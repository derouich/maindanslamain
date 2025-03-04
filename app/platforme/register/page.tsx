"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas")
      setIsLoading(false)
      return
    }

    // Simulate registration
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    // Redirect to login page after registration
    router.push("/platforme")
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col">
        <div className="mb-6">
          <Link href="/platforme" className="inline-flex items-center text-sm text-emerald-700 hover:text-emerald-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la connexion
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <h1 className="text-2xl font-serif font-bold text-emerald-800">Dr. Youness Chraibi</h1>
            </Link>
            <p className="text-slate-600 mt-1">Plateforme de Mentorat Spirituel</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Créer un compte</h2>
            <p className="text-slate-600">Rejoignez notre communauté de mentorat spirituel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Prénom"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Nom"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="vous@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" required />
              <Label htmlFor="terms" className="text-sm font-normal">
                J'accepte les{" "}
                <Link href="#" className="text-emerald-700 hover:text-emerald-800">
                  conditions d'utilisation
                </Link>{" "}
                et la{" "}
                <Link href="#" className="text-emerald-700 hover:text-emerald-800">
                  politique de confidentialité
                </Link>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-11"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création en cours...
                </>
              ) : (
                "Créer un compte"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Vous avez déjà un compte?{" "}
              <Link href="/platforme" className="text-emerald-700 hover:text-emerald-800 font-medium">
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Dr. Youness Chraibi - Tous droits réservés</p>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden md:block w-1/2 bg-emerald-50 relative">
        <div className="absolute inset-0 flex items-center justify-center p-10">
          <div className="relative w-full max-w-lg">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src="/images/youness.jpg"
                  width={1000}
                  height={800}
                  alt="Dr. Youness Chraibi"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                <h3 className="font-medium text-emerald-800">Rejoignez notre communauté</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Commencez votre voyage spirituel avec Dr. Youness Chraibi dès aujourd'hui.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

