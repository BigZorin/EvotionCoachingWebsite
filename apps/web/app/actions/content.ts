"use server"

import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// ============================================================
// AUTH HELPERS (local to this file, same pattern as admin-clients.ts)
// ============================================================

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
// INTERFACES
// ============================================================

export interface ContentItem {
  id: string
  title: string
  description: string | null
  type: 'video' | 'article' | 'image' | 'pdf' | 'template'
  category: string | null
  url: string | null
  thumbnail: string | null
  duration: string | null
  views: number
  status: 'published' | 'draft'
  created_at: string
  updated_at: string
}

export interface ContentFilters {
  type?: 'video' | 'article' | 'image' | 'pdf' | 'template'
  status?: 'published' | 'draft'
  category?: string
}

export interface ContentStats {
  total: number
  byType: Record<string, number>
  totalViews: number
  published: number
  draft: number
}

// ============================================================
// GET CONTENT ITEMS
// ============================================================

export async function getContentItems(
  filters?: ContentFilters
): Promise<{ success: boolean; data?: ContentItem[]; error?: string }> {
  const currentUser = await getCurrentUser()
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'COACH')) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const supabase = await getSupabaseAdmin()

    let query = supabase
      .from("content_items")
      .select("*")
      .eq("coach_id", currentUser.id)
      .order("created_at", { ascending: false })

    if (filters?.type) {
      query = query.eq("type", filters.type)
    }
    if (filters?.status) {
      query = query.eq("status", filters.status)
    }
    if (filters?.category) {
      query = query.eq("category", filters.category)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching content items:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error in getContentItems:", error)
    return { success: false, error: "Failed to fetch content items" }
  }
}

// ============================================================
// CREATE CONTENT ITEM
// ============================================================

export async function createContentItem(input: {
  title: string
  description?: string
  type: 'video' | 'article' | 'image' | 'pdf' | 'template'
  category?: string
  url?: string
  thumbnail?: string
  duration?: string
  status?: 'published' | 'draft'
}): Promise<{ success: boolean; data?: ContentItem; error?: string }> {
  const currentUser = await getCurrentUser()
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'COACH')) {
    return { success: false, error: "Unauthorized" }
  }

  if (!input.title || !input.type) {
    return { success: false, error: "Title and type are required" }
  }

  try {
    const supabase = await getSupabaseAdmin()

    const { data, error } = await supabase
      .from("content_items")
      .insert({
        coach_id: currentUser.id,
        title: input.title,
        description: input.description || null,
        type: input.type,
        category: input.category || null,
        url: input.url || null,
        thumbnail: input.thumbnail || null,
        duration: input.duration || null,
        status: input.status || 'draft',
        views: 0,
      })
      .select("*")
      .single()

    if (error) {
      console.error("Error creating content item:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in createContentItem:", error)
    return { success: false, error: "Failed to create content item" }
  }
}

// ============================================================
// UPDATE CONTENT ITEM
// ============================================================

export async function updateContentItem(
  id: string,
  input: {
    title?: string
    description?: string
    type?: 'video' | 'article' | 'image' | 'pdf' | 'template'
    category?: string
    url?: string
    thumbnail?: string
    duration?: string
    status?: 'published' | 'draft'
  }
): Promise<{ success: boolean; data?: ContentItem; error?: string }> {
  const currentUser = await getCurrentUser()
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'COACH')) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const supabase = await getSupabaseAdmin()

    const { data, error } = await supabase
      .from("content_items")
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("coach_id", currentUser.id)
      .select("*")
      .single()

    if (error) {
      console.error("Error updating content item:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in updateContentItem:", error)
    return { success: false, error: "Failed to update content item" }
  }
}

// ============================================================
// DELETE CONTENT ITEM
// ============================================================

export async function deleteContentItem(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const currentUser = await getCurrentUser()
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'COACH')) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const supabase = await getSupabaseAdmin()

    const { error } = await supabase
      .from("content_items")
      .delete()
      .eq("id", id)
      .eq("coach_id", currentUser.id)

    if (error) {
      console.error("Error deleting content item:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in deleteContentItem:", error)
    return { success: false, error: "Failed to delete content item" }
  }
}

// ============================================================
// DUPLICATE CONTENT ITEM
// ============================================================

export async function duplicateContentItem(
  id: string
): Promise<{ success: boolean; data?: ContentItem; error?: string }> {
  const currentUser = await getCurrentUser()
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'COACH')) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const supabase = await getSupabaseAdmin()

    // Fetch the original item (only if owned by current user)
    const { data: original, error: fetchError } = await supabase
      .from("content_items")
      .select("*")
      .eq("id", id)
      .eq("coach_id", currentUser.id)
      .single()

    if (fetchError || !original) {
      console.error("Error fetching content item for duplication:", fetchError)
      return { success: false, error: fetchError?.message || "Content item not found" }
    }

    // Create a copy with modified title and draft status
    const { data: duplicate, error: insertError } = await supabase
      .from("content_items")
      .insert({
        coach_id: currentUser.id,
        title: `Kopie van: ${original.title}`,
        description: original.description,
        type: original.type,
        category: original.category,
        url: original.url,
        thumbnail: original.thumbnail,
        duration: original.duration,
        status: 'draft',
        views: 0,
      })
      .select("*")
      .single()

    if (insertError) {
      console.error("Error duplicating content item:", insertError)
      return { success: false, error: insertError.message }
    }

    return { success: true, data: duplicate }
  } catch (error) {
    console.error("Error in duplicateContentItem:", error)
    return { success: false, error: "Failed to duplicate content item" }
  }
}

// ============================================================
// GET CONTENT STATS
// ============================================================

export async function getContentStats(): Promise<{ success: boolean; data?: ContentStats; error?: string }> {
  const currentUser = await getCurrentUser()
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'COACH')) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const supabase = await getSupabaseAdmin()

    const { data, error } = await supabase
      .from("content_items")
      .select("type, status, views")
      .eq("coach_id", currentUser.id)

    if (error) {
      console.error("Error fetching content stats:", error)
      return { success: false, error: error.message }
    }

    const items = data || []

    // Count by type
    const byType: Record<string, number> = {}
    for (const item of items) {
      byType[item.type] = (byType[item.type] || 0) + 1
    }

    // Total views
    const totalViews = items.reduce((sum, item) => sum + (item.views || 0), 0)

    // Count by status
    const published = items.filter(item => item.status === 'published').length
    const draft = items.filter(item => item.status === 'draft').length

    return {
      success: true,
      data: {
        total: items.length,
        byType,
        totalViews,
        published,
        draft,
      },
    }
  } catch (error) {
    console.error("Error in getContentStats:", error)
    return { success: false, error: "Failed to fetch content stats" }
  }
}
