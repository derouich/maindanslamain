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

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate authentication
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    // Redirect to dashboard or other page after login
    // router.push("/platforme/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm text-emerald-700 hover:text-emerald-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
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
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Connexion</h2>
            <p className="text-slate-600">Bienvenue ! Veuillez vous connecter pour accéder à votre compte.</p>
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <Link href="/platforme/forgot-password" className="text-sm text-emerald-700 hover:text-emerald-800">
                  Mot de passe oublié?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-normal">
                Se souvenir de moi
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
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Vous n'avez pas de compte?{" "}
              <Link href="/platforme/register" className="text-emerald-700 hover:text-emerald-800 font-medium">
                S'inscrire
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
                <h3 className="font-medium text-emerald-800">Plateforme de Mentorat Spirituel</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Accédez à votre parcours spirituel personnalisé et rejoignez notre communauté.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

