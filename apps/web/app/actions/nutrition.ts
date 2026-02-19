"use server"

import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// ============================================
// Auth helpers (same pattern as admin-clients.ts)
// ============================================

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
  if (!user) return { authorized: false as const, user: null }
  const role = user.user_metadata?.role || "CLIENT"
  if (role !== "ADMIN" && role !== "COACH") return { authorized: false as const, user: null }
  return { authorized: true as const, user }
}

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

// ============================================
// RECIPES
// ============================================

export async function getRecipes() {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("recipes")
    .select("*, recipe_ingredients(*)")
    .eq("coach_id", auth.user.id)
    .order("created_at", { ascending: false })

  if (error) return { success: false, error: error.message }
  return { success: true, recipes: data }
}

export async function getRecipe(recipeId: string) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("recipes")
    .select("*, recipe_ingredients(*)")
    .eq("id", recipeId)
    .eq("coach_id", auth.user.id)
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, recipe: data }
}

export async function createRecipe(data: {
  title: string
  description?: string
  image_url?: string
  source?: string
  source_id?: string
  servings?: number
  prep_time_min?: number
  cook_time_min?: number
  calories?: number
  protein_grams?: number
  carbs_grams?: number
  fat_grams?: number
  instructions?: string
  tags?: string[]
  ingredients?: Array<{ name: string; amount?: number; unit?: string }>
}) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()

  const { ingredients, ...recipeData } = data
  const { data: recipe, error } = await supabase
    .from("recipes")
    .insert({
      coach_id: auth.user.id,
      title: recipeData.title,
      description: recipeData.description || null,
      image_url: recipeData.image_url || null,
      source: recipeData.source || "manual",
      source_id: recipeData.source_id || null,
      servings: recipeData.servings || 1,
      prep_time_min: recipeData.prep_time_min || null,
      cook_time_min: recipeData.cook_time_min || null,
      calories: recipeData.calories || null,
      protein_grams: recipeData.protein_grams || null,
      carbs_grams: recipeData.carbs_grams || null,
      fat_grams: recipeData.fat_grams || null,
      instructions: recipeData.instructions || null,
      tags: recipeData.tags || [],
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message }

  // Insert ingredients if provided
  if (ingredients && ingredients.length > 0) {
    const { error: ingError } = await supabase
      .from("recipe_ingredients")
      .insert(
        ingredients.map((ing, idx) => ({
          recipe_id: recipe.id,
          name: ing.name,
          amount: ing.amount || null,
          unit: ing.unit || null,
          order_index: idx,
        }))
      )
    if (ingError) console.error("Error inserting ingredients:", ingError.message)
  }

  return { success: true, recipe }
}

export async function updateRecipe(
  recipeId: string,
  data: {
    title?: string
    description?: string
    image_url?: string
    servings?: number
    prep_time_min?: number
    cook_time_min?: number
    calories?: number
    protein_grams?: number
    carbs_grams?: number
    fat_grams?: number
    instructions?: string
    tags?: string[]
    ingredients?: Array<{ name: string; amount?: number; unit?: string }>
  }
) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()

  const { ingredients, ...recipeData } = data
  const { data: recipe, error } = await supabase
    .from("recipes")
    .update(recipeData)
    .eq("id", recipeId)
    .eq("coach_id", auth.user.id)
    .select()
    .single()

  if (error) return { success: false, error: error.message }

  // Replace ingredients if provided
  if (ingredients !== undefined) {
    await supabase.from("recipe_ingredients").delete().eq("recipe_id", recipeId)
    if (ingredients.length > 0) {
      await supabase.from("recipe_ingredients").insert(
        ingredients.map((ing, idx) => ({
          recipe_id: recipeId,
          name: ing.name,
          amount: ing.amount || null,
          unit: ing.unit || null,
          order_index: idx,
        }))
      )
    }
  }

  return { success: true, recipe }
}

