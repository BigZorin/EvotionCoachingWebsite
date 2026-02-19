"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  getTrainingPrograms,
  deleteTrainingProgram,
} from "@/app/actions/training-programs"
import {
  Plus,
  Edit,
  Trash2,
  UserPlus,
  Layers,
  Dumbbell,
  AlertCircle,
  ImageIcon,
} from "lucide-react"

type Program = {
  id: string
  name: string
  description: string | null
  banner_url: string | null
  is_active: boolean
  created_at: string
  blockCount: number
  totalWorkouts: number
}

export default function ProgramsClient() {
  const router = useRouter()
  const [programs, setPrograms] = useState<Program[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    loadPrograms()
  }, [])

  const loadPrograms = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await getTrainingPrograms()
      if (result.success && result.programs) {
        setPrograms(result.programs as Program[])
      } else if (result.error) {
        setError(result.error)
      }
    } catch (err: any) {
      setError(err.message || "Er is een fout opgetreden")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (programId: string) => {
    if (!confirm("Weet je zeker dat je dit programma wilt verwijderen?")) return

    setDeletingId(programId)
    try {
      const result = await deleteTrainingProgram(programId)
      if (result.success) {
        await loadPrograms()
      } else {
        alert(result.error || "Fout bij verwijderen")
      }
    } catch (err: any) {
      alert(err.message || "Er is een fout opgetreden")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Programma's</h2>
          <p className="text-muted-foreground">
            Maak trainingsprogramma's met meerdere blokken en fases
          </p>
        </div>
        <Button
          onClick={() => router.push("/coach/dashboard/workouts/programs/create")}
          className="bg-[#1e1839] hover:bg-[#2a2054] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nieuw Programma
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-40 bg-gray-200 rounded-t-lg" />
              <CardContent className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && programs.length === 0 && !error && (
        <div className="text-center py-16">
          <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nog geen programma's
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Maak je eerste trainingsprogramma met blokken en fases om aan clients
            toe te wijzen.
          </p>
          <Button
            onClick={() => router.push("/coach/dashboard/workouts/programs/create")}
            className="bg-[#1e1839] hover:bg-[#2a2054] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Maak Programma
          </Button>
        </div>
      )}

      {/* Programs grid */}
      {!isLoading && programs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <Card
              key={program.id}
              className="overflow-hidden hover:shadow-md transition-shadow border-gray-200"
            >
              {/* Banner */}
              <div className="relative h-40 bg-gradient-to-br from-[#1e1839] to-[#3d2d6b]">
                {program.banner_url ? (
                  <img
                    src={program.banner_url}
                    alt={program.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-white/30" />
                  </div>
                )}
                {!program.is_active && (
                  <Badge className="absolute top-3 right-3 bg-yellow-500 text-white">
                    Inactief
                  </Badge>
                )}
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  {program.name}
                </h3>
                {program.description && (
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {program.description}
                  </p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Layers className="w-4 h-4" />
                    <span>{program.blockCount} blokken</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Dumbbell className="w-4 h-4" />
                    <span>{program.totalWorkouts} workouts</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(
                        `/coach/dashboard/workouts/programs/${program.id}`
                      )
                    }
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Bewerken
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(
                        `/coach/dashboard/workouts/programs/${program.id}/assign`
                      )
                    }
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    Toewijzen
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-auto"
                    onClick={() => handleDelete(program.id)}
                    disabled={deletingId === program.id}
                  >
                    <Trash2 className="w-4 h-4" />
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
