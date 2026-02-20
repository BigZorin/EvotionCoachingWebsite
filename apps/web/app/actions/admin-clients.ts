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

  if (!user) return false

  const role = user.user_metadata?.role || 'CLIENT'
  return role === 'ADMIN' || role === 'COACH'
}

async function checkAdmin() {
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
  if (!user) return false
  return (user.user_metadata?.role || 'CLIENT') === 'ADMIN'
}

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
  // Use createClient (not createServerClient) with service role key
  // to properly bypass RLS. createServerClient uses cookie-based auth
  // which applies RLS based on the logged-in user's session.
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

export interface Client {
  id: string
  email: string
  created_at: string
  last_sign_in_at: string | null
  raw_user_meta_data: {
    full_name?: string
    avatar_url?: string
  }
}

export interface CheckIn {
  id: string
  user_id: string
  created_at: string
  week_number: number
  year: number
  feeling: number | null
  weight: number | null
  energy_level: number | null
  sleep_quality: number | null
  stress_level: number | null
  nutrition_adherence: number | null
  training_adherence: number | null
  notes: string | null
  coach_feedback: string | null
  coach_feedback_at: string | null
  coach_id: string | null
}

export interface DailyCheckIn {
  id: string
  user_id: string
  created_at: string
  check_in_date: string
  weight: number | null
  mood: number | null
  sleep_quality: number | null
  notes: string | null
  coach_feedback: string | null
  coach_feedback_at: string | null
  coach_id: string | null
}

export interface ClientWithStats extends Client {
  checkInsCount: number
  dailyCheckInsCount: number
  latestCheckIn: CheckIn | null
  latestDailyCheckIn: DailyCheckIn | null
  todayDailyCheckIn: DailyCheckIn | null
  client_status: string | null
  assigned_coach_id: string | null
  assigned_coach_name: string | null
}

export async function getClients(): Promise<{ success: boolean; clients?: ClientWithStats[]; error?: string }> {
  // Role-aware: ADMIN sees all clients, COACH sees only assigned clients
  const currentUser = await getCurrentUser()
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'COACH')) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const supabase = await getSupabaseAdmin()

    // Parallel fetch
    const [usersRes, profilesRes, checkInsRes, dailyRes, relationshipsRes] = await Promise.all([
      supabase.auth.admin.listUsers(),
      supabase.from("profiles").select("user_id, first_name, last_name, client_status"),
      supabase.from("check_ins").select("*").order("created_at", { ascending: false }),
      supabase.from("daily_check_ins").select("*").order("check_in_date", { ascending: false }),
      supabase.from("coaching_relationships").select("client_id, coach_id, status").eq("status", "ACTIVE"),
    ])

    if (usersRes.error) {
      console.error("Error fetching users:", usersRes.error)
      return { success: false, error: usersRes.error.message }
    }

    const profiles = profilesRes.data || []
    const checkIns = checkInsRes.data || []
    const dailyCheckIns = dailyRes.data || []
    const relationships = relationshipsRes.data || []

    // COACH: only show clients assigned to this coach
    // ADMIN: show all clients
    const assignedClientIds = currentUser.role === 'COACH'
      ? new Set(relationships.filter(r => r.coach_id === currentUser.id).map(r => r.client_id))
      : null // null = no filter (show all)

    const today = new Date().toISOString().split("T")[0]

    // Only show CLIENT role users (filtered by coach assignment for COACH role)
    const clients: ClientWithStats[] = usersRes.data.users
      .filter(u => {
        if ((u.user_metadata?.role || "CLIENT") !== "CLIENT") return false
        if (assignedClientIds && !assignedClientIds.has(u.id)) return false
        return true
      })
      .map((user) => {
        // Name resolution: profiles table → user_metadata
        const profile = profiles.find(p => p.user_id === user.id)
        const firstName = profile?.first_name || user.user_metadata?.first_name || ""
        const lastName = profile?.last_name || user.user_metadata?.last_name || ""
        const fullName = [firstName, lastName].filter(Boolean).join(" ") || user.user_metadata?.full_name || ""

        const userCheckIns = checkIns?.filter((ci) => ci.user_id === user.id) || []
        const userDailyCheckIns = dailyCheckIns?.filter((ci) => ci.user_id === user.id) || []
        const todayDaily = userDailyCheckIns.find((ci) => ci.check_in_date === today) || null

        const relationship = relationships.find(r => r.client_id === user.id)

        return {
          id: user.id,
          email: user.email || "",
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          raw_user_meta_data: { ...user.user_metadata, full_name: fullName } || {},
          checkInsCount: userCheckIns.length,
          dailyCheckInsCount: userDailyCheckIns.length,
          latestCheckIn: userCheckIns.length > 0 ? userCheckIns[0] : null,
          latestDailyCheckIn: userDailyCheckIns.length > 0 ? userDailyCheckIns[0] : null,
          todayDailyCheckIn: todayDaily,
          client_status: (profile as any)?.client_status || null,
          assigned_coach_id: relationship?.coach_id || null,
          assigned_coach_name: null,
        }
      })

    // Populate coach names from user data
    const coachIds = new Set(clients.map(c => c.assigned_coach_id).filter(Boolean))
    if (coachIds.size > 0) {
      const coachMap = new Map<string, string>()
      usersRes.data.users.forEach(u => {
        if (coachIds.has(u.id)) {
          const p = profiles.find(pr => pr.user_id === u.id)
          const name = [p?.first_name, p?.last_name].filter(Boolean).join(" ") || u.user_metadata?.full_name || u.email || ""
          coachMap.set(u.id, name)
        }
      })
      clients.forEach(c => {
        if (c.assigned_coach_id && coachMap.has(c.assigned_coach_id)) {
          c.assigned_coach_name = coachMap.get(c.assigned_coach_id)!
        }
      })
    }

    // Sort by most recent check-in first
    clients.sort((a, b) => {
      if (!a.latestCheckIn && !b.latestCheckIn) return 0
      if (!a.latestCheckIn) return 1
      if (!b.latestCheckIn) return -1
      return new Date(b.latestCheckIn.created_at).getTime() - new Date(a.latestCheckIn.created_at).getTime()
    })

    return { success: true, clients }
  } catch (error) {
    console.error("Error in getClients:", error)
    return { success: false, error: "Failed to fetch clients" }
  }
}