export async function deleteRecipe(recipeId: string) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from("recipes")
    .delete()
    .eq("id", recipeId)
    .eq("coach_id", auth.user.id)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function importSpoonacularRecipe(data: {
  title: string
  description?: string
  image_url?: string
  source_id: string
  servings?: number
  prep_time_min?: number
  cook_time_min?: number
  calories?: number
  protein_grams?: number
  carbs_grams?: number
  fat_grams?: number
  instructions?: string
  tags?: string[]
  ingredients?: Array<{ name: string; amount?: number; unit?: string }>
}) {
  return createRecipe({ ...data, source: "spoonacular" })
}

// ============================================
// MEAL PLANS
// ============================================

export async function getMealPlans() {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("meal_plans")
    .select(`
      *,
      meal_plan_entries (
        *,
        recipes (id, title, image_url, calories, protein_grams, carbs_grams, fat_grams)
      )
    `)
    .eq("coach_id", auth.user.id)
    .order("created_at", { ascending: false })

  if (error) return { success: false, error: error.message }
  return { success: true, mealPlans: data }
}

export async function getMealPlan(mealPlanId: string) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("meal_plans")
    .select(`
      *,
      meal_plan_entries (
        *,
        recipes (id, title, image_url, calories, protein_grams, carbs_grams, fat_grams, description, servings, instructions, recipe_ingredients(*))
      )
    `)
    .eq("id", mealPlanId)
    .eq("coach_id", auth.user.id)
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, mealPlan: data }
}

export async function createMealPlan(data: {
  name: string
  description?: string
  daily_calories?: number
  protein_grams?: number
  carbs_grams?: number
  fat_grams?: number
  entries?: Array<{
    recipe_id?: string
    day_of_week: number
    meal_type: string
    custom_title?: string
    custom_description?: string
    order_index?: number
  }>
}) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()
  const { entries, ...planData } = data

  const { data: mealPlan, error } = await supabase
    .from("meal_plans")
    .insert({
      coach_id: auth.user.id,
      name: planData.name,
      description: planData.description || null,
      daily_calories: planData.daily_calories || null,
      protein_grams: planData.protein_grams || null,
      carbs_grams: planData.carbs_grams || null,
      fat_grams: planData.fat_grams || null,
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message }

  if (entries && entries.length > 0) {
    const { error: entryError } = await supabase
      .from("meal_plan_entries")
      .insert(
        entries.map((e) => ({
          meal_plan_id: mealPlan.id,
          recipe_id: e.recipe_id || null,
          day_of_week: e.day_of_week,
          meal_type: e.meal_type,
          custom_title: e.custom_title || null,
          custom_description: e.custom_description || null,
          order_index: e.order_index || 0,
        }))
      )
    if (entryError) console.error("Error inserting entries:", entryError.message)
  }

  return { success: true, mealPlan }
}

export async function updateMealPlan(
  mealPlanId: string,
  data: {
    name?: string
    description?: string
    daily_calories?: number
    protein_grams?: number
    carbs_grams?: number
    fat_grams?: number
    entries?: Array<{
      recipe_id?: string
      day_of_week: number
      meal_type: string
      custom_title?: string
      custom_description?: string
      order_index?: number
    }>
  }
) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()
  const { entries, ...planData } = data

  const { data: mealPlan, error } = await supabase
    .from("meal_plans")
    .update(planData)
    .eq("id", mealPlanId)
    .eq("coach_id", auth.user.id)
    .select()
    .single()

  if (error) return { success: false, error: error.message }

  // Replace all entries if provided
  if (entries !== undefined) {
    await supabase.from("meal_plan_entries").delete().eq("meal_plan_id", mealPlanId)
    if (entries.length > 0) {
      await supabase.from("meal_plan_entries").insert(
        entries.map((e) => ({
          meal_plan_id: mealPlanId,
          recipe_id: e.recipe_id || null,
          day_of_week: e.day_of_week,
          meal_type: e.meal_type,
          custom_title: e.custom_title || null,
          custom_description: e.custom_description || null,
          order_index: e.order_index || 0,
        }))
      )
    }
  }

  return { success: true, mealPlan }
}

