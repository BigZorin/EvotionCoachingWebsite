"use server"

import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

async function checkAdmin() {
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
  if (!user) return false
  return (user.user_metadata?.role || 'CLIENT') === 'ADMIN'
}

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

// ============================================================
// 1. PLATFORM OVERVIEW
// ============================================================

export interface PlatformOverview {
  totalUsers: number
  totalCoaches: number
  totalClients: number
  activeRelationships: number
  newUsersThisMonth: number
  newUsersLastMonth: number
}

export async function getPlatformOverview(): Promise<PlatformOverview | { error: string }> {
  const isAdmin = await checkAdmin()
  if (!isAdmin) return { error: "Unauthorized" }

  try {
    const supabase = getSupabaseAdmin()

    const now = new Date()
    const firstOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()

    const [
      profilesRes,
      relationshipsRes,
    ] = await Promise.all([
      supabase.from("profiles").select("id, role, created_at"),
      supabase.from("coaching_relationships").select("id, status").eq("status", "ACTIVE"),
    ])

    const profiles = profilesRes.data || []
    const relationships = relationshipsRes.data || []

    const totalUsers = profiles.length
    const totalCoaches = profiles.filter(p => p.role === "COACH").length
    const totalClients = profiles.filter(p => p.role === "CLIENT").length
    const activeRelationships = relationships.length

    const newUsersThisMonth = profiles.filter(p => p.created_at && p.created_at >= firstOfThisMonth).length
    const newUsersLastMonth = profiles.filter(p =>
      p.created_at && p.created_at >= firstOfLastMonth && p.created_at < firstOfThisMonth
    ).length

    return {
      totalUsers,
      totalCoaches,
      totalClients,
      activeRelationships,
      newUsersThisMonth,
      newUsersLastMonth,
    }
  } catch (err) {
    console.error("Error in getPlatformOverview:", err)
    return { error: "Failed to fetch platform overview" }
  }
}

// ============================================================
// 2. ENGAGEMENT STATS
// ============================================================

export interface EngagementStats {
  weeklyCheckIns: number
  dailyCheckIns: number
  workoutsCompleted: number
  messagesThisWeek: number
  avgTrainingAdherence: number
  avgNutritionAdherence: number
}

export async function getEngagementStats(): Promise<EngagementStats | { error: string }> {
  const isAdmin = await checkAdmin()
  if (!isAdmin) return { error: "Unauthorized" }

  try {
    const supabase = getSupabaseAdmin()

    // Calculate current week boundaries (Monday-Sunday)
    const now = new Date()
    const dayOfWeek = now.getDay() // 0=Sun, 1=Mon...
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    const monday = new Date(now)
    monday.setDate(now.getDate() + mondayOffset)
    monday.setHours(0, 0, 0, 0)
    const mondayISO = monday.toISOString()

    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 7)
    const sundayISO = sunday.toISOString()

    // 30 days ago for adherence averages
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000).toISOString()

    const [
      weeklyCheckInsRes,
      dailyCheckInsRes,
      workoutsRes,
      messagesRes,
      adherenceRes,
    ] = await Promise.all([
      supabase.from("check_ins").select("id", { count: "exact", head: true }).gte("created_at", mondayISO).lt("created_at", sundayISO),
      supabase.from("daily_checkins").select("id", { count: "exact", head: true }).gte("created_at", mondayISO).lt("created_at", sundayISO),
      supabase.from("client_workouts").select("id", { count: "exact", head: true }).eq("completed", true).gte("completed_at", mondayISO).lt("completed_at", sundayISO),
      supabase.from("messages").select("id", { count: "exact", head: true }).gte("created_at", mondayISO).lt("created_at", sundayISO),
      supabase.from("check_ins").select("training_adherence, nutrition_adherence").gte("created_at", thirtyDaysAgo),
    ])

    // Calculate averages from adherence data (1-10 scale, multiply by 10 for %)
    const adherenceData = adherenceRes.data || []
    const trainingValues = adherenceData.filter(d => d.training_adherence != null).map(d => d.training_adherence as number)
    const nutritionValues = adherenceData.filter(d => d.nutrition_adherence != null).map(d => d.nutrition_adherence as number)

    const avgTraining = trainingValues.length > 0
      ? Math.round((trainingValues.reduce((s, v) => s + v, 0) / trainingValues.length) * 10)
      : 0
    const avgNutrition = nutritionValues.length > 0
      ? Math.round((nutritionValues.reduce((s, v) => s + v, 0) / nutritionValues.length) * 10)
      : 0

    return {
      weeklyCheckIns: weeklyCheckInsRes.count || 0,
      dailyCheckIns: dailyCheckInsRes.count || 0,
      workoutsCompleted: workoutsRes.count || 0,
      messagesThisWeek: messagesRes.count || 0,
      avgTrainingAdherence: avgTraining,
      avgNutritionAdherence: avgNutrition,
    }
  } catch (err) {
    console.error("Error in getEngagementStats:", err)
    return { error: "Failed to fetch engagement stats" }
  }
}

// ============================================================
// 3. USER GROWTH DATA (last 6 months)
// ============================================================

export interface UserGrowthPoint {
  month: string
  users: number
  clients: number
  coaches: number
}

