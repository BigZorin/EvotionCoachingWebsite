"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createWorkoutTemplate, getExercises } from "@/app/actions/workouts"
import {
  X,
  GripVertical,
  Save,
  ArrowLeft,
  Dumbbell,
  ChevronUp,
  ChevronDown,
} from "lucide-react"

type Exercise = {
  id: string
  name: string
  category: string | null
  equipment: string | null
  videoUrl: string | null
}

type IntensityType = "weight" | "rpe" | "rir" | "bodyweight" | "percentage"

type TemplateExercise = {
  exerciseId: string
  exerciseName: string
  sets: number
  reps: string
  restSeconds: number
  notes: string
  intensityType: IntensityType
  prescribedWeightKg: number | null
  prescribedRpe: number | null
  prescribedRir: number | null
  prescribedPercentage: number | null
  tempo: string
}

const INTENSITY_LABELS: Record<IntensityType, string> = {
  weight: "Gewicht (kg)",
  rpe: "RPE (1-10)",
  rir: "RIR (reps in reserve)",
  bodyweight: "Lichaamsgewicht",
  percentage: "Percentage 1RM",
}

export default function CreateWorkoutTemplateClient() {
  const router = useRouter()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [templateExercises, setTemplateExercises] = useState<TemplateExercise[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Form fields
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [durationMinutes, setDurationMinutes] = useState<number>(0)

  useEffect(() => {
    loadExercises()
  }, [])

  const loadExercises = async () => {
    setIsLoading(true)
    try {
      const result = await getExercises()
      if (result.success && result.exercises) {
        setExercises(result.exercises as Exercise[])
      }
    } catch (error) {
      console.error("Error loading exercises:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addExercise = (exerciseId: string) => {
    const exercise = exercises.find((e) => e.id === exerciseId)
    if (!exercise) return

    setTemplateExercises([
      ...templateExercises,
      {
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        sets: 3,
        reps: "10",
        restSeconds: 60,
        notes: "",
        intensityType: "weight",
        prescribedWeightKg: null,
        prescribedRpe: null,
        prescribedRir: null,
        prescribedPercentage: null,
        tempo: "",
      },
    ])
  }

  const removeExercise = (index: number) => {
    setTemplateExercises(templateExercises.filter((_, i) => i !== index))
  }

  const updateExercise = (index: number, field: keyof TemplateExercise, value: any) => {
    const updated = [...templateExercises]
    updated[index] = { ...updated[index], [field]: value }

    // Clear irrelevant prescription fields when changing intensity type
    if (field === "intensityType") {
      updated[index].prescribedWeightKg = null
      updated[index].prescribedRpe = null
      updated[index].prescribedRir = null
      updated[index].prescribedPercentage = null
    }

    setTemplateExercises(updated)
  }

  const moveExercise = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return
    if (direction === "down" && index === templateExercises.length - 1) return

    const newIndex = direction === "up" ? index - 1 : index + 1
    const updated = [...templateExercises]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp
    setTemplateExercises(updated)
  }

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Vul een naam in voor de template")
      return
    }

    if (templateExercises.length === 0) {
      alert("Voeg minimaal één oefening toe")
      return
    }

    setIsSaving(true)
    try {
      const result = await createWorkoutTemplate({
        name,
        description: description || undefined,
        durationMinutes: durationMinutes > 0 ? durationMinutes : undefined,
        exercises: templateExercises.map((ex) => ({
          exerciseId: ex.exerciseId,
          sets: ex.sets,
          reps: ex.reps,
          restSeconds: ex.restSeconds,
          notes: ex.notes || undefined,
          intensityType: ex.intensityType,
          prescribedWeightKg: ex.prescribedWeightKg || undefined,
          prescribedRpe: ex.prescribedRpe || undefined,
          prescribedRir: ex.prescribedRir || undefined,
          prescribedPercentage: ex.prescribedPercentage || undefined,
          tempo: ex.tempo || undefined,
        })),
      })

      if (result.success) {
        router.push("/coach/dashboard/workouts/templates")
      } else {
        alert(result.error || "Er is een fout opgetreden")
      }
    } catch (error: any) {
      alert(error.message || "Er is een fout opgetreden")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Terug
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">Nieuwe Workout Template</h1>
          <p className="text-muted-foreground">Maak een workout template die je kunt toewijzen aan clients</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 mr-2 border-b-2 border-white"></div>
              Opslaan...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Opslaan
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Template Info */}
        <div className="lg:col-span-1">
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Template Info</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Naam *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Bijv. Upper Body Power"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Beschrijving</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optionele beschrijving..."
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="duration">Duur (minuten)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 0)}
                    placeholder="60"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Add Exercise */}
              <div className="mt-6 pt-6 border-t border-border">
                <Label htmlFor="add-exercise">Voeg Oefening Toe</Label>
                <Select onValueChange={(value) => addExercise(value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecteer een oefening..." />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoading ? (
                      <SelectItem value="loading" disabled>
                        Laden...
                      </SelectItem>
                    ) : exercises.length === 0 ? (
                      <SelectItem value="empty" disabled>
                        Geen oefeningen beschikbaar
                      </SelectItem>
                    ) : (
                      exercises.map((exercise) => (
                        <SelectItem key={exercise.id} value={exercise.id}>
                          {exercise.name}
                          {exercise.category && (
                            <span className="text-muted-foreground ml-2">({exercise.category})</span>
                          )}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Exercise List */}
        <div className="lg:col-span-2">
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Oefeningen ({templateExercises.length})
              </h2>

              {templateExercises.length === 0 ? (
                <div className="text-center py-12">
                  <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Nog geen oefeningen toegevoegd. Selecteer een oefening om te beginnen.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {templateExercises.map((exercise, index) => (
                    <div
                      key={index}
                      className="p-4 bg-secondary/50 rounded-lg border border-border"
                    >
                      <div className="flex items-start gap-3">
                        {/* Move buttons */}
                        <div className="flex flex-col gap-1 pt-1">
                          <button
                            onClick={() => moveExercise(index, "up")}
                            disabled={index === 0}
                            className="p-1 text-muted-foreground hover:text-muted-foreground disabled:opacity-30"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => moveExercise(index, "down")}
                            disabled={index === templateExercises.length - 1}
                            className="p-1 text-muted-foreground hover:text-muted-foreground disabled:opacity-30"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Exercise Details */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-foreground">{exercise.exerciseName}</h3>
                            <button
                              onClick={() => removeExercise(index)}
                              className="p-1 text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Sets / Reps / Rest */}
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <Label className="text-xs">Sets</Label>
                              <Input
                                type="number"
                                value={exercise.sets}
                                onChange={(e) =>
                                  updateExercise(index, "sets", parseInt(e.target.value) || 0)
                                }
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Reps</Label>
                              <Input
                                value={exercise.reps}
                                onChange={(e) =>
                                  updateExercise(index, "reps", e.target.value)
                                }
                                placeholder="10-12, AMRAP"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Rust (sec)</Label>
                              <Input
                                type="number"
                                value={exercise.restSeconds}
                                onChange={(e) =>
                                  updateExercise(index, "restSeconds", parseInt(e.target.value) || 0)
                                }
                                className="mt-1"
                              />
                            </div>
                          </div>

                          {/* Intensity Type + Prescription */}
                          <div className="p-3 bg-card rounded-md border border-border space-y-3">
                            <div>
                              <Label className="text-xs font-semibold text-foreground">Intensiteit</Label>
                              <Select
                                value={exercise.intensityType}
                                onValueChange={(value) =>
                                  updateExercise(index, "intensityType", value)
                                }
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(INTENSITY_LABELS).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>
                                      {label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Conditional prescription fields */}
                            {exercise.intensityType === "weight" && (
                              <div>
                                <Label className="text-xs">Voorgeschreven gewicht (kg)</Label>
                                <Input
                                  type="number"
                                  step="0.5"
                                  value={exercise.prescribedWeightKg ?? ""}
                                  onChange={(e) =>
                                    updateExercise(
                                      index,
                                      "prescribedWeightKg",
                                      e.target.value ? parseFloat(e.target.value) : null
                                    )
                                  }
                                  placeholder="Bijv. 80"
                                  className="mt-1"
                                />
                              </div>
                            )}

                            {exercise.intensityType === "rpe" && (
                              <div>
                                <Label className="text-xs">Doel RPE (1-10)</Label>
                                <div className="flex gap-1 mt-1">
                                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                                    <button
                                      key={val}
                                      onClick={() => updateExercise(index, "prescribedRpe", val)}
                                      className={`flex-1 py-2 rounded text-sm font-semibold transition-colors ${
                                        exercise.prescribedRpe === val
                                          ? val <= 5
                                            ? "bg-green-500 text-white"
                                            : val <= 7
                                            ? "bg-yellow-500 text-white"
                                            : "bg-red-500 text-white"
                                          : "bg-secondary text-muted-foreground hover:bg-secondary"
                                      }`}
                                    >
                                      {val}
                                    </button>
                                  ))}
                                </div>
                                <p className="text-[11px] text-muted-foreground mt-1">
                                  {exercise.prescribedRpe
                                    ? exercise.prescribedRpe <= 5
                                      ? "Licht — veel reps over"
                                      : exercise.prescribedRpe <= 7
                                      ? "Gemiddeld — enkele reps over"
                                      : exercise.prescribedRpe === 8
                                      ? "Zwaar — 2 reps over"
                                      : exercise.prescribedRpe === 9
                                      ? "Zeer zwaar — 1 rep over"
                                      : "Maximaal — geen reps over"
                                    : "Selecteer een RPE waarde"}
                                </p>
                              </div>
                            )}

                            {exercise.intensityType === "rir" && (
                              <div>
                                <Label className="text-xs">Reps In Reserve (0-5)</Label>
                                <div className="flex gap-2 mt-1">
                                  {[0, 1, 2, 3, 4, 5].map((val) => (
                                    <button
                                      key={val}
                                      onClick={() => updateExercise(index, "prescribedRir", val)}
                                      className={`flex-1 py-2 rounded text-sm font-semibold transition-colors ${
                                        exercise.prescribedRir === val
                                          ? "bg-primary text-primary-foreground"
                                          : "bg-secondary text-muted-foreground hover:bg-secondary"
                                      }`}
                                    >
                                      {val}
                                    </button>
                                  ))}
                                </div>
                                <p className="text-[11px] text-muted-foreground mt-1">
                                  {exercise.prescribedRir != null
                                    ? exercise.prescribedRir === 0
                                      ? "Tot falen — geen reps over"
                                      : `${exercise.prescribedRir} rep${exercise.prescribedRir > 1 ? "s" : ""} over voordat je faalt`
                                    : "Hoeveel reps kan de client nog doen na de set?"}
                                </p>
                              </div>
                            )}

                            {exercise.intensityType === "percentage" && (
                              <div>
                                <Label className="text-xs">Percentage van 1RM</Label>
                                <div className="flex items-center gap-2 mt-1">
                                  <Input
                                    type="number"
                                    min={1}
                                    max={100}
                                    value={exercise.prescribedPercentage ?? ""}
                                    onChange={(e) =>
                                      updateExercise(
                                        index,
                                        "prescribedPercentage",
                                        e.target.value ? parseInt(e.target.value) : null
                                      )
                                    }
                                    placeholder="75"
                                    className="w-24"
                                  />
                                  <span className="text-sm text-muted-foreground">% van 1RM</span>
                                </div>
                              </div>
                            )}

                            {exercise.intensityType === "bodyweight" && (
                              <p className="text-sm text-muted-foreground italic">
                                Geen gewicht nodig — client traint met lichaamsgewicht.
                              </p>
                            )}
                          </div>

                          {/* Tempo */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs">Tempo (optioneel)</Label>
                              <Input
                                value={exercise.tempo}
                                onChange={(e) => updateExercise(index, "tempo", e.target.value)}
                                placeholder="3-1-2-0"
                                className="mt-1"
                              />
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                Exc-pauze-conc-pauze (sec)
                              </p>
                            </div>
                            <div>
                              <Label className="text-xs">Notities (optioneel)</Label>
                              <Input
                                value={exercise.notes}
                                onChange={(e) => updateExercise(index, "notes", e.target.value)}
                                placeholder="Focus op eccentrisch..."
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
