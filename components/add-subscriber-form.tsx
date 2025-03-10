"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { addSubscriber } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      className="w-full py-2 font-medium text-white transition-colors bg-emerald-600 hover:bg-emerald-700"
      disabled={pending}
    >
      {pending ? "Ajout en cours..." : "Ajouter l'abonné"}
    </Button>
  )
}

type Subscriber = {
  id: number
  name: string
  email: string
  phone: string
  created_at: string
}

type AddSubscriberFormProps = {
  onSuccess?: (subscriber: Subscriber) => void
}

export default function AddSubscriberForm({ onSuccess }: AddSubscriberFormProps) {
  // Update the form state to remove email
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
  })

  async function handleSubmit(formData: FormData) {
    const result = await addSubscriber(formData)

    if (result.success) {
      toast.success("Abonné ajouté avec succès!")

      // Créer un objet abonné à partir des données du formulaire
      if (onSuccess && result.subscriber) {
        onSuccess(result.subscriber)
      } else if (onSuccess) {
        // Fallback if subscriber data is not returned
        const fallbackSubscriber = {
          id: Date.now(),
          name: formState.name,
          phone: formState.phone,
          created_at: new Date().toISOString(),
        }
        onSuccess(fallbackSubscriber)
      }

      // Réinitialiser le formulaire
      setFormState({ name: "", phone: "" })
    } else {
      toast.error(result.message || "Une erreur s'est produite. Veuillez réessayer.")
    }
  }

  // Remove the email field from the form
  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-gray-700">
          Nom Complet
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          value={formState.name}
          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
          placeholder="Entrez le nom complet"
          required
          className="text-black border-gray-300 rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-gray-700">
          Numéro de Téléphone
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formState.phone}
          onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
          placeholder="Entrez le numéro de téléphone"
          required
          className="text-black border-gray-300 rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
        />
      </div>

      <SubmitButton />
    </form>
  )
}

