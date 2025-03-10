"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

const categories = [
  { value: "spiritualite", label: "Spiritualité" },
  { value: "temoignages", label: "Témoignages" },
  { value: "meditation", label: "Méditation" },
  { value: "ateliers", label: "Ateliers" },
  { value: "conseils", label: "Conseils" },
]

interface Video {
  id: string
  title: string
  description?: string
  category: string
  url: string
  thumbnail_url?: string
}

interface EditVideoFormProps {
  video: Video
}

export default function EditVideoForm({ video }: EditVideoFormProps) {
  const [formState, setFormState] = useState({
    title: video.title,
    description: video.description || "",
    category: video.category,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/videos/${video.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Une erreur est survenue")
      }

      toast.success("Vidéo mise à jour avec succès")

      // Revalider la page d'accueil
      await fetch("/api/revalidate", { method: "POST" })

      // Rediriger vers la liste des vidéos
      router.push("/admin/videos")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          value={formState.title}
          onChange={(e) => setFormState({ ...formState, title: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formState.description}
          onChange={(e) => setFormState({ ...formState, description: e.target.value })}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Catégorie</Label>
        <Select value={formState.category} onValueChange={(value) => setFormState({ ...formState, category: value })}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Sélectionnez une catégorie" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </div>
    </form>
  )
}

