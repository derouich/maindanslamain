"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Upload, X, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabaseAdmin } from "@/lib/supabase"

const categories = [
  { value: "spiritualite", label: "Spiritualité" },
  { value: "temoignages", label: "Témoignages" },
  { value: "meditation", label: "Méditation" },
  { value: "ateliers", label: "Ateliers" },
  { value: "conseils", label: "Conseils" },
]

// Ajouter une fonction pour générer une miniature à partir d'une vidéo
// Ajouter cette fonction après les déclarations de constantes au début du composant

const generateThumbnail = (videoFile: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    // Créer un élément vidéo temporaire
    const video = document.createElement("video")
    video.preload = "metadata"
    video.muted = true
    video.playsInline = true

    // Créer un URL pour le fichier vidéo
    const videoUrl = URL.createObjectURL(videoFile)
    video.src = videoUrl

    // Lorsque les métadonnées sont chargées, on peut manipuler la vidéo
    video.onloadedmetadata = () => {
      // Aller à 25% de la durée de la vidéo pour capturer une image représentative
      video.currentTime = video.duration * 0.25
    }

    // Lorsque la vidéo est à la position souhaitée, capturer l'image
    video.onseeked = () => {
      // Créer un canvas pour dessiner l'image
      const canvas = document.createElement("canvas")
      // Définir les dimensions du canvas (16:9 aspect ratio)
      const width = 640
      const height = 360
      canvas.width = width
      canvas.height = height

      // Dessiner l'image de la vidéo sur le canvas
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0, width, height)

        // Convertir le canvas en blob (fichier)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Créer un fichier à partir du blob
              const thumbnailFile = new File([blob], `thumbnail-${Date.now()}.jpg`, { type: "image/jpeg" })

              // Libérer l'URL
              URL.revokeObjectURL(videoUrl)

              resolve(thumbnailFile)
            } else {
              reject(new Error("Impossible de générer la miniature"))
            }
          },
          "image/jpeg",
          0.85,
        ) // Qualité JPEG de 85%
      } else {
        reject(new Error("Impossible de créer le contexte 2D"))
      }
    }

    // En cas d'erreur
    video.onerror = () => {
      URL.revokeObjectURL(videoUrl)
      reject(new Error("Erreur lors du chargement de la vidéo"))
    }

    // Démarrer le chargement de la vidéo
    video.load()
  })
}

