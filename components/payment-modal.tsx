"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Check,
  CreditCard,
  Loader2,
  ShoppingCartIcon as PaypalIcon,
  User,
  CreditCardIcon as PaymentIcon,
  CheckCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  type: "formation" | "abonnement"
  price: number
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  paymentMethod: "cmi" | "paypal"
}

export function PaymentModal({ isOpen, onClose, type, price }: PaymentModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    paymentMethod: "cmi",
  })

  const steps = [
    {
      number: 1,
      title: "Informations",
      icon: User,
      description: "Vos coordonnées",
    },
    {
      number: 2,
      title: "Paiement",
      icon: PaymentIcon,
      description: "Choisissez votre méthode",
    },
    {
      number: 3,
      title: "Confirmation",
      icon: CheckCircle,
      description: "C'est fait !",
    },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePaymentMethodChange = (value: "cmi" | "paypal") => {
    setFormData({ ...formData, paymentMethod: value })
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setCurrentStep(3)
  }

  const isStepComplete = (stepNumber: number) => {
    if (stepNumber === 1) {
      return formData.firstName && formData.lastName && formData.email && formData.phone
    }
    if (stepNumber === 2) {
      return formData.paymentMethod
    }
    return false
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold">
            {type === "formation" ? "Réserver Votre Formation" : "S'abonner au Programme"}
          </DialogTitle>
        </DialogHeader>

        {/* Stepper */}
        <div className="px-6 py-4 border-b bg-slate-50">
          <div className="flex justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.number
              const isComplete = currentStep > step.number
              const isLastStep = index === steps.length - 1

              return (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors duration-200",
                        isActive && "border-primary bg-primary text-white",
                        isComplete && "border-primary bg-primary text-white",
                        !isActive && !isComplete && "border-slate-200 bg-white",
                      )}
                    >
                      {isComplete ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <div className="mt-2 space-y-1">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          (isActive || isComplete) && "text-primary",
                          !isActive && !isComplete && "text-slate-500",
                        )}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-slate-500">{step.description}</p>
                    </div>
                  </div>
                  {!isLastStep && (
                    <div className={cn("h-[2px] w-12 mx-2 mt-5", isComplete ? "bg-primary" : "bg-slate-200")} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Step Content */}
          <div className="min-h-[300px]">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Votre prénom"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Votre nom"
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
                    onChange={handleInputChange}
                    placeholder="vous@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Numéro de téléphone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+212 6XX XXXXXX"
                    required
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value: "cmi" | "paypal") => handlePaymentMethodChange(value)}
                  className="grid gap-4"
                >
                  <div className="relative">
                    <RadioGroupItem value="cmi" id="cmi" className="peer sr-only" />
                    <Label
                      htmlFor="cmi"
                      className="flex items-center justify-between rounded-lg border-2 border-muted bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="flex items-center gap-4">
                        <CreditCard className="h-6 w-6 text-primary" />
                        <div>
                          <div className="font-medium">Carte Bancaire CMI</div>
                          <div className="text-sm text-muted-foreground">Paiement sécurisé via CMI</div>
                        </div>
                      </div>
                      <Check
                        className={cn(
                          "h-5 w-5 text-primary",
                          formData.paymentMethod === "cmi" ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </Label>
                  </div>
                  <div className="relative">
                    <RadioGroupItem value="paypal" id="paypal" className="peer sr-only" />
                    <Label
                      htmlFor="paypal"
                      className="flex items-center justify-between rounded-lg border-2 border-muted bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="flex items-center gap-4">
                        <PaypalIcon className="h-6 w-6 text-primary" />
                        <div>
                          <div className="font-medium">PayPal</div>
                          <div className="text-sm text-muted-foreground">Paiement rapide et sécurisé</div>
                        </div>
                      </div>
                      <Check
                        className={cn(
                          "h-5 w-5 text-primary",
                          formData.paymentMethod === "paypal" ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </Label>
                  </div>
                </RadioGroup>
                <div className="rounded-lg bg-slate-50 p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total à payer</span>
                    <span className="text-2xl font-bold text-primary">{price} DH</span>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="rounded-lg bg-green-50 p-6 text-center">
                  <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-green-800">Paiement Confirmé</h3>
                  <p className="mt-2 text-sm text-green-600">
                    Merci pour votre confiance ! Vous allez recevoir un email de confirmation dans quelques instants.
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 space-y-3">
                  <h4 className="font-medium">Récapitulatif de votre commande</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-muted-foreground">Nom complet</span>
                      <span className="font-medium">
                        {formData.firstName} {formData.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-muted-foreground">Email</span>
                      <span className="font-medium">{formData.email}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-muted-foreground">Téléphone</span>
                      <span className="font-medium">{formData.phone}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-muted-foreground">Méthode de paiement</span>
                      <span className="font-medium">
                        {formData.paymentMethod === "cmi" ? "Carte Bancaire CMI" : "PayPal"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 font-medium">
                      <span>Montant total</span>
                      <span className="text-primary">{price} DH</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            {currentStep < 3 && (
              <>
                <Button
                  variant="ghost"
                  onClick={currentStep > 1 ? handleBack : onClose}
                  className="flex items-center gap-2"
                >
                  {currentStep > 1 ? "Retour" : "Annuler"}
                </Button>
                {currentStep === 2 ? (
                  <Button
                    className="btn-cta flex items-center gap-2"
                    onClick={handleSubmit}
                    disabled={isLoading || !formData.paymentMethod}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Traitement...
                      </>
                    ) : (
                      <>
                        <PaymentIcon className="h-4 w-4" />
                        Payer {price} DH
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    className="btn-cta flex items-center gap-2"
                    onClick={handleNext}
                    disabled={!isStepComplete(currentStep)}
                  >
                    Continuer
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
            {currentStep === 3 && (
              <Button className="btn-cta ml-auto" onClick={onClose}>
                Terminer
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

