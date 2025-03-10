"use client"

import { useState } from "react"
import { CalendarDays, MapPin, Clock, Users, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const PAYPAL_USERNAME = "maindanslamain" // Replace with actual PayPal username

export default function ParisEventSection() {
  const [selectedTicket, setSelectedTicket] = useState<"single" | "couple" | null>(null)

  const handlePayment = (type: "single" | "couple") => {
    const amount = type === "single" ? "155" : "300"
    const description = type === "single" ? "Billet individuel" : "Billet couple"

    // Redirect to PayPal payment
    window.location.href = `https://www.paypal.me/${PAYPAL_USERNAME}/${amount}EUR`
  }

  return (
    <section className="relative py-16 bg-gradient-to-b from-emerald-50 to-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-100 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full opacity-20 translate-x-1/3 translate-y-1/3"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Elegant header with underline */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-emerald-800 mb-3 inline-block relative">
            Formation Exceptionnelle à Paris
            <span className="absolute bottom-0 left-1/2 w-24 h-1 bg-emerald-500 -translate-x-1/2 rounded-full"></span>
          </h2>
          <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">
            Un voyage vers le changement avec Dr. Younes Chraibi
          </p>
        </div>

        {/* Main content in an elegant card */}
        <div className="max-w-6xl mx-auto">
          <Card className="overflow-hidden shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-12 gap-0">
                {/* Left side - Image and key details */}
                <div className="md:col-span-4 bg-gradient-to-br from-emerald-600 to-blue-700 text-white p-8 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-6 border-b border-white/20 pb-4">Informations Clés</h3>

                    <ul className="space-y-6">
                      <li className="flex items-start gap-4">
                        <CalendarDays className="h-6 w-6 text-emerald-200 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-medium text-lg text-emerald-100">Dates</p>
                          <p className="text-white">14-15 Mars 2025</p>
                          <p className="text-sm text-emerald-100">Vendredi-Samedi</p>
                        </div>
                      </li>

                      <li className="flex items-start gap-4">
                        <Clock className="h-6 w-6 text-emerald-200 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-medium text-lg text-emerald-100">Horaire</p>
                          <p className="text-white">Dès 15h30</p>
                        </div>
                      </li>

                      <li className="flex items-start gap-4">
                        <MapPin className="h-6 w-6 text-emerald-200 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-medium text-lg text-emerald-100">Lieu</p>
                          <p className="text-white">89 BD National</p>
                          <p className="text-sm text-emerald-100">92250 La Garenne-Colombes, Paris-France</p>
                        </div>
                      </li>

                      <li className="flex items-start gap-4">
                        <Users className="h-6 w-6 text-emerald-200 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-medium text-lg text-emerald-100">Places</p>
                          <p className="text-white">Limitées</p>
                          <p className="text-sm text-emerald-100">Réservation requise</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/20">
                    <p className="text-emerald-100 italic">
                      "Une expérience transformative qui changera votre perspective sur la vie"
                    </p>
                  </div>
                </div>

                {/* Right side - Program and pricing */}
                <div className="md:col-span-8 p-8">
                  <div className="space-y-8">
                    {/* Program section */}
                    <div>
                      <h3 className="text-2xl font-bold text-emerald-800 mb-6 pb-2 border-b border-emerald-100">
                        Programme Détaillé
                      </h3>

                      <div className="space-y-6">
                        <div className="flex gap-4">
                          <div className="w-20 text-center">
                            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-medium">
                              15h30
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">Accueil des participants</h4>
                            <p className="text-gray-600">Enregistrement et installation</p>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <div className="w-20 text-center">
                            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-medium">
                              16h00
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">Les clefs de la réussite</h4>
                            <ul className="text-gray-600 list-disc ml-5 mt-1">
                              <li>Description des clefs</li>
                              <li>Comment activer ces clefs</li>
                            </ul>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <div className="w-20 text-center">
                            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-medium">
                              17h30
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">Atelier pratique</h4>
                            <p className="text-gray-600">Questions & Réponses</p>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <div className="w-20 text-center">
                            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-medium">
                              18h00
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">L'art de communiquer</h4>
                            <p className="text-gray-600">Relations humaines et développement personnel</p>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <div className="w-20 text-center">
                            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-medium">
                              19h00
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">Rupture du jeûne et séance photo</h4>
                            <p className="text-gray-600">Moment de partage et d'échange</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pricing section */}
                    <div className="mt-10">
                      <h3 className="text-2xl font-bold text-emerald-800 mb-6 pb-2 border-b border-emerald-100">
                        Réservation
                      </h3>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div
                          className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
                            selectedTicket === "single"
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-gray-200 hover:border-emerald-300"
                          }`}
                          onClick={() => setSelectedTicket("single")}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-xl font-bold text-gray-800">Billet Individuel</h4>
                              <p className="text-gray-600">Accès complet à la formation</p>
                            </div>
                            <div className="text-3xl font-bold text-emerald-600">155€</div>
                          </div>
                          <Button
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => handlePayment("single")}
                          >
                            Réserver maintenant
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>

                        <div
                          className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
                            selectedTicket === "couple"
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-gray-200 hover:border-emerald-300"
                          }`}
                          onClick={() => setSelectedTicket("couple")}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-xl font-bold text-gray-800">Billet Couple</h4>
                              <p className="text-gray-600">Tarif spécial pour les couples</p>
                            </div>
                            <div className="text-3xl font-bold text-emerald-600">300€</div>
                          </div>
                          <Button
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => handlePayment("couple")}
                          >
                            Réserver pour deux
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

