"use server"

import { createServerClient } from "@supabase/ssr"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

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
  if (!user) return { authorized: false as const, user: null, coachId: "" }
  const role = user.user_metadata?.role || "CLIENT"
  if (role !== "ADMIN" && role !== "COACH") return { authorized: false as const, user: null, coachId: "" }
  return { authorized: true as const, user, coachId: user.id }
}

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

// ── Types ──

export type CoachingEventType =
  | "intake_completed"
  | "intake_analyzed"
  | "training_program_generated"
  | "training_program_assigned"
  | "training_program_completed"
  | "training_program_paused"
  | "nutrition_targets_set"
  | "nutrition_targets_adjusted"
  | "supplement_added"
  | "supplement_removed"
  | "supplement_adjusted"
  | "weekly_review_generated"
  | "weekly_review_action_applied"
  | "client_summary_generated"
  | "supplement_analysis_generated"
  | "coach_note_added"
  | "goal_added"
  | "goal_completed"
  | "manual_adjustment"

export type CoachingArea = "training" | "nutrition" | "supplements" | "recovery" | "general"

export type CoachingSource = "manual" | "ai" | "ai_applied" | "system"

export interface CoachingEvent {
  id: string
  client_id: string
  coach_id: string
  event_type: CoachingEventType
  area: CoachingArea
  title: string
  description: string | null
  source: CoachingSource
  ai_generation_log_id: string | null
  related_entity_type: string | null
  related_entity_id: string | null
  event_data: any
  created_at: string
}

// ── Log a coaching event (can be called from other server actions with a supabase admin client) ──

export async function logCoachingEventDirect(
  supabase: SupabaseClient,
  event: {
    clientId: string
    coachId: string
    eventType: CoachingEventType
    area: CoachingArea
    title: string
    description?: string
    source: CoachingSource
    aiGenerationLogId?: string
    relatedEntityType?: string
    relatedEntityId?: string
    eventData?: any
  }
): Promise<{ success: boolean; id?: string }> {
  const { data, error } = await supabase
    .from("coaching_events")
    .insert({
      client_id: event.clientId,
      coach_id: event.coachId,
      event_type: event.eventType,
      area: event.area,
      title: event.title,
      description: event.description || null,
      source: event.source,
      ai_generation_log_id: event.aiGenerationLogId || null,
      related_entity_type: event.relatedEntityType || null,
      related_entity_id: event.relatedEntityId || null,
      event_data: event.eventData || {},
    })
    .select("id")
    .single()

  if (error) {
    console.error("[CoachingEvent] Failed to log:", error.message)
    return { success: false }
  }
  return { success: true, id: data.id }
}

// ── Server action wrapper (with auth check) ──

export async function logCoachingEvent(event: {
  clientId: string
  eventType: CoachingEventType
  area: CoachingArea
  title: string
  description?: string
  source: CoachingSource
  aiGenerationLogId?: string
  relatedEntityType?: string
  relatedEntityId?: string
  eventData?: any
}): Promise<{ success: boolean; id?: string; error?: string }> {
  const auth = await checkAuth()
  if (!auth.authorized) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()
  return logCoachingEventDirect(supabase, { ...event, coachId: auth.coachId })
}

// ── Get coaching timeline for a client ──

export async function getCoachingTimeline(
  clientId: string,
  options?: { limit?: number; area?: string }
): Promise<{ success: boolean; events?: CoachingEvent[]; error?: string }> {
  const auth = await checkAuth()
  if (!auth.authorized) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()
  let query = supabase
    .from("coaching_events")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false })
    .limit(options?.limit || 30)

  if (options?.area && options.area !== "all") {
    query = query.eq("area", options.area)
  }

  const { data, error } = await query
  if (error) return { success: false, error: error.message }
  return { success: true, events: (data || []) as CoachingEvent[] }
}

// ── Delete a coaching event ──

export async function deleteCoachingEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
  const auth = await checkAuth()
  if (!auth.authorized) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from("coaching_events")
    .delete()
    .eq("id", eventId)

  if (error) return { success: false, error: error.message }
  return { success: true }
}
