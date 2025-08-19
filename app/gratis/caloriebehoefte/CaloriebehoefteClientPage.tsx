"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowRight, ChevronRight, Heart, Users, TrendingUp, Flame, Activity, Target } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

type FormData = {
  naam: string
  email: string
  telefoon: string
  geslacht: "man" | "vrouw"
  leeftijd: number
  gewicht: number
  lengte: number
  activiteit: string
  doel: string
}

type Step = {
  id: number
  title: string
  description: string
}

export default function CaloriebehoefteClientPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    naam: "",
    email: "",
    telefoon: "",
    geslacht: "man",
    leeftijd: 30,
    gewicht: 75,
    lengte: 180,
    activiteit: "matig",
    doel: "afvallen",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [calorieResult, setCalorieResult] = useState<{
    bmr: number
    tdee: number
    target: number
    protein: number
    carbs: number
    fat: number
    recommendedCoaching: string
  } | null>(null)
  const [typingEffect, setTypingEffect] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showNextButton, setShowNextButton] = useState(false)

  // Animated counters on results
  const [displayBMR, setDisplayBMR] = useState(0)
  const [displayTDEE, setDisplayTDEE] = useState(0)
  const [displayTarget, setDisplayTarget] = useState(0)
  const rafRef = useRef<number | null>(null)

  const steps: Step[] = [
    { id: 0, title: "Welkom", description: "Welkom bij de Evotion Caloriebehoefte Calculator" },
    { id: 1, title: "Persoonlijke gegevens", description: "We hebben je naam nodig" },
    { id: 2, title: "Contact", description: "Hoe kunnen we je bereiken?" },
    { id: 3, title: "Geslacht", description: "Wat is je geslacht?" },
    { id: 4, title: "Leeftijd", description: "Wat is je leeftijd?" },
    { id: 5, title: "Gewicht", description: "Wat is je huidige gewicht?" },
    { id: 6, title: "Lengte", description: "Wat is je lengte?" },
    { id: 7, title: "Activiteitsniveau", description: "Hoe actief ben je?" },
    { id: 8, title: "Doel", description: "Wat is je doel?" },
    { id: 9, title: "Berekenen", description: "We berekenen je caloriebehoefte" },
  ]

  const welcomeMessages = [
    "Welkom bij de Evotion Caloriebehoefte Calculator!",
    "Ik ga je helpen om je dagelijkse caloriebehoefte te berekenen.",
    "Hiermee krijg je inzicht in hoeveel calorieën en macronutriënten je nodig hebt om je doel te bereiken.",
    "Laten we beginnen met een paar vragen...",
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number.parseFloat(value) }))
  }

  const calculateCalories = () => {
    // BMR berekening met Mifflin-St Jeor formule
    let bmr = 0
    if (formData.geslacht === "man") {
      bmr = 10 * formData.gewicht + 6.25 * formData.lengte - 5 * formData.leeftijd + 5
    } else {
      bmr = 10 * formData.gewicht + 6.25 * formData.lengte - 5 * formData.leeftijd - 161
    }

    // TDEE berekening op basis van activiteitsniveau
    let tdee = 0
    switch (formData.activiteit) {
      case "sedentair":
        tdee = bmr * 1.2
        break
      case "licht":
        tdee = bmr * 1.375
        break
      case "matig":
        tdee = bmr * 1.55
        break
      case "actief":
        tdee = bmr * 1.725
        break
      case "zeer_actief":
        tdee = bmr * 1.9
        break
      default:
        tdee = bmr * 1.55
    }

    // Doelcalorieën op basis van doel
    let target = 0
    switch (formData.doel) {
      case "afvallen":
        target = tdee * 0.85 // 15% calorie-tekort
        break
      case "behouden":
        target = tdee
        break
      case "aankomen":
        target = tdee * 1.15 // 15% calorie-overschot
        break
      default:
        target = tdee
    }

    // Macronutriënten berekening
    const protein = formData.gewicht * 2 // 2g eiwit per kg lichaamsgewicht
    const fat = (target * 0.25) / 9 // 25% van calorieën uit vet (9 cal per gram)
    const carbs = (target - protein * 4 - fat * 9) / 4 // Rest uit koolhydraten (4 cal per gram)

    // Aanbevolen coaching
    let recommendedCoaching = ""
    if (formData.activiteit === "zeer_actief" || formData.activiteit === "actief") {
      recommendedCoaching = "premium-coaching"
    } else if (formData.doel === "afvallen") {
      recommendedCoaching = "12-weken-vetverlies"
    } else {
      recommendedCoaching = "online-coaching"
    }

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      target: Math.round(target),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
      recommendedCoaching,
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const result = calculateCalories()
    setCalorieResult(result)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200))
      setIsSubmitted(true)
      setCurrentStep(currentStep + 1)
    } catch (error) {
      console.error("Er is een fout opgetreden bij het verzenden van het formulier:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      setTypingEffect("")
      setIsTyping(true)
      setShowNextButton(false)
    }
  }

  const getStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6 text-center">
            {/* Desktop */}
            <div className="hidden sm:block">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight text-primary">
                  {typingEffect}
                  {isTyping && <span className="animate-pulse">|</span>}
                </h2>
                {showNextButton && (
                  <Button onClick={nextStep} className="mt-6 animate-fade-in">
                    Laten we beginnen <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Mobiel */}
            <div className="sm:hidden">
              <div className="space-y-2">
                <h2 className="text-base font-bold tracking-tight text-primary mb-1">
                  {typingEffect}
                  {isTyping && <span className="animate-pulse">|</span>}
                </h2>
                {showNextButton && (
                  <Button onClick={nextStep} className="mt-3 animate-fade-in text-xs">
                    Laten we beginnen <ChevronRight className="ml-2 h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )
      case 1:
        return (
          <div className="space-y-6 text-center">
            {/* Desktop */}
            <div className="hidden sm:block">
              <h2 className="text-2xl font-bold tracking-tight text-primary mb-2">{typingEffect}</h2>
              {showNextButton && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <Label htmlFor="naam-desktop" className="block">
                      Wat is je naam?
                    </Label>
                    <Input
                      id="naam-desktop"
                      name="naam"
                      value={formData.naam}
                      onChange={handleInputChange}
                      placeholder="Voer je naam in"
                      className="max-w-md mx-auto text-center"
                    />
                  </div>
                  <Button onClick={nextStep} disabled={!formData.naam} className="mx-auto">
                    Volgende <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Mobiel */}
            <div className="sm:hidden">
              <h2 className="text-base font-bold tracking-tight text-primary mb-1">{typingEffect}</h2>
              {showNextButton && (
                <div className="space-y-2 animate-fade-in">
                  <div className="space-y-1">
                    <Label htmlFor="naam-mobile" className="block text-xs">
                      Wat is je naam?
                    </Label>
                    <Input
                      id="naam-mobile"
                      name="naam"
                      value={formData.naam}
                      onChange={handleInputChange}
                      placeholder="Voer je naam in"
                      className="max-w-[200px] mx-auto text-center text-xs"
                    />
                  </div>
                  <Button onClick={nextStep} disabled={!formData.naam} className="mx-auto text-xs">
                    Volgende <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6 text-center">
            {/* Desktop */}
            <div className="hidden sm:block">
              <h2 className="text-2xl font-bold tracking-tight text-primary mb-2">{typingEffect}</h2>
              {showNextButton && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-desktop" className="block">
                        E-mailadres
                      </Label>
                      <Input
                        id="email-desktop"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="jouw@email.nl"
                        className="max-w-md mx-auto text-center"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefoon-desktop" className="block">
                        Telefoonnummer (optioneel)
                      </Label>
                      <Input
                        id="telefoon-desktop"
                        name="telefoon"
                        value={formData.telefoon}
                        onChange={handleInputChange}
                        placeholder="06 12345678"
                        className="max-w-md mx-auto text-center"
                      />
                    </div>
                  </div>
                  <Button onClick={nextStep} disabled={!formData.email} className="mx-auto">
                    Volgende <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Mobiel */}
            <div className="sm:hidden">
              <h2 className="text-base font-bold tracking-tight text-primary mb-1">{typingEffect}</h2>
              {showNextButton && (
                <div className="space-y-2 animate-fade-in">
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="email-mobile" className="block text-xs">
                        E-mailadres
                      </Label>
                      <Input
                        id="email-mobile"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="jouw@email.nl"
                        className="max-w-[200px] mx-auto text-center text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="telefoon-mobile" className="block text-xs">
                        Telefoonnummer (optioneel)
                      </Label>
                      <Input
                        id="telefoon-mobile"
                        name="telefoon"
                        value={formData.telefoon}
                        onChange={handleInputChange}
                        placeholder="06 12345678"
                        className="max-w-[200px] mx-auto text-center text-xs"
                      />
                    </div>
                  </div>
                  <Button onClick={nextStep} disabled={!formData.email} className="mx-auto text-xs">
                    Volgende <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6 text-center">
            {/* Desktop */}
            <div className="hidden sm:block">
              <h2 className="text-2xl font-bold tracking-tight text-primary mb-2">{typingEffect}</h2>
              {showNextButton && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <Label className="block">Wat is je geslacht?</Label>
                    <RadioGroup
                      value={formData.geslacht}
                      onValueChange={(value) => handleSelectChange("geslacht", value)}
                      className="flex justify-center space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="man" id="man-desktop" />
                        <Label htmlFor="man-desktop">Man</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="vrouw" id="vrouw-desktop" />
                        <Label htmlFor="vrouw-desktop">Vrouw</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <Button onClick={nextStep} className="mx-auto">
                    Volgende <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Mobiel */}
            <div className="sm:hidden">
              <h2 className="text-base font-bold tracking-tight text-primary mb-1">{typingEffect}</h2>
              {showNextButton && (
                <div className="space-y-2 animate-fade-in">
                  <div className="space-y-1">
                    <Label className="block text-xs">Wat is je geslacht?</Label>
                    <RadioGroup
                      value={formData.geslacht}
                      onValueChange={(value) => handleSelectChange("geslacht", value)}
                      className="flex justify-center space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="man" id="man-mobile" />
                        <Label htmlFor="man-mobile" className="text-xs">
                          Man
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="vrouw" id="vrouw-mobile" />
                        <Label htmlFor="vrouw-mobile" className="text-xs">
                          Vrouw
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <Button onClick={nextStep} className="mx-auto text-xs">
                    Volgende <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-6 text-center">
            {/* Desktop */}
            <div className="hidden sm:block">
              <h2 className="text-2xl font-bold tracking-tight text-primary mb-2">{typingEffect}</h2>
              {showNextButton && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <Label htmlFor="leeftijd-desktop" className="block">
                      Wat is je leeftijd?
                    </Label>
                    <Input
                      id="leeftijd-desktop"
                      name="leeftijd"
                      type="number"
                      min="18"
                      max="100"
                      value={formData.leeftijd}
                      onChange={handleNumberChange}
                      className="max-w-md mx-auto text-center"
                    />
                  </div>
                  <Button onClick={nextStep} disabled={!formData.leeftijd} className="mx-auto">
                    Volgende <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Mobiel */}
            <div className="sm:hidden">
              <h2 className="text-base font-bold tracking-tight text-primary mb-1">{typingEffect}</h2>
              {showNextButton && (
                <div className="space-y-2 animate-fade-in">
                  <div className="space-y-1">
                    <Label htmlFor="leeftijd-mobile" className="block text-xs">
                      Wat is je leeftijd?
                    </Label>
                    <Input
                      id="leeftijd-mobile"
                      name="leeftijd"
                      type="number"
                      min="18"
                      max="100"
                      value={formData.leeftijd}
                      onChange={handleNumberChange}
                      className="max-w-[200px] mx-auto text-center text-xs"
                    />
                  </div>
                  <Button onClick={nextStep} disabled={!formData.leeftijd} className="mx-auto text-xs">
                    Volgende <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )
      case 5:
        return (
          <div className="space-y-6 text-center">
            {/* Desktop */}
            <div className="hidden sm:block">
              <h2 className="text-2xl font-bold tracking-tight text-primary mb-2">{typingEffect}</h2>
              {showNextButton && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <Label htmlFor="gewicht-desktop" className="block">
                      Wat is je huidige gewicht in kg?
                    </Label>
                    <Input
                      id="gewicht-desktop"
                      name="gewicht"
                      type="number"
                      min="40"
                      max="200"
                      value={formData.gewicht}
                      onChange={handleNumberChange}
                      className="max-w-md mx-auto text-center"
                    />
                  </div>
                  <Button onClick={nextStep} disabled={!formData.gewicht} className="mx-auto">
                    Volgende <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Mobiel */}
            <div className="sm:hidden">
              <h2 className="text-base font-bold tracking-tight text-primary mb-1">{typingEffect}</h2>
              {showNextButton && (
                <div className="space-y-2 animate-fade-in">
                  <div className="space-y-1">
                    <Label htmlFor="gewicht-mobile" className="block text-xs">
                      Wat is je huidige gewicht in kg?
                    </Label>
                    <Input
                      id="gewicht-mobile"
                      name="gewicht"
                      type="number"
                      min="40"
                      max="200"
                      value={formData.gewicht}
                      onChange={handleNumberChange}
                      className="max-w-[200px] mx-auto text-center text-xs"
                    />
                  </div>
                  <Button onClick={nextStep} disabled={!formData.gewicht} className="mx-auto text-xs">
                    Volgende <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )
      case 6:
        return (
          <div className="space-y-6 text-center">
            {/* Desktop */}
            <div className="hidden sm:block">
              <h2 className="text-2xl font-bold tracking-tight text-primary mb-2">{typingEffect}</h2>
              {showNextButton && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <Label htmlFor="lengte-desktop" className="block">
                      Wat is je lengte in cm?
                    </Label>
                    <Input
                      id="lengte-desktop"
                      name="lengte"
                      type="number"
                      min="140"
                      max="220"
                      value={formData.lengte}
                      onChange={handleNumberChange}
                      className="max-w-md mx-auto text-center"
                    />
                  </div>
                  <Button onClick={nextStep} disabled={!formData.lengte} className="mx-auto">
                    Volgende <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Mobiel */}
            <div className="sm:hidden">
              <h2 className="text-base font-bold tracking-tight text-primary mb-1">{typingEffect}</h2>
              {showNextButton && (
                <div className="space-y-2 animate-fade-in">
                  <div className="space-y-1">
                    <Label htmlFor="lengte-mobile" className="block text-xs">
                      Wat is je lengte in cm?
                    </Label>
                    <Input
                      id="lengte-mobile"
                      name="lengte"
                      type="number"
                      min="140"
                      max="220"
                      value={formData.lengte}
                      onChange={handleNumberChange}
                      className="max-w-[200px] mx-auto text-center text-xs"
                    />
                  </div>
                  <Button onClick={nextStep} disabled={!formData.lengte} className="mx-auto text-xs">
                    Volgende <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )
      case 7:
        return (
          <div className="space-y-6 text-center">
            {/* Desktop */}
            <div className="hidden sm:block">
              <h2 className="text-2xl font-bold tracking-tight text-primary mb-2">{typingEffect}</h2>
              {showNextButton && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <Label htmlFor="activiteit-desktop" className="block">
                      Hoe zou je je activiteitsniveau omschrijven?
                    </Label>
                    <Select
                      value={formData.activiteit}
                      onValueChange={(value) => handleSelectChange("activiteit", value)}
                    >
                      <SelectTrigger id="activiteit-desktop" className="max-w-md mx-auto text-center">
                        <SelectValue placeholder="Selecteer je activiteitsniveau" />
                      </SelectTrigger>
                      <SelectContent align="center">
                        <SelectItem value="sedentair" className="text-center">
                          Sedentair (weinig tot geen beweging, kantoorwerk)
                        </SelectItem>
                        <SelectItem value="licht" className="text-center">
                          Licht actief (lichte beweging, 1-2 keer per week sporten)
                        </SelectItem>
                        <SelectItem value="matig" className="text-center">
                          Matig actief (matige beweging, 3-5 keer per week sporten)
                        </SelectItem>
                        <SelectItem value="actief" className="text-center">
                          Actief (dagelijks sporten of fysiek werk)
                        </SelectItem>
                        <SelectItem value="zeer_actief" className="text-center">
                          Zeer actief (intensieve training, 2x per dag sporten)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={nextStep} className="mx-auto">
                    Volgende <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Mobiel */}
            <div className="sm:hidden">
              <h2 className="text-base font-bold tracking-tight text-primary mb-1">{typingEffect}</h2>
              {showNextButton && (
                <div className="space-y-2 animate-fade-in">
                  <div className="space-y-1">
                    <Label htmlFor="activiteit-mobile" className="block text-xs">
                      Hoe zou je je activiteitsniveau omschrijven?
                    </Label>
                    <Select
                      value={formData.activiteit}
                      onValueChange={(value) => handleSelectChange("activiteit", value)}
                    >
                      <SelectTrigger id="activiteit-mobile" className="max-w-[200px] mx-auto text-center text-xs">
                        <SelectValue placeholder="Selecteer je activiteitsniveau" />
                      </SelectTrigger>
                      <SelectContent align="center">
                        <SelectItem value="sedentair" className="text-center text-xs">
                          Sedentair (weinig tot geen beweging)
                        </SelectItem>
                        <SelectItem value="licht" className="text-center text-xs">
                          Licht actief (1-2x per week sporten)
                        </SelectItem>
                        <SelectItem value="matig" className="text-center text-xs">
                          Matig actief (3-5x per week sporten)
                        </SelectItem>
                        <SelectItem value="actief" className="text-center text-xs">
                          Actief (dagelijks sporten)
                        </SelectItem>
                        <SelectItem value="zeer_actief" className="text-center text-xs">
                          Zeer actief (intensieve training)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={nextStep} className="mx-auto text-xs">
                    Volgende <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )
      case 8:
        return (
          <div className="space-y-6 text-center">
            {/* Desktop */}
            <div className="hidden sm:block">
              <h2 className="text-2xl font-bold tracking-tight text-primary mb-2">{typingEffect}</h2>
              {showNextButton && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <Label htmlFor="doel-desktop" className="block">
                      Wat is je belangrijkste doel?
                    </Label>
                    <Select value={formData.doel} onValueChange={(value) => handleSelectChange("doel", value)}>
                      <SelectTrigger id="doel-desktop" className="max-w-md mx-auto">
                        <SelectValue placeholder="Selecteer je doel" className="text-center" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="afvallen" className="text-left">
                          Afvallen / Vet verliezen
                        </SelectItem>
                        <SelectItem value="behouden" className="text-left">
                          Gewicht behouden / Recomposition
                        </SelectItem>
                        <SelectItem value="aankomen" className="text-left">
                          Aankomen / Spieropbouw
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleSubmit} disabled={isSubmitting} className="mx-auto">
                    {isSubmitting ? <>Berekenen...</> : <>Bereken mijn caloriebehoefte</>}
                  </Button>
                </div>
              )}
            </div>

            {/* Mobiel */}
            <div className="sm:hidden">
              <h2 className="text-base font-bold tracking-tight text-primary mb-1">{typingEffect}</h2>
              {showNextButton && (
                <div className="space-y-2 animate-fade-in">
                  <div className="space-y-1">
                    <Label htmlFor="doel-mobile" className="block text-xs">
                      Wat is je belangrijkste doel?
                    </Label>
                    <Select value={formData.doel} onValueChange={(value) => handleSelectChange("doel", value)}>
                      <SelectTrigger id="doel-mobile" className="max-w-[200px] mx-auto text-center text-xs">
                        <SelectValue placeholder="Selecteer je doel" />
                      </SelectTrigger>
                      <SelectContent align="center">
                        <SelectItem value="afvallen" className="text-center justify-center text-xs">
                          Afvallen / Vet verliezen
                        </SelectItem>
                        <SelectItem value="behouden" className="text-center justify-center text-xs">
                          Gewicht behouden / Recomposition
                        </SelectItem>
                        <SelectItem value="aankomen" className="text-center justify-center text-xs">
                          Aankomen / Spieropbouw
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleSubmit} disabled={isSubmitting} className="mx-auto text-xs">
                    {isSubmitting ? <>Berekenen...</> : <>Bereken mijn caloriebehoefte</>}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )
      case 9:
        return (
          <div className="space-y-8 text-center">
            {/* Desktop */}
            <div className="hidden sm:block">
              <h2 className="text-2xl font-bold tracking-tight text-primary mb-4">
                {typingEffect}
                {isTyping && <span className="animate-pulse">|</span>}
              </h2>
              {!isTyping && showNextButton && calorieResult && (
                <div className="space-y-8 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-white border">
                      <CardContent className="p-4 md:p-6 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2 text-primary">
                          <Flame className="h-5 w-5" />
                          <h3 className="text-lg font-semibold text-gray-700">Basaal Metabolisme</h3>
                        </div>
                        <p className="text-3xl font-extrabold text-primary tabular-nums">{displayBMR} kcal</p>
                        <p className="text-sm text-gray-500 mt-2">Calorieën die je lichaam in rust verbruikt</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-white border">
                      <CardContent className="p-4 md:p-6 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2 text-primary">
                          <Activity className="h-5 w-5" />
                          <h3 className="text-lg font-semibold text-gray-700">Dagelijks Verbruik</h3>
                        </div>
                        <p className="text-3xl font-extrabold text-primary tabular-nums">{displayTDEE} kcal</p>
                        <p className="text-sm text-gray-500 mt-2">Totale calorieën die je dagelijks verbruikt</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-white border">
                      <CardContent className="p-4 md:p-6 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2 text-primary">
                          <Target className="h-5 w-5" />
                          <h3 className="text-lg font-semibold text-gray-700">Doelcalorieën</h3>
                        </div>
                        <p className="text-3xl font-extrabold text-primary tabular-nums">{displayTarget} kcal</p>
                        <p className="text-sm text-gray-500 mt-2">Aanbevolen dagelijkse inname voor je doel</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="rounded-2xl border bg-white">
                    <div className="rounded-2xl p-4 md:p-6">
                      <h3 className="text-xl font-bold text-primary mb-4">Aanbevolen Macronutriënten</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Eiwitten: {calorieResult.protein}g</span>
                            <span className="text-sm text-gray-500">
                              {Math.round((calorieResult.protein * 4 * 100) / calorieResult.target)}%
                            </span>
                          </div>
                          <Progress
                            value={(calorieResult.protein * 4 * 100) / calorieResult.target}
                            className="h-2 bg-gray-200"
                            indicatorClassName="bg-primary"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Koolhydraten: {calorieResult.carbs}g</span>
                            <span className="text-sm text-gray-500">
                              {Math.round((calorieResult.carbs * 4 * 100) / calorieResult.target)}%
                            </span>
                          </div>
                          <Progress
                            value={(calorieResult.carbs * 4 * 100) / calorieResult.target}
                            className="h-2 bg-gray-200"
                            indicatorClassName="bg-green-600"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Vetten: {calorieResult.fat}g</span>
                            <span className="text-sm text-gray-500">
                              {Math.round((calorieResult.fat * 9 * 100) / calorieResult.target)}%
                            </span>
                          </div>
                          <Progress
                            value={(calorieResult.fat * 9 * 100) / calorieResult.target}
                            className="h-2 bg-gray-200"
                            indicatorClassName="bg-amber-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 md:p-6 rounded-2xl border bg-gray-50">
                    <h3 className="text-xl font-bold text-primary mb-4">Onze Aanbeveling</h3>
                    <p className="text-gray-700 mb-6">
                      Op basis van je gegevens en doelen denken we dat de volgende coaching optie het beste bij je past:
                    </p>

                    {calorieResult.recommendedCoaching === "premium-coaching" && (
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <Heart className="w-10 h-10 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-primary mb-2 flex items-center justify-center">
                            Premium Coaching
                            <Badge className="ml-2" variant="secondary">
                              Aanbevolen
                            </Badge>
                          </h4>
                          <p className="text-gray-600 mb-4">
                            Voor jouw activiteitsniveau en doelen raden we onze Premium Coaching aan. Dit combineert
                            persoonlijke training met online begeleiding voor optimale resultaten.
                          </p>
                          <Button asChild className="w-full md:w-auto">
                            <a href="/premium-coaching">Bekijk Premium Coaching</a>
                          </Button>
                        </div>
                      </div>
                    )}

                    {calorieResult.recommendedCoaching === "12-weken-vetverlies" && (
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-10 h-10 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-primary mb-2 flex items-center justify-center">
                            12-Weken Vetverlies
                            <Badge className="ml-2" variant="secondary">
                              Aanbevolen
                            </Badge>
                          </h4>
                          <p className="text-gray-600 mb-4">
                            Voor jouw vetverliesdoel raden we ons 12-Weken Vetverlies programma aan. Dit intensieve
                            programma is speciaal ontworpen voor maximaal vetverlies en lichaamstransformatie.
                          </p>
                          <Button asChild className="w-full md:w-auto">
                            <a href="/12-weken-vetverlies">Bekijk 12-Weken Vetverlies</a>
                          </Button>
                        </div>
                      </div>
                    )}

                    {calorieResult.recommendedCoaching === "online-coaching" && (
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <Users className="w-10 h-10 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-primary mb-2 flex items-center justify-center">
                            Online Coaching
                            <Badge className="ml-2" variant="secondary">
                              Aanbevolen
                            </Badge>
                          </h4>
                          <p className="text-gray-600 mb-4">
                            Voor jouw doelen en activiteitsniveau raden we onze Online Coaching aan. Dit geeft je
                            flexibiliteit en volledige begeleiding via onze app en platform.
                          </p>
                          <Button asChild className="w-full md:w-auto">
                            <a href="/online-coaching">Bekijk Online Coaching</a>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <p className="text-gray-600 mb-4">
                      We hebben je resultaten ook naar je e-mail gestuurd. Heb je vragen? Neem gerust contact met ons
                      op!
                    </p>
                    <div className="flex flex-col md:flex-row justify-center gap-3">
                      <Button variant="outline" onClick={() => router.push("/")} className="w-full md:w-auto">
                        Terug naar home
                      </Button>
                      <Button asChild className="w-full md:w-auto">
                        <a href="/#contact">Neem contact op</a>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobiel */}
            <div className="sm:hidden">
              <h2 className="text-base font-bold tracking-tight text-primary mb-2">
                {typingEffect}
                {isTyping && <span className="animate-pulse">|</span>}
              </h2>
              {!isTyping && showNextButton && calorieResult && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 gap-3">
                    <Card className="bg-white border">
                      <CardContent className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2 mb-1 text-primary">
                          <Flame className="h-4 w-4" />
                          <h3 className="text-sm font-semibold text-gray-700">Basaal Metabolisme</h3>
                        </div>
                        <p className="text-xl font-extrabold text-primary tabular-nums">{displayBMR} kcal</p>
                        <p className="text-xs text-gray-500 mt-1">Calorieën die je lichaam in rust verbruikt</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-white border">
                      <CardContent className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2 mb-1 text-primary">
                          <Activity className="h-4 w-4" />
                          <h3 className="text-sm font-semibold text-gray-700">Dagelijks Verbruik</h3>
                        </div>
                        <p className="text-xl font-extrabold text-primary tabular-nums">{displayTDEE} kcal</p>
                        <p className="text-xs text-gray-500 mt-1">Totale calorieën die je dagelijks verbruikt</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-white border">
                      <CardContent className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2 mb-1 text-primary">
                          <Target className="h-4 w-4" />
                          <h3 className="text-sm font-semibold text-gray-700">Doelcalorieën</h3>
                        </div>
                        <p className="text-xl font-extrabold text-primary tabular-nums">{displayTarget} kcal</p>
                        <p className="text-xs text-gray-500 mt-1">Aanbevolen dagelijkse inname voor je doel</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="rounded-xl border bg-white">
                    <div className="rounded-xl p-3">
                      <h3 className="text-sm font-bold text-primary mb-3">Aanbevolen Macronutriënten</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs font-medium">Eiwitten: {calorieResult.protein}g</span>
                            <span className="text-xs text-gray-500">
                              {Math.round((calorieResult.protein * 4 * 100) / calorieResult.target)}%
                            </span>
                          </div>
                          <Progress
                            value={(calorieResult.protein * 4 * 100) / calorieResult.target}
                            className="h-1.5 bg-gray-200"
                            indicatorClassName="bg-primary"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs font-medium">Koolhydraten: {calorieResult.carbs}g</span>
                            <span className="text-xs text-gray-500">
                              {Math.round((calorieResult.carbs * 4 * 100) / calorieResult.target)}%
                            </span>
                          </div>
                          <Progress
                            value={(calorieResult.carbs * 4 * 100) / calorieResult.target}
                            className="h-1.5 bg-gray-200"
                            indicatorClassName="bg-green-600"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs font-medium">Vetten: {calorieResult.fat}g</span>
                            <span className="text-xs text-gray-500">
                              {Math.round((calorieResult.fat * 9 * 100) / calorieResult.target)}%
                            </span>
                          </div>
                          <Progress
                            value={(calorieResult.fat * 9 * 100) / calorieResult.target}
                            className="h-1.5 bg-gray-200"
                            indicatorClassName="bg-amber-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border bg-gray-50">
                    <h3 className="text-sm font-bold text-primary mb-2">Onze Aanbeveling</h3>
                    <p className="text-xs text-gray-700 mb-3">
                      Op basis van je gegevens en doelen denken we dat de volgende coaching optie het beste bij je past:
                    </p>

                    {calorieResult.recommendedCoaching === "premium-coaching" && (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                          <Heart className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-primary mb-1 flex items-center justify-center">
                            Premium Coaching
                            <Badge className="ml-1" variant="secondary">
                              Aanbevolen
                            </Badge>
                          </h4>
                          <p className="text-xs text-gray-600 mb-3">
                            Persoonlijke training met online begeleiding voor optimale resultaten.
                          </p>
                          <Button asChild className="w-full text-xs py-1 h-8">
                            <a href="/premium-coaching">Bekijk Premium Coaching</a>
                          </Button>
                        </div>
                      </div>
                    )}

                    {calorieResult.recommendedCoaching === "12-weken-vetverlies" && (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-primary mb-1 flex items-center justify-center">
                            12-Weken Vetverlies
                            <Badge className="ml-1" variant="secondary">
                              Aanbevolen
                            </Badge>
                          </h4>
                          <p className="text-xs text-gray-600 mb-3">Intensief programma voor maximaal vetverlies.</p>
                          <Button asChild className="w-full text-xs py-1 h-8">
                            <a href="/12-weken-vetverlies">Bekijk 12-Weken Vetverlies</a>
                          </Button>
                        </div>
                      </div>
                    )}

                    {calorieResult.recommendedCoaching === "online-coaching" && (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-primary mb-1 flex items-center justify-center">
                            Online Coaching
                            <Badge className="ml-1" variant="secondary">
                              Aanbevolen
                            </Badge>
                          </h4>
                          <p className="text-xs text-gray-600 mb-3">
                            Flexibiliteit en volledige begeleiding via onze app.
                          </p>
                          <Button asChild className="w-full text-xs py-1 h-8">
                            <a href="/online-coaching">Bekijk Online Coaching</a>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-3">
                      We hebben je resultaten ook naar je e-mail gestuurd. Heb je vragen? Neem gerust contact met ons
                      op!
                    </p>
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" onClick={() => router.push("/")} className="w-full text-xs py-1 h-8">
                        Terug naar home
                      </Button>
                      <Button asChild className="w-full text-xs py-1 h-8">
                        <a href="/#contact">Neem contact op</a>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const getStepMessage = () => {
    switch (currentStep) {
      case 0:
        return welcomeMessages
      case 1:
        return [`Hoi! Laten we beginnen.`, `Wat is je naam?`]
      case 2:
        return [
          `Hey ${formData.naam}, aangenaam kennis te maken!`,
          `Ik heb nog wat gegevens van je nodig om je caloriebehoefte te berekenen.`,
        ]
      case 3:
        return [`Nu heb ik wat informatie over je lichaam nodig.`, `Wat is je geslacht?`]
      case 4:
        return [`Wat is je leeftijd?`]
      case 5:
        return [`Wat is je huidige gewicht in kg?`]
      case 6:
        return [`Wat is je lengte in cm?`]
      case 7:
        return [`Hoe zou je je activiteitsniveau omschrijven?`]
      case 8:
        return [`Wat is je belangrijkste doel?`]
      case 9:
        return [
          `Geweldig, ${formData.naam}! Hier zijn je resultaten.`,
          `Op basis van je gegevens hebben we je dagelijkse caloriebehoefte berekend.`,
        ]
      default:
        return [""]
    }
  }

  // Typewriter per stap
  useEffect(() => {
    setIsTyping(true)
    let currentText = ""
    let currentMessageIndex = 0
    let currentCharIndex = 0
    const messages = getStepMessage()

    const typingInterval = setInterval(() => {
      if (currentMessageIndex < messages.length) {
        if (currentCharIndex < messages[currentMessageIndex].length) {
          currentText += messages[currentMessageIndex][currentCharIndex]
          setTypingEffect(currentText)
          currentCharIndex++
        } else {
          currentText += currentStep === 0 ? "\n\n" : "\n"
          currentMessageIndex++
          currentCharIndex = 0
        }
      } else {
        clearInterval(typingInterval)
        setIsTyping(false)
        setShowNextButton(true)
      }
    }, 30)

    return () => clearInterval(typingInterval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep])

  // Animate result counters when results step is visible
  useEffect(() => {
    if (currentStep !== 9 || !calorieResult) return

    const duration = 900
    const start = performance.now()

    const fromBMR = 0
    const fromTDEE = 0
    const fromTarget = 0

    const toBMR = calorieResult.bmr
    const toTDEE = calorieResult.tdee
    const toTarget = calorieResult.target

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

    const tick = (now: number) => {
      const elapsed = now - start
      const t = Math.min(1, elapsed / duration)
      const e = easeOut(t)

      setDisplayBMR(Math.round(fromBMR + (toBMR - fromBMR) * e))
      setDisplayTDEE(Math.round(fromTDEE + (toTDEE - fromTDEE) * e))
      setDisplayTarget(Math.round(fromTarget + (toTarget - fromTarget) * e))

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        rafRef.current = null
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [currentStep, calorieResult])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="container mx-auto px-4 py-10 sm:py-12 max-w-4xl">
          {/* Page hero heading */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border text-primary border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium">
              Gratis tool
            </div>
            <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
              Caloriebehoefte Berekenen
            </h1>
            <p className="text-gray-600 mt-3 sm:mt-4 max-w-2xl mx-auto">
              Bereken je dagelijkse caloriebehoefte en krijg een persoonlijk voedingsadvies op basis van je doelen en
              activiteitsniveau.
            </p>
          </div>

          {/* Progress */}
          <div className="mb-7 sm:mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Stap {currentStep + 1} van {steps.length}
              </span>
              <span className="text-sm font-semibold text-primary">
                {Math.round(((currentStep + 1) / steps.length) * 100)}%
              </span>
            </div>
            <Progress
              value={((currentStep + 1) / steps.length) * 100}
              className="h-2"
              indicatorClassName="bg-primary"
            />
          </div>

          {/* Main card (solid surface, no gradient) */}
          <Card className="rounded-2xl bg-white border shadow-sm">
            <CardContent className="p-4 md:p-8">
              <div className={currentStep < 9 ? "min-h-[300px] sm:min-h-[400px]" : ""}>{getStepContent()}</div>
            </CardContent>
          </Card>

          {/* Footer note below card */}
          {currentStep < 9 && (
            <div className="text-center mt-6 sm:mt-8 text-xs text-gray-500">
              Je gegevens worden vertrouwelijk behandeld en uitsluitend gebruikt voor je persoonlijke advies.
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
