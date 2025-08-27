"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { submitCaloriebehoefte } from "@/app/actions/caloriebehoefte"
import { trackEvent, logCalculatorAction, logContactSubmission } from "@/utils/cookie-utils"
import {
  Calculator,
  User,
  Activity,
  Target,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Scale,
  Zap,
  Heart,
  Award,
  Mail,
  Phone,
  RotateCcw,
} from "lucide-react"

interface FormData {
  gender: string
  age: string
  weight: string
  height: string
  activityLevel: string
  goal: string
  name: string
  email: string
  phone: string
}

const initialFormData: FormData = {
  gender: "",
  age: "",
  weight: "",
  height: "",
  activityLevel: "",
  goal: "",
  name: "",
  email: "",
  phone: "",
}

interface CalorieResult {
  bmr: number
  tdee: number
  goalCalories: number
  protein: number
  carbs: number
  fat: number
}

export default function CaloriebehoefteClientPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [result, setResult] = useState<CalorieResult | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const totalSteps = 7

  // Load saved progress on component mount
  useEffect(() => {
    if (typeof window === "undefined") return

    // Log calculator started only if not already completed
    const saved = localStorage.getItem("calorie-calculator-progress")
    let shouldLogStart = true

    try {
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && typeof parsed === "object") {
          if (parsed.step && typeof parsed.step === "number") {
            setCurrentStep(parsed.step)
          }
          if (parsed.data && typeof parsed.data === "object") {
            setFormData({ ...initialFormData, ...parsed.data })
          }
          if (parsed.result && typeof parsed.result === "object") {
            setResult(parsed.result)
          }
          if (parsed.isSubmitted === true) {
            setIsSubmitted(true)
            shouldLogStart = false // Don't log start if already completed
          }
        }
      }
    } catch (error) {
      console.error("Error loading saved progress:", error)
      try {
        localStorage.removeItem("calorie-calculator-progress")
      } catch (e) {
        console.error("Error clearing corrupted data:", e)
      }
    }

    // Only log calculator started if not already completed
    if (shouldLogStart) {
      logCalculatorAction("started")
    }
  }, [])

  // Save progress whenever form data or step changes
  useEffect(() => {
    if (typeof window === "undefined") return

    if (currentStep > 1 || Object.values(formData).some((value) => value !== "")) {
      try {
        const dataToSave = {
          step: currentStep,
          data: formData,
          result: result,
          isSubmitted: isSubmitted,
          timestamp: new Date().toISOString(),
        }
        localStorage.setItem("calorie-calculator-progress", JSON.stringify(dataToSave))
      } catch (error) {
        console.error("Error saving progress:", error)
      }
    }
  }, [currentStep, formData, result, isSubmitted])

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1)
      try {
        trackEvent("calculator_step_completed", { step: currentStep })
      } catch (error) {
        console.error("Error tracking event:", error)
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const resetCalculator = () => {
    setCurrentStep(1)
    setFormData(initialFormData)
    setResult(null)
    setIsSubmitting(false)
    setIsSubmitted(false)

    try {
      localStorage.removeItem("calorie-calculator-progress")
      // Log calculator restart
      logCalculatorAction("started")
    } catch (error) {
      console.error("Error resetting calculator:", error)
    }
  }

  const calculateCalories = (): CalorieResult => {
    const weight = Number.parseFloat(formData.weight) || 0
    const height = Number.parseFloat(formData.height) || 0
    const age = Number.parseFloat(formData.age) || 0

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr: number
    if (formData.gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }

    // Activity multipliers
    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    }

    const multiplier = activityMultipliers[formData.activityLevel] || 1.2
    const tdee = bmr * multiplier

    // Goal adjustments
    let goalCalories = tdee
    if (formData.goal === "lose_weight") {
      goalCalories = tdee - 500 // 500 calorie deficit
    } else if (formData.goal === "gain_weight") {
      goalCalories = tdee + 300 // 300 calorie surplus
    }

    // Macronutrient distribution (40% carbs, 30% protein, 30% fat)
    const protein = (goalCalories * 0.3) / 4 // 4 calories per gram
    const carbs = (goalCalories * 0.4) / 4 // 4 calories per gram
    const fat = (goalCalories * 0.3) / 9 // 9 calories per gram

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      goalCalories: Math.round(goalCalories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const calculatedResult = calculateCalories()
      setResult(calculatedResult)

      // Log calculator completion
      logCalculatorAction("completed", {
        age: formData.age,
        gender: formData.gender,
        weight: formData.weight,
        height: formData.height,
        activityLevel: formData.activityLevel,
        goal: formData.goal,
        result: calculatedResult,
      })

      // Submit to server action
      const formDataObj = new FormData()

      // Add form data safely
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataObj.append(key, String(value))
        }
      })

      formDataObj.append("bmr", calculatedResult.bmr.toString())
      formDataObj.append("tdee", calculatedResult.tdee.toString())
      formDataObj.append("goalCalories", calculatedResult.goalCalories.toString())

      const result = await submitCaloriebehoefte(formDataObj)

      if (result && result.success) {
        // Log contact submission
        logContactSubmission("calculator", {
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          result: calculatedResult,
        })

        // Track completion
        try {
          trackEvent("calculator_completed", {
            goal: formData.goal,
            gender: formData.gender,
            age_range: getAgeRange(Number.parseInt(formData.age) || 0),
            activity_level: formData.activityLevel,
          })
        } catch (error) {
          console.error("Error tracking completion:", error)
        }

        setIsSubmitted(true)
        setCurrentStep(totalSteps + 1) // Move to results step
      } else {
        console.error("Submission failed:", result?.error || "Unknown error")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getAgeRange = (age: number): string => {
    if (age < 25) return "18-24"
    if (age < 35) return "25-34"
    if (age < 45) return "35-44"
    if (age < 55) return "45-54"
    return "55+"
  }

  const getStepTitle = (step: number): string => {
    const titles: Record<number, string> = {
      1: "Welkom",
      2: "Persoonlijke gegevens",
      3: "Lichaamsgegevens",
      4: "Activiteitsniveau",
      5: "Jouw doel",
      6: "Contactgegevens",
      7: "Bevestiging",
    }
    return titles[step] || ""
  }

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return true
      case 2:
        return formData.gender !== "" && formData.age !== ""
      case 3:
        return formData.weight !== "" && formData.height !== ""
      case 4:
        return formData.activityLevel !== ""
      case 5:
        return formData.goal !== ""
      case 6:
        return formData.name !== "" && formData.email !== ""
      case 7:
        return true
      default:
        return false
    }
  }

  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1839] via-[#2a2054] to-[#1e1839]">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Calculator className="w-12 h-12 text-[#bad4e1] mr-3" />
              <h1 className="text-4xl font-bold text-white">Gratis Caloriebehoefte Calculator</h1>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Ontdek precies hoeveel calorieën jij nodig hebt om jouw doelen te bereiken
            </p>
          </div>

          {/* Progress Bar */}
          {currentStep <= totalSteps && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">Voortgang</span>
                <span className="text-sm text-gray-300">
                  Stap {currentStep} van {totalSteps}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          )}

          {/* Step Content */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-[#1e1839]">{getStepTitle(currentStep)}</CardTitle>
              {currentStep <= totalSteps && (
                <CardDescription className="text-gray-600">
                  Vul de onderstaande gegevens in om jouw persoonlijke caloriebehoefte te berekenen
                </CardDescription>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Step 1: Welcome */}
              {currentStep === 1 && (
                <div className="text-center space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center p-6 bg-[#1e1839]/5 rounded-lg">
                      <Zap className="w-12 h-12 text-[#1e1839] mb-3" />
                      <h3 className="font-semibold text-[#1e1839] mb-2">Nauwkeurig</h3>
                      <p className="text-sm text-gray-600 text-center">Gebaseerd op wetenschappelijke formules</p>
                    </div>
                    <div className="flex flex-col items-center p-6 bg-[#1e1839]/5 rounded-lg">
                      <Heart className="w-12 h-12 text-[#1e1839] mb-3" />
                      <h3 className="font-semibold text-[#1e1839] mb-2">Persoonlijk</h3>
                      <p className="text-sm text-gray-600 text-center">Aangepast aan jouw unieke situatie</p>
                    </div>
                    <div className="flex flex-col items-center p-6 bg-[#1e1839]/5 rounded-lg">
                      <Award className="w-12 h-12 text-[#1e1839] mb-3" />
                      <h3 className="font-semibold text-[#1e1839] mb-2">Gratis</h3>
                      <p className="text-sm text-gray-600 text-center">Geen kosten, geen verplichtingen</p>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    Deze calculator duurt ongeveer 3 minuten om in te vullen en geeft je een compleet overzicht van jouw
                    calorie- en macronutriëntenbehoefte.
                  </p>
                </div>
              )}

              {/* Step 2: Personal Info */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <User className="w-6 h-6 text-[#1e1839] mr-2" />
                    <h3 className="text-lg font-semibold text-[#1e1839]">Persoonlijke gegevens</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium text-[#1e1839] mb-3 block">Wat is jouw geslacht?</Label>
                      <RadioGroup
                        value={formData.gender}
                        onValueChange={(value) => updateFormData("gender", value)}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male" className="cursor-pointer">
                            Man
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female" className="cursor-pointer">
                            Vrouw
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor="age" className="text-base font-medium text-[#1e1839]">
                        Wat is jouw leeftijd?
                      </Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="Bijvoorbeeld: 30"
                        value={formData.age}
                        onChange={(e) => updateFormData("age", e.target.value)}
                        className="mt-2"
                        min="16"
                        max="100"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Body Measurements */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Scale className="w-6 h-6 text-[#1e1839] mr-2" />
                    <h3 className="text-lg font-semibold text-[#1e1839]">Lichaamsgegevens</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="weight" className="text-base font-medium text-[#1e1839]">
                        Wat is jouw gewicht? (kg)
                      </Label>
                      <Input
                        id="weight"
                        type="number"
                        placeholder="Bijvoorbeeld: 70"
                        value={formData.weight}
                        onChange={(e) => updateFormData("weight", e.target.value)}
                        className="mt-2"
                        min="30"
                        max="300"
                        step="0.1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="height" className="text-base font-medium text-[#1e1839]">
                        Wat is jouw lengte? (cm)
                      </Label>
                      <Input
                        id="height"
                        type="number"
                        placeholder="Bijvoorbeeld: 175"
                        value={formData.height}
                        onChange={(e) => updateFormData("height", e.target.value)}
                        className="mt-2"
                        min="120"
                        max="250"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Activity Level */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Activity className="w-6 h-6 text-[#1e1839] mr-2" />
                    <h3 className="text-lg font-semibold text-[#1e1839]">Activiteitsniveau</h3>
                  </div>

                  <div>
                    <Label className="text-base font-medium text-[#1e1839] mb-3 block">
                      Hoe actief ben je gemiddeld?
                    </Label>
                    <RadioGroup
                      value={formData.activityLevel}
                      onValueChange={(value) => updateFormData("activityLevel", value)}
                      className="space-y-3"
                    >
                      <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="sedentary" id="sedentary" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="sedentary" className="cursor-pointer font-medium">
                            Zittend werk (weinig tot geen sport)
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">
                            Kantoorwerk, weinig beweging, geen regelmatige sport
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="light" id="light" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="light" className="cursor-pointer font-medium">
                            Licht actief (1-3 dagen sport per week)
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">Lichte sport of wandelen, af en toe actief</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="moderate" id="moderate" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="moderate" className="cursor-pointer font-medium">
                            Matig actief (3-5 dagen sport per week)
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">Regelmatige sport, actieve levensstijl</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="active" id="active" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="active" className="cursor-pointer font-medium">
                            Zeer actief (6-7 dagen sport per week)
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">Dagelijks sport, intensieve training</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="very_active" id="very_active" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="very_active" className="cursor-pointer font-medium">
                            Extreem actief (2x per dag sport of fysiek werk)
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">Professionele atleet, fysiek zwaar werk</p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}

              {/* Step 5: Goal */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Target className="w-6 h-6 text-[#1e1839] mr-2" />
                    <h3 className="text-lg font-semibold text-[#1e1839]">Jouw doel</h3>
                  </div>

                  <div>
                    <Label className="text-base font-medium text-[#1e1839] mb-3 block">Wat wil je bereiken?</Label>
                    <RadioGroup
                      value={formData.goal}
                      onValueChange={(value) => updateFormData("goal", value)}
                      className="space-y-3"
                    >
                      <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="lose_weight" id="lose_weight" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="lose_weight" className="cursor-pointer font-medium">
                            Gewicht verliezen
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">Vet verbranden en slanker worden</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="maintain_weight" id="maintain_weight" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="maintain_weight" className="cursor-pointer font-medium">
                            Gewicht behouden
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">Huidige gewicht en vorm behouden</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="gain_weight" id="gain_weight" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="gain_weight" className="cursor-pointer font-medium">
                            Gewicht aankomen
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">Spiermassa opbouwen en sterker worden</p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}

              {/* Step 6: Contact Info */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Mail className="w-6 h-6 text-[#1e1839] mr-2" />
                    <h3 className="text-lg font-semibold text-[#1e1839]">Contactgegevens</h3>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800">
                      <strong>Waarom vragen we dit?</strong> We sturen je jouw persoonlijke resultaten toe en kunnen je
                      helpen met het bereiken van jouw doelen.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-base font-medium text-[#1e1839]">
                        Jouw naam *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Voor- en achternaam"
                        value={formData.name}
                        onChange={(e) => updateFormData("name", e.target.value)}
                        className="mt-2"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-base font-medium text-[#1e1839]">
                        E-mailadres *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="jouw@email.nl"
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                        className="mt-2"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-base font-medium text-[#1e1839]">
                        Telefoonnummer (optioneel)
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="06 12 34 56 78"
                        value={formData.phone}
                        onChange={(e) => updateFormData("phone", e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 7: Confirmation */}
              {currentStep === 7 && (
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="w-6 h-6 text-[#1e1839] mr-2" />
                    <h3 className="text-lg font-semibold text-[#1e1839]">Bevestiging</h3>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <h4 className="font-semibold text-[#1e1839] mb-3">Controleer jouw gegevens:</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Geslacht:</span> {formData.gender === "male" ? "Man" : "Vrouw"}
                      </div>
                      <div>
                        <span className="font-medium">Leeftijd:</span> {formData.age} jaar
                      </div>
                      <div>
                        <span className="font-medium">Gewicht:</span> {formData.weight} kg
                      </div>
                      <div>
                        <span className="font-medium">Lengte:</span> {formData.height} cm
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-medium">Activiteitsniveau:</span>{" "}
                        {formData.activityLevel === "sedentary" && "Zittend werk"}
                        {formData.activityLevel === "light" && "Licht actief"}
                        {formData.activityLevel === "moderate" && "Matig actief"}
                        {formData.activityLevel === "active" && "Zeer actief"}
                        {formData.activityLevel === "very_active" && "Extreem actief"}
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-medium">Doel:</span>{" "}
                        {formData.goal === "lose_weight" && "Gewicht verliezen"}
                        {formData.goal === "maintain_weight" && "Gewicht behouden"}
                        {formData.goal === "gain_weight" && "Gewicht aankomen"}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <span className="font-medium">Naam:</span> {formData.name}
                    </div>
                    <div>
                      <span className="font-medium">E-mail:</span> {formData.email}
                    </div>
                    {formData.phone && (
                      <div>
                        <span className="font-medium">Telefoon:</span> {formData.phone}
                      </div>
                    )}
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800">
                      Door op "Bereken mijn caloriebehoefte" te klikken, ga je akkoord met het ontvangen van jouw
                      persoonlijke resultaten en eventuele follow-up communicatie van Evotion Coaching.
                    </p>
                  </div>
                </div>
              )}

              {/* Results */}
              {currentStep > totalSteps && result && (
                <div className="space-y-8">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                      <TrendingUp className="w-12 h-12 text-green-600 mr-3" />
                      <h2 className="text-3xl font-bold text-[#1e1839]">Jouw Persoonlijke Resultaten</h2>
                    </div>
                    <p className="text-gray-600 mb-6">
                      Gebaseerd op jouw gegevens hebben we jouw calorie- en macronutriëntenbehoefte berekend
                    </p>
                  </div>

                  {/* Main Results */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                      <CardHeader className="text-center">
                        <CardTitle className="text-blue-800">Basaal Metabolisme</CardTitle>
                        <CardDescription>Calorieën in rust</CardDescription>
                      </CardHeader>
                      <CardContent className="text-center">
                        <div className="text-3xl font-bold text-blue-800 mb-2">{result.bmr}</div>
                        <div className="text-sm text-blue-600">calorieën per dag</div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                      <CardHeader className="text-center">
                        <CardTitle className="text-green-800">Totaal Verbruik</CardTitle>
                        <CardDescription>Met jouw activiteit</CardDescription>
                      </CardHeader>
                      <CardContent className="text-center">
                        <div className="text-3xl font-bold text-green-800 mb-2">{result.tdee}</div>
                        <div className="text-sm text-green-600">calorieën per dag</div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                      <CardHeader className="text-center">
                        <CardTitle className="text-purple-800">Jouw Doel</CardTitle>
                        <CardDescription>Aanbevolen inname</CardDescription>
                      </CardHeader>
                      <CardContent className="text-center">
                        <div className="text-3xl font-bold text-purple-800 mb-2">{result.goalCalories}</div>
                        <div className="text-sm text-purple-600">calorieën per dag</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Macronutrients */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#1e1839]">Aanbevolen Macronutriënten</CardTitle>
                      <CardDescription>
                        Verdeling van eiwitten, koolhydraten en vetten voor optimale resultaten
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-red-50 rounded-lg">
                          <div className="text-2xl font-bold text-red-600 mb-2">{result.protein}g</div>
                          <div className="text-sm font-medium text-red-800">Eiwitten</div>
                          <div className="text-xs text-red-600 mt-1">30% van calorieën</div>
                        </div>

                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                          <div className="text-2xl font-bold text-yellow-600 mb-2">{result.carbs}g</div>
                          <div className="text-sm font-medium text-yellow-800">Koolhydraten</div>
                          <div className="text-xs text-yellow-600 mt-1">40% van calorieën</div>
                        </div>

                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600 mb-2">{result.fat}g</div>
                          <div className="text-sm font-medium text-orange-800">Vetten</div>
                          <div className="text-xs text-orange-600 mt-1">30% van calorieën</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Next Steps */}
                  <Card className="bg-gradient-to-r from-[#1e1839] to-[#2a2054] text-white">
                    <CardHeader>
                      <CardTitle className="text-white">Wat nu?</CardTitle>
                      <CardDescription className="text-gray-300">
                        Hulp nodig bij het bereiken van jouw doelen?
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-300">
                        Deze resultaten zijn een geweldige start, maar iedereen is uniek. Voor de beste resultaten raden
                        we persoonlijke begeleiding aan.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button asChild className="bg-[#bad4e1] hover:bg-[#bad4e1]/90 text-[#1e1839]">
                          <a href="/contact">
                            <Phone className="w-4 h-4 mr-2" />
                            Gratis Consult Boeken
                          </a>
                        </Button>

                        <Button
                          asChild
                          variant="outline"
                          className="border-white text-white hover:bg-white hover:text-[#1e1839] bg-transparent"
                        >
                          <a href="/online-coaching">
                            Bekijk Online Coaching
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Reset Calculator Button */}
                  <div className="text-center">
                    <Button
                      onClick={resetCalculator}
                      variant="outline"
                      className="text-[#1e1839] border-[#1e1839] bg-transparent hover:bg-[#1e1839] hover:text-white"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Nieuwe Berekening Maken
                    </Button>
                  </div>

                  {isSubmitted && (
                    <div className="text-center">
                      <Badge variant="default" className="bg-green-600">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Resultaten verzonden naar {formData.email}
                      </Badge>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep <= totalSteps && (
                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="text-[#1e1839] border-[#1e1839] bg-transparent"
                  >
                    Vorige
                  </Button>

                  {currentStep < totalSteps ? (
                    <Button
                      onClick={nextStep}
                      disabled={!canProceed()}
                      className="bg-[#1e1839] hover:bg-[#1e1839]/90 text-white"
                    >
                      Volgende
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={!canProceed() || isSubmitting}
                      className="bg-[#bad4e1] hover:bg-[#bad4e1]/90 text-[#1e1839]"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-[#1e1839] border-t-transparent" />
                          Berekenen...
                        </>
                      ) : (
                        <>
                          <Calculator className="w-4 h-4 mr-2" />
                          Bereken Mijn Caloriebehoefte
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
