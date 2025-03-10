"use client"

import { useEffect, useRef } from "react"

export default function VideoSection() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && iframeRef.current) {
            // Load the video when the container is in view
            iframeRef.current.src =
              "https://www.youtube.com/embed/MQiJgoWy8sg?autoplay=1&mute=1&loop=1&playlist=MQiJgoWy8sg"
          }
        })
      },
      { threshold: 0.1 },
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="relative overflow-hidden rounded-lg shadow-xl aspect-video">
      <iframe
        ref={iframeRef}
        className="absolute top-0 left-0 w-full h-full"
        title="Main Dans La Main Introduction"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  )
}

