"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { toast } from "sonner"

export default function RefreshHomeButton() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)

    try {
      const response = await fetch("/api/revalidate-sections", { method: "POST" })
      const data = await response.json()

      if (data.success) {
        toast.success("Page d'accueil rafraîchie avec succès")

        // Ouvrir la page d'accueil dans un nouvel onglet
        window.open("/", "_blank")
      } else {
        toast.error("Erreur lors du rafraîchissement: " + (data.error || "Erreur inconnue"))
      }
    } catch (error) {
      toast.error("Erreur de connexion")
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing} className="flex items-center gap-2">
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
      {isRefreshing ? "Rafraîchissement..." : "Rafraîchir la page d'accueil"}
    </Button>
  )
}

