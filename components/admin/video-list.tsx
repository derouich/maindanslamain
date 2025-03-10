"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, Edit, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface Video {
  id: string
  title: string
  description?: string
  category: string
  url: string
  thumbnail_url?: string
  file_name: string
  created_at: string
}

interface VideoListProps {
  videos: Video[]
}

export default function VideoList({ videos: initialVideos }: VideoListProps) {
  const [videos, setVideos] = useState<Video[]>(initialVideos)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async (video: Video) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette vidéo ?")) return

    setDeletingId(video.id)

    try {
      const response = await fetch(`/api/videos/${video.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Une erreur est survenue")
      }

      // Mettre à jour la liste locale
      setVideos((prev) => prev.filter((v) => v.id !== video.id))
      toast.success("Vidéo supprimée avec succès")

      // Revalider la page d'accueil
      await fetch("/api/revalidate", { method: "POST" })
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue")
    } finally {
      setDeletingId(null)
    }
  }

  const handleView = async (video: Video) => {
    try {
      // Récupérer l'URL signée
      const response = await fetch(`/api/videos/${video.id}`)
      if (!response.ok) {
        throw new Error("Impossible de récupérer la vidéo")
      }

      const data = await response.json()

      // Ouvrir la vidéo dans un nouvel onglet
      window.open(data.url, "_blank")
    } catch (error) {
      toast.error("Erreur lors de l'ouverture de la vidéo")
    }
  }

  if (!videos.length) {
    return <div className="text-center py-8 text-gray-500">Aucune vidéo disponible</div>
  }

  return (
    <div className="space-y-4">
      {videos.map((video) => (
        <div key={video.id} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">{video.title}</h3>
              {video.description && <p className="text-gray-600 mt-1">{video.description}</p>}
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">{video.category}</span>
                <span className="text-sm text-gray-500">{new Date(video.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleView(video)}>
                <Eye className="h-4 w-4 mr-1" />
                Voir
              </Button>

              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/videos/edit/${video.id}`}>
                  <Edit className="h-4 w-4 mr-1" />
                  Modifier
                </Link>
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(video)}
                disabled={deletingId === video.id}
              >
                {deletingId === video.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Supprimer
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

