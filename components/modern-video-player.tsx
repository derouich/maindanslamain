"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

interface ModernVideoPlayerProps {
  src: string
  thumbnailUrl?: string
  title?: string
  description?: string
  category?: string
  autoPlay?: boolean
  onPlay?: () => void
}

export default function ModernVideoPlayer({
  src,
  thumbnailUrl,
  title,
  description,
  category,
  autoPlay = false,
  onPlay,
}: ModernVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isHovering, setIsHovering] = useState(false)

  const togglePlay = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true)
          if (onPlay) onPlay()
        })
        .catch((error) => {
          console.error("Erreur lors de la lecture de la vidéo:", error)
        })
    }
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!videoRef.current) return

    const newMutedState = !isMuted
    videoRef.current.muted = newMutedState
    setIsMuted(newMutedState)
  }

  return (
    <div
      className="relative w-full h-full rounded-lg overflow-hidden bg-black group cursor-pointer"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={togglePlay}
    >
      {/* Vidéo */}
      <video
        ref={videoRef}
        src={src}
        poster={thumbnailUrl}
        className="w-full h-full object-cover"
        playsInline
        loop
        muted={isMuted}
      />

      {/* Overlay pour les contrôles */}
      <div
        className={`absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-b from-black/10 via-transparent to-black/60 transition-opacity duration-300 ${
          isHovering || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Bouton de lecture/pause central */}
        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white transition-transform hover:scale-110"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>
        </div>

        {/* Informations et contrôles en bas */}
        <div className="space-y-2">
          {/* Titre et description */}
          {(title || description) && (
            <div className="text-white text-shadow">
              {title && <h3 className="font-semibold text-sm">{title}</h3>}
              {description && <p className="text-xs text-white/90 line-clamp-2">{description}</p>}
              {category && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-500/80 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                  {category}
                </span>
              )}
            </div>
          )}

          {/* Bouton de son */}
          <button
            onClick={toggleMute}
            className="text-white hover:text-emerald-400 transition-colors"
            aria-label={isMuted ? "Activer le son" : "Désactiver le son"}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}

