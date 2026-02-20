"use server"

import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// ============================================================
// AUTH HELPERS (replicated from admin-clients.ts pattern)
// ============================================================

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
// TYPE DEFINITIONS
// ============================================================

export type SessionType = 'pt_session' | 'video_call' | 'check_in_gesprek' | 'programma_review'
export type SessionStatus = 'scheduled' | 'confirmed' | 'completed' | 'no_show' | 'cancelled'
export type SessionMode = 'in_person' | 'video'

export interface ClientSession {
  id: string
  coach_id: string
  client_id: string
  type: SessionType
  status: SessionStatus
  start_time: string
  end_time: string
  mode: SessionMode
  location: string | null
  notes: string | null
  created_at: string
  updated_at: string
  // Joined client info
  client_name: string
  client_initials: string
}

export interface CreateSessionInput {
  clientId: string
  type: SessionType
  startTime: string
  endTime: string
  mode: SessionMode
  location?: string
  notes?: string
}

export interface AvailabilitySlot {
  id: string
  coach_id: string
  day_of_week: number
  start_time: string
  end_time: string
  active: boolean
}

export interface AvailabilityInput {
  dayOfWeek: number
  startTime: string
  endTime: string
  active: boolean
}

export interface WeekStats {
  totalSessions: number
  byType: Record<SessionType, number>
  byStatus: Record<SessionStatus, number>
  attendanceRate: number
  noShows: number
}

// ============================================================
// 1. GET COACH SESSIONS FOR A WEEK
// ============================================================

export async function getCoachSessions(
  weekStart: string
): Promise<{ success: boolean; data?: ClientSession[]; error?: string }> {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'COACH')) {
      return { success: false, error: "Unauthorized" }
    }

    const supabase = await getSupabaseAdmin()

    // Calculate week end (weekStart + 7 days)
    const startDate = new Date(weekStart)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 7)

    // Fetch sessions for this coach within the week
    const { data: sessions, error } = await supabase
      .from("client_sessions")
      .select("*")
      .eq("coach_id", currentUser.id)
      .gte("start_time", startDate.toISOString())
      .lt("start_time", endDate.toISOString())
      .order("start_time", { ascending: true })

    if (error) {
      console.error("Error fetching sessions:", error)
      return { success: false, error: error.message }
    }

    if (!sessions || sessions.length === 0) {
      return { success: true, data: [] }
    }

    // Get unique client IDs to fetch their names
    const clientIds = [...new Set(sessions.map(s => s.client_id))]

    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, first_name, last_name")
      .in("user_id", clientIds)

    const profileMap = new Map(
      (profiles || []).map(p => [p.user_id, p])
    )

    // Map sessions with client name + initials
    const enrichedSessions: ClientSession[] = sessions.map(session => {
      const profile = profileMap.get(session.client_id)
      const firstName = profile?.first_name || ""
      const lastName = profile?.last_name || ""
      const clientName = [firstName, lastName].filter(Boolean).join(" ") || "Onbekend"
      const clientInitials = `${(firstName[0] || "").toUpperCase()}${(lastName[0] || "").toUpperCase()}` || "?"

      return {
        id: session.id,
        coach_id: session.coach_id,
        client_id: session.client_id,
        type: session.type,
        status: session.status,
        start_time: session.start_time,
        end_time: session.end_time,
        mode: session.mode,
        location: session.location,
        notes: session.notes,
        created_at: session.created_at,
        updated_at: session.updated_at,
        client_name: clientName,
        client_initials: clientInitials,
      }
    })

    return { success: true, data: enrichedSessions }
  } catch (error) {
    console.error("Error in getCoachSessions:", error)
    return { success: false, error: "Failed to fetch sessions" }
  }
}

// ============================================================
// 2. CREATE SESSION
// ============================================================

export async function createSession(
  data: CreateSessionInput
): Promise<{ success: boolean; data?: { id: string }; error?: string }> {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'COACH')) {
      return { success: false, error: "Unauthorized" }
    }

    const supabase = await getSupabaseAdmin()

    const { data: session, error } = await supabase
      .from("client_sessions")
      .insert({
        coach_id: currentUser.id,
        client_id: data.clientId,
        type: data.type,
        status: "scheduled" as SessionStatus,
        start_time: data.startTime,
        end_time: data.endTime,
        mode: data.mode,
        location: data.location || null,
        notes: data.notes || null,
      })
      .select("id")
      .single()

    if (error) {
      console.error("Error creating session:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data: { id: session.id } }
  } catch (error) {
    console.error("Error in createSession:", error)
    return { success: false, error: "Failed to create session" }
  }
}

// ============================================================
// 3. UPDATE SESSION STATUS
// ============================================================

