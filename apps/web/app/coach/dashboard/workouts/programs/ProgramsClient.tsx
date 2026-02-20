"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  getTrainingPrograms,
  deleteTrainingProgram,
} from "@/app/actions/training-programs"
import {
  Plus,
  Trash2,
  UserPlus,
  Layers,
  Dumbbell,
  AlertCircle,
  ImageIcon,
  MoreHorizontal,
  Edit,
  Loader2,
  Sparkles,
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

  const activeCount = programs.filter(p => p.is_active).length
  const draftCount = programs.filter(p => !p.is_active).length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Programma&apos;s laden...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">Programma&apos;s</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Trainingsprogramma&apos;s met blokken en fases
          </p>
        </div>
        <Button asChild>
          <Link href="/coach/dashboard/workouts/programs/create">
            <Plus className="size-4 mr-1.5" />
            Nieuw programma
          </Link>
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg">
          <AlertCircle className="size-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {programs.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Layers className="size-10 text-muted-foreground/30 mb-3" />
          <h3 className="font-semibold mb-1">Nog geen programma&apos;s</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md">
            Maak je eerste trainingsprogramma met blokken en fases om aan clients toe te wijzen.
          </p>
          <Button asChild>
            <Link href="/coach/dashboard/workouts/programs/create">
              <Plus className="size-4 mr-1.5" />
              Maak programma
            </Link>
          </Button>
        </div>
      ) : programs.length > 0 && (
        <Tabs defaultValue="alle">
          <TabsList>
            <TabsTrigger value="alle">Alle ({programs.length})</TabsTrigger>
            <TabsTrigger value="actief">Actief ({activeCount})</TabsTrigger>
            {draftCount > 0 && (
              <TabsTrigger value="concept">Concepten ({draftCount})</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="alle" className="mt-4">
            <ProgramGrid programs={programs} onDelete={handleDelete} deletingId={deletingId} />
          </TabsContent>
          <TabsContent value="actief" className="mt-4">
            <ProgramGrid programs={programs.filter(p => p.is_active)} onDelete={handleDelete} deletingId={deletingId} />
          </TabsContent>
          {draftCount > 0 && (
            <TabsContent value="concept" className="mt-4">
              <ProgramGrid programs={programs.filter(p => !p.is_active)} onDelete={handleDelete} deletingId={deletingId} />
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  )
}

function ProgramGrid({
  programs,
  onDelete,
  deletingId,
}: {
  programs: Program[]
  onDelete: (id: string) => void
  deletingId: string | null
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {programs.map((program) => (
        <ProgramCard
          key={program.id}
          program={program}
          onDelete={onDelete}
          isDeleting={deletingId === program.id}
        />
      ))}
    </div>
  )
}

function ProgramCard({
  program,
  onDelete,
  isDeleting,
}: {
  program: Program
  onDelete: (id: string) => void
  isDeleting: boolean
}) {
  return (
    <Card className="overflow-hidden shadow-sm hover:border-primary/30 transition-all group">
      {/* Banner */}
      <Link href={`/coach/dashboard/workouts/programs/${program.id}`}>
        <div className="relative h-24 bg-gradient-to-br from-primary to-primary/70">
          {program.banner_url ? (
            <img
              src={program.banner_url}
              alt={program.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Dumbbell className="size-8 text-primary-foreground/30" />
            </div>
          )}
          {/* Title overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="font-semibold text-white text-sm truncate">{program.name}</h3>
          </div>
          {!program.is_active && (
            <Badge className="absolute top-2 right-2 bg-amber-500/90 text-white text-[10px]">
              Concept
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        {program.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {program.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Layers className="size-3.5" />
            <span>{program.blockCount} blokken</span>
          </div>
          <div className="flex items-center gap-1">
            <Dumbbell className="size-3.5" />
            <span>{program.totalWorkouts} workouts</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs flex-1" asChild>
            <Link href={`/coach/dashboard/workouts/programs/${program.id}`}>
              <Edit className="size-3.5 mr-1" />
              Bewerken
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
            <Link href={`/coach/dashboard/workouts/programs/${program.id}/assign`}>
              <UserPlus className="size-3.5 mr-1" />
              Toewijzen
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/coach/dashboard/workouts/programs/${program.id}`}>
                  <Edit className="mr-2 size-4" />
                  Bewerken
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/coach/dashboard/workouts/programs/${program.id}/assign`}>
                  <UserPlus className="mr-2 size-4" />
                  Toewijzen
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(program.id)}
                disabled={isDeleting}
              >
                <Trash2 className="mr-2 size-4" />
                Verwijderen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}
