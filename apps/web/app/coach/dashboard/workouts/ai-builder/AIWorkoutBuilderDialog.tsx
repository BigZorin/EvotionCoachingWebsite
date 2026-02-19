"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { generateWorkoutWithAI } from "@/app/actions/ai-workouts"
import { getMyClients } from "@/app/actions/admin-clients"
import { toast } from "sonner"

type Client = {
  id: string
  profile?: {
    firstName: string
    lastName: string
  } | null
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (templateId: string) => void
}

export default function AIWorkoutBuilderDialog({
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [step, setStep] = useState(1)
  const [clients, setClients] = useState<Client[]>([])
  const [loadingClients, setLoadingClients] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [generationComplete, setGenerationComplete] = useState(false)
  const [generatedTemplateId, setGeneratedTemplateId] = useState<string | null>(
    null
  )

  // Form data
  const [selectedClientId, setSelectedClientId] = useState("")
  const [goals, setGoals] = useState("")
  const [experience, setExperience] = useState("BEGINNER")
  const [equipment, setEquipment] = useState<string[]>([])
  const [sessionsPerWeek, setSessionsPerWeek] = useState(3)
  const [sessionDuration, setSessionDuration] = useState(60)
  const [injuries, setInjuries] = useState("")

  const equipmentOptions = [
    "Barbell",
    "Dumbbell",
    "Kettlebell",
    "Resistance Bands",
    "Pull-up Bar",
    "Bench",
    "Cable Machine",
    "Squat Rack",
    "Bodyweight",
  ]

  const experienceLevels = [
    { value: "BEGINNER", label: "Beginner (0-1 jaar training)" },
    { value: "INTERMEDIATE", label: "Intermediate (1-3 jaar training)" },
    { value: "ADVANCED", label: "Advanced (3+ jaar training)" },
  ]

  useEffect(() => {
    if (open) {
      loadClients()
      resetForm()
    }
  }, [open])

  async function loadClients() {
    try {
      setLoadingClients(true)
      const result = await getMyClients()
      if (result.success && result.clients) {
        setClients(result.clients)
      }
    } catch (error: any) {
      toast.error("Error loading clients")
      console.error(error)
    } finally {
      setLoadingClients(false)
    }
  }

  function resetForm() {
    setStep(1)
    setSelectedClientId("")
    setGoals("")
    setExperience("BEGINNER")
    setEquipment([])
    setSessionsPerWeek(3)
    setSessionDuration(60)
    setInjuries("")
    setGenerating(false)
    setGenerationComplete(false)
    setGeneratedTemplateId(null)
  }

  function toggleEquipment(item: string) {
    setEquipment((prev) =>
      prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item]
    )
  }

  function canProceedToStep2() {
    return selectedClientId !== ""
  }

  function canProceedToStep3() {
    return (
      goals.trim() !== "" &&
      experience !== "" &&
      equipment.length > 0 &&
      sessionsPerWeek > 0 &&
      sessionDuration > 0
    )
  }

  async function handleGenerate() {
    if (!canProceedToStep3()) {
      toast.error("Please fill in all required fields")
      return
    }

    setGenerating(true)
    setStep(3)

    try {
      const result = await generateWorkoutWithAI({
        clientId: selectedClientId,
        preferences: {
          goals,
          experience,
          equipment,
          sessionsPerWeek,
          sessionDuration,
          injuries: injuries.trim() ? [injuries] : undefined,
        },
      })

      if (!result.success || !result.templateId) {
        toast.error(result.error || "Failed to generate workout")
        setGenerating(false)
        return
      }

      setGeneratedTemplateId(result.templateId)
      setGenerationComplete(true)
      toast.success(
        `Workout generated! Used ${result.tokensUsed} tokens.`
      )
    } catch (error: any) {
      toast.error("Error generating workout")
      console.error(error)
      setGenerating(false)
    } finally {
      setGenerating(false)
    }
  }

  function handleClose() {
    onOpenChange(false)
    // Reset after close animation
    setTimeout(resetForm, 300)
  }

  function handleFinish() {
    if (generatedTemplateId && onSuccess) {
      onSuccess(generatedTemplateId)
    }
    handleClose()
  }

  const selectedClient = clients.find((c) => c.id === selectedClientId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            AI Workout Generator
          </DialogTitle>
          <DialogDescription>
            Laat AI een gepersonaliseerd trainingsprogramma genereren op basis van
            client data en evidence-based principles
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step >= s
                    ? "bg-purple-500 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step > s ? "bg-purple-500" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select Client */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label>Selecteer Client *</Label>
              {loadingClients ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Select
                  value={selectedClientId}
                  onValueChange={setSelectedClientId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kies een client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.profile?.firstName} {client.profile?.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {selectedClient && (
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-sm">Client Info</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p>
                    Naam: {selectedClient.profile?.firstName}{" "}
                    {selectedClient.profile?.lastName}
                  </p>
                  <p className="text-muted-foreground">
                    AI zal recente check-in data en profiel informatie gebruiken
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Step 2: Input Preferences */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label>Training Doelen *</Label>
              <Textarea
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="Bijv. Muscle gain, strength, fat loss, athletic performance..."
                rows={3}
              />
            </div>

            <div>
              <Label>Ervaring Level *</Label>
              <Select value={experience} onValueChange={setExperience}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Beschikbare Apparatuur *</Label>
              <div className="flex flex-wrap gap-2 mt-2 p-3 border rounded-md">
                {equipmentOptions.map((item) => (
                  <Badge
                    key={item}
                    variant={equipment.includes(item) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleEquipment(item)}
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Sessies per Week *</Label>
                <Input
                  type="number"
                  min="1"
                  max="7"
                  value={sessionsPerWeek}
                  onChange={(e) => setSessionsPerWeek(parseInt(e.target.value))}
                />
              </div>

              <div>
                <Label>Sessie Duur (minuten) *</Label>
                <Input
                  type="number"
                  min="15"
                  max="180"
                  step="15"
                  value={sessionDuration}
                  onChange={(e) =>
                    setSessionDuration(parseInt(e.target.value))
                  }
                />
              </div>
            </div>

            <div>
              <Label>Blessures / Limitaties (optioneel)</Label>
              <Textarea
                value={injuries}
                onChange={(e) => setInjuries(e.target.value)}
                placeholder="Bijv. Lower back pain, knee injury..."
                rows={2}
              />
            </div>
          </div>
        )}

        {/* Step 3: Generating / Complete */}
        {step === 3 && (
          <div className="space-y-6 py-8">
            {generating && (
              <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-16 h-16 animate-spin text-purple-500" />
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">
                    AI Genereert Workout...
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Claude analyseert client data, check-ins, en evidence-based
                    principes om een gepersonaliseerd programma te maken. Dit kan
                    15-30 seconden duren.
                  </p>
                </div>
              </div>
            )}

            {generationComplete && generatedTemplateId && (
              <div className="flex flex-col items-center justify-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">Workout Gegenereerd!</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Je nieuwe AI-gegenereerde workout template is klaar. Je kunt
                    deze nu bekijken en toewijzen aan de client.
                  </p>
                </div>
              </div>
            )}

            {!generating && !generationComplete && (
              <div className="flex flex-col items-center justify-center space-y-4">
                <XCircle className="w-16 h-16 text-red-500" />
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">Generatie Mislukt</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Er ging iets mis tijdens het genereren. Probeer het opnieuw.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex justify-between">
          <div className="flex-1">
            {step > 1 && step < 3 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={generating}
              >
                Vorige
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose} disabled={generating}>
              {step === 3 && generationComplete ? "Sluiten" : "Annuleren"}
            </Button>

            {step === 1 && (
              <Button
                onClick={() => setStep(2)}
                disabled={!canProceedToStep2()}
              >
                Volgende
              </Button>
            )}

            {step === 2 && (
              <Button onClick={handleGenerate} disabled={!canProceedToStep3()}>
                <Sparkles className="w-4 h-4 mr-2" />
                Genereer Workout
              </Button>
            )}

            {step === 3 && generationComplete && (
              <Button onClick={handleFinish}>
                Bekijk Template
              </Button>
            )}

            {step === 3 && !generating && !generationComplete && (
              <Button onClick={() => setStep(2)}>Probeer Opnieuw</Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
