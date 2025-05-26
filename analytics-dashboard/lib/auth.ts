import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const sql = neon(process.env.DATABASE_URL!)

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  isActive: boolean
  createdAt: string
  lastLogin?: string
}

export interface AuthResult {
  success: boolean
  user?: User
  token?: string
  error?: string
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch {
    return null
  }
}

export async function createUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
): Promise<AuthResult> {
  try {
    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return { success: false, error: "Un utilisateur avec cet email existe déjà" }
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password)
    const result = await sql`
      INSERT INTO users (email, password_hash, first_name, last_name)
      VALUES (${email}, ${passwordHash}, ${firstName}, ${lastName})
      RETURNING id, email, first_name, last_name, role, is_active, created_at
    `

    const user = result[0]
    const token = generateToken(user.id)

    // Create session
    await sql`
      INSERT INTO user_sessions (user_id, session_token, expires_at)
      VALUES (${user.id}, ${token}, NOW() + INTERVAL '7 days')
    `

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        isActive: user.is_active,
        createdAt: user.created_at,
      },
      token,
    }
  } catch (error) {
    console.error("Create user error:", error)
    return { success: false, error: "Erreur lors de la création du compte" }
  }
}

export async function authenticateUser(email: string, password: string): Promise<AuthResult> {
  try {
    const result = await sql`
      SELECT id, email, password_hash, first_name, last_name, role, is_active, created_at
      FROM users 
      WHERE email = ${email} AND is_active = true
    `

    if (result.length === 0) {
      return { success: false, error: "Email ou mot de passe incorrect" }
    }

    const user = result[0]
    const isValidPassword = await verifyPassword(password, user.password_hash)

    if (!isValidPassword) {
      return { success: false, error: "Email ou mot de passe incorrect" }
    }

    // Update last login
    await sql`
      UPDATE users SET last_login = NOW() WHERE id = ${user.id}
    `

    const token = generateToken(user.id)

    // Create session
    await sql`
      INSERT INTO user_sessions (user_id, session_token, expires_at)
      VALUES (${user.id}, ${token}, NOW() + INTERVAL '7 days')
    `

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        isActive: user.is_active,
        createdAt: user.created_at,
        lastLogin: new Date().toISOString(),
      },
      token,
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return { success: false, error: "Erreur lors de la connexion" }
  }
}

export async function getUserFromToken(token: string): Promise<User | null> {
  try {
    const decoded = verifyToken(token)
    if (!decoded) return null

    // Check if session exists and is valid
    const sessionResult = await sql`
      SELECT user_id FROM user_sessions 
      WHERE session_token = ${token} AND expires_at > NOW()
    `

    if (sessionResult.length === 0) return null

    const userResult = await sql`
      SELECT id, email, first_name, last_name, role, is_active, created_at, last_login
      FROM users 
      WHERE id = ${decoded.userId} AND is_active = true
    `

    if (userResult.length === 0) return null

    const user = userResult[0]
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      isActive: user.is_active,
      createdAt: user.created_at,
      lastLogin: user.last_login,
    }
  } catch (error) {
    console.error("Get user from token error:", error)
    return null
  }
}

export async function logoutUser(token: string): Promise<boolean> {
  try {
    await sql`
      DELETE FROM user_sessions WHERE session_token = ${token}
    `
    return true
  } catch (error) {
    console.error("Logout error:", error)
    return false
  }
}
