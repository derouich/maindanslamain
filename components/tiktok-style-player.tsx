"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, AlertCircle, RefreshCw } from "lucide-react"

interface TikTokStylePlayerProps {
  src: string
  thumbnailUrl?: string
  title?: string
  description?: string
  category?: string
  isActive?: boolean
  videoId: string
  onPlayStateChange?: (isPlaying: boolean) => void
  shouldPause?: boolean
}

export default function TikTokStylePlayer({
  src,
  thumbnailUrl,
  title,
  description,
  category,
  isActive = false,
  videoId,
  onPlayStateChange,
  shouldPause = false,
}: TikTokStylePlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [errorDetails, setErrorDetails] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  // Validate URL on mount
  useEffect(() => {
    try {
      // Check if the URL is valid
      new URL(src)
      setIsLoading(false)
    } catch (e) {
      console.error("Invalid video URL:", src, e)
      setHasError(true)
      setErrorDetails("URL de vidéo invalide")
      setIsLoading(false)
    }
  }, [src])

  // Gérer la vidéo active sans autoplay
  useEffect(() => {
    if (!videoRef.current) return

    if (!isActive && isPlaying) {
      // Mettre en pause si la vidéo n'est plus active
      videoRef.current.pause()
      setIsPlaying(false)
      if (onPlayStateChange) onPlayStateChange(false)
    }
  }, [isActive, isPlaying, onPlayStateChange])

  // Mettre en pause la vidéo si shouldPause est true
  useEffect(() => {
    if (shouldPause && isPlaying && videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
      if (onPlayStateChange) onPlayStateChange(false)
    }
  }, [shouldPause, isPlaying, onPlayStateChange])

  // Ajouter des écouteurs d'événements pour la vidéo
  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    // Set loading state
    setIsLoading(true)

    const handlePlay = () => {
      setIsPlaying(true)
      if (onPlayStateChange) onPlayStateChange(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
      if (onPlayStateChange) onPlayStateChange(false)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      if (onPlayStateChange) onPlayStateChange(false)
    }

    const handleError = (e: Event) => {
      console.error("Erreur de chargement de la vidéo:", e)

      // Get more detailed error information if available
      const videoElement = e.target as HTMLVideoElement
      let errorMessage = "Erreur inconnue"

      if (videoElement.error) {
        switch (videoElement.error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = "La lecture a été annulée"
            break
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = "Erreur réseau"
            break
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = "Erreur de décodage"
            break
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = "Format vidéo non supporté"
            break
          default:
            errorMessage = `Erreur ${videoElement.error.code}`
        }
      }

      setErrorDetails(errorMessage)
      setHasError(true)
      setIsPlaying(false)
      setIsLoading(false)
      if (onPlayStateChange) onPlayStateChange(false)
    }

    const handleLoadedData = () => {
      setIsLoading(false)
      setHasError(false)
    }

    videoElement.addEventListener("play", handlePlay)
    videoElement.addEventListener("pause", handlePause)
    videoElement.addEventListener("ended", handleEnded)
    videoElement.addEventListener("error", handleError)
    videoElement.addEventListener("loadeddata", handleLoadedData)

    // Try to load the video with a timeout
    const timeoutId = setTimeout(() => {
      if (isLoading && !hasError) {
        setHasError(true)
        setErrorDetails("Délai d'attente dépassé")
        setIsLoading(false)
      }
    }, 10000) // 10 seconds timeout

    return () => {
      videoElement.removeEventListener("play", handlePlay)
      videoElement.removeEventListener("pause", handlePause)
      videoElement.removeEventListener("ended", handleEnded)
      videoElement.removeEventListener("error", handleError)
      videoElement.removeEventListener("loadeddata", handleLoadedData)
      clearTimeout(timeoutId)
    }
  }, [onPlayStateChange, isLoading, hasError])

  const togglePlay = (e: React.MouseEvent) => {
    // Arrêter la propagation pour éviter que le conteneur parent ne capture l'événement
    e.stopPropagation()

    if (hasError) {
      // Si la vidéo a une erreur, essayer de la recharger
      retryLoadVideo()
      return
    }

    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play().catch((error) => {
        console.error("Erreur lors de la lecture de la vidéo:", error)
        setHasError(true)
        setErrorDetails("Erreur de lecture")
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

  // Fonction pour gérer le clic sur le conteneur
  const handleContainerClick = () => {
    if (hasError) {
      // Si la vidéo a une erreur, essayer de la recharger
      retryLoadVideo()
      return
    }

    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play().catch((error) => {
        console.error("Erreur lors de la lecture de la vidéo:", error)
        setHasError(true)
        setErrorDetails("Erreur de lecture")
      })
    }
  }

  // Function to retry loading the video
  const retryLoadVideo = () => {
    if (!videoRef.current) return

    setIsLoading(true)
    setHasError(false)

    // Try with a different approach - create a new source element
    try {
      // Reset the video element
      videoRef.current.pause()

      // Use a fallback URL if the original one failed
      const fallbackUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"

      // Try the original URL first, if it fails again we'll use the fallback
      videoRef.current.src = src

      // Load the video
      videoRef.current.load()

      // Add a one-time error handler for this specific retry attempt
      const handleRetryError = () => {
        console.log("Retry failed, using fallback URL")
        if (videoRef.current) {
          videoRef.current.src = fallbackUrl
          videoRef.current.load()
        }
        videoRef.current?.removeEventListener("error", handleRetryError)
      }

      videoRef.current.addEventListener("error", handleRetryError, { once: true })
    } catch (error) {
      console.error("Error during retry:", error)
      setHasError(true)
      setErrorDetails("Échec de la tentative")
      setIsLoading(false)
    }
  }

  return (
    <div
      className="relative w-full h-full group cursor-pointer"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleContainerClick}
    >
      {/* Loading state */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center p-4 text-center z-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500 mb-2"></div>
          <p className="text-gray-600">Chargement de la vidéo...</p>
        </div>
      )}

      {/* Fallback background if no thumbnail */}
      {!thumbnailUrl && !hasError && !isLoading && (
        <div
          className="absolute inset-0 bg-gradient-to-b from-emerald-100 to-emerald-300 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="text-emerald-800 text-center p-4">
            <div className="text-4xl mb-2">▶️</div>
            <div className="text-sm font-medium">{title || "Cliquez pour lire"}</div>
          </div>
        </div>
      )}

      {/* Afficher un message d'erreur si la vidéo ne peut pas être chargée */}
      {hasError && (
        <div className="absolute inset-0 bg-red-100 flex flex-col items-center justify-center p-4 text-center z-20">
          <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
          <h3 className="text-red-700 font-medium">Erreur de chargement</h3>
          <p className="text-red-600 text-sm mt-1">{errorDetails || "Impossible de charger la vidéo"}</p>
          <button
            className="mt-3 px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 flex items-center"
            onClick={(e) => {
              e.stopPropagation()
              retryLoadVideo()
            }}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Réessayer
          </button>
        </div>
      )}

      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        poster={thumbnailUrl || undefined}
        className={`w-full h-full object-cover ${hasError || isLoading ? "opacity-0" : "opacity-100"}`}
        playsInline
        loop
        muted={isMuted}
        preload="metadata"
      />

      {/* Overlay pour les contrôles */}
      <div
        className={`absolute inset-0 flex flex-col justify-between p-3 bg-gradient-to-b from-emerald-700/10 via-transparent to-emerald-900/50 transition-opacity duration-300 ${
          isHovering || !isPlaying || hasError ? "opacity-100" : "opacity-0"
        } ${hasError || isLoading ? "hidden" : ""}`}
      >
        {/* Bouton de lecture/pause central */}
        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-emerald-500/40 backdrop-blur-sm text-white transition-transform hover:scale-110"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>
        </div>

        {/* Informations et contrôles en bas */}
        <div className="space-y-1">
          {/* Titre et description */}
          {(title || description) && (
            <div className="text-white text-shadow">
              {title && <h3 className="font-semibold text-sm line-clamp-1">{title}</h3>}
              {description && <p className="text-xs text-white/90 line-clamp-1">{description}</p>}
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
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} className="text-emerald-400" />}
          </button>
        </div>
      </div>
    </div>
  )
}

