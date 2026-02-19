"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Pencil, Trash2, Video, Dumbbell, Filter } from "lucide-react"
import {
  getExercises,
  createExercise,
  updateExercise,
  deleteExercise,
  getExerciseCategories,
  getDifficultyLevels,
  getMuscleGroups,
  uploadExerciseMedia,
} from "@/app/actions/exercises"
import { toast } from "sonner"

type Exercise = {
  id: string
  name: string
  description?: string | null
  category: string
  difficulty?: string | null
  muscleGroups?: string[] | null
  equipmentNeeded?: string | null
  cues?: string | null
  videoUrl?: string | null
  thumbnailUrl?: string | null
  videoStoragePath?: string | null
  imageStoragePath?: string | null
  isPublic: boolean
  creator?: {
    profile?: {
      firstName: string
      lastName: string
    } | null
  }
}

export default function ExerciseLibraryClient() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all")
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([])

  const [categories, setCategories] = useState<string[]>([])
  const [difficulties, setDifficulties] = useState<string[]>([])
  const [muscleGroups, setMuscleGroups] = useState<string[]>([])

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    difficulty: "BEGINNER",
    muscleGroups: [] as string[],
    equipmentNeeded: "",
    cues: "",
  })
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [exercises, searchQuery, categoryFilter, difficultyFilter, selectedMuscleGroups])

  async function loadData() {
    try {
      setLoading(true)
      const [exercisesRes, categoriesRes, difficultiesRes, muscleGroupsRes] =
        await Promise.all([
          getExercises(),
          getExerciseCategories(),
          getDifficultyLevels(),
          getMuscleGroups(),
        ])

      if (exercisesRes.success) {
        setExercises(exercisesRes.exercises || [])
      }
      if (categoriesRes.success) {
        setCategories(categoriesRes.categories || [])
      }
      if (difficultiesRes.success) {
        setDifficulties(difficultiesRes.levels || [])
      }
      if (muscleGroupsRes.success) {
        setMuscleGroups(muscleGroupsRes.muscleGroups || [])
      }
    } catch (error: any) {
      toast.error("Error loading data")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  function applyFilters() {
    let filtered = exercises

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (ex) =>
          ex.name.toLowerCase().includes(query) ||
          ex.description?.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((ex) => ex.category === categoryFilter)
    }

    // Difficulty filter
    if (difficultyFilter !== "all") {
      filtered = filtered.filter((ex) => ex.difficulty === difficultyFilter)
    }

    // Muscle groups filter
    if (selectedMuscleGroups.length > 0) {
      filtered = filtered.filter((ex) => {
        const groups = (ex.muscleGroups as string[]) || []
        return selectedMuscleGroups.some((g) => groups.includes(g))
      })
    }

    setFilteredExercises(filtered)
  }

  function resetForm() {
    setFormData({
      name: "",
      description: "",
      category: "",
      difficulty: "BEGINNER",
      muscleGroups: [],
      equipmentNeeded: "",
      cues: "",
    })
    setVideoFile(null)
    setThumbnailFile(null)
  }

  function openCreateDialog() {
    resetForm()
    setIsCreateDialogOpen(true)
  }

  function openEditDialog(exercise: Exercise) {
    setSelectedExercise(exercise)
    setFormData({
      name: exercise.name,
      description: exercise.description || "",
      category: exercise.category,
      difficulty: exercise.difficulty || "BEGINNER",
      muscleGroups: (exercise.muscleGroups as string[]) || [],
      equipmentNeeded: exercise.equipmentNeeded || "",
      cues: exercise.cues || "",
    })
    setIsEditDialogOpen(true)
  }

  function openDeleteDialog(exercise: Exercise) {
    setSelectedExercise(exercise)
    setIsDeleteDialogOpen(true)
  }

  async function handleCreate() {
    if (!formData.name.trim() || !formData.category) {
      toast.error("Name and category are required")
      return
    }

    setIsSubmitting(true)
    try {
      // Create exercise first
      const result = await createExercise({
        name: formData.name,
        description: formData.description || undefined,
        category: formData.category,
        difficulty: formData.difficulty,
        muscleGroups: formData.muscleGroups,
        equipmentNeeded: formData.equipmentNeeded || undefined,
        cues: formData.cues || undefined,
      })

      if (!result.success || !result.exercise) {
        toast.error(result.error || "Failed to create exercise")
        return
      }

      // Upload media if provided
      if (videoFile || thumbnailFile) {
        const uploadFormData = new FormData()
        uploadFormData.append("exerciseId", result.exercise.id)
        if (videoFile) uploadFormData.append("video", videoFile)
        if (thumbnailFile) uploadFormData.append("thumbnail", thumbnailFile)

        const uploadResult = await uploadExerciseMedia(uploadFormData)

        if (uploadResult.success && uploadResult) {
          // Update exercise with media URLs
          await updateExercise(result.exercise.id, {
            videoUrl: uploadResult.videoUrl,
            videoStoragePath: uploadResult.videoStoragePath,
            thumbnailUrl: uploadResult.thumbnailUrl,
            imageStoragePath: uploadResult.imageStoragePath,
          })
        }
      }

      toast.success("Exercise created successfully")
      setIsCreateDialogOpen(false)
      resetForm()
      await loadData()
    } catch (error: any) {
      toast.error("Error creating exercise")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleUpdate() {
    if (!selectedExercise || !formData.name.trim()) {
      toast.error("Name is required")
      return
    }

    setIsSubmitting(true)
    try {
      // Update exercise data
      const result = await updateExercise(selectedExercise.id, {
        name: formData.name,
        description: formData.description || undefined,
        category: formData.category,
        difficulty: formData.difficulty,
        muscleGroups: formData.muscleGroups,
        equipmentNeeded: formData.equipmentNeeded || undefined,
        cues: formData.cues || undefined,
      })

      if (!result.success) {
        toast.error(result.error || "Failed to update exercise")
        return
      }

      // Upload new media if provided
      if (videoFile || thumbnailFile) {
        const uploadFormData = new FormData()
        uploadFormData.append("exerciseId", selectedExercise.id)
        if (videoFile) uploadFormData.append("video", videoFile)
        if (thumbnailFile) uploadFormData.append("thumbnail", thumbnailFile)

        const uploadResult = await uploadExerciseMedia(uploadFormData)

        if (uploadResult.success) {
          await updateExercise(selectedExercise.id, {
            videoUrl: uploadResult.videoUrl || undefined,
            videoStoragePath: uploadResult.videoStoragePath || undefined,
            thumbnailUrl: uploadResult.thumbnailUrl || undefined,
            imageStoragePath: uploadResult.imageStoragePath || undefined,
          })
        }
      }

      toast.success("Exercise updated successfully")
      setIsEditDialogOpen(false)
      resetForm()
      setSelectedExercise(null)
      await loadData()
    } catch (error: any) {
      toast.error("Error updating exercise")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!selectedExercise) return

    setIsSubmitting(true)
    try {
      const result = await deleteExercise(selectedExercise.id)

      if (!result.success) {
        toast.error(result.error || "Failed to delete exercise")
        return
      }

      toast.success("Exercise deleted successfully")
      setIsDeleteDialogOpen(false)
      setSelectedExercise(null)
      await loadData()
    } catch (error: any) {
      toast.error("Error deleting exercise")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  function toggleMuscleGroup(group: string) {
    setFormData((prev) => ({
      ...prev,
      muscleGroups: prev.muscleGroups.includes(group)
        ? prev.muscleGroups.filter((g) => g !== group)
        : [...prev.muscleGroups, group],
    }))
  }

  function toggleFilterMuscleGroup(group: string) {
    setSelectedMuscleGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <Dumbbell className="w-12 h-12 animate-pulse mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Loading exercises...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Oefeningen Bibliotheek</h2>
          <p className="text-sm text-muted-foreground">
            {filteredExercises.length} oefeningen
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Nieuwe Oefening
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white border-gray-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <Label>Zoeken</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Zoek op naam of beschrijving..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-gray-200"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <Label>Categorie</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-white border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty */}
            <div>
              <Label>Moeilijkheid</Label>
              <Select
                value={difficultyFilter}
                onValueChange={setDifficultyFilter}
              >
                <SelectTrigger className="bg-white border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  {difficulties.map((diff) => (
                    <SelectItem key={diff} value={diff}>
                      {diff}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Muscle Groups Filter */}
          {selectedMuscleGroups.length > 0 && (
            <div className="mt-4">
              <Label>Geselecteerde Spiergroepen:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedMuscleGroups.map((group) => (
                  <Badge
                    key={group}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => toggleFilterMuscleGroup(group)}
                  >
                    {group} ×
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Exercise Grid */}
      {filteredExercises.length === 0 ? (
        <Card className="bg-white border-gray-200">
          <CardContent className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
            <Dumbbell className="w-16 h-16 text-muted-foreground" />
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Geen oefeningen gevonden</h3>
              <p className="text-muted-foreground max-w-md">
                {searchQuery || categoryFilter !== "all" || difficultyFilter !== "all"
                  ? "Probeer andere filters"
                  : "Maak je eerste oefening aan"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => (
            <Card
              key={exercise.id}
              className="bg-white border-gray-200 hover:border-gray-300 transition-all"
            >
              <CardHeader className="p-0">
                {exercise.thumbnailUrl || exercise.videoUrl ? (
                  <div className="relative aspect-video rounded-t-lg overflow-hidden bg-muted">
                    {exercise.thumbnailUrl ? (
                      <img
                        src={exercise.thumbnailUrl}
                        alt={exercise.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Video className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-video rounded-t-lg bg-muted flex items-center justify-center">
                    <Dumbbell className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
              </CardHeader>

              <CardContent className="pt-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{exercise.name}</h3>
                  {exercise.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {exercise.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{exercise.category}</Badge>
                  {exercise.difficulty && (
                    <Badge variant="secondary">{exercise.difficulty}</Badge>
                  )}
                  {exercise.isPublic && (
                    <Badge variant="default">Platform</Badge>
                  )}
                </div>

                {exercise.muscleGroups &&
                  (exercise.muscleGroups as string[]).length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {(exercise.muscleGroups as string[]).slice(0, 3).map((group) => (
                        <Badge key={group} variant="outline" className="text-xs">
                          {group}
                        </Badge>
                      ))}
                      {(exercise.muscleGroups as string[]).length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{(exercise.muscleGroups as string[]).length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
              </CardContent>

              <CardFooter className="gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditDialog(exercise)}
                  className="flex-1"
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Bewerken
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => openDeleteDialog(exercise)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nieuwe Oefening</DialogTitle>
            <DialogDescription>
              Voeg een nieuwe oefening toe aan je bibliotheek
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Naam *</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Bijv. Barbell Bench Press"
              />
            </div>

            <div>
              <Label>Beschrijving</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Beschrijf de oefening..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Categorie *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kies categorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Moeilijkheid</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) =>
                    setFormData({ ...formData, difficulty: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((diff) => (
                      <SelectItem key={diff} value={diff}>
                        {diff}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Spiergroepen</Label>
              <div className="flex flex-wrap gap-2 mt-2 max-h-40 overflow-y-auto p-2 border rounded-md">
                {muscleGroups.map((group) => (
                  <Badge
                    key={group}
                    variant={
                      formData.muscleGroups.includes(group)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => toggleMuscleGroup(group)}
                  >
                    {group}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label>Benodigde Apparatuur</Label>
              <Input
                value={formData.equipmentNeeded}
                onChange={(e) =>
                  setFormData({ ...formData, equipmentNeeded: e.target.value })
                }
                placeholder="Bijv. Barbell, Bench"
              />
            </div>

            <div>
              <Label>Uitvoerings Cues</Label>
              <Textarea
                value={formData.cues}
                onChange={(e) =>
                  setFormData({ ...formData, cues: e.target.value })
                }
                placeholder="Techniek instructies..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Video</Label>
                <Input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                />
              </div>

              <div>
                <Label>Thumbnail</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setThumbnailFile(e.target.files?.[0] || null)
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
              disabled={isSubmitting}
            >
              Annuleren
            </Button>
            <Button onClick={handleCreate} disabled={isSubmitting}>
              {isSubmitting ? "Aanmaken..." : "Aanmaken"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog - Similar structure to Create */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Oefening Bewerken</DialogTitle>
            <DialogDescription>
              Wijzig de details van deze oefening
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Same form fields as Create Dialog */}
            <div>
              <Label>Naam *</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Bijv. Barbell Bench Press"
              />
            </div>

            <div>
              <Label>Beschrijving</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Beschrijf de oefening..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Categorie *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kies categorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Moeilijkheid</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) =>
                    setFormData({ ...formData, difficulty: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((diff) => (
                      <SelectItem key={diff} value={diff}>
                        {diff}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Spiergroepen</Label>
              <div className="flex flex-wrap gap-2 mt-2 max-h-40 overflow-y-auto p-2 border rounded-md">
                {muscleGroups.map((group) => (
                  <Badge
                    key={group}
                    variant={
                      formData.muscleGroups.includes(group)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => toggleMuscleGroup(group)}
                  >
                    {group}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label>Benodigde Apparatuur</Label>
              <Input
                value={formData.equipmentNeeded}
                onChange={(e) =>
                  setFormData({ ...formData, equipmentNeeded: e.target.value })
                }
                placeholder="Bijv. Barbell, Bench"
              />
            </div>

            <div>
              <Label>Uitvoerings Cues</Label>
              <Textarea
                value={formData.cues}
                onChange={(e) =>
                  setFormData({ ...formData, cues: e.target.value })
                }
                placeholder="Techniek instructies..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Video (nieuw uploaden)</Label>
                <Input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                />
              </div>

              <div>
                <Label>Thumbnail (nieuw uploaden)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setThumbnailFile(e.target.files?.[0] || null)
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isSubmitting}
            >
              Annuleren
            </Button>
            <Button onClick={handleUpdate} disabled={isSubmitting}>
              {isSubmitting ? "Opslaan..." : "Opslaan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Oefening Verwijderen</DialogTitle>
            <DialogDescription>
              Weet je zeker dat je "{selectedExercise?.name}" wilt verwijderen?
              Deze actie kan niet ongedaan gemaakt worden.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Annuleren
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Verwijderen..." : "Verwijderen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