export async function getClientCheckIns(userId: string): Promise<{ success: boolean; checkIns?: CheckIn[]; error?: string }> {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const supabase = await getSupabaseAdmin()

    const { data, error } = await supabase
      .from("check_ins")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    console.log(`[getClientCheckIns] userId: ${userId}, found: ${data?.length ?? 0}, error: ${error?.message || 'none'}`)

    if (error) {
      console.error("Error fetching check-ins:", error)
      return { success: false, error: error.message }
    }

    return { success: true, checkIns: data }
  } catch (error) {
    console.error("Error in getClientCheckIns:", error)
    return { success: false, error: "Failed to fetch check-ins" }
  }
}

export async function getClientDetails(userId: string): Promise<{ success: boolean; client?: Client; error?: string }> {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const supabase = await getSupabaseAdmin()

    const { data, error } = await supabase.auth.admin.getUserById(userId)

    if (error) {
      console.error("Error fetching user:", error)
      return { success: false, error: error.message }
    }

    const client: Client = {
      id: data.user.id,
      email: data.user.email || "",
      created_at: data.user.created_at,
      last_sign_in_at: data.user.last_sign_in_at,
      raw_user_meta_data: data.user.user_metadata || {},
    }

    return { success: true, client }
  } catch (error) {
    console.error("Error in getClientDetails:", error)
    return { success: false, error: "Failed to fetch client details" }
  }
}

export async function getClientDailyCheckIns(userId: string): Promise<{ success: boolean; checkIns?: DailyCheckIn[]; error?: string }> {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const supabase = await getSupabaseAdmin()

    const { data, error } = await supabase
      .from("daily_check_ins")
      .select("*")
      .eq("user_id", userId)
      .order("check_in_date", { ascending: false })
      .limit(90)

    if (error) {
      console.error("Error fetching daily check-ins:", error)
      return { success: false, error: error.message }
    }

    return { success: true, checkIns: data }
  } catch (error) {
    console.error("Error in getClientDailyCheckIns:", error)
    return { success: false, error: "Failed to fetch daily check-ins" }
  }
}

export async function submitCoachFeedback(
  checkInId: string,
  checkInType: "daily" | "weekly",
  feedback: string
): Promise<{ success: boolean; error?: string }> {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const supabase = await getSupabaseAdmin()
    const table = checkInType === "daily" ? "daily_check_ins" : "check_ins"

    // Get coach user id
    const cookieStore = await cookies()
    const anonSupabase = createServerClient(
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
    const { data: { user } } = await anonSupabase.auth.getUser()

    const { error } = await supabase
      .from(table)
      .update({
        coach_feedback: feedback,
        coach_feedback_at: new Date().toISOString(),
        coach_id: user?.id || null,
      })
      .eq("id", checkInId)

    if (error) {
      console.error("Error submitting feedback:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in submitCoachFeedback:", error)
    return { success: false, error: "Failed to submit feedback" }
  }
}

// ============================================================
// CLIENT PROFILE (extended data for detail page)
// ============================================================

export interface ClientProfile {
  user_id: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  coach_id: string | null
  created_at: string
}

export async function getClientProfile(userId: string) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) return { success: false, error: "Unauthorized" }

  const supabase = await getSupabaseAdmin()

  // Get auth user data
  const { data: authData } = await supabase.auth.admin.getUserById(userId)

  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle()

  // Get intake form
  const { data: intake } = await supabase
    .from("intake_forms")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  return {
    success: true,
    client: authData?.user ? {
      id: authData.user.id,
      email: authData.user.email || "",
      created_at: authData.user.created_at,
      last_sign_in_at: authData.user.last_sign_in_at,
      raw_user_meta_data: authData.user.user_metadata || {},
    } : null,
    profile: profile || null,
    intake: intake || null,
  }
}

