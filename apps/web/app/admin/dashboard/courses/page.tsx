"use client"

import { useState, useEffect, useCallback } from "react"
import {
  BookOpen,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Globe,
  GlobeLock,
  ChevronDown,
  ChevronRight,
  Video,
  FileText,
  HelpCircle,
  Users,
  Layers,
  GraduationCap,
  UserPlus,
  UserMinus,
  Loader2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type {
  Course,
  CourseModule,
  CourseLesson,
  CourseEnrollment,
} from "@/app/actions/courses"
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  createModule,
  updateModule,
  deleteModule,
  createLesson,
  updateLesson,
  deleteLesson,
  getCourseEnrollments,
  enrollClient,
  unenrollClient,
} from "@/app/actions/courses"
import { getClients } from "@/app/actions/admin-clients"
import type { ClientWithStats } from "@/app/actions/admin-clients"

// ============================================================
// Types
// ============================================================

interface CourseWithDetails extends Course {
  modules: CourseModule[]
}

// ============================================================
// Content type helpers
// ============================================================

const contentTypeIcon = {
  video: Video,
  text: FileText,
  quiz: HelpCircle,
}

const contentTypeLabel = {
  video: "Video",
  text: "Tekst",
  quiz: "Quiz",
}

// ============================================================
// Main Page Component
// ============================================================

