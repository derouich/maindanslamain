"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { subscribeUser } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      className="w-full py-6 text-lg font-medium text-white transition-colors bg-emerald-600 hover:bg-emerald-700"
      disabled={pending}
    >
      {pending ? "Traitement en cours..." : "Rejoindre la Liste d'Attente"}
    </Button>
  )
}

export default function SubscriptionForm() {
  // Update the form state to remove email
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
  })

  // Update the handleSubmit function to handle the new form structure
  async function handleSubmit(formData: FormData) {
    const result = await subscribeUser(formData)

    if (result.success) {
      toast.success("Merci pour votre inscription! Nous vous contacterons bientôt.")
      setFormState({ name: "", phone: "" })
    } else {
      toast.error(result.message || "Une erreur s'est produite. Veuillez réessayer.")
    }
  }

  // Remove the email input field and keep only name and phone
  return (
    <form action={handleSubmit} className="space-y-6">
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
          placeholder="Entrez votre nom complet"
          required
          className="py-6 text-black border-gray-300 rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
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
          placeholder="Entrez votre numéro de téléphone"
          required
          className="py-6 text-black border-gray-300 rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
        />
      </div>

      <SubmitButton />
    </form>
  )
}

