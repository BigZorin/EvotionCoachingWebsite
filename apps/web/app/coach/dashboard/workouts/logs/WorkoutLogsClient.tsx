"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { getWorkoutLogs } from "@/app/actions/workouts"
import {
  CheckCircle,
  User,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
} from "lucide-react"

type WorkoutLog = {
  id: string
  completedAt: Date
  totalDurationMinutes: number | null
  notes: string | null
  exerciseLogs: any
  clientWorkout: {
    id: string
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
    }
  }
}

export default function WorkoutLogsClient() {
  const router = useRouter()
  const [logs, setLogs] = useState<WorkoutLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadLogs()
  }, [])

  const loadLogs = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await getWorkoutLogs()
      if (result.success && result.logs) {
        setLogs(result.logs as WorkoutLog[])
      } else if (result.error) {
        setError(result.error)
      }
    } catch (error: any) {
      console.error("Error loading workout logs:", error)
      setError(error.message || "Er is een fout opgetreden")
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate stats
  const totalWorkouts = logs.length
  const last7Days = logs.filter((log) => {
    const logDate = new Date(log.completedAt)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    return logDate >= sevenDaysAgo
  }).length

  const avgDuration =
    logs.filter((log) => log.totalDurationMinutes).length > 0
      ? Math.round(
          logs.reduce((sum, log) => sum + (log.totalDurationMinutes || 0), 0) /
            logs.filter((log) => log.totalDurationMinutes).length
        )
      : 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Workout Logs</h1>
            <p className="text-gray-600">Bekijk voltooide workouts en client performance</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">TOTAAL VOLTOOID</p>
                    <p className="text-4xl font-bold text-gray-900">{totalWorkouts}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">LAATSTE 7 DAGEN</p>
                    <p className="text-4xl font-bold text-gray-900">{last7Days}</p>
                  </div>
                  <div className="p-3 bg-[#1e1839] rounded-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">GEM. DUUR</p>
                    <p className="text-4xl font-bold text-gray-900">{avgDuration}</p>
                    <p className="text-sm text-gray-500">minuten</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-900 text-xl flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1e1839]"></div>
                Laden...
              </div>
            </div>
          ) : error ? (
            /* Error State */
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Er is een fout opgetreden</h3>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : logs.length === 0 ? (
            /* Empty State */
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Nog Geen Voltooide Workouts</h3>
                <p className="text-gray-600">
                  Zodra clients workouts voltooien, verschijnen ze hier.
                </p>
              </CardContent>
            </Card>
          ) : (
            /* Logs List */
            <div className="space-y-4">
              {logs.map((log) => {
                const client = log.clientWorkout.client
                const clientName =
                  client.profile?.firstName && client.profile?.lastName
                    ? `${client.profile.firstName} ${client.profile.lastName}`
                    : client.email

                return (
                  <Card
                    key={log.id}
                    className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                              <CheckCircle className="h-3 w-3" />
                              Voltooid
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(log.completedAt).toLocaleDateString("nl-NL", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>

                          <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            {log.clientWorkout.workoutTemplate.name}
                          </h3>

                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>{clientName}</span>
                            </div>

                            {log.totalDurationMinutes && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{log.totalDurationMinutes} min</span>
                              </div>
                            )}
                          </div>

                          {log.notes && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Client notities:</span> {log.notes}
                              </p>
                            </div>
                          )}

                          {log.exerciseLogs && Array.isArray(log.exerciseLogs) && log.exerciseLogs.length > 0 && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm font-medium text-gray-700 mb-2">Exercise Details:</p>
                              <div className="space-y-1">
                                {log.exerciseLogs.slice(0, 3).map((ex: any, idx: number) => (
                                  <p key={idx} className="text-sm text-gray-600">
                                    • {ex.exerciseName || "Exercise"}: {ex.sets || 0}x{ex.reps || 0}
                                    {ex.weight && ` @ ${ex.weight}kg`}
                                  </p>
                                ))}
                                {log.exerciseLogs.length > 3 && (
                                  <p className="text-sm text-gray-500 italic">
                                    +{log.exerciseLogs.length - 3} meer...
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => router.push(`/coach/dashboard/clients/${client.id}`)}
                          className="text-sm text-[#1e1839] hover:underline"
                        >
                          Bekijk Client →
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
    </div>
  )
}
