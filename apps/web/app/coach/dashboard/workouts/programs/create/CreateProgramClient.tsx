"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  saveProgramFromBuilder,
  uploadProgramBanner,
  getWorkoutTemplatesForProgram,
} from "@/app/actions/training-programs"
import { getExercises } from "@/app/actions/exercises"
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
  Search,
  GripVertical,
  Video,
  Coffee,
  Flame,
  Wind,
  X,
  FileDown,
  Moon,
} from "lucide-react"

// ============================================
// Types
// ============================================

type ProgramExercise = {
  tempId: string
  exerciseId: string
  exerciseName: string
  exerciseCategory: string
  thumbnailUrl: string | null
  gifUrl: string | null
  section: "warm_up" | "workout" | "cool_down"
  sets: number | null
  reps: string
  restSeconds: number | null
  notes: string
  intensityType: "weight" | "rpe" | "rir" | "bodyweight" | "percentage"
  prescribedWeightKg: number | null
  prescribedRpe: number | null
  prescribedRir: number | null
  prescribedPercentage: number | null
  tempo: string
}

type ProgramDay = {
  tempId: string
  name: string
  isRestDay: boolean
  instructions: string
  dayOfWeek: number | null
  exercises: ProgramExercise[]
}

type ProgramBlock = {
  tempId: string
  name: string
  description: string
  durationWeeks: number
  days: ProgramDay[]
}

type LibraryExercise = {
  id: string
  name: string
  category: string
  thumbnailUrl: string | null
  gifUrl: string | null
  videoUrl: string | null
}

type WorkoutTemplate = {
  id: string
  name: string
  description: string | null
  duration_minutes: number | null
  workout_template_exercises: Array<{
    id: string
    order_index: number
    sets: number | null
    reps: string | null
    rest_seconds: number | null
    notes: string | null
    intensity_type: string | null
    prescribed_weight_kg: number | null
    prescribed_rpe: number | null
    prescribed_rir: number | null
    prescribed_percentage: number | null
    tempo: string | null
    section: string | null
    exercises: {
      id: string
      name: string
      category: string
      thumbnail_url: string | null
      gif_url: string | null
    }
  }>
}

// ============================================
// Helpers
// ============================================

