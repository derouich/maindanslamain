"use client"

import { useEffect, useRef } from "react"

interface InstagramEmbedProps {
  url: string
  caption?: string
  className?: string
}

export default function InstagramEmbed({ url, caption, className = "" }: InstagramEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Fonction pour charger le script Instagram
    const loadInstagramEmbed = () => {
      // Vérifier si le script est déjà chargé
      if (window.instgrm) {
        window.instgrm.Embeds.process()
        return
      }

      // Créer et charger le script Instagram
      const script = document.createElement("script")
      script.async = true
      script.defer = true
      script.src = "//www.instagram.com/embed.js"
      script.onload = () => {
        if (window.instgrm) {
          window.instgrm.Embeds.process()
        }
      }
      document.body.appendChild(script)
    }

    loadInstagramEmbed()

    // Nettoyer le script lors du démontage du composant
    return () => {
      const existingScript = document.querySelector('script[src="//www.instagram.com/embed.js"]')
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className={`instagram-embed ${className}`}>
      <blockquote
        className="instagram-media"
        data-instgrm-captioned
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{
          background: "#FFF",
          border: 0,
          borderRadius: "3px",
          boxShadow: "0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)",
          margin: "1px",
          maxWidth: "540px",
          minWidth: "326px",
          padding: 0,
          width: "99.375%",
        }}
      >
        <div style={{ padding: "16px" }}>
          <a
            href={url}
            style={{
              background: "#FFFFFF",
              lineHeight: 0,
              padding: "0 0",
              textAlign: "center",
              textDecoration: "none",
              width: "100%",
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            {caption && <p style={{ margin: "8px 0 0 0", padding: "0 4px" }}>{caption}</p>}
          </a>
        </div>
      </blockquote>
    </div>
  )
}

// Ajouter la définition de type pour window.instgrm
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void
      }
    }
  }
}

