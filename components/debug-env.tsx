"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function DebugEnv() {
  const [showEnv, setShowEnv] = useState(false)

  return (
    <div className="p-4 mt-4 bg-gray-100 rounded-md">
      <Button onClick={() => setShowEnv(!showEnv)}>
        {showEnv ? "Masquer les informations de débogage" : "Afficher les informations de débogage"}
      </Button>

      {showEnv && (
        <div className="mt-4">
          <h3 className="mb-2 text-lg font-semibold">Variables d'environnement publiques :</h3>
          <ul className="pl-5 list-disc">
            <li>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "Défini ✅" : "Non défini ❌"}</li>
            <li>
              NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Défini ✅" : "Non défini ❌"}
            </li>
          </ul>
          <p className="mt-4 text-sm text-gray-600">
            Note: Les variables d'environnement côté serveur ne sont pas visibles ici pour des raisons de sécurité.
          </p>
        </div>
      )}
    </div>
  )
}