export async function deleteMealPlan(mealPlanId: string) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from("meal_plans")
    .delete()
    .eq("id", mealPlanId)
    .eq("coach_id", auth.user.id)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ============================================
// MEAL PLAN ASSIGNMENTS
// ============================================

export async function assignMealPlan(data: {
  client_id: string
  meal_plan_id: string
  start_date?: string
  end_date?: string
  notes?: string
}) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()

  // Deactivate any existing active meal plan for this client from this coach
  await supabase
    .from("client_meal_plans")
    .update({ is_active: false })
    .eq("client_id", data.client_id)
    .eq("coach_id", auth.user.id)
    .eq("is_active", true)

  const { data: assignment, error } = await supabase
    .from("client_meal_plans")
    .insert({
      client_id: data.client_id,
      meal_plan_id: data.meal_plan_id,
      coach_id: auth.user.id,
      start_date: data.start_date || null,
      end_date: data.end_date || null,
      notes: data.notes || null,
      is_active: true,
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, assignment }
}

export async function unassignMealPlan(assignmentId: string) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from("client_meal_plans")
    .update({ is_active: false })
    .eq("id", assignmentId)
    .eq("coach_id", auth.user.id)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function getClientAssignments(clientId: string) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("client_meal_plans")
    .select(`
      *,
      meal_plans (id, name, description, daily_calories, protein_grams, carbs_grams, fat_grams)
    `)
    .eq("client_id", clientId)
    .eq("coach_id", auth.user.id)
    .order("created_at", { ascending: false })

  if (error) return { success: false, error: error.message }
  return { success: true, assignments: data }
}

export async function getAssignedClients(mealPlanId: string) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("client_meal_plans")
    .select("*")
    .eq("meal_plan_id", mealPlanId)
    .eq("coach_id", auth.user.id)
    .eq("is_active", true)

  if (error) return { success: false, error: error.message }

  // Enrich with profile data
  const clientIds = (data || []).map((a: any) => a.client_id)
  if (clientIds.length === 0) return { success: true, clients: [] }

  const { data: profiles } = await supabase
    .from("profiles")
    .select("user_id, first_name, last_name, avatar_url")
    .in("user_id", clientIds)

  const profileMap = new Map((profiles || []).map((p: any) => [p.user_id, p]))

  const clients = (data || []).map((a: any) => ({
    ...a,
    profile: profileMap.get(a.client_id) || null,
  }))

  return { success: true, clients }
}

export async function getAllAssignments() {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("client_meal_plans")
    .select(`
      *,
      meal_plans (id, name)
    `)
    .eq("coach_id", auth.user.id)
    .order("created_at", { ascending: false })

  if (error) return { success: false, error: error.message }

  // Enrich with profile data
  const clientIds = [...new Set((data || []).map((a: any) => a.client_id))]
  if (clientIds.length === 0) return { success: true, assignments: data }

  const { data: profiles } = await supabase
    .from("profiles")
    .select("user_id, first_name, last_name, avatar_url")
    .in("user_id", clientIds)

  const profileMap = new Map((profiles || []).map((p: any) => [p.user_id, p]))

  const assignments = (data || []).map((a: any) => ({
    ...a,
    profile: profileMap.get(a.client_id) || null,
  }))

  return { success: true, assignments }
}

// ============================================
// NUTRITION TARGETS
// ============================================