export default function CoursesPage() {
  // Core state
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<CourseWithDetails | null>(null)
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)

  // Dialog state
  const [showNewCourse, setShowNewCourse] = useState(false)
  const [showEditCourse, setShowEditCourse] = useState(false)
  const [showNewModule, setShowNewModule] = useState(false)
  const [showNewLesson, setShowNewLesson] = useState(false)
  const [showEnrollDialog, setShowEnrollDialog] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ type: "course" | "module" | "lesson"; id: string; name: string } | null>(null)

  // Form state
  const [newCourseTitle, setNewCourseTitle] = useState("")
  const [newCourseDesc, setNewCourseDesc] = useState("")
  const [editCourseTitle, setEditCourseTitle] = useState("")
  const [editCourseDesc, setEditCourseDesc] = useState("")
  const [newModuleTitle, setNewModuleTitle] = useState("")
  const [newLessonTitle, setNewLessonTitle] = useState("")
  const [newLessonType, setNewLessonType] = useState<"video" | "text" | "quiz">("video")
  const [newLessonUrl, setNewLessonUrl] = useState("")
  const [newLessonText, setNewLessonText] = useState("")
  const [newLessonDuration, setNewLessonDuration] = useState("")
  const [targetModuleId, setTargetModuleId] = useState<string | null>(null)

  // Enrollment
  const [clients, setClients] = useState<ClientWithStats[]>([])
  const [selectedClientId, setSelectedClientId] = useState("")

  // Accordion state
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())

  // Submitting state
  const [submitting, setSubmitting] = useState(false)

  // ============================================================
  // Data loading
  // ============================================================

  const loadCourses = useCallback(async () => {
    setLoading(true)
    const result = await getCourses()
    if (result.success && result.data) {
      setCourses(result.data)
    }
    setLoading(false)
  }, [])

  const loadCourseDetail = useCallback(async (id: string) => {
    setDetailLoading(true)
    const [courseResult, enrollmentsResult] = await Promise.all([
      getCourse(id),
      getCourseEnrollments(id),
    ])

    if (courseResult.success && courseResult.data) {
      setSelectedCourse(courseResult.data as CourseWithDetails)
      // Auto-expand all modules
      const moduleIds = new Set(courseResult.data.modules.map(m => m.id))
      setExpandedModules(moduleIds)
    }
    if (enrollmentsResult.success && enrollmentsResult.data) {
      setEnrollments(enrollmentsResult.data)
    }
    setDetailLoading(false)
  }, [])

  useEffect(() => {
    loadCourses()
  }, [loadCourses])

  // ============================================================
  // Handlers
  // ============================================================

  async function handleCreateCourse() {
    if (!newCourseTitle.trim()) return
    setSubmitting(true)
    const result = await createCourse({
      title: newCourseTitle.trim(),
      description: newCourseDesc.trim() || undefined,
    })
    if (result.success) {
      setShowNewCourse(false)
      setNewCourseTitle("")
      setNewCourseDesc("")
      await loadCourses()
    }
    setSubmitting(false)
  }

  async function handleUpdateCourse() {
    if (!selectedCourse || !editCourseTitle.trim()) return
    setSubmitting(true)
    const result = await updateCourse(selectedCourse.id, {
      title: editCourseTitle.trim(),
      description: editCourseDesc.trim() || undefined,
    })
    if (result.success) {
      setShowEditCourse(false)
      await loadCourses()
      await loadCourseDetail(selectedCourse.id)
    }
    setSubmitting(false)
  }

  async function handleTogglePublish(course: Course) {
    const newStatus = course.status === "published" ? "draft" : "published"
    const result = await updateCourse(course.id, { status: newStatus })
    if (result.success) {
      await loadCourses()
      if (selectedCourse?.id === course.id) {
        await loadCourseDetail(course.id)
      }
    }
  }

  async function handleDelete() {
    if (!showDeleteConfirm) return
    setSubmitting(true)
    const { type, id } = showDeleteConfirm
    let result: { success: boolean; error?: string }

    if (type === "course") {
      result = await deleteCourse(id)
      if (result.success) {
        if (selectedCourse?.id === id) {
          setSelectedCourse(null)
          setEnrollments([])
        }
        await loadCourses()
      }
    } else if (type === "module") {
      result = await deleteModule(id)
      if (result.success && selectedCourse) {
        await loadCourseDetail(selectedCourse.id)
        await loadCourses()
      }
    } else {
      result = await deleteLesson(id)
      if (result.success && selectedCourse) {
        await loadCourseDetail(selectedCourse.id)
        await loadCourses()
      }
    }

    setShowDeleteConfirm(null)
    setSubmitting(false)
  }

  async function handleCreateModule() {
    if (!selectedCourse || !newModuleTitle.trim()) return
    setSubmitting(true)
    const result = await createModule(selectedCourse.id, newModuleTitle.trim())
    if (result.success) {
      setShowNewModule(false)
      setNewModuleTitle("")
      await loadCourseDetail(selectedCourse.id)
      await loadCourses()
    }
    setSubmitting(false)
  }

  async function handleCreateLesson() {
    if (!targetModuleId || !newLessonTitle.trim()) return
    setSubmitting(true)
    const result = await createLesson(targetModuleId, {
      title: newLessonTitle.trim(),
      contentType: newLessonType,
      contentUrl: newLessonUrl.trim() || undefined,
      contentText: newLessonText.trim() || undefined,
      duration: newLessonDuration.trim() || undefined,
    })
    if (result.success && selectedCourse) {
      setShowNewLesson(false)
      setNewLessonTitle("")
      setNewLessonType("video")
      setNewLessonUrl("")
      setNewLessonText("")
      setNewLessonDuration("")
      setTargetModuleId(null)
      await loadCourseDetail(selectedCourse.id)
      await loadCourses()
    }
    setSubmitting(false)
  }

  async function handleEnrollClient() {
    if (!selectedCourse || !selectedClientId) return
    setSubmitting(true)
    const result = await enrollClient(selectedCourse.id, selectedClientId)
    if (result.success) {
      setShowEnrollDialog(false)
      setSelectedClientId("")
      await loadCourseDetail(selectedCourse.id)
      await loadCourses()
    }
    setSubmitting(false)
  }

  async function handleUnenrollClient(clientId: string) {
    if (!selectedCourse) return
    const result = await unenrollClient(selectedCourse.id, clientId)
    if (result.success) {
      await loadCourseDetail(selectedCourse.id)
      await loadCourses()
    }
  }

  function openEnrollDialog() {
    setShowEnrollDialog(true)
    // Load clients if not loaded yet
    if (clients.length === 0) {
      getClients().then(result => {
        if (result.success && result.clients) {
          setClients(result.clients)
        }
      })
    }
  }

  function toggleModule(moduleId: string) {
    setExpandedModules(prev => {
      const next = new Set(prev)
      if (next.has(moduleId)) {
        next.delete(moduleId)
      } else {
        next.add(moduleId)
      }
      return next
    })
  }

  function openEditCourse() {
    if (!selectedCourse) return
    setEditCourseTitle(selectedCourse.title)
    setEditCourseDesc(selectedCourse.description || "")
    setShowEditCourse(true)
  }

  function openNewLesson(moduleId: string) {
    setTargetModuleId(moduleId)
    setShowNewLesson(true)
  }

  // ============================================================
  // Render
  // ============================================================

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Courses</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            E-learning en cursussen voor je clients
          </p>
        </div>
        <Button onClick={() => setShowNewCourse(true)}>
          <Plus className="size-4" />
          Nieuwe Course
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Empty state */}
      {!loading && courses.length === 0 && (
        <Card className="shadow-sm border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <GraduationCap className="size-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Nog geen courses
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              Maak je eerste course aan om een e-learning bibliotheek op te bouwen
              voor je clients.
            </p>
            <Button onClick={() => setShowNewCourse(true)}>
              <Plus className="size-4" />
              Eerste Course Aanmaken
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Main content: courses grid + detail */}
      {!loading && courses.length > 0 && (
        <div className="flex flex-col gap-6">
          {/* Course Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card
                key={course.id}
                className={`shadow-sm cursor-pointer transition-all hover:shadow-md ${
                  selectedCourse?.id === course.id
                    ? "ring-2 ring-primary"
                    : ""
                }`}
                onClick={() => loadCourseDetail(course.id)}
              >
                <CardContent className="p-0">
                  {/* Thumbnail placeholder */}
                  <div className="h-32 rounded-t-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <BookOpen className="size-10 text-primary/40" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-foreground truncate">
                          {course.title}
                        </h3>
                        {course.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {course.description}
                          </p>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              loadCourseDetail(course.id).then(() => openEditCourse())
                            }}
                          >
                            <Pencil className="size-4" />
                            Bewerken
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              handleTogglePublish(course)
                            }}
                          >
                            {course.status === "published" ? (
                              <>
                                <GlobeLock className="size-4" />
                                Concept maken
                              </>
                            ) : (
                              <>
                                <Globe className="size-4" />
                                Publiceren
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowDeleteConfirm({
                                type: "course",
                                id: course.id,
                                name: course.title,
                              })
                            }}
                          >
                            <Trash2 className="size-4" />
                            Verwijderen
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Stats + badge */}
                    <div className="flex items-center gap-3 mt-3">
                      <Badge
                        variant={
                          course.status === "published"
                            ? "default"
                            : "secondary"
                        }
                        className="text-[10px]"
                      >
                        {course.status === "published"
                          ? "Gepubliceerd"
                          : "Draft"}
                      </Badge>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-0.5">
                          <Layers className="size-3" />
                          {course.module_count || 0}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <FileText className="size-3" />
                          {course.lesson_count || 0}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Users className="size-3" />
                          {course.enrollment_count || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Course Detail View */}
          {detailLoading && (
            <Card className="shadow-sm">
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          )}

          {selectedCourse && !detailLoading && (
            <Card className="shadow-sm">
              <CardContent className="p-6">
                {/* Course header */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-foreground">
                        {selectedCourse.title}
                      </h3>
                      <Badge
                        variant={
                          selectedCourse.status === "published"
                            ? "default"
                            : "secondary"
                        }
                        className="text-[10px]"
                      >
                        {selectedCourse.status === "published"
                          ? "Gepubliceerd"
                          : "Draft"}
                      </Badge>
                    </div>
                    {selectedCourse.description && (
                      <p className="text-sm text-muted-foreground">
                        {selectedCourse.description}
                      </p>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={openEditCourse}>
                    <Pencil className="size-3.5" />
                    Bewerken
                  </Button>
                </div>

                {/* Modules section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-foreground">
                      Modules ({selectedCourse.modules.length})
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowNewModule(true)}
                    >
                      <Plus className="size-3.5" />
                      Module
                    </Button>
                  </div>

                  {selectedCourse.modules.length === 0 && (
                    <div className="rounded-lg border border-dashed p-6 text-center">
                      <p className="text-sm text-muted-foreground">
                        Nog geen modules. Voeg je eerste module toe om lessen te
                        organiseren.
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    {selectedCourse.modules.map((mod) => {
                      const isExpanded = expandedModules.has(mod.id)
                      return (
                        <div
                          key={mod.id}
                          className="rounded-lg border bg-card"
                        >
                          {/* Module header */}
                          <div
                            className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => toggleModule(mod.id)}
                          >
                            {isExpanded ? (
                              <ChevronDown className="size-4 text-muted-foreground shrink-0" />
                            ) : (
                              <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                            )}
                            <span className="text-sm font-medium text-foreground flex-1">
                              {mod.title}
                            </span>
                            <span className="text-xs text-muted-foreground mr-2">
                              {mod.lessons?.length || 0} lessen
                            </span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon-xs"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreVertical className="size-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    openNewLesson(mod.id)
                                  }}
                                >
                                  <Plus className="size-4" />
                                  Les toevoegen
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  variant="destructive"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setShowDeleteConfirm({
                                      type: "module",
                                      id: mod.id,
                                      name: mod.title,
                                    })
                                  }}
                                >
                                  <Trash2 className="size-4" />
                                  Verwijderen
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Lessons list */}
                          {isExpanded && (
                            <div className="border-t">
                              {(!mod.lessons || mod.lessons.length === 0) && (
                                <div className="px-4 py-3 text-xs text-muted-foreground text-center">
                                  Nog geen lessen in deze module.
                                </div>
                              )}
                              {mod.lessons?.map((lesson) => {
                                const Icon =
                                  contentTypeIcon[lesson.content_type] ||
                                  FileText
                                return (
                                  <div
                                    key={lesson.id}
                                    className="flex items-center gap-3 px-4 py-2.5 border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                                  >
                                    <Icon className="size-4 text-muted-foreground shrink-0" />
                                    <span className="text-sm text-foreground flex-1 truncate">
                                      {lesson.title}
                                    </span>
                                    <Badge
                                      variant="outline"
                                      className="text-[10px] shrink-0"
                                    >
                                      {contentTypeLabel[lesson.content_type] ||
                                        lesson.content_type}
                                    </Badge>
                                    {lesson.duration && (
                                      <span className="text-[11px] text-muted-foreground shrink-0">
                                        {lesson.duration}
                                      </span>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="icon-xs"
                                      onClick={() =>
                                        setShowDeleteConfirm({
                                          type: "lesson",
                                          id: lesson.id,
                                          name: lesson.title,
                                        })
                                      }
                                    >
                                      <Trash2 className="size-3" />
                                    </Button>
                                  </div>
                                )
                              })}
                              {/* Add lesson button inside module */}
                              <div className="px-4 py-2 border-t">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full text-muted-foreground"
                                  onClick={() => openNewLesson(mod.id)}
                                >
                                  <Plus className="size-3.5" />
                                  Les toevoegen
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Enrollments section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-foreground">
                      Inschrijvingen ({enrollments.length})
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={openEnrollDialog}
                    >
                      <UserPlus className="size-3.5" />
                      Inschrijven
                    </Button>
                  </div>

                  {enrollments.length === 0 && (
                    <div className="rounded-lg border border-dashed p-6 text-center">
                      <p className="text-sm text-muted-foreground">
                        Nog geen clients ingeschreven voor deze course.
                      </p>
                    </div>
                  )}

                  {enrollments.length > 0 && (
                    <div className="space-y-1">
                      {enrollments.map((enrollment) => (
                        <div
                          key={enrollment.id}
                          className="flex items-center gap-3 rounded-lg border px-4 py-2.5"
                        >
                          <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                            {enrollment.client_initials || "?"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {enrollment.client_name || "Naamloos"}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              Voortgang: {enrollment.progress_percent}%
                              {enrollment.completed_at && " (Voltooid)"}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() =>
                              handleUnenrollClient(enrollment.client_id)
                            }
                          >
                            <UserMinus className="size-3.5 text-muted-foreground" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* DIALOGS */}
      {/* ============================================================ */}

      {/* New Course Dialog */}
      <Dialog open={showNewCourse} onOpenChange={setShowNewCourse}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nieuwe Course</DialogTitle>
            <DialogDescription>
              Maak een nieuwe course aan voor je clients.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Titel
              </label>
              <Input
                placeholder="Bijv. Basis Voedingsleer"
                value={newCourseTitle}
                onChange={(e) => setNewCourseTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Beschrijving
              </label>
              <Textarea
                placeholder="Waar gaat deze course over?"
                value={newCourseDesc}
                onChange={(e) => setNewCourseDesc(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewCourse(false)}
            >
              Annuleren
            </Button>
            <Button
              onClick={handleCreateCourse}
              disabled={!newCourseTitle.trim() || submitting}
            >
              {submitting && <Loader2 className="size-4 animate-spin" />}
              Aanmaken
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Course Dialog */}
      <Dialog open={showEditCourse} onOpenChange={setShowEditCourse}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Course Bewerken</DialogTitle>
            <DialogDescription>
              Pas de titel en beschrijving van deze course aan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Titel
              </label>
              <Input
                value={editCourseTitle}
                onChange={(e) => setEditCourseTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Beschrijving
              </label>
              <Textarea
                value={editCourseDesc}
                onChange={(e) => setEditCourseDesc(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditCourse(false)}
            >
              Annuleren
            </Button>
            <Button
              onClick={handleUpdateCourse}
              disabled={!editCourseTitle.trim() || submitting}
            >
              {submitting && <Loader2 className="size-4 animate-spin" />}
              Opslaan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Module Dialog */}
      <Dialog open={showNewModule} onOpenChange={setShowNewModule}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nieuwe Module</DialogTitle>
            <DialogDescription>
              Voeg een nieuwe module toe aan deze course.
            </DialogDescription>
          </DialogHeader>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Module titel
            </label>
            <Input
              placeholder="Bijv. Week 1 - Introductie"
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewModule(false)}
            >
              Annuleren
            </Button>
            <Button
              onClick={handleCreateModule}
              disabled={!newModuleTitle.trim() || submitting}
            >
              {submitting && <Loader2 className="size-4 animate-spin" />}
              Toevoegen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Lesson Dialog */}
      <Dialog open={showNewLesson} onOpenChange={setShowNewLesson}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nieuwe Les</DialogTitle>
            <DialogDescription>
              Voeg een nieuwe les toe aan deze module.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Titel
              </label>
              <Input
                placeholder="Bijv. Wat zijn macronutrienten?"
                value={newLessonTitle}
                onChange={(e) => setNewLessonTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Type
              </label>
              <Select
                value={newLessonType}
                onValueChange={(v) =>
                  setNewLessonType(v as "video" | "text" | "quiz")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="text">Tekst</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(newLessonType === "video" || newLessonType === "quiz") && (
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  URL
                </label>
                <Input
                  placeholder="https://..."
                  value={newLessonUrl}
                  onChange={(e) => setNewLessonUrl(e.target.value)}
                />
              </div>
            )}
            {newLessonType === "text" && (
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Tekst inhoud
                </label>
                <Textarea
                  placeholder="Schrijf de lesinhoud..."
                  value={newLessonText}
                  onChange={(e) => setNewLessonText(e.target.value)}
                  rows={4}
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Duur (optioneel)
              </label>
              <Input
                placeholder="Bijv. 15 min"
                value={newLessonDuration}
                onChange={(e) => setNewLessonDuration(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewLesson(false)}
            >
              Annuleren
            </Button>
            <Button
              onClick={handleCreateLesson}
              disabled={!newLessonTitle.trim() || submitting}
            >
              {submitting && <Loader2 className="size-4 animate-spin" />}
              Toevoegen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enroll Client Dialog */}
      <Dialog open={showEnrollDialog} onOpenChange={setShowEnrollDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Client Inschrijven</DialogTitle>
            <DialogDescription>
              Schrijf een client in voor deze course.
            </DialogDescription>
          </DialogHeader>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Selecteer client
            </label>
            <Select
              value={selectedClientId}
              onValueChange={setSelectedClientId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Kies een client..." />
              </SelectTrigger>
              <SelectContent>
                {clients
                  .filter(
                    (c) =>
                      !enrollments.some((e) => e.client_id === c.id)
                  )
                  .map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.raw_user_meta_data?.full_name ||
                        client.email}
                    </SelectItem>
                  ))}
                {clients.filter(
                  (c) =>
                    !enrollments.some((e) => e.client_id === c.id)
                ).length === 0 && (
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">
                    Alle clients zijn al ingeschreven
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEnrollDialog(false)}
            >
              Annuleren
            </Button>
            <Button
              onClick={handleEnrollClient}
              disabled={!selectedClientId || submitting}
            >
              {submitting && <Loader2 className="size-4 animate-spin" />}
              Inschrijven
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!showDeleteConfirm}
        onOpenChange={(open) => !open && setShowDeleteConfirm(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verwijderen bevestigen</DialogTitle>
            <DialogDescription>
              Weet je zeker dat je{" "}
              <span className="font-semibold text-foreground">
                {showDeleteConfirm?.name}
              </span>{" "}
              wilt verwijderen?
              {showDeleteConfirm?.type === "course" &&
                " Alle modules, lessen en inschrijvingen worden ook verwijderd."}
              {showDeleteConfirm?.type === "module" &&
                " Alle lessen in deze module worden ook verwijderd."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(null)}
            >
              Annuleren
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={submitting}
            >
              {submitting && <Loader2 className="size-4 animate-spin" />}
              Verwijderen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