export async function updateSessionStatus(
  sessionId: string,
  status: SessionStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'COACH')) {
      return { success: false, error: "Unauthorized" }
    }

    const validStatuses: SessionStatus[] = ['scheduled', 'confirmed', 'completed', 'no_show', 'cancelled']
    if (!validStatuses.includes(status)) {
      return { success: false, error: "Invalid status value" }
    }

    const supabase = await getSupabaseAdmin()

    const { error } = await supabase
      .from("client_sessions")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId)
      .eq("coach_id", currentUser.id)

    if (error) {
      console.error("Error updating session status:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in updateSessionStatus:", error)
    return { success: false, error: "Failed to update session status" }
  }
}

// ============================================================
// 4. DELETE SESSION
// ============================================================

export async function deleteSession(
  sessionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'COACH')) {
      return { success: false, error: "Unauthorized" }
    }

    const supabase = await getSupabaseAdmin()

    const { error } = await supabase
      .from("client_sessions")
      .delete()
      .eq("id", sessionId)
      .eq("coach_id", currentUser.id)

    if (error) {
      console.error("Error deleting session:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in deleteSession:", error)
    return { success: false, error: "Failed to delete session" }
  }
}

// ============================================================
// 5. GET COACH AVAILABILITY
// ============================================================

export async function getCoachAvailability(): Promise<{ success: boolean; data?: AvailabilitySlot[]; error?: string }> {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'COACH')) {
      return { success: false, error: "Unauthorized" }
    }

    const supabase = await getSupabaseAdmin()

    const { data, error } = await supabase
      .from("coach_availability")
      .select("*")
      .eq("coach_id", currentUser.id)
      .order("day_of_week", { ascending: true })

    if (error) {
      console.error("Error fetching availability:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error in getCoachAvailability:", error)
    return { success: false, error: "Failed to fetch availability" }
  }
}

// ============================================================
// 6. UPDATE COACH AVAILABILITY
// ============================================================

export async function updateCoachAvailability(
  slots: AvailabilityInput[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'COACH')) {
      return { success: false, error: "Unauthorized" }
    }

    const supabase = await getSupabaseAdmin()

    // Delete all existing availability slots for this coach
    const { error: deleteError } = await supabase
      .from("coach_availability")
      .delete()
      .eq("coach_id", currentUser.id)

    if (deleteError) {
      console.error("Error deleting existing availability:", deleteError)
      return { success: false, error: deleteError.message }
    }

    // Insert new slots (only if there are any)
    if (slots.length > 0) {
      const rows = slots.map(slot => ({
        coach_id: currentUser.id,
        day_of_week: slot.dayOfWeek,
        start_time: slot.startTime,
        end_time: slot.endTime,
        active: slot.active,
      }))

      const { error: insertError } = await supabase
        .from("coach_availability")
        .insert(rows)

      if (insertError) {
        console.error("Error inserting availability:", insertError)
        return { success: false, error: insertError.message }
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in updateCoachAvailability:", error)
    return { success: false, error: "Failed to update availability" }
  }
}

// ============================================================
// 7. GET WEEK STATISTICS
// ============================================================

export async function getWeekStats(
  weekStart: string
): Promise<{ success: boolean; data?: WeekStats; error?: string }> {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'COACH')) {
      return { success: false, error: "Unauthorized" }
    }

    const supabase = await getSupabaseAdmin()

    // Calculate week boundaries
    const startDate = new Date(weekStart)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 7)

    // Fetch all sessions for this week
    const { data: sessions, error } = await supabase
      .from("client_sessions")
      .select("type, status")
      .eq("coach_id", currentUser.id)
      .gte("start_time", startDate.toISOString())
      .lt("start_time", endDate.toISOString())

    if (error) {
      console.error("Error fetching week stats:", error)
      return { success: false, error: error.message }
    }

    const allSessions = sessions || []
    const totalSessions = allSessions.length

    // Count by type
    const byType: Record<SessionType, number> = {
      pt_session: 0,
      video_call: 0,
      check_in_gesprek: 0,
      programma_review: 0,
    }
    for (const s of allSessions) {
      if (s.type in byType) {
        byType[s.type as SessionType]++
      }
    }

    // Count by status
    const byStatus: Record<SessionStatus, number> = {
      scheduled: 0,
      confirmed: 0,
      completed: 0,
      no_show: 0,
      cancelled: 0,
    }
    for (const s of allSessions) {
      if (s.status in byStatus) {
        byStatus[s.status as SessionStatus]++
      }
    }

    // Calculate attendance rate
    // Attendance = completed / (completed + no_show + cancelled)
    // Only count sessions that have a final status (not scheduled/confirmed which are future)
    const finalized = byStatus.completed + byStatus.no_show + byStatus.cancelled
    const attendanceRate = finalized > 0
      ? Math.round((byStatus.completed / finalized) * 100)
      : 100 // Default to 100% if no finalized sessions yet

    const noShows = byStatus.no_show

    return {
      success: true,
      data: {
        totalSessions,
        byType,
        byStatus,
        attendanceRate,
        noShows,
      },
    }
  } catch (error) {
    console.error("Error in getWeekStats:", error)
    return { success: false, error: "Failed to fetch week statistics" }
  }
}