// ============================================================
// CLIENT WORKOUTS
// ============================================================

export async function getClientWorkouts(userId: string) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) return { success: false, error: "Unauthorized" }

  const supabase = await getSupabaseAdmin()

  // Fetch completed client_workouts with nested template name + set-level logs + exercise names
  const { data: workouts, error } = await supabase
    .from("client_workouts")
    .select(`
      id,
      workout_template_id,
      scheduled_date,
      completed,
      completed_at,
      week_number,
      client_program_id,
      workout_templates (
        id, name, description
      ),
      workout_logs (
        id, exercise_id, set_number, reps_completed, weight_kg,
        prescribed_reps, prescribed_weight_kg, prescribed_rpe, prescribed_rir,
        actual_rpe, actual_rir, notes, logged_at,
        exercises ( id, name, category, thumbnail_url )
      )
    `)
    .eq("client_id", userId)
    .eq("completed", true)
    .order("completed_at", { ascending: false })
    .limit(100)

  if (error) return { success: false, error: error.message }

  return { success: true, workouts: workouts || [] }
}

// ============================================================
// CLIENT NUTRITION / FOOD LOGS
// ============================================================

export async function getClientFoodLogs(userId: string, days: number = 7) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) return { success: false, error: "Unauthorized" }

  const supabase = await getSupabaseAdmin()

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from("food_logs")
    .select("*")
    .eq("user_id", userId)
    .gte("date", startDate.toISOString().split("T")[0])
    .order("date", { ascending: false })

  if (error) return { success: false, error: error.message }

  // Get nutrition targets
  const { data: targets } = await supabase
    .from("nutrition_targets")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle()

  return { success: true, foodLogs: data || [], targets: targets || null }
}

// ============================================================
// CLIENT HEALTH DATA
// ============================================================

export async function getClientHealthSummary(userId: string) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) return { success: false, error: "Unauthorized" }

  const supabase = await getSupabaseAdmin()
  const today = new Date().toISOString().split("T")[0]

  // Today's data
  const { data: todayData } = await supabase
    .from("health_data")
    .select("*")
    .eq("user_id", userId)
    .eq("date", today)

  // Last 14 days
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 14)

  const { data: historyData } = await supabase
    .from("health_data")
    .select("*")
    .eq("user_id", userId)
    .gte("date", startDate.toISOString().split("T")[0])
    .order("date", { ascending: true })

  // Wearable connection
  const { data: connection } = await supabase
    .from("wearable_connections")
    .select("*")
    .eq("user_id", userId)
    .eq("is_connected", true)
    .maybeSingle()

  return {
    success: true,
    todayData: todayData || [],
    historyData: historyData || [],
    isConnected: !!connection,
    lastSync: connection?.last_sync_at || null,
  }
}

// ============================================================
// COACH NOTES (private)
// ============================================================

export interface CoachNote {
  id: string
  coach_id: string
  client_id: string
  content: string
  is_pinned: boolean
  created_at: string
  updated_at: string
}

export async function getCoachNotes(clientId: string) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) return { success: false, error: "Unauthorized" }

  const supabase = await getSupabaseAdmin()

  const cookieStore = await cookies()
  const anonSupabase = createServerClient(
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
  const { data: { user } } = await anonSupabase.auth.getUser()
  if (!user) return { success: false, error: "Unauthorized" }

  const { data, error } = await supabase
    .from("coach_notes")
    .select("*")
    .eq("coach_id", user.id)
    .eq("client_id", clientId)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) return { success: false, error: error.message }
  return { success: true, notes: data || [] }
}

export async function addCoachNote(clientId: string, content: string) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) return { success: false, error: "Unauthorized" }

  const supabase = await getSupabaseAdmin()

  const cookieStore = await cookies()
  const anonSupabase = createServerClient(
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
  const { data: { user } } = await anonSupabase.auth.getUser()
  if (!user) return { success: false, error: "Unauthorized" }

  const { error } = await supabase
    .from("coach_notes")
    .insert({ coach_id: user.id, client_id: clientId, content })

  if (error) return { success: false, error: error.message }

  // Log coaching event
  try {
    const { logCoachingEventDirect } = await import("./coaching-events")
    await logCoachingEventDirect(supabase, {
      clientId,
      coachId: user.id,
      eventType: "coach_note_added",
      area: "general",
      title: "Notitie toegevoegd",
      description: content.length > 100 ? content.slice(0, 100) + "..." : content,
      source: "manual",
    })
  } catch (e) { /* non-critical */ }

  return { success: true }
}

export async function deleteCoachNote(noteId: string) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) return { success: false, error: "Unauthorized" }

  const supabase = await getSupabaseAdmin()

  const { error } = await supabase
    .from("coach_notes")
    .delete()
    .eq("id", noteId)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function togglePinNote(noteId: string) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) return { success: false, error: "Unauthorized" }

  const supabase = await getSupabaseAdmin()

  const { data: note } = await supabase
    .from("coach_notes")
    .select("is_pinned")
    .eq("id", noteId)
    .single()

  if (!note) return { success: false, error: "Note not found" }

  const { error } = await supabase
    .from("coach_notes")
    .update({ is_pinned: !note.is_pinned })
    .eq("id", noteId)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ============================================================