export async function setNutritionTargets(
  clientId: string,
  targets: {
    daily_calories?: number
    daily_protein_grams?: number
    daily_carbs_grams?: number
    daily_fat_grams?: number
  },
  metadata?: {
    source?: "manual" | "ai"
    rationale?: string
    aiModel?: string
    ragUsed?: boolean
  }
) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()

  // Fetch previous targets for history log
  const { data: previous } = await supabase
    .from("nutrition_targets")
    .select("daily_calories, daily_protein_grams, daily_carbs_grams, daily_fat_grams")
    .eq("user_id", clientId)
    .maybeSingle()

  // Upsert: update if exists, insert if not
  const { data, error } = await supabase
    .from("nutrition_targets")
    .upsert(
      {
        user_id: clientId,
        coach_id: auth.user.id,
        daily_calories: targets.daily_calories || null,
        daily_protein_grams: targets.daily_protein_grams || null,
        daily_carbs_grams: targets.daily_carbs_grams || null,
        daily_fat_grams: targets.daily_fat_grams || null,
      },
      { onConflict: "user_id" }
    )
    .select()
    .single()

  if (error) return { success: false, error: error.message }

  // Log the change to history
  await supabase.from("nutrition_target_history").insert({
    user_id: clientId,
    coach_id: auth.user.id,
    source: metadata?.source || "manual",
    daily_calories: targets.daily_calories || null,
    daily_protein_grams: targets.daily_protein_grams || null,
    daily_carbs_grams: targets.daily_carbs_grams || null,
    daily_fat_grams: targets.daily_fat_grams || null,
    previous_calories: previous?.daily_calories || null,
    previous_protein_grams: previous?.daily_protein_grams || null,
    previous_carbs_grams: previous?.daily_carbs_grams || null,
    previous_fat_grams: previous?.daily_fat_grams || null,
    rationale: metadata?.rationale || null,
    ai_model: metadata?.aiModel || null,
    rag_used: metadata?.ragUsed || false,
  })

  // Log coaching event
  try {
    const { logCoachingEventDirect } = await import("./coaching-events")
    const isNew = !previous?.daily_calories
    await logCoachingEventDirect(supabase, {
      clientId,
      coachId: auth.user.id,
      eventType: isNew ? "nutrition_targets_set" : "nutrition_targets_adjusted",
      area: "nutrition",
      title: isNew ? "Voedingsdoelen ingesteld" : "Voedingsdoelen aangepast",
      description: metadata?.rationale || `${targets.daily_calories || "?"}kcal, ${targets.daily_protein_grams || "?"}g eiwit, ${targets.daily_carbs_grams || "?"}g kh, ${targets.daily_fat_grams || "?"}g vet`,
      source: metadata?.source === "ai" ? "ai" : "manual",
      eventData: {
        newCalories: targets.daily_calories,
        newProtein: targets.daily_protein_grams,
        newCarbs: targets.daily_carbs_grams,
        newFat: targets.daily_fat_grams,
        previousCalories: previous?.daily_calories,
        previousProtein: previous?.daily_protein_grams,
      },
    })
  } catch (e) { /* non-critical */ }

  return { success: true, targets: data }
}

export async function getNutritionTargets(clientId: string) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("nutrition_targets")
    .select("*")
    .eq("user_id", clientId)
    .maybeSingle()

  if (error) return { success: false, error: error.message }
  return { success: true, targets: data }
}

export async function getNutritionTargetHistory(clientId: string) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("nutrition_target_history")
    .select("*")
    .eq("user_id", clientId)
    .order("created_at", { ascending: false })
    .limit(20)

  if (error) return { success: false, error: error.message }
  return { success: true, history: data || [] }
}

// ============================================
// FOOD LOGS (existing - kept as-is, uses Supabase)
// ============================================

export async function getFoodLogs(date?: string) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()

  // Get coach's client IDs
  const { data: profiles } = await supabase
    .from("profiles")
    .select("user_id, first_name, last_name")
    .eq("coach_id", auth.user.id)

  const clientIds = (profiles || []).map((p: any) => p.user_id)
  if (clientIds.length === 0) return { success: true, logs: [] }

  const profileMap = new Map(
    (profiles || []).map((p: any) => [
      p.user_id,
      `${p.first_name || ""} ${p.last_name || ""}`.trim() || "Client",
    ])
  )

  let query = supabase
    .from("food_logs")
    .select("*")
    .in("user_id", clientIds)
    .order("logged_at", { ascending: true })

  if (date) {
    query = query.eq("date", date)
  }

  const { data, error } = await query.limit(500)

  if (error) return { success: false, error: error.message }

  const logs = (data || []).map((log: any) => ({
    ...log,
    client_name: profileMap.get(log.user_id) || "Client",
  }))

  return { success: true, logs }
}

