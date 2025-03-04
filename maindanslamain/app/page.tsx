"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Facebook,
  Instagram,
  MessageCircle,
  InstagramIcon as TiktokIcon,
  X,
  BookOpen,
  Users,
  Calendar,
  Award,
  Heart,
  Quote,
  Check,
} from "lucide-react"
import { PaymentModal } from "@/components/payment-modal"
import { cn } from "@/lib/utils"

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
    <div className="flex min-h-screen flex-col bg-white">
      {showBanner && (
        <div className="bg-[#004225] text-white py-2 px-4 text-center relative">
          <div className="container mx-auto flex items-center justify-center gap-2 text-sm md:text-base">
            <span className="hidden md:inline">🌙</span>
            <p className="font-medium">
              Offre Ramadan : <span className="font-bold">100 DH de réduction</span> avec le code{" "}
              <span className="bg-white/20 px-2 py-0.5 rounded font-mono">RAMADAN</span>{" "}
              <span className="hidden md:inline">- Valable jusqu'à la fin du Ramadan</span>
            </p>
            <button
              onClick={() => setShowBanner(false)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Fermer la bannière"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b backdrop-blur transition-all duration-300",
          scrolled ? "bg-white/95 shadow-sm" : "bg-white",
        )}
      >
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-serif text-xl font-medium">
            <span>Dr. Youness Chraibi</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" })
              }}
              className="text-sm font-medium transition-colors hover:text-primary cursor-pointer"
            >
              À Propos
            </a>
            <a
              href="#mentorship"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById("mentorship")?.scrollIntoView({ behavior: "smooth" })
              }}
              className="text-sm font-medium transition-colors hover:text-primary cursor-pointer"
            >
              Mentorat
            </a>
            <a
              href="#testimonials"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById("testimonials")?.scrollIntoView({ behavior: "smooth" })
              }}
              className="text-sm font-medium transition-colors hover:text-primary cursor-pointer"
            >
              Témoignages
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
              }}
              className="text-sm font-medium transition-colors hover:text-primary cursor-pointer"
            >
              Contact
            </a>
          </nav>
          <Button className="btn-cta hidden md:flex" onClick={() => handlePaymentClick("formation", 999)}>
            Réserver Ma Place
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="md:hidden"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
          >
            Menu
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section id="hero" className="relative overflow-hidden bg-pattern py-12 md:py-16">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
          <div className="container relative px-4 md:px-6">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 lg:pr-8 text-center lg:text-left">
                <div className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary">
                  Mentorat Spirituel & Développement Personnel
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-gradient">
                  Le Changement Intérieur, <br />
                  La Clé de Votre Transformation
                </h1>
                <p className="text-lg md:text-xl text-slate-700 mb-8 max-w-2xl mx-auto lg:mx-0">
                  Bienvenue dans un voyage de croissance spirituelle et de transformation personnelle. En tant que
                  mentor spirituel musulman, je guide les individus vers la paix intérieure, le sens et la connexion
                  avec leur foi.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    className="btn-cta rounded-md px-6 py-4 text-lg font-medium hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl"
                    onClick={() => handlePaymentClick("formation", 999)}
                  >
                    Réservez Votre Place Pour La Formation 🎯
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-6 py-4 text-lg border-primary text-primary hover:bg-primary/5"
                    onClick={() => document.getElementById("mentorship")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    Découvrir le Programme
                  </Button>
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="relative mx-auto">
                  <div className="relative overflow-hidden rounded-xl border border-slate-200 shadow-lg">
                    <Image
                      src="/images/younes.jpg"
                      width={1000}
                      height={800}
                      alt="Dr. Youness Chraibi avec des collègues lors d'un événement de coaching"
                      className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-white/20">
                    <p className="text-sm font-medium text-primary">Youness Chraibi</p>
                    <p className="text-xs text-muted-foreground">
                      Dentiste Chirurgien, Mentor & Spirituel, Public Speaker
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="stats" className="py-8 bg-gradient-to-b from-white to-slate-50">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div className="flex flex-col items-center p-6 bg-white rounded-xl border shadow-sm card-hover">
                <Users className="h-8 w-8 mb-3 text-primary" />
                <span className="text-3xl font-bold text-primary">1200+</span>
                <span className="text-sm text-center text-slate-600">Personnes Accompagnées</span>
              </div>
              <div className="flex flex-col items-center p-6 bg-white rounded-xl border shadow-sm card-hover">
                <BookOpen className="h-8 w-8 mb-3 text-primary" />
                <span className="text-3xl font-bold text-primary">40+</span>
                <span className="text-sm text-center text-slate-600">Vidéos de Formation</span>
              </div>
              <div className="flex flex-col items-center p-6 bg-white rounded-xl border shadow-sm card-hover">
                <Award className="h-8 w-8 mb-3 text-primary" />
                <span className="text-3xl font-bold text-primary">15+</span>
                <span className="text-sm text-center text-slate-600">Années d'Expérience</span>
              </div>
              <div className="flex flex-col items-center p-6 bg-white rounded-xl border shadow-sm card-hover">
                <Calendar className="h-8 w-8 mb-3 text-primary" />
                <span className="text-2xl font-bold text-primary">15 Mars</span>
                <span className="text-sm text-primary font-medium">Paris</span>
                <span className="text-xs text-center text-slate-600">Prochaine Formation</span>
              </div>
            </div>
          </div>
        </section>

        <section id="mentorship" className="py-12 md:py-16 bg-slate-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-pattern opacity-50"></div>
          <div className="container relative px-4 md:px-6">
            <div className="text-center mb-8">
              <div className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary">
                Programme Exclusif
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Rejoignez Mon Programme de Mentorat Spirituel</h2>
              <p className="text-lg text-slate-700 max-w-2xl mx-auto">
                Accédez à du contenu vidéo exclusif, des conseils personnalisés et des pratiques spirituelles
                transformatrices qui vous aideront à naviguer dans les défis de la vie avec foi et sagesse.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 items-start">
              <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-100 card-hover h-full">
                <h3 className="text-2xl font-bold mb-6">Ce Que Vous Apprendrez</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Heart className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Développement Spirituel</h4>
                      <p className="text-slate-600 text-sm">
                        Apprenez à cultiver une connexion profonde avec votre spiritualité et à intégrer ses
                        enseignements dans votre vie quotidienne.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Heart className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Équilibre Émotionnel</h4>
                      <p className="text-slate-600 text-sm">
                        Découvrez des techniques pour gérer le stress, l'anxiété et cultiver la paix intérieure même
                        dans les moments difficiles.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Heart className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Relations Harmonieuses</h4>
                      <p className="text-slate-600 text-sm">
                        Améliorez vos relations personnelles et professionnelles grâce à des principes spirituels et
                        éthiques profonds.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Heart className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Sagesse Pratique</h4>
                      <p className="text-slate-600 text-sm">
                        Appliquez les enseignements spirituels à vos défis quotidiens pour une vie plus épanouissante et
                        alignée.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100 h-full flex flex-col">
                <div className="bg-primary/5 p-6 border-b border-slate-100">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-1">Abonnement</h3>
                    <p className="text-slate-600">Accès exclusif au mentorat spirituel</p>
                  </div>
                  <div className="flex items-center justify-center gap-3 my-6">
                    <span className={`text-sm font-medium ${!isAnnual ? "text-primary" : "text-slate-500"}`}>
                      Mensuel
                    </span>
                    <Switch
                      checked={isAnnual}
                      onCheckedChange={setIsAnnual}
                      className={cn(
                        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        isAnnual ? "bg-[#00a350]" : "bg-slate-200",
                      )}
                    />
                    <span className={`text-sm font-medium ${isAnnual ? "text-primary" : "text-slate-500"}`}>
                      Annuel
                    </span>
                  </div>
                  <div className="text-center">
                    {!isAnnual && (
                      <div className="inline-block bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full mb-2">
                        -20% avec le code RAMADAN
                      </div>
                    )}
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-4xl font-bold">{isAnnual ? "799" : "99"} Dirhams</span>
                      <span className="text-slate-500">/{isAnnual ? "an" : "mois"}</span>
                    </div>
                    {isAnnual && <p className="text-sm text-slate-500 mt-1">Économisez 389 Dh par an</p>}
                  </div>
                </div>
                <div className="flex-1 p-6">
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-slate-700">Accès complet à toutes les vidéos de mentorat</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-slate-700">Sessions live hebdomadaires gratuites</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-slate-700">Rejoignez la communauté WhatsApp exclusive</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-slate-700">Sessions mensuelles de questions-réponses en direct</span>
                    </li>
                  </ul>
                  <Button
                    className="w-full btn-cta rounded-md py-6 text-lg font-medium shadow-md hover:shadow-lg transition-all"
                    onClick={() => handlePaymentClick("abonnement", isAnnual ? 799 : 99)}
                  >
                    S'Abonner Maintenant
                  </Button>
                  <p className="text-xs text-center text-slate-500 mt-4">
                    Annulation possible à tout moment. Satisfaction garantie ou remboursé pendant 14 jours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-12 bg-white relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-slate-50 to-white"></div>
          <div className="container relative px-4 md:px-6">
            <div className="text-center mb-8">
              <div className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary">
                Témoignages
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ce Que Disent Nos Membres</h2>
              <p className="text-lg text-slate-700 max-w-2xl mx-auto">
                Découvrez comment notre programme de mentorat a transformé la vie de nos membres et les a aidés dans
                leur parcours spirituel.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-slate-100 card-hover">
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />
                  <p className="text-slate-700 mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-medium">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-slate-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="community" className="py-12 md:py-16 bg-primary/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-pattern opacity-30"></div>
          <div className="container relative px-4 md:px-6">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-block px-3 py-1 mb-3 text-sm font-medium rounded-full bg-primary/10 text-primary">
                Rejoignez Notre Communauté
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Connectez-Vous Avec Des Personnes Partageant Les Mêmes Valeurs
              </h2>
              <p className="text-lg text-slate-700 mb-6">
                Faites partie de notre communauté WhatsApp exclusive où vous pourrez partager votre parcours, poser des
                questions et recevoir le soutien des autres membres ainsi que mes conseils directs.
              </p>
              <Button className="flex items-center justify-center gap-2 btn-cta rounded-md px-6 py-4 text-lg font-medium shadow-md hover:shadow-lg transition-all mx-auto">
                <MessageCircle className="h-5 w-5" />
                Rejoindre la Communauté WhatsApp
              </Button>
            </div>
          </div>
        </section>

        <section id="social" className="py-12 md:py-16 bg-white">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Connectez-Vous Avec Moi</h2>
              <p className="text-lg text-slate-700 max-w-2xl mx-auto">
                Suivez-moi sur les réseaux sociaux pour une inspiration quotidienne, de la sagesse et des mises à jour
                sur le nouveau contenu.
              </p>
              <div className="flex gap-4 justify-center mt-6">
                <Link
                  href="#"
                  className="flex h-12 w-12 items-center justify-center rounded-full border bg-white shadow-sm transition-colors hover:bg-slate-50"
                >
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link
                  href="#"
                  className="flex h-12 w-12 items-center justify-center rounded-full border bg-white shadow-sm transition-colors hover:bg-slate-50"
                >
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link
                  href="#"
                  className="flex h-12 w-12 items-center justify-center rounded-full border bg-white shadow-sm transition-colors hover:bg-slate-50"
                >
                  <TiktokIcon className="h-5 w-5" />
                  <span className="sr-only">TikTok</span>
                </Link>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100 card-hover">
                <Instagram className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 text-xl font-bold">Instagram</h3>
                <p className="text-slate-600">Réflexions spirituelles quotidiennes et sagesse pour votre parcours.</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100 card-hover">
                <Facebook className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 text-xl font-bold">Facebook</h3>
                <p className="text-slate-600">
                  Rejoignez notre communauté grandissante pour des discussions et des sessions en direct.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100 card-hover">
                <TiktokIcon className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 text-xl font-bold">TikTok</h3>
                <p className="text-slate-600">Conseils spirituels courts et percutants pour votre vie quotidienne.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer id="contact" className="bg-slate-900 text-white py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <Link href="/" className="font-serif text-2xl font-medium">
                Dr. Youness Chraibi
              </Link>
              <p className="mt-2 text-slate-400">Mentor & Guide Spirituel</p>
              <p className="mt-4 text-slate-400">Accompagnement spirituel pour une vie équilibrée et épanouissante.</p>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Liens Rapides</h4>
              <nav className="flex flex-col gap-2">
                <Link href="#about" className="text-slate-400 hover:text-white transition-colors">
                  À Propos
                </Link>
                <Link href="#mentorship" className="text-slate-400 hover:text-white transition-colors">
                  Mentorat
                </Link>
                <Link href="#testimonials" className="text-slate-400 hover:text-white transition-colors">
                  Témoignages
                </Link>
                <Link href="#contact" className="text-slate-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </nav>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Contact</h4>
              <p className="text-slate-400">contact@younesschraibi.com</p>
              <div className="flex gap-4 mt-4">
                <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                  <TiktokIcon className="h-5 w-5" />
                  <span className="sr-only">TikTok</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; {new Date().getFullYear()} Dr. Youness Chraibi - Tous droits réservés.</p>
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

