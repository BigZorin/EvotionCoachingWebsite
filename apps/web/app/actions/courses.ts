"use server"

import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// ============================================================
// AUTH HELPERS (replicated from admin-clients.ts)
// ============================================================

async function getCurrentUser(): Promise<{ id: string; role: string; email: string } | null> {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {}
        },
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  return {
    id: user.id,
    role: (user.user_metadata?.role || 'CLIENT') as string,
    email: user.email || '',
  }
}

async function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

// ============================================================
// TYPES
// ============================================================

export interface Course {
  id: string
  coach_id: string
  title: string
  description: string | null
  thumbnail: string | null
  status: 'draft' | 'published'
  order_index: number
  created_at: string
  updated_at: string
  // Computed
  module_count?: number
  lesson_count?: number
  enrollment_count?: number
}

export interface CourseModule {
  id: string
  course_id: string
  title: string
  order_index: number
  lessons?: CourseLesson[]
}

export interface CourseLesson {
  id: string
  module_id: string
  title: string
  content_type: 'video' | 'text' | 'quiz'
  content_url: string | null
  content_text: string | null
  duration: string | null
  order_index: number
}

export interface CourseEnrollment {
  id: string
  course_id: string
  client_id: string
  enrolled_at: string
  progress_percent: number
  completed_at: string | null
  client_name?: string
  client_initials?: string
}

// ============================================================
// 1. GET COURSES (list for coach)
// ============================================================

export async function getCourses(): Promise<{ success: boolean; data?: Course[]; error?: string }> {
  const currentUser = await getCurrentUser()
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'COACH')) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const supabase = await getSupabaseAdmin()

    // Fetch courses for this coach
    const { data: courses, error } = await supabase
      .from("courses")
      .select("*")
      .eq("coach_id", currentUser.id)
      .order("order_index", { ascending: true })

    if (error) {
      console.error("Error fetching courses:", error)
      return { success: false, error: error.message }
    }

    if (!courses || courses.length === 0) {
      return { success: true, data: [] }
    }

    const courseIds = courses.map(c => c.id)

    // Parallel count queries
    const [modulesRes, lessonsRes, enrollmentsRes] = await Promise.all([
      supabase
        .from("course_modules")
        .select("id, course_id")
        .in("course_id", courseIds),
      supabase
        .from("course_lessons")
        .select("id, module_id, course_modules!inner(course_id)")
        .in("course_modules.course_id", courseIds),
      supabase
        .from("course_enrollments")
        .select("id, course_id")
        .in("course_id", courseIds),
    ])

    const modules = modulesRes.data || []
    const lessons = lessonsRes.data || []
    const enrollments = enrollmentsRes.data || []

    // Build count maps
    const moduleCountMap = new Map<string, number>()
    for (const m of modules) {
      moduleCountMap.set(m.course_id, (moduleCountMap.get(m.course_id) || 0) + 1)
    }

    const lessonCountMap = new Map<string, number>()
    for (const l of lessons) {
      const courseId = (l as any).course_modules?.course_id
      if (courseId) {
        lessonCountMap.set(courseId, (lessonCountMap.get(courseId) || 0) + 1)
      }
    }

    const enrollmentCountMap = new Map<string, number>()
    for (const e of enrollments) {
      enrollmentCountMap.set(e.course_id, (enrollmentCountMap.get(e.course_id) || 0) + 1)
    }

    const enrichedCourses: Course[] = courses.map(c => ({
      ...c,
      module_count: moduleCountMap.get(c.id) || 0,
      lesson_count: lessonCountMap.get(c.id) || 0,
      enrollment_count: enrollmentCountMap.get(c.id) || 0,
    }))

    return { success: true, data: enrichedCourses }
  } catch (error) {
    console.error("Error in getCourses:", error)
    return { success: false, error: "Failed to fetch courses" }
  }
}

// ============================================================
// 2. GET COURSE (single with modules + lessons)
// ============================================================

