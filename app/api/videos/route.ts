import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export const revalidate = 0 // Disable caching for this API route

// Ajoutez une interface Video pour typer correctement les données
interface Video {
  id: string
  title: string
  description?: string
  category: string
  url: string
  thumbnail_url?: string
  file_name: string
  thumbnail_file_name?: string
  created_at: string
  updated_at?: string
}

export async function GET() {
  try {
    console.log("Fetching videos from Supabase...")

    const { data: videos, error } = await supabaseAdmin
      .from("videos")
      .select("*")
      .neq("file_name", "temp")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching videos:", error)
      throw error
    }

    console.log(`Found ${videos?.length || 0} videos`)

    // Ajouter la propriété isDemo à chaque vidéo
    const videosWithDemo = (videos || []).map((video: Video) => ({
      ...video,
      isDemo: false,
    }))

    return NextResponse.json(
      {
        videos: videosWithDemo,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    )
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch videos",
        details: error instanceof Error ? error.message : "Unknown error",
        videos: [], // Retourner un tableau vide pour éviter les erreurs côté client
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    )
  }
}

