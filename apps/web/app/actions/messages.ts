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
  if (!user) return { authorized: false, user: null, role: null as string | null }
  const role = user.user_metadata?.role || 'CLIENT'
  if (role !== 'ADMIN' && role !== 'COACH') return { authorized: false, user: null, role: null as string | null }
  return { authorized: true, user, role }
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
export interface Conversation {
  id: string
  coach_id: string
  client_id: string
  last_message_at: string
  last_message_text: string | null
  unread_count_coach: number
  unread_count_client: number
  created_at: string
  // Joined
  client_name?: string
  client_email?: string
  client_avatar_url?: string | null
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  conversation_id: string
  content: string
  message_type: "text" | "voice" | "image" | "video" | "document"
  media_url: string | null
  media_duration: number | null
  read: boolean
  sent_at: string
  read_at: string | null
}

// Get all conversations for the coach
export async function getCoachConversations() {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()

  // ADMIN sees all conversations, COACH sees only their own
  let query = supabase
    .from("conversations")
    .select("*")
    .order("last_message_at", { ascending: false })

  if (auth.role !== "ADMIN") {
    query = query.eq("coach_id", auth.user.id)
  }

  const { data, error } = await query

  if (error) return { success: false, error: error.message }

  // Enrich with client info from profiles
  const conversations = data || []
  const clientIds = conversations.map((c: any) => c.client_id)

  if (clientIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, first_name, last_name, avatar_url")
      .in("user_id", clientIds)

    const profileMap = new Map(
      (profiles || []).map((p: any) => [
        p.user_id,
        { name: `${p.first_name || ""} ${p.last_name || ""}`.trim(), avatar_url: p.avatar_url },
      ])
    )

    return {
      success: true,
      conversations: conversations.map((c: any) => ({
        ...c,
        client_name: profileMap.get(c.client_id)?.name || "Client",
        client_avatar_url: profileMap.get(c.client_id)?.avatar_url || null,
      })) as Conversation[],
    }
  }

  return { success: true, conversations: conversations as Conversation[] }
}

// Get messages for a conversation
export async function getConversationMessages(conversationId: string) {
  const auth = await checkAuth()
  if (!auth.authorized) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("sent_at", { ascending: true })
    .limit(100)

  if (error) return { success: false, error: error.message }
  return { success: true, messages: data as Message[] }
}

// Send message as coach
export async function sendCoachMessage(
  conversationId: string,
  clientId: string,
  content: string
) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()

  // For ADMIN, use the conversation's coach_id as sender so the client sees it from their coach
  let senderId = auth.user.id
  if (auth.role === "ADMIN") {
    const { data: conv } = await supabase
      .from("conversations")
      .select("coach_id")
      .eq("id", conversationId)
      .single()
    if (conv?.coach_id) senderId = conv.coach_id
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      sender_id: senderId,
      receiver_id: clientId,
      conversation_id: conversationId,
      content,
      message_type: "text",
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message }

  // Update conversation
  await supabase
    .from("conversations")
    .update({
      last_message_at: new Date().toISOString(),
      last_message_text: content.substring(0, 100),
    })
    .eq("id", conversationId)

  return { success: true, message: data as Message }
}

// Send media message as coach (file upload via FormData)
export async function sendCoachMedia(formData: FormData) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const conversationId = formData.get("conversationId") as string
  const clientId = formData.get("clientId") as string
  const file = formData.get("file") as File
  if (!conversationId || !clientId || !file) return { success: false, error: "Missing fields" }

  const supabase = await getSupabaseAdmin()

  // Determine sender (ADMIN sends as coach)
  let senderId = auth.user.id
  if (auth.role === "ADMIN") {
    const { data: conv } = await supabase
      .from("conversations")
      .select("coach_id")
      .eq("id", conversationId)
      .single()
    if (conv?.coach_id) senderId = conv.coach_id
  }

  // Determine message type from MIME
  let messageType: "image" | "video" | "voice" | "document" = "document"
  if (file.type.startsWith("image/")) messageType = "image"
  else if (file.type.startsWith("video/")) messageType = "video"
  else if (file.type.startsWith("audio/")) messageType = "voice"

  // Upload to storage
  const ext = file.name.split(".").pop() || "bin"
  const bucket = messageType === "voice" ? "voice-notes" : "chat-media"
  const storagePath = `${senderId}/${Date.now()}.${ext}`

  const arrayBuffer = await file.arrayBuffer()
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(storagePath, arrayBuffer, { contentType: file.type, upsert: true })

  if (uploadError) return { success: false, error: uploadError.message }

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(storagePath)

  const previewText = messageType === "image" ? "📷 Foto"
    : messageType === "video" ? "🎬 Video"
    : messageType === "voice" ? "🎤 Spraakbericht"
    : `📎 ${file.name}`

  const { data, error } = await supabase
    .from("messages")
    .insert({
      sender_id: senderId,
      receiver_id: clientId,
      conversation_id: conversationId,
      content: previewText,
      message_type: messageType,
      media_url: urlData.publicUrl,
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message }

  await supabase
    .from("conversations")
    .update({
      last_message_at: new Date().toISOString(),
      last_message_text: previewText,
    })
    .eq("id", conversationId)

  return { success: true, message: data as Message }
}

// Mark messages as read by coach
export async function markConversationRead(conversationId: string) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = await getSupabaseAdmin()

  // For ADMIN, mark all unread messages in the conversation as read
  if (auth.role === "ADMIN") {
    const { data: conv } = await supabase
      .from("conversations")
      .select("coach_id")
      .eq("id", conversationId)
      .single()
    if (conv?.coach_id) {
      await supabase
        .from("messages")
        .update({ read: true, read_at: new Date().toISOString() })
        .eq("conversation_id", conversationId)
        .eq("receiver_id", conv.coach_id)
        .eq("read", false)
    }
  } else {
    await supabase
      .from("messages")
      .update({ read: true, read_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)
      .eq("receiver_id", auth.user.id)
      .eq("read", false)
  }

  return { success: true }
}
