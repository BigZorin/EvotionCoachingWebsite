"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  getTrainingProgram,
  getCoachClients,
  assignProgramToClient,
  getClientPrograms,
} from "@/app/actions/training-programs"
import {
  ArrowLeft,
  UserPlus,
  Layers,
  Dumbbell,
  Calendar,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react"

type Client = { id: string; fullName: string; email: string }

export default function AssignProgramClient({ programId }: { programId: string }) {
  const router = useRouter()
  const [program, setProgram] = useState<any>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [assignments, setAssignments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAssigning, setIsAssigning] = useState(false)
  const [assignSuccess, setAssignSuccess] = useState(false)

  // Form
  const [selectedClientId, setSelectedClientId] = useState("")
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0])
  const [notes, setNotes] = useState("")

  useEffect(() => {
    loadData()
  }, [programId])

  const loadData = async () => {
    setIsLoading(true)
    const [programRes, clientsRes, assignmentsRes] = await Promise.all([
      getTrainingProgram(programId),
      getCoachClients(),
      getClientPrograms(),
    ])

    if (programRes.success && programRes.program) setProgram(programRes.program)
    if (clientsRes.success && clientsRes.clients) setClients(clientsRes.clients as Client[])
    if (assignmentsRes.success && assignmentsRes.assignments) {
      setAssignments(
        (assignmentsRes.assignments as any[]).filter((a: any) => a.program_id === programId)
      )
    }
    setIsLoading(false)
  }

  const handleAssign = async () => {
    if (!selectedClientId) {
      alert("Selecteer een client")
      return
    }

    setIsAssigning(true)
    setAssignSuccess(false)
    try {
      const result = await assignProgramToClient({
        clientId: selectedClientId,
        programId,
        startDate,
        notes: notes.trim() || undefined,
      })
      if (result.success) {
        setAssignSuccess(true)
        setSelectedClientId("")
        setNotes("")
        await loadData()
        setTimeout(() => setAssignSuccess(false), 3000)
      } else {
        alert(result.error || "Toewijzing mislukt")
      }
    } catch (err: any) {
      alert(err.message || "Er is een fout opgetreden")
    } finally {
      setIsAssigning(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!program) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Programma niet gevonden</p>
      </div>
    )
  }

  const blocks = program.program_blocks || []
  const totalWorkouts = blocks.reduce(
    (sum: number, b: any) => sum + (b.block_workouts?.length || 0), 0
  )

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Terug
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Programma Toewijzen</h1>
          <p className="text-muted-foreground">{program.name}</p>
        </div>
      </div>

      {/* Program summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {program.banner_url ? (
              <img
                src={program.banner_url}
                alt={program.name}
                className="w-20 h-14 rounded-lg object-cover"
              />
            ) : (
              <div className="w-20 h-14 rounded-lg bg-gradient-to-br from-[#1e1839] to-[#3d2d6b] flex items-center justify-center">
                <Layers className="w-6 h-6 text-white/40" />
              </div>
            )}
            <div>
              <h3 className="font-semibold">{program.name}</h3>
              <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  {blocks.length} blokken
                </span>
                <span className="flex items-center gap-1">
                  <Dumbbell className="w-3.5 h-3.5" />
                  {totalWorkouts} workouts
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assign form */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Nieuw toewijzen
          </h3>

          {assignSuccess && (
            <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
              <span>Programma succesvol toegewezen! Workouts voor het eerste blok zijn aangemaakt.</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Client *</Label>
              <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecteer een client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.fullName}
                    </SelectItem>
                  ))}
                  {clients.length === 0 && (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      Geen actieve clients gevonden
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Startdatum</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label>Notities (optioneel)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Eventuele notities voor deze toewijzing..."
              rows={2}
              className="mt-1"
            />
          </div>

          {/* Block schedule preview */}
          {blocks.length > 0 && startDate && (
            <div>
              <Label className="mb-2 block">Schema preview</Label>
              <div className="space-y-2">
                {blocks.map((block: any, i: number) => {
                  const blockStart = new Date(startDate)
                  // Calculate offset based on previous blocks
                  for (let j = 0; j < i; j++) {
                    blockStart.setDate(
                      blockStart.getDate() + (blocks[j].duration_weeks || 4) * 7
                    )
                  }
                  const blockEnd = new Date(blockStart)
                  blockEnd.setDate(blockEnd.getDate() + (block.duration_weeks || 4) * 7 - 1)

                  return (
                    <div
                      key={block.id}
                      className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg text-sm"
                    >
                      <Badge variant="secondary" className="font-mono">
                        {i + 1}
                      </Badge>
                      <span className="font-medium">{block.name}</span>
                      <span className="text-gray-500 ml-auto flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {blockStart.toLocaleDateString("nl-NL")} –{" "}
                        {blockEnd.toLocaleDateString("nl-NL")}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <Button
            onClick={handleAssign}
            disabled={isAssigning || !selectedClientId}
            className="w-full bg-[#1e1839] hover:bg-[#2a2054] text-white"
          >
            {isAssigning ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <UserPlus className="w-4 h-4 mr-2" />
            )}
            Programma Toewijzen
          </Button>
        </CardContent>
      </Card>

      {/* Existing assignments */}
      {assignments.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">Huidige toewijzingen</h3>
            <div className="space-y-3">
              {assignments.map((a: any) => {
                const clientName = a.users?.raw_user_meta_data?.fullName ||
                  a.users?.raw_user_meta_data?.full_name || "Onbekend"
                return (
                  <div
                    key={a.id}
                    className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <span className="font-medium">{clientName}</span>
                      <span className="text-sm text-gray-500 ml-3">
                        Start: {new Date(a.start_date).toLocaleDateString("nl-NL")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          a.status === "active"
                            ? "default"
                            : a.status === "completed"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {a.status === "active"
                          ? "Actief"
                          : a.status === "completed"
                          ? "Voltooid"
                          : "Gepauzeerd"}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Blok {a.current_block_index + 1}/{blocks.length}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
