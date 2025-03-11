"use client"

import { useState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { editSubscriber } from "@/app/actions"
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
      {pending ? "Modification en cours..." : "Modifier l'abonné"}
    </Button>
  )
}

type Subscriber = {
  id: number
  name: string
  phone: string
  created_at: string
}

type EditSubscriberFormProps = {
  subscriber: Subscriber
  onSuccess?: (subscriber: Subscriber) => void
}

export default function EditSubscriberForm({ subscriber, onSuccess }: EditSubscriberFormProps) {
  // Update the form state to remove email
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
  })

  useEffect(() => {
    if (subscriber) {
      setFormState({
        name: subscriber.name,
        phone: subscriber.phone,
      })
    }
  }, [subscriber])

  async function handleSubmit(formData: FormData) {
    // Add the ID to the form data
    formData.append("id", subscriber.id.toString())

    const result = await editSubscriber(formData)

    if (result.success) {
      toast.success("Abonné modifié avec succès!")

      // Appeler le callback avec l'abonné mis à jour
      if (onSuccess && result.subscriber) {
        onSuccess(result.subscriber)
      }
    } else {
      toast.error(result.message || "Une erreur s'est produite. Veuillez réessayer.")
    }
  }

  // Remove the email field from the form
  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-name" className="text-gray-700">
          Nom Complet
        </Label>
        <Input
          id="edit-name"
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
        <Label htmlFor="edit-phone" className="text-gray-700">
          Numéro de Téléphone
        </Label>
        <Input
          id="edit-phone"
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

