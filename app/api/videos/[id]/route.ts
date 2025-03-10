import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// GET - Récupérer une vidéo spécifique avec une URL signée
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Récupérer la vidéo depuis la base de données
    const { data: video, error: dbError } = await supabaseAdmin.from("videos").select("*").eq("id", params.id).single()

    if (dbError) throw dbError
    if (!video) {
      return NextResponse.json({ error: "Vidéo non trouvée" }, { status: 404 })
    }

    // Générer une URL signée pour la vidéo
    const { data: signedUrl } = await supabaseAdmin.storage.from("videos").createSignedUrl(video.file_name, 3600) // URL valide pendant 1 heure

    // Générer une URL signée pour la miniature si elle existe
    let thumbnailSignedUrl = null
    if (video.thumbnail_file_name) {
      const { data: thumbUrl } = await supabaseAdmin.storage
        .from("thumbnails")
        .createSignedUrl(video.thumbnail_file_name, 3600)
      thumbnailSignedUrl = thumbUrl?.signedUrl
    }

    return NextResponse.json({
      ...video,
      url: signedUrl?.signedUrl,
      thumbnail_url: thumbnailSignedUrl,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération de la vidéo:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erreur inconnue" }, { status: 500 })
  }
}

// DELETE - Supprimer une vidéo
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Récupérer d'abord les informations de la vidéo
    const { data: video, error: fetchError } = await supabaseAdmin
      .from("videos")
      .select("*")
      .eq("id", params.id)
      .single()

    if (fetchError) throw fetchError
    if (!video) {
      return NextResponse.json({ error: "Vidéo non trouvée" }, { status: 404 })
    }

    // Supprimer le fichier vidéo du stockage
    const { error: storageError } = await supabaseAdmin.storage.from("videos").remove([video.file_name])

    if (storageError) throw storageError

    // Supprimer la miniature si elle existe
    if (video.thumbnail_file_name) {
      await supabaseAdmin.storage.from("thumbnails").remove([video.thumbnail_file_name]).catch(console.error)
    }

    // Supprimer l'enregistrement de la base de données
    const { error: deleteError } = await supabaseAdmin.from("videos").delete().eq("id", params.id)

    if (deleteError) throw deleteError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la suppression de la vidéo:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erreur inconnue" }, { status: 500 })
  }
}

// PATCH - Mettre à jour une vidéo
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // Vérifier si la vidéo existe
    const { data: existingVideo, error: fetchError } = await supabaseAdmin
      .from("videos")
      .select("*")
      .eq("id", params.id)
      .single()

    if (fetchError) throw fetchError
    if (!existingVideo) {
      return NextResponse.json({ error: "Vidéo non trouvée" }, { status: 404 })
    }

    // Mettre à jour la vidéo
    const { error: updateError } = await supabaseAdmin
      .from("videos")
      .update({
        title: body.title,
        description: body.description,
        category: body.category,
      })
      .eq("id", params.id)

    if (updateError) throw updateError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la vidéo:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erreur inconnue" }, { status: 500 })
  }
}

