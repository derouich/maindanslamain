"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import TikTokStylePlayer from "./tiktok-style-player"

// Définir le type Video pour assurer la cohérence
type Video = {
  id: string
  url: string
  title: string
  description?: string
  category?: string
  thumbnailUrl?: string
  isDemo?: boolean
}

interface VideoGalleryProps {
  videos: Video[]
}

export default function VideoGallery({ videos }: VideoGalleryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [activeVideoIndex, setActiveVideoIndex] = useState(0)
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null)
  const [loadedVideos, setLoadedVideos] = useState<Video[]>([])
  const [error, setError] = useState<string | null>(null)

  // Vérifier et valider les vidéos au chargement
  useEffect(() => {
    // Ensure we have videos
    if (!videos || videos.length === 0) {
      setError("Aucune vidéo disponible.")
      setLoadedVideos([])
      return
    }

    // Add a fallback video if all videos are invalid
    const fallbackVideo = {
      id: "fallback",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      title: "Vidéo de démonstration",
      description: "Cette vidéo est affichée car les vidéos originales n'ont pas pu être chargées.",
      category: "Démo",
      isDemo: true,
    }

    // Vérifier que les vidéos ont des URLs valides
    const validVideos = videos.filter((video) => {
      // Vérifier si l'URL est valide
      try {
        new URL(video.url)
        return true
      } catch (e) {
        console.warn(`Vidéo avec URL invalide ignorée:`, video)
        return false
      }
    })

    if (validVideos.length === 0 && videos.length > 0) {
      console.warn("Aucune vidéo valide n'a pu être chargée. Utilisation de la vidéo de secours.")
      setLoadedVideos([fallbackVideo])
      setError("Les vidéos originales n'ont pas pu être chargées. Une vidéo de démonstration est affichée à la place.")
    } else {
      setLoadedVideos(validVideos)
      setError(null)
    }
  }, [videos])

  // Gérer le défilement horizontal
  const scrollToVideo = (index: number) => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const videoElements = container.querySelectorAll(".video-item")

    if (videoElements[index]) {
      videoElements[index].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      })
      setActiveVideoIndex(index)
    }
  }

  // Gérer le changement d'état de lecture d'une vidéo
  const handleVideoPlayStateChange = (videoId: string, isPlaying: boolean) => {
    if (isPlaying) {
      setPlayingVideoId(videoId)
    } else if (playingVideoId === videoId) {
      setPlayingVideoId(null)
    }
  }

  // Si une erreur s'est produite mais nous avons une vidéo de secours
  if (error && loadedVideos.length > 0) {
    return (
      <div className="space-y-4">
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <p className="text-yellow-700">{error}</p>
          </div>
        </div>

        <div className="relative">
          {/* Conteneur de défilement horizontal */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {loadedVideos.map((video, index) => (
              <div
                key={video.id}
                className="video-item flex-shrink-0 w-[280px] mx-2 snap-center"
                onClick={() => setActiveVideoIndex(index)}
              >
                <div className="aspect-[9/16] bg-emerald-50 rounded-lg overflow-hidden shadow-lg">
                  <TikTokStylePlayer
                    src={video.url}
                    title={video.title}
                    description={video.description}
                    category={video.category}
                    thumbnailUrl={video.thumbnailUrl}
                    isActive={index === activeVideoIndex}
                    videoId={video.id}
                    onPlayStateChange={(isPlaying) => handleVideoPlayStateChange(video.id, isPlaying)}
                    shouldPause={playingVideoId !== null && playingVideoId !== video.id}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Si aucune vidéo n'est disponible
  if (loadedVideos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucune vidéo n'est disponible pour le moment.</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Navigation */}
      {loadedVideos.length > 1 && (
        <>
          <button
            onClick={() => scrollToVideo(Math.max(0, activeVideoIndex - 1))}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white"
            aria-label="Vidéo précédente"
            disabled={activeVideoIndex === 0}
          >
            <ChevronLeft className="h-6 w-6 text-emerald-700" />
          </button>

          <button
            onClick={() => scrollToVideo(Math.min(loadedVideos.length - 1, activeVideoIndex + 1))}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white"
            aria-label="Vidéo suivante"
            disabled={activeVideoIndex === loadedVideos.length - 1}
          >
            <ChevronRight className="h-6 w-6 text-emerald-700" />
          </button>
        </>
      )}

      {/* Conteneur de défilement horizontal */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {loadedVideos.map((video, index) => (
          <div
            key={video.id}
            className="video-item flex-shrink-0 w-[280px] mx-2 snap-center"
            onClick={() => setActiveVideoIndex(index)}
          >
            <div className="aspect-[9/16] bg-emerald-50 rounded-lg overflow-hidden shadow-lg">
              <TikTokStylePlayer
                src={video.url}
                title={video.title}
                description={video.description}
                category={video.category}
                thumbnailUrl={video.thumbnailUrl}
                isActive={index === activeVideoIndex}
                videoId={video.id}
                onPlayStateChange={(isPlaying) => handleVideoPlayStateChange(video.id, isPlaying)}
                shouldPause={playingVideoId !== null && playingVideoId !== video.id}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Indicateurs de pagination */}
      {loadedVideos.length > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {loadedVideos.map((_, index) => (
            <button
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === activeVideoIndex ? "bg-emerald-600 w-6" : "bg-gray-300"
              }`}
              onClick={() => scrollToVideo(index)}
              aria-label={`Aller à la vidéo ${index + 1}`}
              aria-current={index === activeVideoIndex ? "true" : "false"}
            />
          ))}
        </div>
      )}
    </div>
  )
}

