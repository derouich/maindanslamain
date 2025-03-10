import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

// Définir un mot de passe par défaut si la variable d'environnement n'est pas définie
const DEFAULT_ADMIN_PASSWORD = "maindanslamain"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    // Utiliser le mot de passe par défaut si la variable d'environnement n'est pas définie
    const adminPassword = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD

    // Vérifier si le mot de passe correspond
    if (password === adminPassword) {
      // Définir un cookie pour indiquer que l'utilisateur est authentifié
      cookies().set("admin_authenticated", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 jour
        path: "/",
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, message: "Mot de passe incorrect" }, { status: 401 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "Une erreur s'est produite" }, { status: 500 })
  }
}

