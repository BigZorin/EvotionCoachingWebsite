"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getWorkoutTemplates, deleteWorkoutTemplate } from "@/app/actions/workouts"
import {
  Dumbbell,
  Plus,
  Edit,
  Trash2,
  UserPlus,
  Clock,
  AlertCircle,
} from "lucide-react"

type WorkoutTemplate = {
  id: string
  name: string
  description: string | null
  durationMinutes: number | null
  exercises: Array<{
    id: string
    orderIndex: number
    sets: number | null
    reps: number | null
    restSeconds: number | null
    notes: string | null
    exercise: {
      id: string
      name: string
      category: string | null
      equipment: string | null
    }
  }>
  createdAt: Date
}

export default function WorkoutTemplatesClient() {
  const router = useRouter()
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await getWorkoutTemplates()
      if (result.success && result.templates) {
        setTemplates(result.templates as WorkoutTemplate[])
      } else if (result.error) {
        setError(result.error)
      }
    } catch (error: any) {
      console.error("Error loading workout templates:", error)
      setError(error.message || "Er is een fout opgetreden")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (templateId: string) => {
    if (!confirm("Weet je zeker dat je deze workout template wilt verwijderen?")) {
      return
    }

    setDeletingId(templateId)
    try {
      const result = await deleteWorkoutTemplate(templateId)
      if (result.success) {
        // Reload templates
        await loadTemplates()
      } else {
        alert(result.error || "Fout bij verwijderen")
      }
    } catch (error: any) {
      alert(error.message || "Er is een fout opgetreden")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Workout Templates</h2>
          <p className="text-muted-foreground">Beheer je workout templates en wijs ze toe aan clients</p>
        </div>
        <Button
          onClick={() => router.push("/coach/dashboard/workouts/templates/create")}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nieuwe Template
        </Button>
      </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-foreground text-xl flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                Laden...
              </div>
            </div>
          ) : error ? (
            /* Error State */
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Er is een fout opgetreden</h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
          ) : templates.length === 0 ? (
            /* Empty State */
            <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-12 text-center">
                <Dumbbell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Geen Workout Templates</h3>
                <p className="text-muted-foreground mb-6">
                  Je hebt nog geen workout templates gemaakt. Maak je eerste template aan om te beginnen.
                </p>
                <Button
                  onClick={() => router.push("/coach/dashboard/workouts/templates/create")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Maak je eerste template
                </Button>
              </CardContent>
            </Card>
          ) : (
            /* Templates Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className="bg-card border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    {/* Template Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          {template.name}
                        </h3>
                        {template.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {template.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Template Stats */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Dumbbell className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {template.exercises.length} {template.exercises.length === 1 ? 'oefening' : 'oefeningen'}
                        </span>
                      </div>
                      {template.durationMinutes && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{template.durationMinutes} min</span>
                        </div>
                      )}
                    </div>

                    {/* Exercise Preview */}
                    {template.exercises.length > 0 && (
                      <div className="mb-4 p-3 bg-secondary/50 rounded-lg">
                        <p className="text-xs font-medium text-muted-foreground mb-2">OEFENINGEN</p>
                        <ul className="space-y-1">
                          {template.exercises.slice(0, 3).map((ex) => (
                            <li key={ex.id} className="text-sm text-foreground flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                              {ex.exercise.name}
                              {ex.sets && ex.reps && (
                                <span className="text-muted-foreground">({ex.sets}x{ex.reps})</span>
                              )}
                            </li>
                          ))}
                          {template.exercises.length > 3 && (
                            <li className="text-sm text-muted-foreground italic">
                              +{template.exercises.length - 3} meer...
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/coach/dashboard/workouts/templates/${template.id}/assign`)}
                        className="flex-1"
                      >
                        <UserPlus className="h-3.5 w-3.5 mr-1" />
                        Toewijzen
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/coach/dashboard/workouts/templates/${template.id}/edit`)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(template.id)}
                        disabled={deletingId === template.id}
                        className="text-destructive hover:text-destructive hover:bg-destructive/5"
                      >
                        {deletingId === template.id ? (
                          <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-destructive"></div>
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
    </div>
  )
}