// CLIENT GOALS
// ============================================================

export interface ClientGoal {
  id: string
  coach_id: string
  client_id: string
  title: string
  description: string | null
  target_date: string | null
  status: "active" | "completed" | "cancelled"
  created_at: string
  completed_at: string | null
}

export async function getClientGoals(clientId: string) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) return { success: false, error: "Unauthorized" }

  const supabase = await getSupabaseAdmin()

  const { data, error } = await supabase
    .from("client_goals")
    .select("*")
    .eq("client_id", clientId)
    .order("status", { ascending: true })
    .order("created_at", { ascending: false })

  if (error) return { success: false, error: error.message }
  return { success: true, goals: data || [] }
}

export async function addClientGoal(clientId: string, input: { title: string; description?: string; target_date?: string }) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) return { success: false, error: "Unauthorized" }

  const supabase = await getSupabaseAdmin()

  const cookieStore = await cookies()
  const anonSupabase = createServerClient(
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
  const { data: { user } } = await anonSupabase.auth.getUser()
  if (!user) return { success: false, error: "Unauthorized" }

  const { data: goal, error } = await supabase
    .from("client_goals")
    .insert({
      coach_id: user.id,
      client_id: clientId,
      title: input.title,
      description: input.description || null,
      target_date: input.target_date || null,
    })
    .select("id")
    .single()

  if (error) return { success: false, error: error.message }

  // Log coaching event
  try {
    const { logCoachingEventDirect } = await import("./coaching-events")
    await logCoachingEventDirect(supabase, {
      clientId,
      coachId: user.id,
      eventType: "goal_added",
      area: "general",
      title: `Doel: ${input.title}`,
      description: input.description || null,
      source: "manual",
      relatedEntityType: "client_goal",
      relatedEntityId: goal?.id,
    })
  } catch (e) { /* non-critical */ }

  return { success: true }
}

export async function updateGoalStatus(goalId: string, status: "active" | "completed" | "cancelled") {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) return { success: false, error: "Unauthorized" }

  const supabase = await getSupabaseAdmin()

  const { error } = await supabase
    .from("client_goals")
    .update({
      status,
      completed_at: status === "completed" ? new Date().toISOString() : null,
    })
    .eq("id", goalId)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function deleteClientGoal(goalId: string) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) return { success: false, error: "Unauthorized" }

  const supabase = await getSupabaseAdmin()

  const { error } = await supabase
    .from("client_goals")
    .delete()
    .eq("id", goalId)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ============================================================
// CLIENT HABITS
// ============================================================

export async function getClientHabits(userId: string) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) return { success: false, error: "Unauthorized" }

  const supabase = await getSupabaseAdmin()

  const { data: habits } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)

  // Get last 14 days of logs
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 14)

  const { data: logs } = await supabase
    .from("habit_logs")
    .select("*")
    .eq("user_id", userId)
    .gte("date", startDate.toISOString().split("T")[0])

  return { success: true, habits: habits || [], logs: logs || [] }
}

// ============================================================
// CLIENT PROGRESS PHOTOS
// ============================================================

export async function getClientProgressPhotos(userId: string) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) return { success: false, error: "Unauthorized" }

  const supabase = await getSupabaseAdmin()

  const { data, error } = await supabase
    .from("progress_photos")
    .select("*")
    .eq("user_id", userId)
    .order("taken_at", { ascending: false })
    .limit(20)

  if (error) return { success: false, error: error.message }
  return { success: true, photos: data || [] }
}

// ============================================================
// ENRICHED CLIENTS OVERVIEW (for coach clients page)
// ============================================================

export interface EnrichedClient {
  id: string
  email: string
  full_name: string
  avatar_initial: string
  avatar_url: string | null
  created_at: string
  last_sign_in_at: string | null
  // Activity
  activity_status: "active" | "moderate" | "inactive" // based on last login
  days_since_login: number | null
  // Check-ins
  weekly_checkins_count: number
  daily_checkins_count: number
  last_checkin_date: string | null
  checkin_streak: number // consecutive weeks with check-in
  compliance_30d: number // % of last 4 weeks with weekly check-in
  // Goals
  active_goals_count: number
  // Workouts
  workout_logs_30d: number
  // Latest weight
  latest_weight: number | null
  weight_trend: number | null // diff between latest 2 weights
  // Flags
  needs_attention: boolean // no check-in in 7+ days
  has_pending_feedback: boolean // check-in without coach feedback
  // Approval status
  client_status: string | null
}

