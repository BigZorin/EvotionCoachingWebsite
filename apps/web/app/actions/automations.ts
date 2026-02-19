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
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {}
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

// Types
export interface AutomationRule {
  id: string
  coach_id: string
  name: string
  description: string | null
  trigger_type: string
  schedule_cron: string | null
  schedule_time: string | null
  schedule_days: string[] | null
  conditions: Record<string, any>
  action_type: string
  action_title: string | null
  action_message: string | null
  is_active: boolean
  last_triggered_at: string | null
  created_at: string
  updated_at: string
}

export interface AutomationLog {
  id: string
  rule_id: string
  client_id: string
  triggered_at: string
  status: string
  error_message: string | null
}

// Get all automation rules for the coach
export async function getAutomationRules() {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()

  const { data, error } = await supabase
    .from("automation_rules")
    .select("*")
    .eq("coach_id", auth.user.id)
    .order("created_at", { ascending: false })

  if (error) return { success: false, error: error.message }
  return { success: true, rules: data as AutomationRule[] }
}

// Get a single automation rule
export async function getAutomationRule(ruleId: string) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()

  const { data, error } = await supabase
    .from("automation_rules")
    .select("*")
    .eq("id", ruleId)
    .eq("coach_id", auth.user.id)
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, rule: data as AutomationRule }
}

// Create a new automation rule
export async function createAutomationRule(input: {
  name: string
  description?: string
  trigger_type: string
  schedule_time?: string
  schedule_days?: string[]
  conditions?: Record<string, any>
  action_type: string
  action_title?: string
  action_message?: string
}) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()

  const { data, error } = await supabase
    .from("automation_rules")
    .insert({
      coach_id: auth.user.id,
      name: input.name,
      description: input.description || null,
      trigger_type: input.trigger_type,
      schedule_time: input.schedule_time || null,
      schedule_days: input.schedule_days || null,
      conditions: input.conditions || {},
      action_type: input.action_type,
      action_title: input.action_title || null,
      action_message: input.action_message || null,
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, rule: data as AutomationRule }
}

// Update an automation rule
export async function updateAutomationRule(
  ruleId: string,
  input: Partial<{
    name: string
    description: string
    trigger_type: string
    schedule_time: string
    schedule_days: string[]
    conditions: Record<string, any>
    action_type: string
    action_title: string
    action_message: string
    is_active: boolean
  }>
) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()

  const { data, error } = await supabase
    .from("automation_rules")
    .update(input)
    .eq("id", ruleId)
    .eq("coach_id", auth.user.id)
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, rule: data as AutomationRule }
}

// Delete an automation rule
export async function deleteAutomationRule(ruleId: string) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()

  const { error } = await supabase
    .from("automation_rules")
    .delete()
    .eq("id", ruleId)
    .eq("coach_id", auth.user.id)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

// Toggle automation rule active/inactive
export async function toggleAutomationRule(ruleId: string) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()

  // Get current state
  const { data: current, error: fetchError } = await supabase
    .from("automation_rules")
    .select("is_active")
    .eq("id", ruleId)
    .eq("coach_id", auth.user.id)
    .single()

  if (fetchError) return { success: false, error: fetchError.message }

  const { data, error } = await supabase
    .from("automation_rules")
    .update({ is_active: !current.is_active })
    .eq("id", ruleId)
    .eq("coach_id", auth.user.id)
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, rule: data as AutomationRule }
}

// Get automation logs for a rule
export async function getAutomationLogs(ruleId: string, limit = 50) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()

  const { data, error } = await supabase
    .from("automation_logs")
    .select("*")
    .eq("rule_id", ruleId)
    .order("triggered_at", { ascending: false })
    .limit(limit)

  if (error) return { success: false, error: error.message }
  return { success: true, logs: data as AutomationLog[] }
}
