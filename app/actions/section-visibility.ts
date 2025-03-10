"use server"

import { revalidatePath } from "next/cache"
import { supabaseAdmin } from "@/lib/supabase"

export type SectionVisibility = {
  id: number
  section_id: string
  section_name: string
  is_visible: boolean
}

export async function getSectionVisibility(): Promise<SectionVisibility[]> {
  try {
    const { data, error } = await supabaseAdmin.from("section_visibility").select("*").order("id", { ascending: true })

    if (error) {
      console.error("Error fetching section visibility:", error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Error in getSectionVisibility:", error)
    throw error
  }
}

export async function toggleSectionVisibility(sectionId: string, isVisible: boolean) {
  try {
    const { error } = await supabaseAdmin
      .from("section_visibility")
      .update({
        is_visible: isVisible,
        updated_at: new Date().toISOString(),
      })
      .eq("section_id", sectionId)

    if (error) {
      console.error("Error updating section visibility:", error)
      throw error
    }

    // Revalidate the home page to reflect the changes
    revalidatePath("/", "layout")

    return { success: true }
  } catch (error) {
    console.error("Error in toggleSectionVisibility:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Une erreur s'est produite",
    }
  }
}

