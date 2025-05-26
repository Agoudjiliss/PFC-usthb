import { type NextRequest, NextResponse } from "next/server"
import { logoutUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Token manquant" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const success = await logoutUser(token)

    return NextResponse.json({
      success,
      message: success ? "Déconnexion réussie" : "Erreur lors de la déconnexion",
    })
  } catch (error) {
    console.error("Logout API error:", error)
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 })
  }
}