export async function getCourse(courseId: string): Promise<{ success: boolean; data?: Course & { modules: CourseModule[] }; error?: string }> {
  const currentUser = await getCurrentUser()
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'COACH')) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const supabase = await getSupabaseAdmin()

    // Get course
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .eq("coach_id", currentUser.id)
      .single()

    if (courseError || !course) {
      return { success: false, error: courseError?.message || "Course not found" }
    }

    // Get modules ordered
    const { data: modules, error: modulesError } = await supabase
      .from("course_modules")
      .select("*")
      .eq("course_id", courseId)
      .order("order_index", { ascending: true })

    if (modulesError) {
      return { success: false, error: modulesError.message }
    }

    // Get lessons for all modules
    const moduleIds = (modules || []).map(m => m.id)
    let lessons: any[] = []

    if (moduleIds.length > 0) {
      const { data: lessonData, error: lessonsError } = await supabase
        .from("course_lessons")
        .select("*")
        .in("module_id", moduleIds)
        .order("order_index", { ascending: true })

      if (lessonsError) {
        return { success: false, error: lessonsError.message }
      }
      lessons = lessonData || []
    }

    // Nest lessons into modules
    const modulesWithLessons: CourseModule[] = (modules || []).map(m => ({
      ...m,
      lessons: lessons.filter(l => l.module_id === m.id),
    }))

    return {
      success: true,
      data: {
        ...course,
        modules: modulesWithLessons,
      },
    }
  } catch (error) {
    console.error("Error in getCourse:", error)
    return { success: false, error: "Failed to fetch course" }
  }
}

// ============================================================
// 3. CREATE COURSE
// ============================================================

export async function createCourse(data: {
  title: string
  description?: string
  thumbnail?: string
}): Promise<{ success: boolean; data?: Course; error?: string }> {
  const currentUser = await getCurrentUser()
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'COACH')) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const supabase = await getSupabaseAdmin()

    // Get next order_index
    const { count } = await supabase
      .from("courses")
      .select("id", { count: "exact", head: true })
      .eq("coach_id", currentUser.id)

    const { data: course, error } = await supabase
      .from("courses")
      .insert({
        coach_id: currentUser.id,
        title: data.title,
        description: data.description || null,
        thumbnail: data.thumbnail || null,
        status: "draft",
        order_index: (count || 0) + 1,
      })
      .select("*")
      .single()

    if (error) {
      console.error("Error creating course:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data: course }
  } catch (error) {
    console.error("Error in createCourse:", error)
    return { success: false, error: "Failed to create course" }
  }
}

// ============================================================
// 4. UPDATE COURSE
// ============================================================

export async function updateCourse(courseId: string, data: {
  title?: string
  description?: string
  thumbnail?: string
  status?: 'draft' | 'published'
}): Promise<{ success: boolean; data?: Course; error?: string }> {
  const currentUser = await getCurrentUser()
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'COACH')) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const supabase = await getSupabaseAdmin()

    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }
    if (data.title !== undefined) updateData.title = data.title
    if (data.description !== undefined) updateData.description = data.description
    if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail
    if (data.status !== undefined) updateData.status = data.status

    const { data: course, error } = await supabase
      .from("courses")
      .update(updateData)
      .eq("id", courseId)
      .eq("coach_id", currentUser.id)
      .select("*")
      .single()

    if (error) {
      console.error("Error updating course:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data: course }
  } catch (error) {
    console.error("Error in updateCourse:", error)
    return { success: false, error: "Failed to update course" }
  }
}

// ============================================================
// 5. DELETE COURSE
// ============================================================

export async function deleteCourse(courseId: string): Promise<{ success: boolean; error?: string }> {
  const currentUser = await getCurrentUser()
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'COACH')) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const supabase = await getSupabaseAdmin()

    const { error } = await supabase
      .from("courses")
      .delete()
      .eq("id", courseId)
      .eq("coach_id", currentUser.id)

    if (error) {
      console.error("Error deleting course:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in deleteCourse:", error)
    return { success: false, error: "Failed to delete course" }
  }
}

// ============================================================
// 6. CREATE MODULE
// ============================================================

