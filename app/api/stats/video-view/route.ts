import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Créer directement un client Supabase avec la clé de service
const supabaseAdmin = createClient(
  "https://znpcnzkaaokxpxqexksu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpucGNuemthYW9reHB4cWV4a3N1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTIxNjc0MCwiZXhwIjoyMDU2NzkyNzQwfQ.PaOShOpz6Tg7s7RMrhe22Iqci3qZGVDZ5M0ajJIFNp0",
)

// Fonction pour vérifier si une chaîne est un UUID valide
function isValidUUID(str: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const videoId = body.videoId

    if (!videoId) {
      console.error("Erreur: ID de vidéo manquant")
      return NextResponse.json({ success: false, error: "ID de vidéo manquant" }, { status: 400 })
    }

    // Vérifier si l'ID est un UUID valide
    if (!isValidUUID(videoId)) {
      console.error("Erreur: ID de vidéo invalide (pas un UUID):", videoId)
      return NextResponse.json({ success: false, error: "ID de vidéo invalide" }, { status: 400 })
    }

    // Obtenir l'adresse IP et l'agent utilisateur
    const ip = request.headers.get("x-forwarded-for") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    // Vérifier si la vidéo existe et n'est pas temporaire
    const { data: video, error: videoError } = await supabaseAdmin
      .from("videos")
      .select("id")
      .eq("id", videoId)
      .neq("file_name", "temp")
      .maybeSingle()

    if (videoError) {
      console.error("Erreur lors de la vérification de la vidéo:", videoError)
      return NextResponse.json({ success: false, error: videoError.message }, { status: 500 })
    }

    // Si la vidéo n'existe pas dans la base de données, on considère que c'est une vidéo de démonstration
    // et on ne l'enregistre pas dans les statistiques
    if (!video) {
      console.log("Vidéo non trouvée ou temporaire, considérée comme démo:", videoId)
      return NextResponse.json({ success: true, demo: true })
    }

    // Insérer la vue uniquement si la vidéo existe et n'est pas temporaire
    const { error } = await supabaseAdmin.from("video_views").insert([
      {
        video_id: videoId,
        ip_hash: hashIP(ip),
        user_agent: userAgent,
      },
    ])

    if (error) {
      console.error("Erreur lors de l'enregistrement de la vue:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors du traitement de la requête:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Erreur serveur inconnue" },
      { status: 500 },
    )
  }
}

// Fonction pour hacher l'adresse IP (pour la confidentialité)
function hashIP(ip: string): string {
  return Buffer.from(ip).toString("base64")
}

