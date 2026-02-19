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
  const role = user.user_metadata?.role || "CLIENT"
  if (role !== "ADMIN" && role !== "COACH") return { authorized: false, user: null }
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

export interface HealthDataRecord {
  id: string
  user_id: string
  date: string
  data_type: string
  value: number
  source: string
  synced_at: string
}

export interface ClientHealthSummary {
  client_id: string
  client_name: string
  today_steps: number
  today_sleep: number
  today_heart_rate: number
  today_calories: number
  has_wearable: boolean
  last_sync: string | null
}

/**
 * Get health data for a specific client.
 */
export async function getClientHealthData(clientId: string, days: number = 30) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from("health_data")
    .select("*")
    .eq("user_id", clientId)
    .gte("date", startDate.toISOString().split("T")[0])
    .order("date", { ascending: true })

  if (error) return { success: false, error: error.message }
  return { success: true, data: data || [] }
}

/**
 * Get health summary for all coach's clients.
 */
export async function getClientsHealthOverview() {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()

  // Get coach's clients
  const { data: profiles } = await supabase
    .from("profiles")
    .select("user_id, first_name, last_name")
    .eq("coach_id", auth.user.id)

  if (!profiles?.length) return { success: true, clients: [] }

  const clientIds = profiles.map((p: any) => p.user_id)
  const today = new Date().toISOString().split("T")[0]

  // Get today's health data for all clients
  const { data: healthData } = await supabase
    .from("health_data")
    .select("*")
    .in("user_id", clientIds)
    .eq("date", today)

  // Get wearable connections
  const { data: connections } = await supabase
    .from("wearable_connections")
    .select("*")
    .in("user_id", clientIds)
    .eq("is_connected", true)

  const connectionMap = new Map(
    (connections || []).map((c: any) => [c.user_id, c])
  )

  const clients: ClientHealthSummary[] = profiles.map((p: any) => {
    const clientData = (healthData || []).filter((d: any) => d.user_id === p.user_id)
    const conn = connectionMap.get(p.user_id)

    return {
      client_id: p.user_id,
      client_name: `${p.first_name || ""} ${p.last_name || ""}`.trim() || "Client",
      today_steps: clientData.find((d: any) => d.data_type === "steps")?.value || 0,
      today_sleep: clientData.find((d: any) => d.data_type === "sleep_hours")?.value || 0,
      today_heart_rate: clientData.find((d: any) => d.data_type === "heart_rate_avg")?.value || 0,
      today_calories: clientData.find((d: any) => d.data_type === "active_calories")?.value || 0,
      has_wearable: !!conn,
      last_sync: conn?.last_sync_at || null,
    }
  })

  return { success: true, clients }
}