export async function createModule(courseId: string, title: string): Promise<{ success: boolean; data?: CourseModule; error?: string }> {
  const currentUser = await getCurrentUser()
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'COACH')) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const supabase = await getSupabaseAdmin()

    // Get next order_index
    const { count } = await supabase
      .from("course_modules")
      .select("id", { count: "exact", head: true })
      .eq("course_id", courseId)

    const { data: mod, error } = await supabase
      .from("course_modules")
      .insert({
        course_id: courseId,
        title,
        order_index: (count || 0) + 1,
      })
      .select("*")
      .single()

    if (error) {
      console.error("Error creating module:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data: mod }
  } catch (error) {
    console.error("Error in createModule:", error)
    return { success: false, error: "Failed to create module" }
  }
}

// ============================================================
// 7. UPDATE MODULE
// ============================================================

export async function updateModule(moduleId: string, data: {
  title?: string
  order_index?: number
}): Promise<{ success: boolean; data?: CourseModule; error?: string }> {
  const currentUser = await getCurrentUser()
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'COACH')) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const supabase = await getSupabaseAdmin()

    const updateData: Record<string, any> = {}
    if (data.title !== undefined) updateData.title = data.title
    if (data.order_index !== undefined) updateData.order_index = data.order_index

    const { data: mod, error } = await supabase
      .from("course_modules")
      .update(updateData)
      .eq("id", moduleId)
      .select("*")
      .single()

    if (error) {
      console.error("Error updating module:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data: mod }
  } catch (error) {
    console.error("Error in updateModule:", error)
    return { success: false, error: "Failed to update module" }
  }
}

// ============================================================
// 8. DELETE MODULE
// ============================================================

export async function deleteModule(moduleId: string): Promise<{ success: boolean; error?: string }> {
  const currentUser = await getCurrentUser()
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'COACH')) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const supabase = await getSupabaseAdmin()

    const { error } = await supabase
      .from("course_modules")
      .delete()
      .eq("id", moduleId)

    if (error) {
      console.error("Error deleting module:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in deleteModule:", error)
    return { success: false, error: "Failed to delete module" }
  }
}

// ============================================================
// 9. CREATE LESSON
// ============================================================

export async function createLesson(moduleId: string, data: {
  title: string
  contentType: 'video' | 'text' | 'quiz'
  contentUrl?: string
  contentText?: string
  duration?: string
}): Promise<{ success: boolean; data?: CourseLesson; error?: string }> {
  const currentUser = await getCurrentUser()
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'COACH')) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const supabase = await getSupabaseAdmin()

    // Get next order_index
    const { count } = await supabase
      .from("course_lessons")
      .select("id", { count: "exact", head: true })
      .eq("module_id", moduleId)

    const { data: lesson, error } = await supabase
      .from("course_lessons")
      .insert({
        module_id: moduleId,
        title: data.title,
        content_type: data.contentType,
        content_url: data.contentUrl || null,
        content_text: data.contentText || null,
        duration: data.duration || null,
        order_index: (count || 0) + 1,
      })
      .select("*")
      .single()

    if (error) {
      console.error("Error creating lesson:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data: lesson }
  } catch (error) {
    console.error("Error in createLesson:", error)
    return { success: false, error: "Failed to create lesson" }
  }
}

// ============================================================
// 10. UPDATE LESSON
// ============================================================

export async function updateLesson(lessonId: string, data: {
  title?: string
  contentType?: 'video' | 'text' | 'quiz'
  contentUrl?: string
  contentText?: string
  duration?: string
  order_index?: number
}): Promise<{ success: boolean; data?: CourseLesson; error?: string }> {
  const currentUser = await getCurrentUser()
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'COACH')) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const supabase = await getSupabaseAdmin()

    const updateData: Record<string, any> = {}
    if (data.title !== undefined) updateData.title = data.title
    if (data.contentType !== undefined) updateData.content_type = data.contentType
    if (data.contentUrl !== undefined) updateData.content_url = data.contentUrl
    if (data.contentText !== undefined) updateData.content_text = data.contentText
    if (data.duration !== undefined) updateData.duration = data.duration
    if (data.order_index !== undefined) updateData.order_index = data.order_index

    const { data: lesson, error } = await supabase
      .from("course_lessons")
      .update(updateData)
      .eq("id", lessonId)
      .select("*")
      .single()

    if (error) {
      console.error("Error updating lesson:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data: lesson }
  } catch (error) {
    console.error("Error in updateLesson:", error)
    return { success: false, error: "Failed to update lesson" }
  }
}

