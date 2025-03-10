"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createClient } from "@supabase/supabase-js"

// Créer directement un client Supabase avec la clé de service
const supabaseAdmin = createClient(
  "https://znpcnzkaaokxpxqexksu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpucGNuemthYW9reHB4cWV4a3N1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTIxNjc0MCwiZXhwIjoyMDU2NzkyNzQwfQ.PaOShOpz6Tg7s7RMrhe22Iqci3qZGVDZ5M0ajJIFNp0",
)

// Schema for form validation
const SubscriptionSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().min(8, "Veuillez entrer un numéro de téléphone valide"),
})

interface Subscriber {
  id: number;
  email: string;
  created_at: string;
}

// Fallback to in-memory storage if Supabase is not configured
let inMemorySubscribers: Subscriber[] = []

// Read subscribers from Supabase or in-memory
async function readSubscribers() {
  try {
    const { data, error } = await supabaseAdmin
      .from("subscribers")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return inMemorySubscribers
    }

    return data || []
  } catch (error) {
    console.error("Error reading subscribers:", error)
    return inMemorySubscribers
  }
}

export async function subscribeUser(formData: FormData) {
  try {
    // Extract and validate form data
    const name = formData.get("name") as string
    const phone = formData.get("phone") as string

    const validatedData = SubscriptionSchema.parse({ name, phone })

    // Check if phone already exists
    const subscribers = await readSubscribers()
    if (subscribers.some((sub) => sub.phone === validatedData.phone)) {
      return {
        success: false,
        message: "Ce numéro de téléphone est déjà inscrit.",
      }
    }

    // Add new subscriber
    const newSubscriber = {
      id: Date.now(),
      name: validatedData.name,
      phone: validatedData.phone,
      created_at: new Date().toISOString(),
    }

    const { error } = await supabaseAdmin.from("subscribers").insert([
      {
        name: validatedData.name,
        phone: validatedData.phone,
      },
    ])

    if (error) {
      console.error("Supabase insert error:", error)

      // Fallback to in-memory storage
      inMemorySubscribers.push(newSubscriber)
    }

    revalidatePath("/admin")

    return { success: true }
  } catch (error) {
    console.error("Subscription error:", error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message,
      }
    }

    return {
      success: false,
      message: "Une erreur s'est produite. Veuillez réessayer.",
    }
  }
}

// Fonction existante à mettre à jour
export async function getSubscribers() {
  try {
    console.log("Récupération des abonnés depuis Supabase...")

    const { data, error } = await supabaseAdmin
      .from("subscribers")
      .select("*")
      .order("created_at", { ascending: false })
    // Remove the withCache(false) line

    if (error) {
      console.error("Erreur Supabase lors de la récupération des abonnés:", error)
      return []
    }

    console.log(`${data?.length || 0} abonnés récupérés avec succès`)
    return data || []
  } catch (error) {
    console.error("Erreur lors de la lecture des abonnés:", error)
    return []
  }
}

export async function addSubscriber(formData: FormData) {
  const name = formData.get("name") as string
  const phone = formData.get("phone") as string

  try {
    const validatedData = SubscriptionSchema.parse({ name, phone })

    // Check if phone already exists
    const { data: existingSubscriber, error: checkError } = await supabaseAdmin
      .from("subscribers")
      .select("id")
      .eq("phone", validatedData.phone)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking for existing subscriber:", checkError)
      return {
        success: false,
        message: "Erreur lors de la vérification du numéro de téléphone.",
      }
    }

    if (existingSubscriber) {
      return {
        success: false,
        message: "Ce numéro de téléphone est déjà inscrit.",
      }
    }

    // Préparer les données de l'abonné
    const subscriberData = {
      name: validatedData.name,
      phone: validatedData.phone,
    }

    // Ajouter l'abonné à Supabase
    const { data, error } = await supabaseAdmin.from("subscribers").insert([subscriberData]).select() // Récupérer les données insérées

    if (error) {
      console.error("Erreur Supabase lors de l'ajout d'un abonné:", error)
      return {
        success: false,
        message: error.message || "Une erreur s'est produite lors de l'ajout de l'abonné.",
      }
    }

    // Récupérer l'abonné ajouté
    const newSubscriber = data?.[0]

    revalidatePath("/admin/subscribers")
    return {
      success: true,
      subscriber: newSubscriber,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message,
      }
    }

    console.error("Unexpected error in addSubscriber:", error)
    return {
      success: false,
      message: "Une erreur s'est produite. Veuillez réessayer.",
    }
  }
}