export async function getCoachClientsOverview(): Promise<{ success: boolean; clients?: EnrichedClient[]; error?: string }> {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'COACH')) {
      return { success: false, error: "Unauthorized" }
    }
    const supabase = await getSupabaseAdmin()

    // Parallel fetch all data (including coaching relationships for coach filtering)
    const [usersResult, profilesResult, checkInsResult, dailyResult, goalsResult, logsResult, relationshipsResult] = await Promise.all([
      supabase.auth.admin.listUsers(),
      supabase.from("profiles").select("user_id, first_name, last_name, client_status, avatar_url"),
      supabase.from("check_ins").select("user_id, created_at, weight, week_number, year, coach_feedback").order("created_at", { ascending: false }),
      supabase.from("daily_check_ins").select("user_id, check_in_date, weight, coach_feedback").order("check_in_date", { ascending: false }),
      supabase.from("client_goals").select("client_id, status").eq("status", "active"),
      supabase.from("workout_logs").select("user_id, completed_at").gte("completed_at", new Date(Date.now() - 30 * 86400000).toISOString()),
      supabase.from("coaching_relationships").select("client_id, coach_id, status").eq("status", "ACTIVE"),
    ])

    if (usersResult.error) return { success: false, error: usersResult.error.message }

    const profiles = profilesResult.data || []
    const checkIns = checkInsResult.data || []
    const dailyCheckIns = dailyResult.data || []
    const goals = goalsResult.data || []
    const workoutLogs = logsResult.data || []
    const relationships = relationshipsResult.data || []

    // Coach dashboard: only show clients actively assigned to this user
    // (Admin sees ALL clients in the admin dashboard via getClients(), but here only their own)
    const assignedClientIds = new Set(
      relationships.filter(r => r.coach_id === currentUser.id).map(r => r.client_id)
    )

    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000)

    // Get current week/year for streak calculation
    const getWeekNumber = (d: Date) => {
      const start = new Date(d.getFullYear(), 0, 1)
      const diff = d.getTime() - start.getTime()
      return Math.ceil((diff / 86400000 + start.getDay() + 1) / 7)
    }
    const currentWeek = getWeekNumber(now)
    const currentYear = now.getFullYear()

    const clients: EnrichedClient[] = usersResult.data.users
      .filter(u => {
        if ((u.user_metadata?.role || "CLIENT") !== "CLIENT") return false
        // Only show clients assigned to this coach/admin
        if (!assignedClientIds.has(u.id)) return false
        return true
      })
      .map(user => {
        // Name resolution: try profiles table first, then user_metadata
        const profile = profiles.find(p => p.user_id === user.id)
        const firstName = profile?.first_name || user.user_metadata?.first_name || user.user_metadata?.firstName || ""
        const lastName = profile?.last_name || user.user_metadata?.last_name || user.user_metadata?.lastName || ""
        const name = [firstName, lastName].filter(Boolean).join(" ") || user.user_metadata?.full_name || ""
        const userCheckIns = checkIns.filter(ci => ci.user_id === user.id)
        const userDailyCheckIns = dailyCheckIns.filter(ci => ci.user_id === user.id)
        const userGoals = goals.filter(g => g.client_id === user.id)
        const userLogs = workoutLogs.filter(l => l.user_id === user.id)

        // Activity status
        const lastLogin = user.last_sign_in_at ? new Date(user.last_sign_in_at) : null
        const daysSinceLogin = lastLogin ? Math.floor((now.getTime() - lastLogin.getTime()) / 86400000) : null
        const activityStatus: "active" | "moderate" | "inactive" =
          daysSinceLogin === null ? "inactive" :
          daysSinceLogin <= 2 ? "active" :
          daysSinceLogin <= 7 ? "moderate" : "inactive"

        // Last check-in date
        const lastCheckInDate = userCheckIns.length > 0 ? userCheckIns[0].created_at :
          userDailyCheckIns.length > 0 ? userDailyCheckIns[0].check_in_date : null

        // Compliance: how many of last 4 weeks had a weekly check-in
        const recentWeeks = new Set<string>()
        for (let i = 0; i < 4; i++) {
          const d = new Date(now.getTime() - i * 7 * 86400000)
          const wn = getWeekNumber(d)
          const yr = d.getFullYear()
          if (userCheckIns.some(ci => ci.week_number === wn && ci.year === yr)) {
            recentWeeks.add(`${yr}-${wn}`)
          }
        }
        const compliance = Math.round((recentWeeks.size / 4) * 100)

        // Streak: consecutive weeks with check-in going backwards
        let streak = 0
        for (let i = 0; i < 12; i++) {
          const d = new Date(now.getTime() - i * 7 * 86400000)
          const wn = getWeekNumber(d)
          const yr = d.getFullYear()
          if (userCheckIns.some(ci => ci.week_number === wn && ci.year === yr)) {
            streak++
          } else {
            break
          }
        }

        // Weight
        const weightsFromWeekly = userCheckIns.filter(ci => ci.weight).map(ci => ci.weight as number)
        const weightsFromDaily = userDailyCheckIns.filter(ci => ci.weight).map(ci => ci.weight as number)
        const latestWeight = weightsFromDaily[0] || weightsFromWeekly[0] || null
        const secondWeight = weightsFromDaily[1] || weightsFromWeekly[1] || null
        const weightTrend = latestWeight && secondWeight ? Math.round((latestWeight - secondWeight) * 10) / 10 : null

        // Needs attention: no check-in in 7+ days
        const lastCI = lastCheckInDate ? new Date(lastCheckInDate) : null
        const needsAttention = !lastCI || lastCI < sevenDaysAgo

        // Has pending feedback
        const hasPendingFeedback = userCheckIns.some(ci => !ci.coach_feedback) ||
          userDailyCheckIns.slice(0, 7).some(ci => !ci.coach_feedback)

        return {
          id: user.id,
          email: user.email || "",
          full_name: name || "Naamloos",
          avatar_initial: (name || user.email || "C")[0].toUpperCase(),
          avatar_url: profile?.avatar_url || null,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at || null,
          activity_status: activityStatus,
          days_since_login: daysSinceLogin,
          weekly_checkins_count: userCheckIns.length,
          daily_checkins_count: userDailyCheckIns.length,
          last_checkin_date: lastCheckInDate,
          checkin_streak: streak,
          compliance_30d: compliance,
          active_goals_count: userGoals.length,
          workout_logs_30d: userLogs.length,
          latest_weight: latestWeight,
          weight_trend: weightTrend,
          needs_attention: needsAttention,
          has_pending_feedback: hasPendingFeedback,
          client_status: (profile as any)?.client_status || null,
        }
      })

    // Sort: needs attention first, then by last check-in (most recent first)
    clients.sort((a, b) => {
      if (a.needs_attention !== b.needs_attention) return a.needs_attention ? -1 : 1
      if (!a.last_checkin_date && !b.last_checkin_date) return 0
      if (!a.last_checkin_date) return 1
      if (!b.last_checkin_date) return -1
      return new Date(b.last_checkin_date).getTime() - new Date(a.last_checkin_date).getTime()
    })

    return { success: true, clients }
  } catch (error) {
    console.error("Error in getCoachClientsOverview:", error)
    return { success: false, error: "Failed to fetch clients overview" }
  }
}

