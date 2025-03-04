"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate sending reset email
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    setIsSubmitted(true)
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

          {!isSubmitted ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Mot de passe oublié</h2>
                <p className="text-slate-600">
                  Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="vous@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-11"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    "Envoyer le lien de réinitialisation"
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Email envoyé</h2>
              <p className="text-slate-600 mb-6">
                Si un compte existe avec l'email {email}, vous recevrez un lien de réinitialisation de mot de passe.
              </p>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => {
                  setIsSubmitted(false)
                  setEmail("")
                }}
              >
                Retour
              </Button>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Vous vous souvenez de votre mot de passe?{" "}
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
                <h3 className="font-medium text-emerald-800">Réinitialisation de mot de passe</h3>
                <p className="text-sm text-slate-600 mt-1">Nous vous aiderons à récupérer l'accès à votre compte.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