export default function VideoUploadForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const router = useRouter()

  const videoInputRef = useRef<HTMLInputElement>(null)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setVideoFile(e.target.files[0])
    }
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setThumbnailFile(e.target.files[0])
    }
  }

  // Modifier la fonction handleSubmit pour générer une miniature si nécessaire
  // Remplacer la partie du code qui gère le téléchargement de la miniature

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !videoFile || !category) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      console.log("Début du téléchargement de la vidéo")

      // 1. Télécharger la vidéo
      const videoFileName = `${Date.now()}-${videoFile.name}`
      const { data: videoData, error: videoError } = await supabaseAdmin.storage
        .from("videos")
        .upload(videoFileName, videoFile, {
          cacheControl: "3600",
          upsert: false,
          onUploadProgress: (progress) => {
            setUploadProgress(Math.round((progress.loaded / progress.total) * 50))
          },
        })

      if (videoError) {
        console.error("Erreur lors du téléchargement de la vidéo:", videoError)
        throw new Error(`Erreur lors du téléchargement de la vidéo: ${videoError.message}`)
      }

      console.log("Vidéo téléchargée avec succès")

      // 2. Télécharger la miniature (si fournie ou générer une miniature)
      let thumbnailUrl = null
      let thumbnailFileName = null
      let thumbnailToUpload = thumbnailFile

      // Si aucune miniature n'est fournie, en générer une à partir de la vidéo
      if (!thumbnailToUpload && videoFile) {
        try {
          console.log("Génération d'une miniature à partir de la vidéo...")
          thumbnailToUpload = await generateThumbnail(videoFile)
          console.log("Miniature générée avec succès")
        } catch (thumbnailError) {
          console.error("Erreur lors de la génération de la miniature:", thumbnailError)
          // Continuer sans miniature en cas d'erreur
        }
      }

      if (thumbnailToUpload) {
        console.log("Début du téléchargement de la miniature")
        thumbnailFileName = `${Date.now()}-${thumbnailToUpload.name}`
        const { data: thumbnailData, error: thumbnailError } = await supabaseAdmin.storage
          .from("thumbnails")
          .upload(thumbnailFileName, thumbnailToUpload, {
            cacheControl: "3600",
            upsert: false,
            onUploadProgress: (progress) => {
              setUploadProgress(50 + Math.round((progress.loaded / progress.total) * 30))
            },
          })

        if (thumbnailError) {
          console.error("Erreur lors du téléchargement de la miniature:", thumbnailError)
          // Continuer sans miniature en cas d'erreur
        } else {
          console.log("Miniature téléchargée avec succès")

          // Obtenir l'URL publique de la miniature
          const { data: thumbnailUrlData } = supabaseAdmin.storage.from("thumbnails").getPublicUrl(thumbnailFileName)
          thumbnailUrl = thumbnailUrlData.publicUrl
        }
      }

      // Obtenir l'URL publique de la vidéo
      const { data: videoUrlData } = supabaseAdmin.storage.from("videos").getPublicUrl(videoFileName)

      // 3. Enregistrer les métadonnées dans la base de données
      setUploadProgress(80)
      console.log("Enregistrement des métadonnées dans la base de données")

      const { data: insertData, error: insertError } = await supabaseAdmin
        .from("videos")
        .insert([
          {
            title,
            description,
            category,
            url: videoUrlData.publicUrl,
            thumbnail_url: thumbnailUrl,
            file_name: videoFileName, // S'assurer que ce n'est pas "temp"
            thumbnail_file_name: thumbnailFileName,
          },
        ])
        .select()

      if (insertError) {
        console.error("Erreur lors de l'enregistrement des métadonnées:", insertError)
        throw new Error(`Erreur lors de l'enregistrement des métadonnées: ${insertError.message}`)
      }

      // Après le succès de l'upload
      if (insertData) {
        console.log("Métadonnées enregistrées avec succès")
        setUploadProgress(100)
        toast.success("Vidéo téléchargée avec succès!")

        // Réinitialiser le formulaire
        setTitle("")
        setDescription("")
        setCategory("")
        setVideoFile(null)
        setThumbnailFile(null)
        if (videoInputRef.current) videoInputRef.current.value = ""
        if (thumbnailInputRef.current) thumbnailInputRef.current.value = ""

        // Forcer la revalidation de la page d'accueil
        try {
          const response = await fetch("/api/revalidate", {
            method: "POST",
          })
          if (!response.ok) {
            console.error("Erreur lors de la revalidation de la page d'accueil")
          }
        } catch (error) {
          console.error("Erreur lors de la revalidation:", error)
        }

        // Rafraîchir la page admin
        router.refresh()
      }
      // Réinitialiser le formulaire
      setTitle("")
      setDescription("")
      setCategory("")
      setVideoFile(null)
      setThumbnailFile(null)
      if (videoInputRef.current) videoInputRef.current.value = ""
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = ""

      // Rafraîchir la page pour voir les changements
      router.refresh()

      // Revalider la page d'accueil pour afficher la nouvelle vidéo
      fetch("/api/revalidate-home", { method: "POST" })
        .then(() => console.log("Page d'accueil revalidée"))
        .catch((err) => console.error("Erreur lors de la revalidation:", err))
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error)
      toast.error(`Erreur: ${error instanceof Error ? error.message : "Une erreur est survenue"}`)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-gray-700">
            Titre <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entrez le titre de la vidéo"
            required
            disabled={isUploading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="text-gray-700">
            Catégorie <span className="text-red-500">*</span>
          </Label>
          <Select value={category} onValueChange={setCategory} disabled={isUploading}>
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-gray-700">
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Entrez une description de la vidéo"
          rows={3}
          disabled={isUploading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="video" className="text-gray-700">
            Fichier vidéo <span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center gap-2">
            <Input
              ref={videoInputRef}
              id="video"
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="hidden"
              disabled={isUploading}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => videoInputRef.current?.click()}
              disabled={isUploading}
              className="flex-1"
            >
              {videoFile ? videoFile.name : "Sélectionner une vidéo"}
            </Button>
            {videoFile && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  setVideoFile(null)
                  if (videoInputRef.current) videoInputRef.current.value = ""
                }}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="thumbnail" className="text-gray-700">
            Miniature (optionnel)
          </Label>
          <div className="flex items-center gap-2">
            <Input
              ref={thumbnailInputRef}
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="hidden"
              disabled={isUploading}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => thumbnailInputRef.current?.click()}
              disabled={isUploading}
              className="flex-1"
            >
              {thumbnailFile ? thumbnailFile.name : "Sélectionner une image"}
            </Button>
            {thumbnailFile && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  setThumbnailFile(null)
                  if (thumbnailInputRef.current) thumbnailInputRef.current.value = ""
                }}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {isUploading && (
        <div className="space-y-2">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 text-center">Téléchargement en cours... {uploadProgress}%</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isUploading || !title || !videoFile || !category}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Téléchargement en cours...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Télécharger la vidéo
          </>
        )}
      </Button>
    </form>
  )
}