// ============================================================
// DASHBOARD: RECENT CHECK-INS FEED
// ============================================================

export interface RecentCheckIn {
  id: string
  user_id: string
  client_name: string
  client_initials: string
  created_at: string
  type: "weekly" | "daily"
  has_coach_feedback: boolean
  weight: number | null
  note: string | null
}

export async function getDashboardRecentCheckIns(limit = 8): Promise<{ success: boolean; checkIns?: RecentCheckIn[]; error?: string }> {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'COACH')) {
      return { success: false, error: "Unauthorized" }
    }
    const supabase = await getSupabaseAdmin()

    // Get coach's assigned clients
    const { data: relationships } = await supabase
      .from("coaching_relationships")
      .select("client_id")
      .eq("coach_id", currentUser.id)
      .eq("status", "ACTIVE")
    const assignedIds = new Set((relationships || []).map(r => r.client_id))
    if (assignedIds.size === 0) return { success: true, checkIns: [] }

    // Fetch recent weekly + daily check-ins
    const [weeklyResult, dailyResult, profilesResult] = await Promise.all([
      supabase
        .from("check_ins")
        .select("id, user_id, created_at, weight, coach_feedback, notes")
        .in("user_id", Array.from(assignedIds))
        .order("created_at", { ascending: false })
        .limit(limit),
      supabase
        .from("daily_check_ins")
        .select("id, user_id, check_in_date, weight, coach_feedback, notes")
        .in("user_id", Array.from(assignedIds))
        .order("check_in_date", { ascending: false })
        .limit(limit),
      supabase
        .from("profiles")
        .select("user_id, first_name, last_name")
        .in("user_id", Array.from(assignedIds)),
    ])

    const profiles = new Map((profilesResult.data || []).map(p => [p.user_id, p]))

    const allCheckIns: RecentCheckIn[] = []

    for (const ci of weeklyResult.data || []) {
      const profile = profiles.get(ci.user_id)
      const name = profile ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() : "Onbekend"
      const initials = profile
        ? `${(profile.first_name || "")[0] || ""}${(profile.last_name || "")[0] || ""}`.toUpperCase()
        : "?"
      allCheckIns.push({
        id: ci.id,
        user_id: ci.user_id,
        client_name: name,
        client_initials: initials,
        created_at: ci.created_at,
        type: "weekly",
        has_coach_feedback: !!ci.coach_feedback,
        weight: ci.weight,
        note: ci.notes || null,
      })
    }

    for (const ci of dailyResult.data || []) {
      const profile = profiles.get(ci.user_id)
      const name = profile ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() : "Onbekend"
      const initials = profile
        ? `${(profile.first_name || "")[0] || ""}${(profile.last_name || "")[0] || ""}`.toUpperCase()
        : "?"
      allCheckIns.push({
        id: ci.id,
        user_id: ci.user_id,
        client_name: name,
        client_initials: initials,
        created_at: ci.check_in_date,
        type: "daily",
        has_coach_feedback: !!ci.coach_feedback,
        weight: ci.weight,
        note: ci.notes || null,
      })
    }

    // Sort by date descending, take limit
    allCheckIns.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return { success: true, checkIns: allCheckIns.slice(0, limit) }
  } catch (error) {
    console.error("Error in getDashboardRecentCheckIns:", error)
    return { success: false, error: "Failed to fetch recent check-ins" }
  }
}

