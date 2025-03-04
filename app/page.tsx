"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Mail } from "lucide-react"
import { PaymentModal } from "@/components/payment-modal"
import { Input } from "@/components/ui/input"

export default function Home() {
  const [showBanner, setShowBanner] = useState(true)
  const [isAnnual, setIsAnnual] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentType, setPaymentType] = useState<"formation" | "abonnement">("formation")
  const [paymentAmount, setPaymentAmount] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handlePaymentClick = (type: "formation" | "abonnement", amount: number) => {
    setPaymentType(type)
    setPaymentAmount(amount)
    setShowPaymentModal(true)
  }

  const testimonials = [
    {
      quote:
        "Le programme de mentorat de Dr. Youness a complètement transformé ma perspective spirituelle et m'a aidé à trouver un équilibre intérieur.",
      name: "Fatima B.",
      role: "Professeure",
    },
    {
      quote:
        "J'ai trouvé une communauté bienveillante et des enseignements profonds qui m'ont guidé vers une meilleure compréhension de ma foi.",
      name: "Ahmed K.",
      role: "Ingénieur",
    },
    {
      quote:
        "Les sessions hebdomadaires sont devenues un pilier essentiel de mon développement personnel et spirituel.",
      name: "Layla M.",
      role: "Médecin",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-emerald-50 to-white">
      {/* Banner */}
      <div className="bg-[#004225] text-white py-2 px-4 text-center">
        <div className="container mx-auto flex items-center justify-center gap-2 text-sm md:text-base">
          <span className="hidden md:inline">🌙</span>
          <p className="font-medium">
            Lancement Imminent : <span className="font-bold">Rejoignez la liste d'attente</span> pour un accès anticipé
          </p>
        </div>
      </div>

      <main className="flex-1 flex flex-col">
        <div className="container px-4 md:px-6 py-10 md:py-14 flex-1 flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
            <div className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full bg-emerald-100 text-emerald-800">
              Bientôt Disponible
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-emerald-900">
              Votre Voyage Spirituel <br />
              <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                Commence Bientôt
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-700 max-w-2xl">
              Préparez-vous à une expérience transformative avec Dr. Youness Chraibi. Notre plateforme de mentorat
              spirituel et développement personnel sera lancée très prochainement.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
              <div className="relative flex-1 max-w-sm">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  type="email"
                  placeholder="Votre email"
                  className="pl-10 bg-white border-emerald-200 focus:border-emerald-500 h-12"
                />
              </div>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-6">
                Être notifié
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <Link href="/beta" className="text-emerald-700 hover:text-emerald-800 font-medium flex items-center">
                Accéder à la version bêta
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
              <span className="hidden sm:inline text-slate-400">•</span>
              <Link href="/platforme" className="text-emerald-700 hover:text-emerald-800 font-medium flex items-center">
                Se connecter
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="pt-6">
              <p className="text-sm text-slate-500">
                Rejoignez plus de <span className="font-medium text-emerald-700">1200+</span> personnes déjà inscrites
              </p>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="relative mx-auto max-w-md">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-emerald-700/20 rounded-2xl transform rotate-3"></div>
              <div className="absolute inset-0 bg-gradient-to-bl from-emerald-500/20 to-emerald-700/20 rounded-2xl transform -rotate-3"></div>
              <div className="relative overflow-hidden rounded-xl border border-emerald-200 shadow-lg bg-white">
                <Image
                  src="/images/youness.jpg"
                  width={1000}
                  height={800}
                  alt="Dr. Youness Chraibi avec des collègues lors d'un événement de coaching"
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-emerald-100">
                <p className="text-sm font-medium text-emerald-700">Youness Chraibi</p>
                <p className="text-xs text-slate-600">Dentiste Chirurgien, Mentor & Spirituel, Public Speaker</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 py-10">
          <div className="container px-4 md:px-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-emerald-800 mb-6">Ce qui vous attend</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 mx-auto mb-4">
                    <span className="text-xl font-bold">1</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Mentorat Personnalisé</h3>
                  <p className="text-slate-600">Accès à des sessions de mentorat adaptées à votre parcours spirituel</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 mx-auto mb-4">
                    <span className="text-xl font-bold">2</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Contenu Exclusif</h3>
                  <p className="text-slate-600">Plus de 40 vidéos et ressources pour votre développement personnel</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 mx-auto mb-4">
                    <span className="text-xl font-bold">3</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Communauté Engagée</h3>
                  <p className="text-slate-600">Rejoignez une communauté de personnes partageant les mêmes valeurs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-emerald-100 py-6">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 text-sm">
              © {new Date().getFullYear()} Dr. Youness Chraibi - Tous droits réservés
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-slate-600 hover:text-emerald-700 text-sm">
                Politique de confidentialité
              </Link>
              <Link href="#" className="text-slate-600 hover:text-emerald-700 text-sm">
                Conditions d'utilisation
              </Link>
              <Link href="#" className="text-slate-600 hover:text-emerald-700 text-sm">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        type={paymentType}
        price={paymentAmount}
      />
    </div>
  )
}

