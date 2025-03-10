import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Forcer la revalidation de la page d'accueil
    revalidatePath("/", "layout")

    return NextResponse.json({
      success: true,
      message: "Page d'accueil revalidée avec succès",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erreur lors de la revalidation:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 },
    )
  }
}