// ============================================================
// CLIENT CHECK-IN SETTINGS
// ============================================================

export async function getClientCheckInSettings(clientId: string): Promise<{ success: boolean; weeklyCheckInDay?: number; error?: string }> {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) return { success: false, error: "Unauthorized" }

  try {
    const supabase = await getSupabaseAdmin()

    const { data, error } = await supabase
      .from("client_check_in_settings")
      .select("weekly_check_in_day")
      .eq("client_id", clientId)
      .maybeSingle()

    if (error) return { success: false, error: error.message }

    return { success: true, weeklyCheckInDay: data?.weekly_check_in_day ?? 0 }
  } catch (error) {
    console.error("Error in getClientCheckInSettings:", error)
    return { success: false, error: "Failed to fetch check-in settings" }
  }
}

export async function updateClientCheckInDay(clientId: string, day: number): Promise<{ success: boolean; error?: string }> {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) return { success: false, error: "Unauthorized" }

  if (day < 0 || day > 6) return { success: false, error: "Day must be between 0 (Sunday) and 6 (Saturday)" }

  try {
    const supabase = await getSupabaseAdmin()

    // Get coach user id
    const cookieStore = await cookies()
    const anonSupabase = createServerClient(
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
    const { data: { user } } = await anonSupabase.auth.getUser()
    if (!user) return { success: false, error: "Unauthorized" }

    const { error } = await supabase
      .from("client_check_in_settings")
      .upsert(
        {
          client_id: clientId,
          coach_id: user.id,
          weekly_check_in_day: day,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "client_id" }
      )

    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (error) {
    console.error("Error in updateClientCheckInDay:", error)
    return { success: false, error: "Failed to update check-in day" }
  }
}

// ============================================================
// CLIENT APPROVAL WORKFLOW
// ============================================================

async function getAuthUserId() {
  const cookieStore = await cookies()
  const anonSupabase = createServerClient(
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
  const { data: { user } } = await anonSupabase.auth.getUser()
  return user?.id || null
}

export async function resetClientIntake(clientId: string): Promise<{ success: boolean; error?: string }> {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) return { success: false, error: "Unauthorized" }

  try {
    const supabase = await getSupabaseAdmin()
    const { error } = await supabase
      .from("intake_forms")
      .delete()
      .eq("user_id", clientId)

    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (error) {
    console.error("Error in resetClientIntake:", error)
    return { success: false, error: "Failed to reset intake" }
  }
}

export async function approveClient(clientId: string): Promise<{ success: boolean; error?: string }> {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) return { success: false, error: "Unauthorized" }

  try {
    const supabase = await getSupabaseAdmin()
    const userId = await getAuthUserId()

    const { error } = await supabase
      .from("profiles")
      .update({
        client_status: "approved",
        status_updated_at: new Date().toISOString(),
        status_updated_by: userId,
        rejection_reason: null,
      })
      .eq("user_id", clientId)

    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (error) {
    console.error("Error in approveClient:", error)
    return { success: false, error: "Failed to approve client" }
  }
}

export async function rejectClient(clientId: string, reason?: string): Promise<{ success: boolean; error?: string }> {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) return { success: false, error: "Unauthorized" }

  try {
    const supabase = await getSupabaseAdmin()
    const userId = await getAuthUserId()

    const { error } = await supabase
      .from("profiles")
      .update({
        client_status: "rejected",
        status_updated_at: new Date().toISOString(),
        status_updated_by: userId,
        rejection_reason: reason || null,
      })
      .eq("user_id", clientId)

    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (error) {
    console.error("Error in rejectClient:", error)
    return { success: false, error: "Failed to reject client" }
  }
}

export async function assignCoachToClient(clientId: string, coachId: string): Promise<{ success: boolean; error?: string }> {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) return { success: false, error: "Unauthorized" }

  try {
    const supabase = await getSupabaseAdmin()

    // Check for existing relationship between this specific coach and client
    // (unique constraint on [coach_id, client_id])
    const { data: existing } = await supabase
      .from("coaching_relationships")
      .select("id, status")
      .eq("client_id", clientId)
      .eq("coach_id", coachId)
      .maybeSingle()

    if (existing) {
      // Reactivate existing relationship
      const { error } = await supabase
        .from("coaching_relationships")
        .update({ status: "ACTIVE", ended_at: null })
        .eq("id", existing.id)
      if (error) {
        console.error("Error reactivating relationship:", error)
        return { success: false, error: error.message }
      }
    } else {
      // End any current active relationships for this client (with other coaches)
      const { error: endError } = await supabase
        .from("coaching_relationships")
        .update({ status: "ENDED", ended_at: new Date().toISOString() })
        .eq("client_id", clientId)
        .eq("status", "ACTIVE")
      if (endError) {
        console.error("Error ending previous relationships:", endError)
      }

      // Create new relationship
      const { error } = await supabase
        .from("coaching_relationships")
        .insert({
          id: crypto.randomUUID(),
          client_id: clientId,
          coach_id: coachId,
          status: "ACTIVE",
          started_at: new Date().toISOString(),
        })
      if (error) {
        console.error("Error creating relationship:", error)
        return { success: false, error: error.message }
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in assignCoachToClient:", error)
    return { success: false, error: "Failed to assign coach" }
  }
}

export async function unassignCoach(clientId: string): Promise<{ success: boolean; error?: string }> {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) return { success: false, error: "Unauthorized" }

  try {
    const supabase = await getSupabaseAdmin()

    // End all active coaching relationships for this client
    const { error } = await supabase
      .from("coaching_relationships")
      .update({ status: "ENDED", ended_at: new Date().toISOString() })
      .eq("client_id", clientId)
      .eq("status", "ACTIVE")

    if (error) {
      console.error("Error unassigning coach:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in unassignCoach:", error)
    return { success: false, error: "Failed to unassign coach" }
  }
}

export interface CoachOption {
  id: string
  email: string
  full_name: string
}

export async function getCoaches(): Promise<{ success: boolean; coaches?: CoachOption[]; error?: string }> {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) return { success: false, error: "Unauthorized" }

  try {
    const supabase = await getSupabaseAdmin()

    const { data: usersData, error } = await supabase.auth.admin.listUsers()
    if (error) return { success: false, error: error.message }

    const coaches: CoachOption[] = usersData.users
      .filter(u => {
        const role = u.user_metadata?.role || "CLIENT"
        return role === "COACH" || role === "ADMIN"
      })
      .map(u => ({
        id: u.id,
        email: u.email || "",
        full_name: [u.user_metadata?.first_name, u.user_metadata?.last_name].filter(Boolean).join(" ") || u.user_metadata?.full_name || u.email || "",
      }))

    return { success: true, coaches }
  } catch (error) {
    console.error("Error in getCoaches:", error)
    return { success: false, error: "Failed to fetch coaches" }
  }
}

// ============================================================
// USER MANAGEMENT (Admin only)
// ============================================================

export interface ManagedUser {
  id: string
  email: string
  full_name: string
  role: string
  client_status: string | null
  created_at: string
  last_sign_in_at: string | null
}

export async function getAllUsers(): Promise<{ success: boolean; users?: ManagedUser[]; error?: string }> {
  const isAdmin = await checkAdmin()
  if (!isAdmin) return { success: false, error: "Alleen admins hebben toegang" }

  try {
    const supabase = await getSupabaseAdmin()
    const { data: usersData, error } = await supabase.auth.admin.listUsers()
    if (error) return { success: false, error: error.message }

    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, first_name, last_name, client_status")

    const profileMap = new Map((profiles || []).map(p => [p.user_id, p]))

    const users: ManagedUser[] = usersData.users.map(u => {
      const profile = profileMap.get(u.id)
      const firstName = profile?.first_name || u.user_metadata?.first_name || ""
      const lastName = profile?.last_name || u.user_metadata?.last_name || ""
      const fullName = [firstName, lastName].filter(Boolean).join(" ") || u.user_metadata?.full_name || ""
      return {
        id: u.id,
        email: u.email || "",
        full_name: fullName,
        role: u.user_metadata?.role || "CLIENT",
        client_status: profile?.client_status || null,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at || null,
      }
    })

    users.sort((a, b) => {
      const roleOrder: Record<string, number> = { ADMIN: 0, COACH: 1, CLIENT: 2 }
      return (roleOrder[a.role] ?? 3) - (roleOrder[b.role] ?? 3)
    })

    return { success: true, users }
  } catch (error) {
    console.error("Error in getAllUsers:", error)
    return { success: false, error: "Failed to fetch users" }
  }
}

export async function changeUserRole(userId: string, newRole: string): Promise<{ success: boolean; error?: string }> {
  const isAdmin = await checkAdmin()
  if (!isAdmin) return { success: false, error: "Alleen admins kunnen rollen wijzigen" }

  if (!["CLIENT", "COACH", "ADMIN"].includes(newRole)) {
    return { success: false, error: "Ongeldige rol" }
  }

  try {
    const supabase = await getSupabaseAdmin()
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { role: newRole },
    })
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (error) {
    console.error("Error in changeUserRole:", error)
    return { success: false, error: "Failed to change role" }
  }
}

export async function deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
  const isAdmin = await checkAdmin()
  if (!isAdmin) return { success: false, error: "Alleen admins kunnen accounts verwijderen" }

  try {
    const supabase = await getSupabaseAdmin()

    // Don't allow deleting yourself
    const currentUserId = await getAuthUserId()
    if (currentUserId === userId) {
      return { success: false, error: "Je kunt je eigen account niet verwijderen" }
    }

    const { error } = await supabase.auth.admin.deleteUser(userId)
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (error) {
    console.error("Error in deleteUser:", error)
    return { success: false, error: "Failed to delete user" }
  }
}
