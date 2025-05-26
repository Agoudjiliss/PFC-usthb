export interface User {
  id: string
  email: string
  name: string
}

export interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ChatResponse {
  id: string
  response: string
  timestamp: string
}

export interface ApiError {
  message: string
  status: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface ChatRequest {
  message: string
}
