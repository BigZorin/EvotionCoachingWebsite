"use server"

import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

async function checkAuth() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { authorized: false, user: null }

  const role = user.user_metadata?.role || 'CLIENT'
  if (role !== 'ADMIN' && role !== 'COACH') return { authorized: false, user: null }

  return { authorized: true, user }
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

export interface Habit {
  id: string
  client_id: string
  coach_id: string
  name: string
  description: string | null
  target_frequency: string
  target_count: number
  is_active: boolean
  created_at: string
}

export interface HabitLog {
  id: string
  habit_id: string
  date: string
  completed: boolean
  notes: string | null
  logged_at: string
}

export interface HabitStreak {
  id: string
  habit_id: string
  current_streak_days: number
  longest_streak_days: number
  last_completed_date: string | null
}

export async function getClientHabits(clientId: string) {
  const auth = await checkAuth()
  if (!auth.authorized) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: true })

  if (error) return { success: false, error: error.message }
  return { success: true, habits: data as Habit[] }
}

export async function createHabit(data: {
  clientId: string
  name: string
  description?: string
  targetFrequency?: string
  targetCount?: number
}) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()
  const { data: habit, error } = await supabase
    .from("habits")
    .insert({
      client_id: data.clientId,
      coach_id: auth.user.id,
      name: data.name,
      description: data.description || null,
      target_frequency: data.targetFrequency || "DAILY",
      target_count: data.targetCount || 1,
      is_active: true,
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message }

  // Create streak record
  await supabase.from("habit_streaks").insert({ habit_id: habit.id })

  return { success: true, habit }
}

export async function updateHabit(habitId: string, updates: {
  name?: string
  description?: string
  isActive?: boolean
}) {
  const auth = await checkAuth()
  if (!auth.authorized) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()
  const updateData: any = {}
  if (updates.name !== undefined) updateData.name = updates.name
  if (updates.description !== undefined) updateData.description = updates.description
  if (updates.isActive !== undefined) updateData.is_active = updates.isActive

  const { error } = await supabase
    .from("habits")
    .update(updateData)
    .eq("id", habitId)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function deleteHabit(habitId: string) {
  const auth = await checkAuth()
  if (!auth.authorized) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()
  const { error } = await supabase
    .from("habits")
    .delete()
    .eq("id", habitId)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function getClientHabitLogs(clientId: string, days: number = 30) {
  const auth = await checkAuth()
  if (!auth.authorized) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()

  // Get habits for client
  const { data: habits } = await supabase
    .from("habits")
    .select("id")
    .eq("client_id", clientId)

  if (!habits?.length) return { success: true, logs: [] }

  const habitIds = habits.map((h: any) => h.id)
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from("habit_logs")
    .select("*")
    .in("habit_id", habitIds)
    .gte("date", startDate.toISOString().split("T")[0])
    .order("date", { ascending: false })

  if (error) return { success: false, error: error.message }
  return { success: true, logs: data as HabitLog[] }
}

export async function getClientHabitStreaks(clientId: string) {
  const auth = await checkAuth()
  if (!auth.authorized) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()

  const { data: habits } = await supabase
    .from("habits")
    .select("id")
    .eq("client_id", clientId)

  if (!habits?.length) return { success: true, streaks: [] }

  const habitIds = habits.map((h: any) => h.id)

  const { data, error } = await supabase
    .from("habit_streaks")
    .select("*")
    .in("habit_id", habitIds)

  if (error) return { success: false, error: error.message }
  return { success: true, streaks: data as HabitStreak[] }
}