function makeId() {
  return `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function createEmptyDay(index: number): ProgramDay {
  return {
    tempId: makeId(),
    name: "",
    isRestDay: false,
    instructions: "",
    dayOfWeek: null,
    exercises: [],
  }
}

function createDefaultBlock(): ProgramBlock {
  return {
    tempId: "default",
    name: "Programma",
    description: "",
    durationWeeks: 4,
    days: [createEmptyDay(0)],
  }
}

const SECTION_ORDER: Array<"warm_up" | "workout" | "cool_down"> = [
  "warm_up",
  "workout",
  "cool_down",
]

const SECTION_META: Record<
  string,
  { label: string; icon: typeof Flame; color: string; bg: string }
> = {
  warm_up: {
    label: "Warm Up",
    icon: Flame,
    color: "text-orange-600",
    bg: "bg-orange-50 border-orange-200",
  },
  workout: {
    label: "Workout",
    icon: Dumbbell,
    color: "text-purple-600",
    bg: "bg-purple-50 border-purple-200",
  },
  cool_down: {
    label: "Cool Down",
    icon: Wind,
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
  },
}

const EXERCISE_LETTER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

// ============================================
// Component
// ============================================

export default function CreateProgramClient() {
  const router = useRouter()

  // Program state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [bannerUrl, setBannerUrl] = useState<string | null>(null)
  const [bannerStoragePath, setBannerStoragePath] = useState<string | null>(null)
  const [useBlocks, setUseBlocks] = useState(false)
  const [blocks, setBlocks] = useState<ProgramBlock[]>([createDefaultBlock()])

  // UI state
  const [activeBlockIndex, setActiveBlockIndex] = useState(0)
  const [activeDayIndex, setActiveDayIndex] = useState(0)
  const [activeSection, setActiveSection] = useState<"warm_up" | "workout" | "cool_down">("workout")
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Exercise library
  const [exercises, setExercises] = useState<LibraryExercise[]>([])
  const [exerciseSearch, setExerciseSearch] = useState("")
  const [exerciseCategoryFilter, setExerciseCategoryFilter] = useState("all")

  // Import template modal
  const [showImportModal, setShowImportModal] = useState(false)
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([])

  // Add day dropdown
  const [showAddDayMenu, setShowAddDayMenu] = useState(false)

  // Video preview
  const [previewExercise, setPreviewExercise] = useState<LibraryExercise | null>(null)

  // ---- Data loading ----
  useEffect(() => {
    loadExercises()
    loadTemplates()
  }, [])

  const loadExercises = async () => {
    const result = await getExercises()
    if (result.success && result.exercises) {
      setExercises(
        result.exercises.map((e: any) => ({
          id: e.id,
          name: e.name,
          category: e.category || "STRENGTH",
          thumbnailUrl: e.thumbnailUrl || null,
          gifUrl: e.gifUrl || null,
          videoUrl: e.videoUrl || null,
        }))
      )
    }
  }

  const loadTemplates = async () => {
    const result = await getWorkoutTemplatesForProgram()
    if (result.success && result.templates) {
      setTemplates(result.templates as WorkoutTemplate[])
    }
  }

  // ---- Derived state ----
  const currentBlock = blocks[activeBlockIndex] || blocks[0]
  const currentDay = currentBlock?.days[activeDayIndex]

  const filteredExercises = useMemo(() => {
    let list = exercises
    if (exerciseCategoryFilter !== "all") {
      list = list.filter(
        (e) => e.category.toUpperCase() === exerciseCategoryFilter.toUpperCase()
      )
    }
    if (exerciseSearch.trim()) {
      const q = exerciseSearch.toLowerCase()
      list = list.filter((e) => e.name.toLowerCase().includes(q))
    }
    return list
  }, [exercises, exerciseSearch, exerciseCategoryFilter])

  const exerciseCategories = useMemo(() => {
    const cats = new Set(exercises.map((e) => e.category))
    return Array.from(cats).sort()
  }, [exercises])

  // ---- Block helpers ----
  const updateBlocks = (fn: (blocks: ProgramBlock[]) => ProgramBlock[]) => {
    setBlocks(fn)
  }

  const addBlock = () => {
    updateBlocks((prev) => [
      ...prev,
      {
        tempId: makeId(),
        name: `Blok ${prev.length + 1}`,
        description: "",
        durationWeeks: 4,
        days: [createEmptyDay(0)],
      },
    ])
    setActiveBlockIndex(blocks.length)
    setActiveDayIndex(0)
  }

  const removeBlock = (index: number) => {
    if (blocks.length <= 1) return
    updateBlocks((prev) => prev.filter((_, i) => i !== index))
    if (activeBlockIndex >= blocks.length - 1) {
      setActiveBlockIndex(Math.max(0, blocks.length - 2))
    }
    setActiveDayIndex(0)
  }

  const updateBlockField = (
    blockIndex: number,
    field: keyof ProgramBlock,
    value: any
  ) => {
    updateBlocks((prev) =>
      prev.map((b, i) => (i === blockIndex ? { ...b, [field]: value } : b))
    )
  }

  // ---- Day helpers ----
  const addDay = (restDay = false) => {
    updateBlocks((prev) =>
      prev.map((b, bi) => {
        if (bi !== activeBlockIndex) return b
        const newDay: ProgramDay = {
          ...createEmptyDay(b.days.length),
          isRestDay: restDay,
        }
        return { ...b, days: [...b.days, newDay] }
      })
    )
    setActiveDayIndex(currentBlock.days.length)
    setShowAddDayMenu(false)
  }

  const removeDay = (dayIndex: number) => {
    if (currentBlock.days.length <= 1) return
    updateBlocks((prev) =>
      prev.map((b, bi) => {
        if (bi !== activeBlockIndex) return b
        return { ...b, days: b.days.filter((_, i) => i !== dayIndex) }
      })
    )
    if (activeDayIndex >= currentBlock.days.length - 1) {
      setActiveDayIndex(Math.max(0, currentBlock.days.length - 2))
    }
  }

  const updateDayField = (field: keyof ProgramDay, value: any) => {
    updateBlocks((prev) =>
      prev.map((b, bi) => {
        if (bi !== activeBlockIndex) return b
        return {
          ...b,
          days: b.days.map((d, di) =>
            di === activeDayIndex ? { ...d, [field]: value } : d
          ),
        }
      })
    )
  }

  // ---- Exercise helpers ----
  const addExerciseToDay = (
    exercise: LibraryExercise,
    section: "warm_up" | "workout" | "cool_down" = activeSection
  ) => {
    const newExercise: ProgramExercise = {
      tempId: makeId(),
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      exerciseCategory: exercise.category,
      thumbnailUrl: exercise.thumbnailUrl,
      gifUrl: exercise.gifUrl,
      section,
      sets: 3,
      reps: "10",
      restSeconds: 90,
      notes: "",
      intensityType: "weight",
      prescribedWeightKg: null,
      prescribedRpe: null,
      prescribedRir: null,
      prescribedPercentage: null,
      tempo: "",
    }

    updateBlocks((prev) =>
      prev.map((b, bi) => {
        if (bi !== activeBlockIndex) return b
        return {
          ...b,
          days: b.days.map((d, di) => {
            if (di !== activeDayIndex) return d
            return { ...d, exercises: [...d.exercises, newExercise] }
          }),
        }
      })
    )
    setActiveSection(section)
  }

  const removeExercise = (tempId: string) => {
    updateBlocks((prev) =>
      prev.map((b, bi) => {
        if (bi !== activeBlockIndex) return b
        return {
          ...b,
          days: b.days.map((d, di) => {
            if (di !== activeDayIndex) return d
            return { ...d, exercises: d.exercises.filter((e) => e.tempId !== tempId) }
          }),
        }
      })
    )
  }

  const updateExerciseField = (
    tempId: string,
    field: keyof ProgramExercise,
    value: any
  ) => {
    updateBlocks((prev) =>
      prev.map((b, bi) => {
        if (bi !== activeBlockIndex) return b
        return {
          ...b,
          days: b.days.map((d, di) => {
            if (di !== activeDayIndex) return d
            return {
              ...d,
              exercises: d.exercises.map((e) =>
                e.tempId === tempId ? { ...e, [field]: value } : e
              ),
            }
          }),
        }
      })
    )
  }

  const moveExercise = (
    tempId: string,
    direction: "up" | "down"
  ) => {
    updateBlocks((prev) =>
      prev.map((b, bi) => {
        if (bi !== activeBlockIndex) return b
        return {
          ...b,
          days: b.days.map((d, di) => {
            if (di !== activeDayIndex) return d
            const idx = d.exercises.findIndex((e) => e.tempId === tempId)
            if (idx === -1) return d
            const newIdx = direction === "up" ? idx - 1 : idx + 1
            if (newIdx < 0 || newIdx >= d.exercises.length) return d
            // Only allow movement within same section
            if (d.exercises[newIdx].section !== d.exercises[idx].section) return d
            const newExercises = [...d.exercises]
            ;[newExercises[idx], newExercises[newIdx]] = [
              newExercises[newIdx],
              newExercises[idx],
            ]
            return { ...d, exercises: newExercises }
          }),
        }
      })
    )
  }

  // ---- Import template ----
  const importTemplate = (template: WorkoutTemplate) => {
    const importedExercises: ProgramExercise[] = (
      template.workout_template_exercises || []
    )
      .sort((a, b) => a.order_index - b.order_index)
      .map((wte) => ({
        tempId: makeId(),
        exerciseId: wte.exercises.id,
        exerciseName: wte.exercises.name,
        exerciseCategory: wte.exercises.category,
        thumbnailUrl: wte.exercises.thumbnail_url,
        gifUrl: wte.exercises.gif_url,
        section: (wte.section as any) || "workout",
        sets: wte.sets,
        reps: wte.reps || "10",
        restSeconds: wte.rest_seconds,
        notes: wte.notes || "",
        intensityType: (wte.intensity_type as any) || "weight",
        prescribedWeightKg: wte.prescribed_weight_kg,
        prescribedRpe: wte.prescribed_rpe,
        prescribedRir: wte.prescribed_rir,
        prescribedPercentage: wte.prescribed_percentage,
        tempo: wte.tempo || "",
      }))

    // Add as a new day with the template's exercises
    const newDay: ProgramDay = {
      tempId: makeId(),
      name: template.name,
      isRestDay: false,
      instructions: template.description || "",
      dayOfWeek: null,
      exercises: importedExercises,
    }

    updateBlocks((prev) =>
      prev.map((b, bi) => {
        if (bi !== activeBlockIndex) return b
        return { ...b, days: [...b.days, newDay] }
      })
    )
    setActiveDayIndex(currentBlock.days.length)
    setShowImportModal(false)
  }

  // ---- Banner upload ----
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
        setBannerStoragePath(result.storagePath || null)
      }
    } catch {}
    setIsUploading(false)
  }

  // ---- Save ----
  const handleSave = async () => {
    if (!name.trim()) {
      alert("Vul een programmanaam in")
      return
    }

    // Validate: each non-rest day needs a name
    for (const block of blocks) {
      for (let i = 0; i < block.days.length; i++) {
        const day = block.days[i]
        if (!day.isRestDay && day.exercises.length === 0) {
          // Allow empty days but warn
        }
      }
    }

    setIsSaving(true)
    try {
      const result = await saveProgramFromBuilder({
        name: name.trim(),
        description: description.trim() || undefined,
        tags: tags.trim() || undefined,
        bannerUrl: bannerUrl || undefined,
        bannerStoragePath: bannerStoragePath || undefined,
        useBlocks,
        blocks: blocks.map((b) => ({
          name: b.name,
          description: b.description || undefined,
          durationWeeks: b.durationWeeks,
          days: b.days.map((d, di) => ({
            name: d.name || `Day ${di + 1}`,
            isRestDay: d.isRestDay,
            instructions: d.instructions || undefined,
            dayOfWeek: d.dayOfWeek || undefined,
            exercises: d.exercises.map((e) => ({
              exerciseId: e.exerciseId,
              section: e.section,
              sets: e.sets || undefined,
              reps: e.reps || undefined,
              restSeconds: e.restSeconds || undefined,
              notes: e.notes || undefined,
              intensityType: e.intensityType || undefined,
              prescribedWeightKg: e.prescribedWeightKg || undefined,
              prescribedRpe: e.prescribedRpe || undefined,
              prescribedRir: e.prescribedRir || undefined,
              prescribedPercentage: e.prescribedPercentage || undefined,
              tempo: e.tempo || undefined,
            })),
          })),
        })),
      })

      if (result.success && result.programId) {
        router.push(`/coach/dashboard/workouts/programs/${result.programId}`)
      } else {
        alert(result.error || "Fout bij opslaan")
      }
    } catch (err: any) {
      alert(err.message || "Er is een fout opgetreden")
    } finally {
      setIsSaving(false)
    }
  }

  // ============================================
  // Render
  // ============================================

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-card border-b px-6 py-3 flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Terug
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-bold">Create a Program</h1>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving || !name.trim()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save & Close
        </Button>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
        {/* Program Info */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Banner */}
              <div>
                <Label className="text-sm font-medium text-foreground">Banner</Label>
                <div className="mt-2 relative">
                  <div className="w-full h-32 rounded-lg overflow-hidden bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                    {bannerUrl ? (
                      <img
                        src={bannerUrl}
                        alt="Banner"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-white/30" />
                    )}
                  </div>
                  <label className="mt-2 flex items-center justify-center gap-2 px-3 py-1.5 bg-card border rounded-md cursor-pointer hover:bg-secondary/50 text-sm">
                    {isUploading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    {isUploading ? "Uploading..." : "Upload"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleBannerUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>

              {/* Name & Tags */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Program Title *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. The Comeback Program"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g. strength, hypertrophy, 4-days"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="desc">Program Overview</Label>
                <Textarea
                  id="desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the program goals and structure..."
                  rows={5}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Use blocks toggle */}
            <div className="mt-4 flex items-center gap-3 pt-4 border-t">
              <Switch
                checked={useBlocks}
                onCheckedChange={(checked) => {
                  setUseBlocks(checked)
                  if (checked && blocks.length === 1 && blocks[0].tempId === "default") {
                    updateBlockField(0, "name", "Block 1")
                  }
                }}
              />
              <div>
                <span className="text-sm font-medium">
                  Use blocks / phases
                </span>
                <span className="text-xs text-muted-foreground ml-2">
                  For periodization (e.g. Foundation → Strength → Peak)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Block selector (if useBlocks) */}
        {useBlocks && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 flex-wrap">
                {blocks.map((block, bi) => (
                  <div key={block.tempId} className="flex items-center">
                    <button
                      onClick={() => {
                        setActiveBlockIndex(bi)
                        setActiveDayIndex(0)
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        bi === activeBlockIndex
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground hover:bg-secondary"
                      }`}
                    >
                      {block.name}
                    </button>
                    {blocks.length > 1 && (
                      <button
                        onClick={() => removeBlock(bi)}
                        className="ml-1 text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addBlock}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Block
                </Button>
              </div>

              {/* Block settings */}
              <div className="mt-3 grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs">Block Name</Label>
                  <Input
                    value={currentBlock.name}
                    onChange={(e) =>
                      updateBlockField(activeBlockIndex, "name", e.target.value)
                    }
                    className="mt-1 h-8 text-sm"
                    placeholder="e.g. Foundation"
                  />
                </div>
                <div>
                  <Label className="text-xs">Duration (weeks)</Label>
                  <Input
                    type="number"
                    min={1}
                    max={52}
                    value={currentBlock.durationWeeks}
                    onChange={(e) =>
                      updateBlockField(
                        activeBlockIndex,
                        "durationWeeks",
                        parseInt(e.target.value) || 4
                      )
                    }
                    className="mt-1 h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Description</Label>
                  <Input
                    value={currentBlock.description}
                    onChange={(e) =>
                      updateBlockField(activeBlockIndex, "description", e.target.value)
                    }
                    className="mt-1 h-8 text-sm"
                    placeholder="Focus of this block..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main builder area */}
        <div className="flex gap-6">
          {/* Left: Day tabs + content */}
          <div className="flex-1 min-w-0">
            {/* Day tabs */}
            <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-1">
              {currentBlock.days.map((day, di) => (
                <div key={day.tempId} className="flex items-center group">
                  <button
                    onClick={() => setActiveDayIndex(di)}
                    className={`px-4 py-2 rounded-t-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      di === activeDayIndex
                        ? "bg-card text-primary border border-b-0 border-border shadow-sm"
                        : "bg-secondary text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {day.isRestDay && <Moon className="w-3.5 h-3.5 text-muted-foreground" />}
                    {day.name || `Day ${di + 1}`}
                    {day.isRestDay && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 ml-1">
                        Rest
                      </Badge>
                    )}
                  </button>
                  {currentBlock.days.length > 1 && (
                    <button
                      onClick={() => removeDay(di)}
                      className="ml-0.5 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}

              {/* Add day dropdown */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddDayMenu(!showAddDayMenu)}
                  className="h-9 px-3"
                >
                  <Plus className="w-4 h-4" />
                </Button>

                {showAddDayMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowAddDayMenu(false)}
                    />
                    <div className="absolute top-full left-0 mt-1 bg-card border rounded-lg shadow-lg z-20 py-1 w-48">
                      <button
                        onClick={() => addDay(false)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-secondary/50 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4 text-muted-foreground" />
                        Create New Day
                      </button>
                      <button
                        onClick={() => {
                          setShowAddDayMenu(false)
                          setShowImportModal(true)
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-secondary/50 flex items-center gap-2"
                      >
                        <FileDown className="w-4 h-4 text-muted-foreground" />
                        Import From Template
                      </button>
                      <button
                        onClick={() => addDay(true)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-secondary/50 flex items-center gap-2"
                      >
                        <Coffee className="w-4 h-4 text-muted-foreground" />
                        Add Rest Day
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Day content */}
            {currentDay && (
              <Card className="border-t-0 rounded-tl-none">
                <CardContent className="p-5 space-y-5">
                  {/* Day name */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Day Name</Label>
                      <Input
                        value={currentDay.name}
                        onChange={(e) => updateDayField("name", e.target.value)}
                        placeholder={`Day ${activeDayIndex + 1}`}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {currentDay.isRestDay ? (
                    /* Rest day display */
                    <div className="py-12 text-center">
                      <Coffee className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-muted-foreground">Rest Day</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Recovery and regeneration
                      </p>
                    </div>
                  ) : (
                    /* Sections with exercises */
                    <div className="space-y-4">
                      {SECTION_ORDER.map((sectionKey) => {
                        const meta = SECTION_META[sectionKey]
                        const Icon = meta.icon
                        const sectionExercises = (currentDay.exercises || []).filter(
                          (e) => e.section === sectionKey
                        )

                        let globalExerciseIndex = 0
                        for (const sk of SECTION_ORDER) {
                          if (sk === sectionKey) break
                          globalExerciseIndex += (currentDay.exercises || []).filter(
                            (e) => e.section === sk
                          ).length
                        }

                        return (
                          <div key={sectionKey}>
                            {/* Section header */}
                            <button
                              onClick={() => setActiveSection(sectionKey)}
                              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                                activeSection === sectionKey
                                  ? meta.bg
                                  : "bg-secondary/50 border-border"
                              }`}
                            >
                              <Icon className={`w-4 h-4 ${meta.color}`} />
                              <span className={meta.color}>{meta.label}</span>
                              {sectionExercises.length > 0 && (
                                <Badge variant="secondary" className="ml-auto text-xs">
                                  {sectionExercises.length}
                                </Badge>
                              )}
                            </button>

                            {/* Exercise rows */}
                            <div className="mt-2 space-y-2">
                              {sectionExercises.map((exercise, localIdx) => {
                                const letterIdx = globalExerciseIndex + localIdx
                                return (
                                  <ExerciseRow
                                    key={exercise.tempId}
                                    exercise={exercise}
                                    letter={EXERCISE_LETTER[letterIdx] || ""}
                                    onUpdate={(field, value) =>
                                      updateExerciseField(exercise.tempId, field, value)
                                    }
                                    onRemove={() => removeExercise(exercise.tempId)}
                                    onMoveUp={() => moveExercise(exercise.tempId, "up")}
                                    onMoveDown={() => moveExercise(exercise.tempId, "down")}
                                    isFirst={localIdx === 0}
                                    isLast={localIdx === sectionExercises.length - 1}
                                    onPreview={() => {
                                      const lib = exercises.find(
                                        (e) => e.id === exercise.exerciseId
                                      )
                                      if (lib) setPreviewExercise(lib)
                                    }}
                                  />
                                )
                              })}

                              {/* Add exercise placeholder */}
                              <button
                                onClick={() => setActiveSection(sectionKey)}
                                className={`w-full py-3 border-2 border-dashed rounded-lg text-sm flex items-center justify-center gap-2 transition-colors ${
                                  activeSection === sectionKey
                                    ? "border-purple-300 text-purple-500 bg-purple-50/50"
                                    : "border-border text-muted-foreground hover:border-border"
                                }`}
                              >
                                <Plus className="w-4 h-4" />
                                Add an Exercise
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Day instructions */}
                  {!currentDay.isRestDay && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Instructions / Notes</Label>
                      <Textarea
                        value={currentDay.instructions}
                        onChange={(e) => updateDayField("instructions", e.target.value)}
                        placeholder="Optional coaching notes for this day..."
                        rows={2}
                        className="mt-1 text-sm"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Exercise Library */}
          <div className="w-72 flex-shrink-0 hidden lg:block">
            <div className="sticky top-[73px]">
              <Card className="overflow-hidden">
                <div className="p-3 border-b bg-secondary/50">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-muted-foreground" />
                    Exercise Library
                  </h3>
                  <div className="mt-2 relative">
                    <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      value={exerciseSearch}
                      onChange={(e) => setExerciseSearch(e.target.value)}
                      placeholder="Search exercises..."
                      className="pl-8 h-8 text-sm"
                    />
                  </div>
                  <div className="mt-2">
                    <Select
                      value={exerciseCategoryFilter}
                      onValueChange={setExerciseCategoryFilter}
                    >
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {exerciseCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
                  {filteredExercises.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-6">
                      No exercises found
                    </p>
                  )}
                  {filteredExercises.map((exercise) => (
                    <button
                      key={exercise.id}
                      onClick={() => addExerciseToDay(exercise)}
                      className="w-full px-3 py-2.5 text-left hover:bg-purple-50 border-b border-border flex items-center gap-3 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {exercise.thumbnailUrl ? (
                          <img
                            src={exercise.thumbnailUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Dumbbell className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                          {exercise.name}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {exercise.category.toLowerCase()}
                        </p>
                      </div>
                      <Plus className="w-4 h-4 text-muted-foreground/50 group-hover:text-purple-500 transition-colors flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Import Template Modal */}
      <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Import From Template</DialogTitle>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto space-y-2 mt-2">
            {templates.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">
                No workout templates available
              </p>
            )}
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => importTemplate(template)}
                className="w-full p-3 text-left border rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{template.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {template.workout_template_exercises?.length || 0} exercises
                  </Badge>
                </div>
                {template.description && (
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {template.description}
                  </p>
                )}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Preview Modal */}
      <Dialog
        open={!!previewExercise}
        onOpenChange={() => setPreviewExercise(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{previewExercise?.name}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
            {previewExercise?.gifUrl ? (
              <img
                src={previewExercise.gifUrl}
                alt={previewExercise.name}
                className="max-w-full max-h-full object-contain"
              />
            ) : previewExercise?.videoUrl ? (
              <video
                src={previewExercise.videoUrl}
                controls
                autoPlay
                className="max-w-full max-h-full"
              />
            ) : (
              <p className="text-muted-foreground text-sm">No video available</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ============================================
// ExerciseRow Component
// ============================================

function ExerciseRow({
  exercise,
  letter,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  onPreview,
}: {
  exercise: ProgramExercise
  letter: string
  onUpdate: (field: keyof ProgramExercise, value: any) => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
  onPreview: () => void
}) {
  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      {/* Top row: handle, letter, name, actions */}
      <div className="flex items-center gap-2 px-3 py-2 bg-secondary/30 border-b">
        <div className="flex flex-col gap-0.5">
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            className="text-muted-foreground hover:text-muted-foreground disabled:opacity-20"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            className="text-muted-foreground hover:text-muted-foreground disabled:opacity-20"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        <span className="w-6 h-6 rounded bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center flex-shrink-0">
          {letter}
        </span>

        <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center flex-shrink-0 overflow-hidden">
          {exercise.thumbnailUrl ? (
            <img
              src={exercise.thumbnailUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <Dumbbell className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </div>

        <span className="text-sm font-semibold flex-1 min-w-0 truncate">
          {exercise.exerciseName}
        </span>

        {(exercise.gifUrl || exercise.thumbnailUrl) && (
          <button
            onClick={onPreview}
            className="text-muted-foreground hover:text-purple-600 transition-colors"
          >
            <Video className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={onRemove}
          className="text-muted-foreground hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Fields */}
      <div className="px-3 py-2.5 space-y-2">
        {/* Row 1: Sets, Reps, Rest */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-muted-foreground w-8">Sets</label>
            <Input
              type="number"
              min={0}
              value={exercise.sets ?? ""}
              onChange={(e) =>
                onUpdate("sets", e.target.value ? parseInt(e.target.value) : null)
              }
              className="w-16 h-7 text-sm text-center"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-muted-foreground w-8">Reps</label>
            <Input
              value={exercise.reps}
              onChange={(e) => onUpdate("reps", e.target.value)}
              className="w-20 h-7 text-sm text-center"
              placeholder="10-12"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-muted-foreground w-8">Rest</label>
            <Input
              type="number"
              min={0}
              value={exercise.restSeconds ?? ""}
              onChange={(e) =>
                onUpdate(
                  "restSeconds",
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              className="w-16 h-7 text-sm text-center"
              placeholder="sec"
            />
            <span className="text-xs text-muted-foreground">s</span>
          </div>
        </div>

        {/* Row 2: RIR, RPE, Intensity, Tempo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-muted-foreground w-8">RIR</label>
            <Input
              type="number"
              min={0}
              max={10}
              value={exercise.prescribedRir ?? ""}
              onChange={(e) =>
                onUpdate(
                  "prescribedRir",
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              className="w-14 h-7 text-sm text-center"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-muted-foreground w-8">RPE</label>
            <Input
              type="number"
              min={0}
              max={10}
              value={exercise.prescribedRpe ?? ""}
              onChange={(e) =>
                onUpdate(
                  "prescribedRpe",
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              className="w-14 h-7 text-sm text-center"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-muted-foreground w-6">kg</label>
            <Input
              type="number"
              min={0}
              value={exercise.prescribedWeightKg ?? ""}
              onChange={(e) =>
                onUpdate(
                  "prescribedWeightKg",
                  e.target.value ? parseFloat(e.target.value) : null
                )
              }
              className="w-16 h-7 text-sm text-center"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-muted-foreground">Tempo</label>
            <Input
              value={exercise.tempo}
              onChange={(e) => onUpdate("tempo", e.target.value)}
              className="w-24 h-7 text-sm text-center"
              placeholder="3-1-2-0"
            />
          </div>
        </div>

        {/* Row 3: Notes */}
        <div className="flex items-center gap-1.5">
          <label className="text-xs text-muted-foreground w-8">Notes</label>
          <Input
            value={exercise.notes}
            onChange={(e) => onUpdate("notes", e.target.value)}
            className="h-7 text-sm flex-1"
            placeholder="Coaching cues, tempo notes..."
          />
        </div>
      </div>
    </div>
  )
}
