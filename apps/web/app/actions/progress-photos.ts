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

export interface ProgressEntry {
  id: string
  user_id: string
  date: string
  weight_kg: number | null
  body_fat_percentage: number | null
  photos: { storagePath: string; category: string; uploadedAt: string }[]
  notes: string | null
  created_at: string
}

export async function getClientProgressPhotos(clientId: string) {
  const auth = await checkAuth()
  if (!auth.authorized) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()
  const { data, error } = await supabase
    .from("progress_tracking")
    .select("*")
    .eq("user_id", clientId)
    .order("date", { ascending: false })

  if (error) return { success: false, error: error.message }
  return { success: true, entries: data as ProgressEntry[] }
}

export async function getProgressPhotoSignedUrl(storagePath: string) {
  const auth = await checkAuth()
  if (!auth.authorized) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()
  const { data, error } = await supabase.storage
    .from("progress-photos")
    .createSignedUrl(storagePath, 3600)

  if (error) return { success: false, error: error.message }
  return { success: true, url: data.signedUrl }
}
