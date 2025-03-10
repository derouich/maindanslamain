"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X } from "lucide-react"

export default function VideoUpload() {
  const [videos, setVideos] = useState<{ file: File; title: string; description: string }[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newVideos = Array.from(e.target.files).map((file) => ({
        file,
        title: file.name.split(".")[0],
        description: "",
      }))
      setVideos((prev) => [...prev, ...newVideos])
    }
  }

  const handleRemoveVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleTitleChange = (index: number, title: string) => {
    setVideos((prev) => prev.map((video, i) => (i === index ? { ...video, title } : video)))
  }

  const handleDescriptionChange = (index: number, description: string) => {
    setVideos((prev) => prev.map((video, i) => (i === index ? { ...video, description } : video)))
  }

  const handleUpload = async () => {
    setUploading(true)

    // Ici, vous implémenteriez la logique pour télécharger les vidéos vers votre serveur
    // Par exemple, en utilisant FormData et fetch

    // Simulation d'un téléchargement
    await new Promise((resolve) => setTimeout(resolve, 2000))

    alert("Vidéos téléchargées avec succès !")
    setVideos([])
    setUploading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
        <Upload className="w-12 h-12 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500 mb-4">Glissez-déposez des fichiers vidéo ou cliquez pour parcourir</p>
        <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="bg-white">
          Sélectionner des vidéos
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {videos.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Vidéos à télécharger ({videos.length})</h3>

          {videos.map((video, index) => (
            <div key={index} className="p-4 border rounded-lg bg-white">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden">
                      <video src={URL.createObjectURL(video.file)} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{video.file.name}</p>
                      <p className="text-xs text-gray-400">{(video.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveVideo(index)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor={`title-${index}`}>Titre</Label>
                  <Input
                    id={`title-${index}`}
                    value={video.title}
                    onChange={(e) => handleTitleChange(index, e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`description-${index}`}>Description</Label>
                  <Textarea
                    id={`description-${index}`}
                    value={video.description}
                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                    className="mt-1"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {uploading ? "Téléchargement en cours..." : "Télécharger les vidéos"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

