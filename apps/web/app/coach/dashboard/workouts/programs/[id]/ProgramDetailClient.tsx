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
  updateTrainingProgram,
  createProgramBlock,
  updateProgramBlock,
  deleteProgramBlock,
  addWorkoutToBlock,
  removeWorkoutFromBlock,
  reorderProgramBlocks,
  reorderBlockWorkouts,
  uploadProgramBanner,
  getWorkoutTemplatesForProgram,
} from "@/app/actions/training-programs"
import {
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  ChevronUp,
  ChevronDown,
  Dumbbell,
  ImageIcon,
  Save,
  Loader2,
  UserPlus,
} from "lucide-react"

type WorkoutTemplate = {
  id: string
  name: string
  description: string | null
  duration_minutes: number | null
  workout_template_exercises: Array<{
    id: string
    exercises: { id: string; name: string; category: string }
  }>
}

const DAY_LABELS: Record<number, string> = {
  1: "Ma", 2: "Di", 3: "Wo", 4: "Do", 5: "Vr", 6: "Za", 7: "Zo",
}

export default function ProgramDetailClient({ programId }: { programId: string }) {
  const router = useRouter()

  const [program, setProgram] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([])
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set())

  // Editable fields
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [bannerUrl, setBannerUrl] = useState<string | null>(null)

  useEffect(() => {
    loadProgram()
    loadTemplates()
  }, [programId])

  const loadProgram = async () => {
    setIsLoading(true)
    const result = await getTrainingProgram(programId)
    if (result.success && result.program) {
      setProgram(result.program)
      setName(result.program.name)
      setDescription(result.program.description || "")
      setBannerUrl(result.program.banner_url)
      // Expand all blocks by default
      const blockIds = new Set((result.program.program_blocks || []).map((b: any) => b.id))
      setExpandedBlocks(blockIds)
    }
    setIsLoading(false)
  }

  const loadTemplates = async () => {
    const result = await getWorkoutTemplatesForProgram()
    if (result.success && result.templates) {
      setTemplates(result.templates as WorkoutTemplate[])
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const result = await updateTrainingProgram(programId, {
        name: name.trim(),
        description: description.trim() || undefined,
        bannerUrl: bannerUrl || undefined,
      })
      if (!result.success) {
        alert(result.error || "Opslaan mislukt")
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const result = await uploadProgramBanner(formData)
      if (result.success && result.url) {
        setBannerUrl(result.url)
        await updateTrainingProgram(programId, { bannerUrl: result.url, bannerStoragePath: result.storagePath || undefined })
      } else {
        alert(result.error || "Upload mislukt")
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleAddBlock = async () => {
    const blocks = program?.program_blocks || []
    const result = await createProgramBlock({
      programId,
      name: `Blok ${blocks.length + 1}`,
      durationWeeks: 4,
      orderIndex: blocks.length,
    })
    if (result.success) await loadProgram()
    else alert(result.error || "Fout bij toevoegen blok")
  }

  const handleDeleteBlock = async (blockId: string) => {
    if (!confirm("Weet je zeker dat je dit blok wilt verwijderen?")) return
    const result = await deleteProgramBlock(blockId)
    if (result.success) await loadProgram()
    else alert(result.error || "Fout bij verwijderen")
  }

  const handleUpdateBlock = async (blockId: string, data: { name?: string; description?: string; durationWeeks?: number }) => {
    await updateProgramBlock(blockId, data)
    // Don't reload, just update local state
    setProgram((prev: any) => ({
      ...prev,
      program_blocks: prev.program_blocks.map((b: any) =>
        b.id === blockId ? { ...b, ...data, duration_weeks: data.durationWeeks ?? b.duration_weeks } : b
      ),
    }))
  }

  const handleAddWorkout = async (blockId: string, templateId: string) => {
    const result = await addWorkoutToBlock({ blockId, workoutTemplateId: templateId })
    if (result.success) await loadProgram()
    else alert(result.error || "Fout bij toevoegen workout")
  }

  const handleRemoveWorkout = async (blockWorkoutId: string) => {
    const result = await removeWorkoutFromBlock(blockWorkoutId)
    if (result.success) await loadProgram()
    else alert(result.error || "Fout bij verwijderen")
  }

  const handleMoveBlock = async (blockIndex: number, direction: "up" | "down") => {
    const blocks = [...(program?.program_blocks || [])]
    const newIndex = direction === "up" ? blockIndex - 1 : blockIndex + 1
    if (newIndex < 0 || newIndex >= blocks.length) return

    ;[blocks[blockIndex], blocks[newIndex]] = [blocks[newIndex], blocks[blockIndex]]
    const blockIds = blocks.map((b: any) => b.id)
    await reorderProgramBlocks(programId, blockIds)
    await loadProgram()
  }

  const handleMoveWorkout = async (blockId: string, workoutIndex: number, direction: "up" | "down") => {
    const block = (program?.program_blocks || []).find((b: any) => b.id === blockId)
    if (!block) return
    const workouts = [...(block.block_workouts || [])]
    const newIndex = direction === "up" ? workoutIndex - 1 : workoutIndex + 1
    if (newIndex < 0 || newIndex >= workouts.length) return

    ;[workouts[workoutIndex], workouts[newIndex]] = [workouts[newIndex], workouts[workoutIndex]]
    const workoutIds = workouts.map((w: any) => w.id)
    await reorderBlockWorkouts(blockId, workoutIds)
    await loadProgram()
  }

  const toggleBlock = (blockId: string) => {
    setExpandedBlocks((prev) => {
      const next = new Set(prev)
      if (next.has(blockId)) next.delete(blockId)
      else next.add(blockId)
      return next
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!program) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Programma niet gevonden</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          Terug
        </Button>
      </div>
    )
  }

  const blocks = program.program_blocks || []

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/coach/dashboard/workouts")}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Terug
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{program.name}</h1>
          <p className="text-muted-foreground">Programma bewerken</p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push(`/coach/dashboard/workouts/programs/${programId}/assign`)}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Toewijzen
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Opslaan
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Program info */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-lg">Programma Info</h3>

            {/* Banner */}
            <div>
              <Label>Banner</Label>
              <div className="mt-2">
                <div className="w-full h-36 rounded-lg overflow-hidden bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  {bannerUrl ? (
                    <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-white/30" />
                  )}
                </div>
                <label className="mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-card border border-border rounded-lg cursor-pointer hover:bg-secondary/50">
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  <span className="text-sm">{isUploading ? "Uploaden..." : "Wijzig banner"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} disabled={isUploading} />
                </label>
              </div>
            </div>

            <div>
              <Label>Naam</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
            </div>

            <div>
              <Label>Beschrijving</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1" />
            </div>

            {/* Stats */}
            <div className="pt-2 border-t space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Blokken</span>
                <span className="font-medium text-foreground">{blocks.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Totaal workouts</span>
                <span className="font-medium text-foreground">
                  {blocks.reduce((sum: number, b: any) => sum + (b.block_workouts?.length || 0), 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Blocks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Blokken / Fases</h3>
            <Button variant="outline" size="sm" onClick={handleAddBlock}>
              <Plus className="w-4 h-4 mr-1" />
              Blok Toevoegen
            </Button>
          </div>

          {blocks.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Dumbbell className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Voeg een blok toe om workouts te organiseren</p>
                <Button variant="outline" size="sm" onClick={handleAddBlock} className="mt-4">
                  <Plus className="w-4 h-4 mr-1" />
                  Eerste Blok
                </Button>
              </CardContent>
            </Card>
          )}

          {blocks.map((block: any, blockIndex: number) => (
            <Card key={block.id} className="overflow-hidden">
              {/* Block header */}
              <div
                className="flex items-center gap-3 px-4 py-3 bg-secondary/50 border-b cursor-pointer"
                onClick={() => toggleBlock(block.id)}
              >
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMoveBlock(blockIndex, "up") }}
                    disabled={blockIndex === 0}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMoveBlock(blockIndex, "down") }}
                    disabled={blockIndex === blocks.length - 1}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <Badge variant="secondary" className="font-mono">{blockIndex + 1}</Badge>

                <div className="flex-1 min-w-0">
                  <span className="font-medium text-sm">{block.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {block.duration_weeks} weken · {block.block_workouts?.length || 0} workouts
                  </span>
                </div>

                <Button
                  variant="ghost" size="sm"
                  className="text-red-600 hover:bg-red-50"
                  onClick={(e) => { e.stopPropagation(); handleDeleteBlock(block.id) }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {expandedBlocks.has(block.id) && (
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Bloknaam</Label>
                      <Input
                        defaultValue={block.name}
                        onBlur={(e) => handleUpdateBlock(block.id, { name: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Duur (weken)</Label>
                      <Input
                        type="number" min={1} max={52}
                        defaultValue={block.duration_weeks}
                        onBlur={(e) => handleUpdateBlock(block.id, { durationWeeks: parseInt(e.target.value) || 4 })}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Beschrijving</Label>
                    <Textarea
                      defaultValue={block.description || ""}
                      onBlur={(e) => handleUpdateBlock(block.id, { description: e.target.value })}
                      rows={2}
                      className="mt-1"
                    />
                  </div>

                  {/* Workouts */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Workouts</Label>
                      <Select onValueChange={(val) => handleAddWorkout(block.id, val)}>
                        <SelectTrigger className="w-[220px] h-8 text-sm">
                          <SelectValue placeholder="+ Workout toevoegen" />
                        </SelectTrigger>
                        <SelectContent>
                          {templates.map((t) => (
                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {(!block.block_workouts || block.block_workouts.length === 0) && (
                      <p className="text-sm text-muted-foreground text-center py-4">Nog geen workouts</p>
                    )}

                    <div className="space-y-2">
                      {(block.block_workouts || []).map((bw: any, wIndex: number) => (
                        <div
                          key={bw.id}
                          className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg"
                        >
                          <div className="flex flex-col gap-0.5">
                            <button
                              onClick={() => handleMoveWorkout(block.id, wIndex, "up")}
                              disabled={wIndex === 0}
                              className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                            >
                              <ChevronUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleMoveWorkout(block.id, wIndex, "down")}
                              disabled={wIndex === (block.block_workouts?.length || 0) - 1}
                              className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                            >
                              <ChevronDown className="w-3 h-3" />
                            </button>
                          </div>

                          <Dumbbell className="w-4 h-4 text-muted-foreground flex-shrink-0" />

                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium">
                              {bw.workout_templates?.name || "Onbekende template"}
                            </span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {bw.workout_templates?.workout_template_exercises?.length || 0} oefeningen
                            </span>
                          </div>

                          {bw.day_of_week && (
                            <Badge variant="outline" className="text-xs">
                              {DAY_LABELS[bw.day_of_week]}
                            </Badge>
                          )}

                          <button
                            onClick={() => handleRemoveWorkout(bw.id)}
                            className="text-muted-foreground hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