// Mettre à jour cette fonction
export async function editSubscriber(formData: FormData) {
  const id = Number(formData.get("id"))
  const name = formData.get("name") as string
  const phone = formData.get("phone") as string

  try {
    const validatedData = SubscriptionSchema.parse({ name, phone })

    // Check if phone already exists for another subscriber
    const subscribers = await readSubscribers()
    const phoneExists = subscribers.some((sub) => sub.phone === validatedData.phone && sub.id !== id)
    if (phoneExists) {
      return {
        success: false,
        message: "Ce numéro de téléphone est déjà utilisé par un autre abonné.",
      }
    }

    // Préparer les données de mise à jour
    const updateData = {
      name: validatedData.name,
      phone: validatedData.phone,
    }

    // Mettre à jour l'abonné dans Supabase
    const { data, error } = await supabaseAdmin.from("subscribers").update(updateData).eq("id", id).select() // Récupérer les données mises à jour

    if (error) {
      console.error("Erreur Supabase lors de la mise à jour d'un abonné:", error)

      // Fallback à la mémoire
      inMemorySubscribers = inMemorySubscribers.map((sub) => {
        if (sub.id === id) {
          return {
            ...sub,
            name: validatedData.name,
            phone: validatedData.phone,
          }
        }
        return sub
      })

      // Créer un objet abonné mis à jour pour le retour
      const updatedSubscriber = {
        id,
        name: validatedData.name,
        phone: validatedData.phone,
        created_at: inMemorySubscribers.find((sub) => sub.id === id)?.created_at || new Date().toISOString(),
      }

      revalidatePath("/admin/subscribers")
      return {
        success: true,
        subscriber: updatedSubscriber,
      }
    }

    // Récupérer l'abonné mis à jour
    const updatedSubscriber = data?.[0]

    revalidatePath("/admin/subscribers")
    return {
      success: true,
      subscriber: updatedSubscriber,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message,
      }
    }

    return {
      success: false,
      message: "Une erreur s'est produite. Veuillez réessayer.",
    }
  }
}

export async function deleteSubscriber(formData: FormData) {
  const id = Number(formData.get("id"))

  try {
    const { error } = await supabaseAdmin.from("subscribers").delete().eq("id", id)

    if (error) {
      console.error("Supabase delete error:", error)

      // Fallback to in-memory storage
      inMemorySubscribers = inMemorySubscribers.filter((sub) => sub.id !== id)
    }

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Delete error:", error)
    return {
      success: false,
      message: "Une erreur s'est produite. Veuillez réessayer.",
    }
  }
}

export async function exportSubscribersToCSV() {
  try {
    const subscribers = await readSubscribers()

    // Format data for CSV
    const csvRows = []

    // Add headers
    csvRows.push(["Nom", "Téléphone", "Date d'inscription"])

    // Add data rows
    subscribers.forEach((sub) => {
      const date = new Date(sub.created_at).toLocaleString("fr-FR")
      csvRows.push([sub.name, sub.phone, date])
    })

    // Convert to CSV format
    const csvContent = csvRows
      .map((row) =>
        row
          .map((cell) => {
            // Escape quotes and wrap in quotes if contains comma
            if (typeof cell === "string" && (cell.includes(",") || cell.includes('"') || cell.includes("\n"))) {
              return `"${cell.replace(/"/g, '""')}"`
            }
            return cell
          })
          .join(","),
      )
      .join("\n")

    const fileName = `subscribers_${new Date().toISOString().split("T")[0]}.csv`

    return {
      success: true,
      fileName,
      csvContent,
    }
  } catch (error) {
    console.error("Error exporting to CSV:", error)
    return {
      success: false,
      message: "Une erreur s'est produite lors de l'exportation. Veuillez réessayer.",
    }
  }
}

export async function cleanupTemporaryVideos() {
  try {
    // Supprimer toutes les vidéos temporaires
    const { error } = await supabaseAdmin.from("videos").delete().eq("file_name", "temp")

    if (error) {
      console.error("Erreur lors du nettoyage des vidéos temporaires:", error)
      return { success: false, message: "Erreur lors du nettoyage des vidéos temporaires" }
    }

    revalidatePath("/admin/videos")
    return { success: true }
  } catch (error) {
    console.error("Erreur lors du nettoyage des vidéos temporaires:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Une erreur est survenue",
    }
  }
}

export async function fixTemporaryVideo(formData: FormData) {
  const id = formData.get("id") as string
  const url = formData.get("url") as string
  const title = formData.get("title") as string
  const category = formData.get("category") as string

  if (!id || !url || !title || !category) {
    return {
      success: false,
      message: "Tous les champs sont requis",
    }
  }

  try {
    const { error } = await supabaseAdmin
      .from("videos")
      .update({
        url,
        title,
        category,
        file_name: "fixed_" + Date.now(), // Changer file_name pour que ce ne soit plus "temp"
      })
      .eq("id", id)

    if (error) {
      console.error("Erreur lors de la mise à jour de la vidéo:", error)
      return {
        success: false,
        message: error.message,
      }
    }

    revalidatePath("/admin/videos")
    revalidatePath("/")

    return {
      success: true,
      message: "Vidéo mise à jour avec succès",
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la vidéo:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Une erreur est survenue",
    }
  }
}

