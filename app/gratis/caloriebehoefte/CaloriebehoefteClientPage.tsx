"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Calculator, User, Activity, Target, ArrowRight, CheckCircle, Mail, Phone } from "lucide-react"
import { sendCaloriebehoefteEmail } from "@/app/actions/caloriebehoefte"

interface FormData {
  name: string
  email: string
  phone: string
  age: string
  gender: "man" | "vrouw" | ""
  weight: string
  height: string
  activityLevel: string
  goal: string
}

interface Results {
  bmr: number
  tdee: number
  goalCalories: number
  protein: number
  carbs: number
  fat: number
}

export default function CaloriebehoefteClientPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
    activityLevel: "",
    goal: "",
  })

  const [results, setResults] = useState<Results | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [emailStatus, setEmailStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const calculateCalories = () => {
    const age = Number.parseInt(formData.age)
    const weight = Number.parseFloat(formData.weight)
    const height = Number.parseFloat(formData.height)

    // BMR berekening (Mifflin-St Jeor Equation)
    let bmr: number
    if (formData.gender === "man") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }

    // Activiteitsfactor
    const activityFactors: { [key: string]: number } = {
      "weinig-actief": 1.2,
      "licht-actief": 1.375,
      "matig-actief": 1.55,
      "zeer-actief": 1.725,
      "extra-actief": 1.9,
    }

    const tdee = bmr * (activityFactors[formData.activityLevel] || 1.2)

    // Doel aanpassingen
    let goalCalories: number
    switch (formData.goal) {
      case "afvallen":
        goalCalories = tdee - 500 // 500 kcal deficit
        break
      case "aankomen":
        goalCalories = tdee + 300 // 300 kcal surplus
        break
      case "spieropbouw":
        goalCalories = tdee + 200 // 200 kcal surplus
        break
      default:
        goalCalories = tdee // Onderhouden
    }

    // Macronutriënten berekening
    const protein = weight * 2.2 // 2.2g per kg lichaamsgewicht
    const fat = (goalCalories * 0.25) / 9 // 25% van calorieën uit vet
    const carbs = (goalCalories - protein * 4 - fat * 9) / 4 // Rest uit koolhydraten

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      goalCalories: Math.round(goalCalories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCalculating(true)
    setEmailStatus(null)

    // Bereken resultaten
    const calculatedResults = calculateCalories()
    setResults(calculatedResults)

    // Verstuur email
    try {
      const emailResult = await sendCaloriebehoefteEmail({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        age: Number.parseInt(formData.age),
        gender: formData.gender as "man" | "vrouw",
        weight: Number.parseFloat(formData.weight),
        height: Number.parseFloat(formData.height),
        activityLevel: getActivityLevelText(formData.activityLevel),
        goal: getGoalText(formData.goal),
        ...calculatedResults,
      })

      if (emailResult.success) {
        setEmailStatus({ type: "success", message: emailResult.message })
      } else {
        setEmailStatus({ type: "error", message: emailResult.error || "Email verzending mislukt" })
      }
    } catch (error) {
      setEmailStatus({ type: "error", message: "Er ging iets mis bij het verzenden van de email" })
    }

    setIsCalculating(false)
  }

  const getActivityLevelText = (level: string) => {
    const levels: { [key: string]: string } = {
      "weinig-actief": "Weinig actief (kantoorwerk, geen sport)",
      "licht-actief": "Licht actief (1-3x per week sport)",
      "matig-actief": "Matig actief (3-5x per week sport)",
      "zeer-actief": "Zeer actief (6-7x per week sport)",
      "extra-actief": "Extra actief (2x per dag sport/fysiek werk)",
    }
    return levels[level] || level
  }

  const getGoalText = (goal: string) => {
    const goals: { [key: string]: string } = {
      afvallen: "Gewichtsverlies/Afvallen",
      aankomen: "Gewichtstoename",
      spieropbouw: "Spieropbouw",
      onderhouden: "Gewicht onderhouden",
    }
    return goals[goal] || goal
  }

  const isFormValid = () => {
    return (
      formData.name &&
      formData.email &&
      formData.age &&
      formData.gender &&
      formData.weight &&
      formData.height &&
      formData.activityLevel &&
      formData.goal
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 animate-fade-in-up">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-evotion-primary text-white text-sm font-medium mb-8">
              <Calculator className="w-4 h-4 mr-2" />
              Gratis Calculator
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in-up delay-100">
              Bereken je <span className="text-evotion-primary">Caloriebehoefte</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 animate-fade-in-up delay-200">
              Ontdek precies hoeveel calorieën jij nodig hebt om je doelen te bereiken. Inclusief persoonlijk
              macronutriënten advies en volgende stappen.
            </p>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {!results ? (
              <Card className="animate-fade-in-up delay-300">
                <CardContent className="p-8">
                  <div className="mb-8">
                    <Badge className="bg-evotion-primary/10 text-evotion-primary border border-evotion-primary/20 mb-4">
                      <User className="w-4 h-4 mr-2" />
                      Persoonlijke Gegevens
                    </Badge>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Vul je gegevens in</h2>
                    <p className="text-gray-600">
                      We hebben wat basisinformatie nodig om je exacte caloriebehoefte te berekenen.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Contact Info */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Volledige naam *
                        </label>
                        <Input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full"
                          placeholder="Je voor- en achternaam"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email adres *
                        </label>
                        <Input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full"
                          placeholder="je@email.nl"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Telefoonnummer (optioneel)
                      </label>
                      <Input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full"
                        placeholder="+31 6 12345678"
                      />
                    </div>

                    {/* Personal Stats */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                          Leeftijd *
                        </label>
                        <Input
                          type="number"
                          id="age"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          required
                          min="16"
                          max="80"
                          className="w-full"
                          placeholder="25"
                        />
                      </div>
                      <div>
                        <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                          Gewicht (kg) *
                        </label>
                        <Input
                          type="number"
                          id="weight"
                          name="weight"
                          value={formData.weight}
                          onChange={handleInputChange}
                          required
                          min="40"
                          max="200"
                          step="0.1"
                          className="w-full"
                          placeholder="70"
                        />
                      </div>
                      <div>
                        <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                          Lengte (cm) *
                        </label>
                        <Input
                          type="number"
                          id="height"
                          name="height"
                          value={formData.height}
                          onChange={handleInputChange}
                          required
                          min="140"
                          max="220"
                          className="w-full"
                          placeholder="175"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                        Geslacht *
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-evotion-primary focus:border-transparent"
                      >
                        <option value="">Selecteer je geslacht</option>
                        <option value="man">Man</option>
                        <option value="vrouw">Vrouw</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 mb-2">
                        Activiteitsniveau *
                      </label>
                      <select
                        id="activityLevel"
                        name="activityLevel"
                        value={formData.activityLevel}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-evotion-primary focus:border-transparent"
                      >
                        <option value="">Selecteer je activiteitsniveau</option>
                        <option value="weinig-actief">Weinig actief (kantoorwerk, geen sport)</option>
                        <option value="licht-actief">Licht actief (1-3x per week sport)</option>
                        <option value="matig-actief">Matig actief (3-5x per week sport)</option>
                        <option value="zeer-actief">Zeer actief (6-7x per week sport)</option>
                        <option value="extra-actief">Extra actief (2x per dag sport/fysiek werk)</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-2">
                        Wat is je doel? *
                      </label>
                      <select
                        id="goal"
                        name="goal"
                        value={formData.goal}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-evotion-primary focus:border-transparent"
                      >
                        <option value="">Selecteer je doel</option>
                        <option value="afvallen">Gewichtsverlies/Afvallen</option>
                        <option value="aankomen">Gewichtstoename</option>
                        <option value="spieropbouw">Spieropbouw</option>
                        <option value="onderhouden">Gewicht onderhouden</option>
                      </select>
                    </div>

                    <Button
                      type="submit"
                      disabled={!isFormValid() || isCalculating}
                      className="w-full bg-evotion-primary hover:bg-[#2d2654] text-white py-4 text-lg font-semibold transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCalculating ? (
                        <span className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Berekenen...
                        </span>
                      ) : (
                        <span className="flex items-center gap-3">
                          <Calculator className="w-5 h-5" />
                          Bereken Mijn Caloriebehoefte
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              /* Results Section */
              <div className="space-y-8 animate-fade-in-up">
                {/* Success Message */}
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <h3 className="text-xl font-bold text-green-800">Berekening Voltooid!</h3>
                    </div>
                    <p className="text-green-700">
                      Je persoonlijke caloriebehoefte is berekend. Scroll naar beneden voor je resultaten en volgende
                      stappen.
                    </p>
                    {emailStatus && (
                      <div
                        className={`mt-4 p-3 rounded-lg ${
                          emailStatus.type === "success"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {emailStatus.message}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Results Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="text-center hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Activity className="h-8 w-8 text-red-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">BMR</h3>
                      <p className="text-3xl font-bold text-red-600 mb-2">{results.bmr}</p>
                      <p className="text-sm text-gray-600">kcal/dag</p>
                      <p className="text-xs text-gray-500 mt-2">Basisstofwisseling</p>
                    </CardContent>
                  </Card>

                  <Card className="text-center hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="h-8 w-8 text-orange-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">TDEE</h3>
                      <p className="text-3xl font-bold text-orange-600 mb-2">{results.tdee}</p>
                      <p className="text-sm text-gray-600">kcal/dag</p>
                      <p className="text-xs text-gray-500 mt-2">Totale dagelijkse behoefte</p>
                    </CardContent>
                  </Card>

                  <Card className="text-center hover:shadow-lg transition-all duration-300 border-2 border-evotion-primary">
                    <CardContent className="p-6">
                      <div className="w-16 h-16 bg-evotion-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Target className="h-8 w-8 text-evotion-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Voor jouw doel</h3>
                      <p className="text-3xl font-bold text-evotion-primary mb-2">{results.goalCalories}</p>
                      <p className="text-sm text-gray-600">kcal/dag</p>
                      <p className="text-xs text-evotion-primary font-medium mt-2">Aanbevolen inname</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Macronutrients */}
                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">🥗 Aanbevolen Macronutriënten</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center p-6 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                        <h4 className="text-lg font-bold text-yellow-800 mb-2">Eiwitten</h4>
                        <p className="text-3xl font-bold text-yellow-600 mb-2">{results.protein}g</p>
                        <p className="text-sm text-yellow-700">
                          {Math.round(((results.protein * 4) / results.goalCalories) * 100)}% van calorieën
                        </p>
                      </div>
                      <div className="text-center p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                        <h4 className="text-lg font-bold text-blue-800 mb-2">Koolhydraten</h4>
                        <p className="text-3xl font-bold text-blue-600 mb-2">{results.carbs}g</p>
                        <p className="text-sm text-blue-700">
                          {Math.round(((results.carbs * 4) / results.goalCalories) * 100)}% van calorieën
                        </p>
                      </div>
                      <div className="text-center p-6 bg-green-50 rounded-lg border-2 border-green-200">
                        <h4 className="text-lg font-bold text-green-800 mb-2">Vetten</h4>
                        <p className="text-3xl font-bold text-green-600 mb-2">{results.fat}g</p>
                        <p className="text-sm text-green-700">
                          {Math.round(((results.fat * 9) / results.goalCalories) * 100)}% van calorieën
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Next Steps */}
                <Card className="bg-evotion-primary text-white">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6 text-center">🚀 Volgende Stappen</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-xl font-bold mb-4">✅ Wat je nu weet:</h4>
                        <ul className="space-y-2 text-sm">
                          <li>• Je exacte caloriebehoefte</li>
                          <li>• Optimale macronutriënt verdeling</li>
                          <li>• Aangepaste cijfers voor jouw doel</li>
                          <li>• Wetenschappelijk onderbouwde berekening</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-4">🎯 Wat je nog nodig hebt:</h4>
                        <ul className="space-y-2 text-sm">
                          <li>• Praktisch voedingsplan</li>
                          <li>• Trainingsschema op maat</li>
                          <li>• Begeleiding en accountability</li>
                          <li>• Aanpassingen tijdens het proces</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-8 text-center">
                      <p className="text-lg mb-6">
                        <strong>Klaar om deze cijfers om te zetten in echte resultaten?</strong>
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                          asChild
                          className="bg-white text-evotion-primary hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                        >
                          <a
                            href="https://wa.me/31610935077?text=Hoi%20Martin%2C%20ik%20heb%20net%20mijn%20caloriebehoefte%20berekend%20en%20wil%20graag%20meer%20weten%20over%20jullie%20coaching%20programma%27s!"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <Phone className="w-5 h-5" />
                            WhatsApp Chat
                          </a>
                        </Button>
                        <Button
                          asChild
                          className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-evotion-primary px-8 py-3 text-lg font-semibold"
                        >
                          <a href="/contact" className="flex items-center gap-2">
                            <Mail className="w-5 h-5" />
                            Gratis Consult
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* New Calculation Button */}
                <div className="text-center">
                  <Button
                    onClick={() => {
                      setResults(null)
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        age: "",
                        gender: "",
                        weight: "",
                        height: "",
                        activityLevel: "",
                        goal: "",
                      })
                      setEmailStatus(null)
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3"
                  >
                    Nieuwe Berekening
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
