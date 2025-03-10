import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export const revalidate = 0 // Disable caching for this API route

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

    return NextResponse.json(
      {
        videos: videos || [],
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

