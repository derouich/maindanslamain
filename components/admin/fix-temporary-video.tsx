"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fixTemporaryVideo } from "@/app/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const categories = [
  { value: "spiritualite", label: "Spiritualité" },
  { value: "temoignages", label: "Témoignages" },
  { value: "meditation", label: "Méditation" },
  { value: "ateliers", label: "Ateliers" },
  { value: "conseils", label: "Conseils" },
]

interface FixTemporaryVideoProps {
  id: string
  title: string
  onSuccess?: () => void
}

export default function FixTemporaryVideo({ id, title, onSuccess }: FixTemporaryVideoProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formState, setFormState] = useState({
    title: title,
    url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    category: "spiritualite",
  })
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    formData.append("id", id)

    const result = await fixTemporaryVideo(formData)

    if (result.success) {
      toast.success("Vidéo réparée avec succès")
      setIsOpen(false)

      // Rafraîchir la page admin
      if (onSuccess) onSuccess()
      router.refresh()

      // Revalider la page d'accueil
      fetch("/api/revalidate-home", { method: "POST" })
        .then(() => console.log("Page d'accueil revalidée"))
        .catch((err) => console.error("Erreur lors de la revalidation:", err))
    } else {
      toast.error(result.message || "Une erreur s'est produite")
    }
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200"
        onClick={() => setIsOpen(true)}
      >
        Réparer cette vidéo
      </Button>
    )
  }

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mt-2">
      <h4 className="font-medium mb-2">Réparer la vidéo temporaire</h4>

      <form action={handleSubmit} className="space-y-3">
        <div>
          <Label htmlFor="title">Titre</Label>
          <Input
            id="title"
            name="title"
            value={formState.title}
            onChange={(e) => setFormState({ ...formState, title: e.target.value })}
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="url">URL de la vidéo</Label>
          <Input
            id="url"
            name="url"
            value={formState.url}
            onChange={(e) => setFormState({ ...formState, url: e.target.value })}
            className="mt-1"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Utilisez une URL de vidéo valide. Vous pouvez utiliser les exemples de Google:
            <br />
            https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4
          </p>
        </div>

        <div>
          <Label htmlFor="category">Catégorie</Label>
          <Select
            name="category"
            value={formState.category}
            onValueChange={(value) => setFormState({ ...formState, category: value })}
          >
            <SelectTrigger id="category" className="mt-1">
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

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Annuler
          </Button>
          <Button type="submit">Réparer</Button>
        </div>
      </form>
    </div>
  )
}

