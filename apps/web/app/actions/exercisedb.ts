"use server"

import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// ============================================
// Auth helpers
// ============================================

async function checkAuth() {
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
  if (!user) return { authorized: false as const, user: null }
  const role = user.user_metadata?.role || "CLIENT"
  if (role !== "ADMIN" && role !== "COACH") return { authorized: false as const, user: null }
  return { authorized: true as const, user }
}

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

// ============================================
// ExerciseDB API types
// ============================================

export interface ExerciseDBResult {
  id: string
  name: string
  bodyPart: string
  equipment: string
  gifUrl: string
  target: string
  secondaryMuscles: string[]
  instructions: string[]
}

// ============================================
// ExerciseDB API calls (server-side proxy)
// ============================================

const EXERCISEDB_BASE = "https://exercisedb-api.vercel.app/api/v1"

export async function searchExerciseDB(query: string, options?: {
  bodyPart?: string
  equipment?: string
  limit?: number
  offset?: number
}) {
  const auth = await checkAuth()
  if (!auth.authorized) return { success: false, error: "Not authorized" }

  try {
    const limit = options?.limit || 20
    const offset = options?.offset || 0

    let url: string
    if (options?.bodyPart) {
      url = `${EXERCISEDB_BASE}/exercises?search=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`
    } else {
      url = `${EXERCISEDB_BASE}/exercises?search=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`
    }

    const response = await fetch(url, {
      headers: { "Accept": "application/json" },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      return { success: false, error: `ExerciseDB API error: ${response.status}` }
    }

    const result = await response.json()
    const exercises: ExerciseDBResult[] = (result.data?.exercises || result.data || []).map((ex: any) => ({
      id: ex.exerciseId || ex.id,
      name: ex.name,
      bodyPart: ex.bodyPart,
      equipment: ex.equipment,
      gifUrl: ex.gifUrl,
      target: ex.target,
      secondaryMuscles: ex.secondaryMuscles || [],
      instructions: ex.instructions || [],
    }))

    return { success: true, exercises }
  } catch (error: any) {
    console.error("ExerciseDB search error:", error)
    return { success: false, error: error.message }
  }
}

export async function getExerciseDBBodyParts() {
  const auth = await checkAuth()
  if (!auth.authorized) return { success: false, error: "Not authorized" }

  try {
    const response = await fetch(`${EXERCISEDB_BASE}/bodyparts`, {
      headers: { "Accept": "application/json" },
      next: { revalidate: 86400 }, // Cache for 24 hours
    })

    if (!response.ok) return { success: false, error: `API error: ${response.status}` }
    const result = await response.json()
    return { success: true, bodyParts: result.data || [] }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getExerciseDBEquipment() {
  const auth = await checkAuth()
  if (!auth.authorized) return { success: false, error: "Not authorized" }

  try {
    const response = await fetch(`${EXERCISEDB_BASE}/equipments`, {
      headers: { "Accept": "application/json" },
      next: { revalidate: 86400 },
    })

    if (!response.ok) return { success: false, error: `API error: ${response.status}` }
    const result = await response.json()
    return { success: true, equipment: result.data || [] }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// ============================================
// Import exercise from ExerciseDB into our DB
// ============================================

const BODY_PART_TO_CATEGORY: Record<string, string> = {
  back: "STRENGTH",
  cardio: "CARDIO",
  chest: "STRENGTH",
  "lower arms": "STRENGTH",
  "lower legs": "STRENGTH",
  neck: "FLEXIBILITY",
  shoulders: "STRENGTH",
  "upper arms": "STRENGTH",
  "upper legs": "STRENGTH",
  waist: "CORE",
}

const BODY_PART_TO_MUSCLE_GROUPS: Record<string, string[]> = {
  back: ["back"],
  chest: ["chest"],
  "lower arms": ["forearms"],
  "lower legs": ["calves"],
  neck: ["neck"],
  shoulders: ["shoulders"],
  "upper arms": ["biceps", "triceps"],
  "upper legs": ["quadriceps", "hamstrings", "glutes"],
  waist: ["abs", "obliques"],
}

export async function importExerciseFromDB(exercise: ExerciseDBResult) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()

  // Check if already imported
  const { data: existing } = await supabase
    .from("exercises")
    .select("id")
    .eq("external_id", exercise.id)
    .eq("external_source", "exercisedb")
    .limit(1)

  if (existing && existing.length > 0) {
    return { success: false, error: "Deze oefening is al geïmporteerd" }
  }

  const category = BODY_PART_TO_CATEGORY[exercise.bodyPart] || "STRENGTH"
  const muscleGroups = BODY_PART_TO_MUSCLE_GROUPS[exercise.bodyPart] || []

  // Add target muscle if not already in list
  if (exercise.target && !muscleGroups.includes(exercise.target)) {
    muscleGroups.push(exercise.target)
  }

  const { data, error } = await supabase
    .from("exercises")
    .insert({
      name: exercise.name.charAt(0).toUpperCase() + exercise.name.slice(1),
      description: exercise.instructions.join("\n"),
      category,
      equipment_needed: exercise.equipment !== "body weight" ? exercise.equipment : null,
      muscle_groups: muscleGroups,
      difficulty: "INTERMEDIATE",
      gif_url: exercise.gifUrl,
      external_id: exercise.id,
      external_source: "exercisedb",
      is_public: false,
      created_by: auth.user.id,
    })
    .select()
    .single()

  if (error) {
    console.error("Import exercise error:", error)
    return { success: false, error: error.message }
  }

  return { success: true, exercise: data }
}

export async function bulkImportExercises(exercises: ExerciseDBResult[]) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()

  // Get already imported IDs
  const externalIds = exercises.map(e => e.id)
  const { data: existing } = await supabase
    .from("exercises")
    .select("external_id")
    .eq("external_source", "exercisedb")
    .in("external_id", externalIds)

  const existingIds = new Set((existing || []).map((e: any) => e.external_id))
  const toImport = exercises.filter(e => !existingIds.has(e.id))

  if (toImport.length === 0) {
    return { success: true, imported: 0, message: "Alle oefeningen zijn al geïmporteerd" }
  }

  const rows = toImport.map(exercise => {
    const category = BODY_PART_TO_CATEGORY[exercise.bodyPart] || "STRENGTH"
    const muscleGroups = [...(BODY_PART_TO_MUSCLE_GROUPS[exercise.bodyPart] || [])]
    if (exercise.target && !muscleGroups.includes(exercise.target)) {
      muscleGroups.push(exercise.target)
    }

    return {
      name: exercise.name.charAt(0).toUpperCase() + exercise.name.slice(1),
      description: exercise.instructions.join("\n"),
      category,
      equipment_needed: exercise.equipment !== "body weight" ? exercise.equipment : null,
      muscle_groups: muscleGroups,
      difficulty: "INTERMEDIATE",
      gif_url: exercise.gifUrl,
      external_id: exercise.id,
      external_source: "exercisedb",
      is_public: false,
      created_by: auth.user.id,
    }
  })

  const { error } = await supabase.from("exercises").insert(rows)

  if (error) return { success: false, error: error.message }
  return { success: true, imported: rows.length }
}
