"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { toggleSectionVisibility, type SectionVisibility } from "@/app/actions/section-visibility"
import { Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SectionVisibilityManagerProps {
  sections: SectionVisibility[]
}

export default function SectionVisibilityManager({ sections }: SectionVisibilityManagerProps) {
  const [visibilityState, setVisibilityState] = useState<Record<string, boolean>>(
    sections.reduce(
      (acc, section) => {
        acc[section.section_id] = section.is_visible
        return acc
      },
      {} as Record<string, boolean>,
    ),
  )

  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const handleToggle = (sectionId: string) => {
    const newVisibility = !visibilityState[sectionId]
    setVisibilityState((prev) => ({
      ...prev,
      [sectionId]: newVisibility,
    }))
    setHasChanges(true)
  }

  const saveChanges = async () => {
    setIsSaving(true)

    try {
      // Save all changes to database
      const promises = Object.entries(visibilityState).map(([sectionId, isVisible]) =>
        toggleSectionVisibility(sectionId, isVisible),
      )

      const results = await Promise.all(promises)

      // Check if all changes were successful
      const allSuccessful = results.every((result) => result.success)

      if (allSuccessful) {
        toast.success("Modifications enregistrées avec succès")
        setHasChanges(false)

        // Revalidate the home page
        await fetch("/api/revalidate-sections", { method: "POST" })

        // Suggest refreshing the home page
        toast.message("Pour voir les changements", {
          action: {
            label: "Rafraîchir la page d'accueil",
            onClick: () => window.open("/", "_blank"),
          },
        })
      } else {
        toast.error("Certaines modifications n'ont pas pu être enregistrées")
      }
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement des modifications")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-600">
        Utilisez les interrupteurs ci-dessous pour afficher ou masquer les différentes sections du site. N'oubliez pas
        de sauvegarder vos modifications.
      </p>

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.section_id} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor={`toggle-${section.section_id}`} className="text-base font-medium">
                {section.section_name}
              </Label>
              <p className="text-sm text-gray-500">{visibilityState[section.section_id] ? "Visible" : "Masquée"}</p>
            </div>
            <div className="flex items-center gap-2">
              {loading[section.section_id] && <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />}
              <Switch
                id={`toggle-${section.section_id}`}
                checked={visibilityState[section.section_id]}
                onCheckedChange={() => handleToggle(section.section_id)}
                disabled={isSaving}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button onClick={saveChanges} disabled={!hasChanges || isSaving} className="flex items-center gap-2">
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Enregistrer les modifications
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

