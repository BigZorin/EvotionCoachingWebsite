"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getAssignedWorkouts } from "@/app/actions/workouts"
import {
  Calendar,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
} from "lucide-react"

type AssignedWorkout = {
  id: string
  scheduledDate: Date | null
  completed: boolean
  completedAt: Date | null
  notes: string | null
  client: {
    id: string
    email: string
    profile: {
      firstName: string | null
      lastName: string | null
      avatarUrl: string | null
    } | null
  }
  workoutTemplate: {
    id: string
    name: string
    description: string | null
    durationMinutes: number | null
  }
  createdAt: Date
}

export default function AssignedWorkoutsClient() {
  const router = useRouter()
  const [assignments, setAssignments] = useState<AssignedWorkout[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all")

  useEffect(() => {
    loadAssignments()
  }, [])

  const loadAssignments = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await getAssignedWorkouts()
      if (result.success && result.assignments) {
        setAssignments(result.assignments as AssignedWorkout[])
      } else if (result.error) {
        setError(result.error)
      }
    } catch (error: any) {
      console.error("Error loading assigned workouts:", error)
      setError(error.message || "Er is een fout opgetreden")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredAssignments = assignments.filter((assignment) => {
    if (filter === "completed") return assignment.completed
    if (filter === "upcoming") return !assignment.completed
    return true
  })

  const upcomingCount = assignments.filter((a) => !a.completed).length
  const completedCount = assignments.filter((a) => a.completed).length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Toegewezen Workouts</h1>
            <p className="text-muted-foreground">Overzicht van alle workouts die je hebt toegewezen aan clients</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">TOTAAL TOEGEWEZEN</p>
                    <p className="text-4xl font-bold text-foreground">{assignments.length}</p>
                  </div>
                  <div className="p-3 bg-primary rounded-lg">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">NOG TE DOEN</p>
                    <p className="text-4xl font-bold text-foreground">{upcomingCount}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">VOLTOOID</p>
                    <p className="text-4xl font-bold text-foreground">{completedCount}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Buttons */}
          <div className="mb-6 flex items-center gap-3">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
                className={filter === "all" ? "bg-primary hover:bg-primary/90" : ""}
              >
                Alles ({assignments.length})
              </Button>
              <Button
                variant={filter === "upcoming" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("upcoming")}
                className={filter === "upcoming" ? "bg-primary hover:bg-primary/90" : ""}
              >
                Nog te doen ({upcomingCount})
              </Button>
              <Button
                variant={filter === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("completed")}
                className={filter === "completed" ? "bg-primary hover:bg-primary/90" : ""}
              >
                Voltooid ({completedCount})
              </Button>
            </div>
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
          ) : filteredAssignments.length === 0 ? (
            /* Empty State */
            <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-12 text-center">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Geen Toegewezen Workouts</h3>
                <p className="text-muted-foreground mb-6">
                  {filter === "all"
                    ? "Je hebt nog geen workouts toegewezen aan clients."
                    : filter === "upcoming"
                    ? "Alle workouts zijn voltooid!"
                    : "Nog geen voltooide workouts."}
                </p>
                {filter === "all" && (
                  <Button
                    onClick={() => router.push("/coach/dashboard/workouts/templates")}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Ga naar Templates
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            /* Assignments List */
            <div className="space-y-4">
              {filteredAssignments.map((assignment) => (
                <Card
                  key={assignment.id}
                  className="bg-card border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {/* Status Badge */}
                          {assignment.completed ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                              <CheckCircle className="h-3 w-3" />
                              Voltooid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                              <Clock className="h-3 w-3" />
                              Te doen
                            </span>
                          )}

                          {/* Scheduled Date */}
                          {assignment.scheduledDate && (
                            <span className="text-sm text-muted-foreground">
                              {new Date(assignment.scheduledDate).toLocaleDateString("nl-NL", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                              })}
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {assignment.workoutTemplate.name}
                        </h3>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>
                              {assignment.client.profile?.firstName && assignment.client.profile?.lastName
                                ? `${assignment.client.profile.firstName} ${assignment.client.profile.lastName}`
                                : assignment.client.email}
                            </span>
                          </div>

                          {assignment.workoutTemplate.durationMinutes && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{assignment.workoutTemplate.durationMinutes} min</span>
                            </div>
                          )}
                        </div>

                        {assignment.notes && (
                          <p className="mt-3 text-sm text-muted-foreground bg-secondary/50 p-3 rounded-lg">
                            <span className="font-medium">Notities:</span> {assignment.notes}
                          </p>
                        )}

                        {assignment.completed && assignment.completedAt && (
                          <p className="mt-2 text-sm text-green-600">
                            ✓ Voltooid op{" "}
                            {new Date(assignment.completedAt).toLocaleDateString("nl-NL", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        )}
                      </div>

                      {/* View Client Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/coach/dashboard/clients/${assignment.client.id}`)}
                      >
                        Bekijk Client
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
