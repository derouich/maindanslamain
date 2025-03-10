"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function PageViewTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Enregistrer la vue de page
    const trackPageView = async () => {
      try {
        await fetch("/api/stats/page-view", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ path: pathname }),
        })
      } catch (error) {
        console.error("Erreur lors du suivi de la vue de page:", error)
      }
    }

    trackPageView()
  }, [pathname])

  return null // Ce composant ne rend rien
}

