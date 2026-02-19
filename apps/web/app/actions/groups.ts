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
export interface GroupConversation {
  id: string
  coach_id: string
  name: string
  description: string | null
  avatar_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  member_count?: number
  last_message?: string
  last_message_at?: string
}

export interface GroupMember {
  id: string
  group_id: string
  user_id: string
  role: string
  joined_at: string
  last_read_at: string | null
  is_muted: boolean
  // Joined
  first_name?: string
  last_name?: string
  email?: string
}

/**
 * Get all groups for the coach.
 */
export async function getCoachGroups() {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()

  const { data: groups, error } = await supabase
    .from("group_conversations")
    .select("*")
    .eq("coach_id", auth.user.id)
    .order("updated_at", { ascending: false })

  if (error) return { success: false, error: error.message }

  // Enrich each group
  for (const group of groups || []) {
    const { count } = await supabase
      .from("group_members")
      .select("*", { count: "exact", head: true })
      .eq("group_id", group.id)

    group.member_count = count || 0

    const { data: lastMsg } = await supabase
      .from("group_messages")
      .select("content, sent_at")
      .eq("group_id", group.id)
      .order("sent_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (lastMsg) {
      group.last_message = lastMsg.content
      group.last_message_at = lastMsg.sent_at
    }
  }

  return { success: true, groups: groups || [] }
}

/**
 * Create a new group.
 */
export async function createGroup(input: {
  name: string
  description?: string
  memberIds: string[]
}) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()

  // Create the group
  const { data: group, error } = await supabase
    .from("group_conversations")
    .insert({
      coach_id: auth.user.id,
      name: input.name,
      description: input.description || null,
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message }

  // Add coach as admin
  const members = [
    {
      group_id: group.id,
      user_id: auth.user.id,
      role: "admin",
    },
    // Add selected clients as members
    ...input.memberIds.map((userId) => ({
      group_id: group.id,
      user_id: userId,
      role: "member",
    })),
  ]

  const { error: memberError } = await supabase
    .from("group_members")
    .insert(members)

  if (memberError) return { success: false, error: memberError.message }

  return { success: true, group }
}

/**
 * Update a group.
 */
export async function updateGroup(
  groupId: string,
  input: { name?: string; description?: string; is_active?: boolean }
) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()

  const { error } = await supabase
    .from("group_conversations")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", groupId)
    .eq("coach_id", auth.user.id)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

/**
 * Delete a group.
 */
export async function deleteGroup(groupId: string) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()

  const { error } = await supabase
    .from("group_conversations")
    .delete()
    .eq("id", groupId)
    .eq("coach_id", auth.user.id)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

/**
 * Get members of a group.
 */
export async function getGroupMembers(groupId: string) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()

  const { data: members, error } = await supabase
    .from("group_members")
    .select("*")
    .eq("group_id", groupId)
    .order("role", { ascending: true })

  if (error) return { success: false, error: error.message }

  // Enrich with profile data
  const userIds = (members || []).map((m: any) => m.user_id)
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, first_name, last_name")
      .in("user_id", userIds)

    const { data: users } = await supabase
      .from("users")
      .select("id, email")
      .in("id", userIds)

    const profileMap = new Map(
      (profiles || []).map((p: any) => [p.user_id, p])
    )
    const userMap = new Map(
      (users || []).map((u: any) => [u.id, u])
    )

    for (const member of members || []) {
      const profile = profileMap.get(member.user_id)
      const userRecord = userMap.get(member.user_id)
      if (profile) {
        member.first_name = profile.first_name
        member.last_name = profile.last_name
      }
      if (userRecord) {
        member.email = userRecord.email
      }
    }
  }

  return { success: true, members: members || [] }
}

/**
 * Add members to a group.
 */
export async function addGroupMembers(groupId: string, userIds: string[]) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()

  const members = userIds.map((userId) => ({
    group_id: groupId,
    user_id: userId,
    role: "member",
  }))

  const { error } = await supabase
    .from("group_members")
    .upsert(members, { onConflict: "group_id,user_id" })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

/**
 * Remove a member from a group.
 */
export async function removeGroupMember(groupId: string, userId: string) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()

  const { error } = await supabase
    .from("group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", userId)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

/**
 * Get coach's clients for adding to groups.
 */
export async function getCoachClients() {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("user_id, first_name, last_name")
    .eq("coach_id", auth.user.id)

  if (error) return { success: false, error: error.message }
  return { success: true, clients: profiles || [] }
}

/**
 * Send a message to a group as coach.
 */
export async function sendGroupMessage(groupId: string, content: string) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()

  const { error } = await supabase
    .from("group_messages")
    .insert({
      group_id: groupId,
      sender_id: auth.user.id,
      content,
      message_type: "text",
    })

  if (error) return { success: false, error: error.message }

  // Update group timestamp
  await supabase
    .from("group_conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", groupId)

  return { success: true }
}

/**
 * Get recent messages for a group.
 */
export async function getGroupMessages(groupId: string, limit: number = 50) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()

  const { data: messages, error } = await supabase
    .from("group_messages")
    .select("*")
    .eq("group_id", groupId)
    .order("sent_at", { ascending: false })
    .limit(limit)

  if (error) return { success: false, error: error.message }

  // Enrich with sender names
  const senderIds = [...new Set((messages || []).map((m: any) => m.sender_id))]
  const { data: profiles } = await supabase
    .from("profiles")
    .select("user_id, first_name, last_name")
    .in("user_id", senderIds)

  const profileMap = new Map(
    (profiles || []).map((p: any) => [
      p.user_id,
      `${p.first_name || ""} ${p.last_name || ""}`.trim() || "Gebruiker",
    ])
  )

  const enriched = (messages || []).map((m: any) => ({
    ...m,
    sender_name: profileMap.get(m.sender_id) || "Gebruiker",
  }))

  return { success: true, messages: enriched.reverse() }
}
