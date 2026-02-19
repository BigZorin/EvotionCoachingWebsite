"use server"

import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

async function getAuthUser() {
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
  const role = user.user_metadata?.role || "CLIENT"
  if (role !== "ADMIN" && role !== "COACH") return null
  return user
}

async function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export interface CoachProfile {
  first_name: string
  last_name: string
  avatar_url: string | null
  bio: string | null
  email: string
}

export async function getCoachProfile(): Promise<{ success: boolean; profile?: CoachProfile; error?: string }> {
  const user = await getAuthUser()
  if (!user) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()
  const { data, error } = await supabase
    .from("profiles")
    .select("first_name, last_name, avatar_url, bio")
    .eq("user_id", user.id)
    .maybeSingle()

  if (error) return { success: false, error: error.message }

  return {
    success: true,
    profile: {
      first_name: data?.first_name || "",
      last_name: data?.last_name || "",
      avatar_url: data?.avatar_url || null,
      bio: data?.bio || null,
      email: user.email || "",
    },
  }
}

export async function updateCoachProfile(data: {
  first_name: string
  last_name: string
  bio: string | null
}): Promise<{ success: boolean; error?: string }> {
  const user = await getAuthUser()
  if (!user) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()
  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: data.first_name,
      last_name: data.last_name,
      bio: data.bio,
    })
    .eq("user_id", user.id)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function uploadCoachAvatar(formData: FormData): Promise<{ success: boolean; avatarUrl?: string; error?: string }> {
  const user = await getAuthUser()
  if (!user) return { success: false, error: "Not authorized" }

  const file = formData.get("file") as File
  if (!file) return { success: false, error: "No file provided" }

  const supabase = await getSupabaseAdmin()

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const storagePath = `${user.id}/avatar.${ext}`

  const arrayBuffer = await file.arrayBuffer()
  const { error: uploadError } = await supabase.storage
    .from("profile-avatars")
    .upload(storagePath, arrayBuffer, {
      contentType: file.type,
      upsert: true,
    })

  if (uploadError) return { success: false, error: uploadError.message }

  const { data: urlData } = supabase.storage
    .from("profile-avatars")
    .getPublicUrl(storagePath)

  // Add cache-busting timestamp to prevent browser caching old avatar
  const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`

  // Update profile record
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("user_id", user.id)

  if (updateError) return { success: false, error: updateError.message }

  return { success: true, avatarUrl }
}
