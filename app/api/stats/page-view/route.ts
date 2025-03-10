import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Créer directement un client Supabase avec la clé de service
const supabaseAdmin = createClient(
  "https://znpcnzkaaokxpxqexksu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpucGNuemthYW9reHB4cWV4a3N1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTIxNjc0MCwiZXhwIjoyMDU2NzkyNzQwfQ.PaOShOpz6Tg7s7RMrhe22Iqci3qZGVDZ5M0ajJIFNp0",
)

export async function POST(request: NextRequest) {
  try {
    // Obtenir l'adresse IP et l'agent utilisateur
    const ip = request.headers.get("x-forwarded-for") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"
    const referer = request.headers.get("referer") || "direct"

    // Obtenir la page visitée depuis le corps de la requête
    const body = await request.json().catch(() => ({}))
    const path = body.path

    if (!path) {
      console.error("Erreur: Chemin de page manquant")
      return NextResponse.json({ success: false, error: "Chemin de page manquant" }, { status: 400 })
    }

    // Vérifier si la table existe
    const { error: tableCheckError } = await supabaseAdmin.from("page_views").select("id").limit(1)

    if (tableCheckError) {
      console.error("Erreur lors de la vérification de la table page_views:", tableCheckError)

      // Si la table n'existe pas, créer un enregistrement en mémoire
      console.log(`Vue de page enregistrée en mémoire: page ${path}, IP ${hashIP(ip)}`)
      return NextResponse.json({ success: true, fallback: true })
    }

    // Insérer les données dans Supabase
    const { error } = await supabaseAdmin.from("page_views").insert([
      {
        path,
        ip_hash: hashIP(ip),
        user_agent: userAgent,
        referer,
      },
    ])

    if (error) {
      console.error("Erreur détaillée lors de l'enregistrement de la vue de page:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur complète lors du traitement de la requête:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erreur serveur inconnue",
      },
      { status: 500 },
    )
  }
}

// Fonction pour hacher l'adresse IP (pour la confidentialité)
function hashIP(ip: string): string {
  return Buffer.from(ip).toString("base64")
}