// ============================================
// SUPPLEMENTS
// ============================================

export async function getClientSupplements(clientId: string) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("client_supplements")
    .select("*")
    .eq("client_id", clientId)
    .order("is_active", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) return { success: false, error: error.message }
  return { success: true, supplements: data || [] }
}

export async function addClientSupplement(
  clientId: string,
  supplement: {
    name: string
    dosage: string
    timing?: string
    frequency?: string
    notes?: string
    source?: "manual" | "ai"
    aiRationale?: string
  }
) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("client_supplements")
    .insert({
      client_id: clientId,
      coach_id: auth.user.id,
      name: supplement.name,
      dosage: supplement.dosage,
      timing: supplement.timing || null,
      frequency: supplement.frequency || "dagelijks",
      notes: supplement.notes || null,
      source: supplement.source || "manual",
      ai_rationale: supplement.aiRationale || null,
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message }

  // Log coaching event
  try {
    const { logCoachingEventDirect } = await import("./coaching-events")
    await logCoachingEventDirect(supabase, {
      clientId,
      coachId: auth.user.id,
      eventType: "supplement_added",
      area: "supplements",
      title: `${supplement.name} toegevoegd`,
      description: `${supplement.dosage}${supplement.timing ? `, ${supplement.timing}` : ""}`,
      source: supplement.source === "ai" ? "ai" : "manual",
      relatedEntityType: "client_supplement",
      relatedEntityId: data.id,
      eventData: { name: supplement.name, dosage: supplement.dosage, timing: supplement.timing },
    })
  } catch (e) { /* non-critical */ }

  return { success: true, supplement: data }
}

export async function updateClientSupplement(
  supplementId: string,
  updates: {
    name?: string
    dosage?: string
    timing?: string
    frequency?: string
    notes?: string
  }
) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()
  const payload: any = { updated_at: new Date().toISOString() }
  if (updates.name !== undefined) payload.name = updates.name
  if (updates.dosage !== undefined) payload.dosage = updates.dosage
  if (updates.timing !== undefined) payload.timing = updates.timing
  if (updates.frequency !== undefined) payload.frequency = updates.frequency
  if (updates.notes !== undefined) payload.notes = updates.notes

  const { error } = await supabase
    .from("client_supplements")
    .update(payload)
    .eq("id", supplementId)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function removeClientSupplement(supplementId: string) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()

  // Fetch supplement name before deleting for the event log
  const { data: sup } = await supabase.from("client_supplements").select("name, client_id").eq("id", supplementId).maybeSingle()

  const { error } = await supabase
    .from("client_supplements")
    .delete()
    .eq("id", supplementId)

  if (error) return { success: false, error: error.message }

  // Log coaching event
  if (sup?.client_id) {
    try {
      const { logCoachingEventDirect } = await import("./coaching-events")
      await logCoachingEventDirect(supabase, {
        clientId: sup.client_id,
        coachId: auth.user.id,
        eventType: "supplement_removed",
        area: "supplements",
        title: `${sup.name || "Supplement"} verwijderd`,
        source: "manual",
      })
    } catch (e) { /* non-critical */ }
  }

  return { success: true }
}

export async function toggleSupplementActive(supplementId: string, isActive: boolean) {
  const auth = await checkAuth()
  if (!auth.authorized || !auth.user) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from("client_supplements")
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq("id", supplementId)

  if (error) return { success: false, error: error.message }
  return { success: true }
}