export async function getUserGrowthData(): Promise<UserGrowthPoint[] | { error: string }> {
  const isAdmin = await checkAdmin()
  if (!isAdmin) return { error: "Unauthorized" }

  try {
    const supabase = getSupabaseAdmin()

    // Determine start date: 6 months ago, first day of that month
    const now = new Date()
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)
    const startISO = sixMonthsAgo.toISOString()

    const { data: profiles } = await supabase
      .from("profiles")
      .select("role, created_at")
      .gte("created_at", startISO)

    // Group by month
    const monthNames = ["Jan", "Feb", "Mrt", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"]
    const monthMap = new Map<string, { users: number; clients: number; coaches: number }>()

    // Initialize all 6 months
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      monthMap.set(key, { users: 0, clients: 0, coaches: 0 })
    }

    for (const profile of profiles || []) {
      if (!profile.created_at) continue
      const d = new Date(profile.created_at)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      const entry = monthMap.get(key)
      if (!entry) continue
      entry.users++
      if (profile.role === "CLIENT") entry.clients++
      if (profile.role === "COACH") entry.coaches++
    }

    const result: UserGrowthPoint[] = []
    for (const [key, val] of monthMap.entries()) {
      const [year, monthStr] = key.split("-")
      const monthIndex = parseInt(monthStr) - 1
      result.push({
        month: monthNames[monthIndex],
        users: val.users,
        clients: val.clients,
        coaches: val.coaches,
      })
    }

    return result
  } catch (err) {
    console.error("Error in getUserGrowthData:", err)
    return { error: "Failed to fetch user growth data" }
  }
}

// ============================================================
// 4. ACTIVITY BREAKDOWN
// ============================================================

export interface ActivityBreakdown {
  checkInRate: number
  workoutCompletionRate: number
  photoUploads: number
  contentItems: number
  contentViews: number
  coursesPublished: number
  totalEnrollments: number
  messagesThisWeek: number
}

export async function getActivityBreakdown(): Promise<ActivityBreakdown | { error: string }> {
  const isAdmin = await checkAdmin()
  if (!isAdmin) return { error: "Unauthorized" }

  try {
    const supabase = getSupabaseAdmin()

    const now = new Date()

    // Week boundaries
    const dayOfWeek = now.getDay()
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    const monday = new Date(now)
    monday.setDate(now.getDate() + mondayOffset)
    monday.setHours(0, 0, 0, 0)
    const mondayISO = monday.toISOString()
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 7)
    const sundayISO = sunday.toISOString()

    // Month boundary
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    const [
      activeRelRes,
      weeklyCheckInsRes,
      workoutsAssignedRes,
      workoutsCompletedRes,
      photosRes,
      contentRes,
      coursesRes,
      enrollmentsRes,
      messagesRes,
    ] = await Promise.all([
      // Active coaching relationships (= active clients)
      supabase.from("coaching_relationships").select("client_id", { count: "exact" }).eq("status", "ACTIVE"),
      // Weekly check-ins this week
      supabase.from("check_ins").select("client_id").gte("created_at", mondayISO).lt("created_at", sundayISO),
      // Workouts assigned this week
      supabase.from("client_workouts").select("id", { count: "exact", head: true }).gte("created_at", mondayISO).lt("created_at", sundayISO),
      // Workouts completed this week
      supabase.from("client_workouts").select("id", { count: "exact", head: true }).eq("completed", true).gte("completed_at", mondayISO).lt("completed_at", sundayISO),
      // Progress photos this month
      supabase.from("progress_photos").select("id", { count: "exact", head: true }).gte("created_at", firstOfMonth),
      // Content items total + views
      supabase.from("content_items").select("id, views"),
      // Published courses
      supabase.from("courses").select("id", { count: "exact", head: true }).eq("status", "published"),
      // Total enrollments
      supabase.from("course_enrollments").select("id", { count: "exact", head: true }),
      // Messages this week
      supabase.from("messages").select("id", { count: "exact", head: true }).gte("created_at", mondayISO).lt("created_at", sundayISO),
    ])

    // Check-in rate: unique clients who checked in this week / total active clients
    const activeClientCount = activeRelRes.count || 0
    const checkInClientIds = new Set((weeklyCheckInsRes.data || []).map(ci => ci.client_id))
    const checkInRate = activeClientCount > 0 ? Math.round((checkInClientIds.size / activeClientCount) * 100) : 0

    // Workout completion rate: completed / assigned this week
    const workoutsAssigned = workoutsAssignedRes.count || 0
    const workoutsCompleted = workoutsCompletedRes.count || 0
    const workoutCompletionRate = workoutsAssigned > 0 ? Math.round((workoutsCompleted / workoutsAssigned) * 100) : 0

    // Content stats
    const contentData = contentRes.data || []
    const contentItems = contentData.length
    const contentViews = contentData.reduce((sum, item) => sum + (item.views || 0), 0)

    return {
      checkInRate,
      workoutCompletionRate,
      photoUploads: photosRes.count || 0,
      contentItems,
      contentViews,
      coursesPublished: coursesRes.count || 0,
      totalEnrollments: enrollmentsRes.count || 0,
      messagesThisWeek: messagesRes.count || 0,
    }
  } catch (err) {
    console.error("Error in getActivityBreakdown:", err)
    return { error: "Failed to fetch activity breakdown" }
  }
}