// ============================================================
// 11. DELETE LESSON
// ============================================================

export async function deleteLesson(lessonId: string): Promise<{ success: boolean; error?: string }> {
  const currentUser = await getCurrentUser()
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'COACH')) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const supabase = await getSupabaseAdmin()

    const { error } = await supabase
      .from("course_lessons")
      .delete()
      .eq("id", lessonId)

    if (error) {
      console.error("Error deleting lesson:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in deleteLesson:", error)
    return { success: false, error: "Failed to delete lesson" }
  }
}

// ============================================================
// 12. GET COURSE ENROLLMENTS
// ============================================================

export async function getCourseEnrollments(courseId: string): Promise<{ success: boolean; data?: CourseEnrollment[]; error?: string }> {
  const currentUser = await getCurrentUser()
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'COACH')) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const supabase = await getSupabaseAdmin()

    const { data: enrollments, error } = await supabase
      .from("course_enrollments")
      .select("*")
      .eq("course_id", courseId)
      .order("enrolled_at", { ascending: false })

    if (error) {
      console.error("Error fetching enrollments:", error)
      return { success: false, error: error.message }
    }

    if (!enrollments || enrollments.length === 0) {
      return { success: true, data: [] }
    }

    // Join with profiles for client names
    const clientIds = enrollments.map(e => e.client_id)
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, first_name, last_name")
      .in("user_id", clientIds)

    const profileMap = new Map((profiles || []).map(p => [p.user_id, p]))

    const enriched: CourseEnrollment[] = enrollments.map(e => {
      const profile = profileMap.get(e.client_id)
      const firstName = profile?.first_name || ""
      const lastName = profile?.last_name || ""
      const name = [firstName, lastName].filter(Boolean).join(" ") || "Naamloos"
      const initials = `${(firstName || "N")[0]}${(lastName || "")[0] || ""}`.toUpperCase()

      return {
        ...e,
        client_name: name,
        client_initials: initials,
      }
    })

    return { success: true, data: enriched }
  } catch (error) {
    console.error("Error in getCourseEnrollments:", error)
    return { success: false, error: "Failed to fetch enrollments" }
  }
}

// ============================================================
// 13. ENROLL CLIENT
// ============================================================

export async function enrollClient(courseId: string, clientId: string): Promise<{ success: boolean; data?: CourseEnrollment; error?: string }> {
  const currentUser = await getCurrentUser()
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'COACH')) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const supabase = await getSupabaseAdmin()

    // Check if already enrolled
    const { data: existing } = await supabase
      .from("course_enrollments")
      .select("id")
      .eq("course_id", courseId)
      .eq("client_id", clientId)
      .maybeSingle()

    if (existing) {
      return { success: false, error: "Client is al ingeschreven voor deze course" }
    }

    const { data: enrollment, error } = await supabase
      .from("course_enrollments")
      .insert({
        course_id: courseId,
        client_id: clientId,
        enrolled_at: new Date().toISOString(),
        progress_percent: 0,
      })
      .select("*")
      .single()

    if (error) {
      console.error("Error enrolling client:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data: enrollment }
  } catch (error) {
    console.error("Error in enrollClient:", error)
    return { success: false, error: "Failed to enroll client" }
  }
}

// ============================================================
// 14. UNENROLL CLIENT
// ============================================================

export async function unenrollClient(courseId: string, clientId: string): Promise<{ success: boolean; error?: string }> {
  const currentUser = await getCurrentUser()
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'COACH')) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const supabase = await getSupabaseAdmin()

    const { error } = await supabase
      .from("course_enrollments")
      .delete()
      .eq("course_id", courseId)
      .eq("client_id", clientId)

    if (error) {
      console.error("Error unenrolling client:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in unenrollClient:", error)
    return { success: false, error: "Failed to unenroll client" }
  }
}
