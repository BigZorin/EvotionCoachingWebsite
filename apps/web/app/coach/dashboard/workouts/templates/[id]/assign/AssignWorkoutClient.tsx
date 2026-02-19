"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getWorkoutTemplate, assignWorkoutToClient } from "@/app/actions/workouts"
import { getClients } from "@/app/actions/admin-clients"
import { ArrowLeft, Send, AlertCircle } from "lucide-react"

type Client = {
  id: string
  email: string
  created_at: string
  last_sign_in_at: string | null
  raw_user_meta_data: {
    full_name?: string
    avatar_url?: string
  }
  checkInsCount: number
  latestCheckIn: any | null
}

type WorkoutTemplate = {
  id: string
  name: string
  description: string | null
  durationMinutes: number | null
  exercises: Array<{
    exercise: {
      name: string
    }
    sets: number | null
    reps: number | null
  }>
}

export default function AssignWorkoutClient({ templateId }: { templateId: string }) {
  const router = useRouter()
  const [template, setTemplate] = useState<WorkoutTemplate | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAssigning, setIsAssigning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [selectedClientId, setSelectedClientId] = useState<string>("")
  const [scheduledDate, setScheduledDate] = useState<string>("")
  const [notes, setNotes] = useState<string>("")

  useEffect(() => {
    loadData()
  }, [templateId])

  const loadData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Load template
      const templateResult = await getWorkoutTemplate(templateId)
      if (templateResult.success && templateResult.template) {
        setTemplate(templateResult.template as WorkoutTemplate)
      } else {
        setError(templateResult.error || "Template niet gevonden")
        return
      }

      // Load clients
      const clientsResult = await getClients()
      if (clientsResult.success && clientsResult.clients) {
        setClients(clientsResult.clients as Client[])
      }
    } catch (error: any) {
      console.error("Error loading data:", error)
      setError(error.message || "Er is een fout opgetreden")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAssign = async () => {
    if (!selectedClientId) {
      alert("Selecteer een client")
      return
    }

    setIsAssigning(true)
    try {
      const result = await assignWorkoutToClient({
        clientId: selectedClientId,
        workoutTemplateId: templateId,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
        notes: notes || undefined,
      })

      if (result.success) {
        router.push("/coach/dashboard/workouts/assigned")
      } else {
        alert(result.error || "Er is een fout opgetreden")
      }
    } catch (error: any) {
      alert(error.message || "Er is een fout opgetreden")
    } finally {
      setIsAssigning(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Workout Toewijzen</h1>
        <p className="text-gray-600">Wijs deze workout toe aan een client</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-900 text-xl flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1e1839]"></div>
                Laden...
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Er is een fout opgetreden</h3>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Workout Details */}
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Workout Details</h2>

                  {template && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">NAAM</p>
                        <p className="text-lg font-semibold text-gray-900">{template.name}</p>
                      </div>

                      {template.description && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">BESCHRIJVING</p>
                          <p className="text-gray-700">{template.description}</p>
                        </div>
                      )}

                      {template.durationMinutes && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">DUUR</p>
                          <p className="text-gray-700">{template.durationMinutes} minuten</p>
                        </div>
                      )}

                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-2">
                          OEFENINGEN ({template.exercises.length})
                        </p>
                        <div className="space-y-2">
                          {template.exercises.map((ex, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <span className="w-1.5 h-1.5 bg-[#1e1839] rounded-full"></span>
                              <span className="text-gray-700">{ex.exercise.name}</span>
                              {ex.sets && ex.reps && (
                                <span className="text-gray-500">({ex.sets}x{ex.reps})</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Right Column - Assignment Form */}
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Toewijzen Aan</h2>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="client">Client *</Label>
                      <Select onValueChange={setSelectedClientId} value={selectedClientId}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Selecteer een client..." />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.length === 0 ? (
                            <SelectItem value="empty" disabled>
                              Geen clients beschikbaar
                            </SelectItem>
                          ) : (
                            clients.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.raw_user_meta_data?.full_name || client.email}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="date">Geplande Datum (optioneel)</Label>
                      <input
                        id="date"
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e1839]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes">Notities (optioneel)</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Bijv. Focus op form, gebruik lichtere gewichten..."
                        rows={4}
                        className="mt-1"
                      />
                    </div>

                    <Button
                      onClick={handleAssign}
                      disabled={isAssigning || !selectedClientId}
                      className="w-full bg-[#1e1839] hover:bg-[#2a2054] text-white"
                    >
                      {isAssigning ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 mr-2 border-b-2 border-white"></div>
                          Toewijzen...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Workout Toewijzen
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
    </div>
  )
}
