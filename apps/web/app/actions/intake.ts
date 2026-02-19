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

export interface IntakeForm {
  id: string
  user_id: string
  goals: string | null
  fitness_experience: string | null
  training_history: string | null
  injuries: string | null
  medical_conditions: string | null
  medications: string | null
  dietary_restrictions: string | null
  allergies: string | null
  sleep_hours: number | null
  stress_level: number | null
  occupation: string | null
  available_days: string[]
  preferred_training_time: string | null
  equipment_access: string | null
  additional_notes: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export async function getClientIntakeForm(clientId: string) {
  const auth = await checkAuth()
  if (!auth.authorized) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()
  const { data, error } = await supabase
    .from("intake_forms")
    .select("*")
    .eq("user_id", clientId)
    .maybeSingle()

  if (error) return { success: false, error: error.message }
  return { success: true, intake: data as IntakeForm | null }
}
