/**
 * Aggregates ALL client data into a single context object for AI features.
 * Used by training generator, nutrition generator, and weekly review.
 */
import { SupabaseClient } from "@supabase/supabase-js"

export interface ClientContext {
  profile: {
    firstName: string
    lastName: string
    age: number | null
    heightCm: number | null
    currentWeightKg: number | null
    goalWeightKg: number | null
    activityLevel: string | null
  }
  intake: {
    goals: string | null
    fitnessExperience: string | null
    trainingHistory: string | null
    injuries: string | null
    medicalConditions: string | null
    medications: string | null
    dietaryRestrictions: string | null
    allergies: string | null
    sleepHours: number | null
    stressLevel: number | null
    occupation: string | null
    availableDays: string[]
    preferredTrainingTime: string | null
    equipmentAccess: string | null
    additionalNotes: string | null
  } | null
  recentWeeklyCheckIns: Array<{
    weekNumber: number
    year: number
    weight: number | null
    feeling: number | null
    energyLevel: number | null
    sleepQuality: number | null
    stressLevel: number | null
    nutritionAdherence: number | null
    trainingAdherence: number | null
    notes: string | null
  }>
  recentDailyCheckIns: Array<{
    date: string
    weight: number | null
    mood: number | null
    sleepQuality: number | null
  }>
  currentProgram: {
    name: string
    status: string
    blocks: Array<{ name: string; durationWeeks: number }>
  } | null
  recentWorkoutLogs: Array<{
    templateName: string
    completedAt: string
    exercises: Array<{
      name: string
      sets: Array<{ reps: number; weightKg: number | null; rpe: number | null }>
    }>
  }>
  nutritionTargets: {
    dailyCalories: number | null
    dailyProteinGrams: number | null
    dailyCarbsGrams: number | null
    dailyFatGrams: number | null
  } | null
  goals: Array<{ title: string; status: string }>
  weightTrend: number | null
  coachingHistory: Array<{
    date: string
    eventType: string
    area: string
    title: string
    description: string | null
    source: string
  }>
}

export async function buildClientContext(
  supabase: SupabaseClient,
  clientId: string
): Promise<ClientContext> {
  const [
    profileRes,
    intakeRes,
    weeklyRes,
    dailyRes,
    programRes,
    workoutRes,
    targetsRes,
    goalsRes,
    coachingEventsRes,
  ] = await Promise.all([
    supabase.from("profiles").select("first_name, last_name, date_of_birth, height_cm, current_weight_kg, goal_weight_kg, activity_level").eq("id", clientId).maybeSingle(),
    supabase.from("intake_forms").select("*").eq("user_id", clientId).maybeSingle(),
    supabase.from("check_ins").select("*").eq("user_id", clientId).order("created_at", { ascending: false }).limit(8),
    supabase.from("daily_check_ins").select("*").eq("user_id", clientId).order("created_at", { ascending: false }).limit(14),
    supabase.from("client_programs").select("status, training_programs(name), program_id, current_block_index").eq("client_id", clientId).eq("status", "active").maybeSingle(),
    supabase.from("client_workouts").select(`
      completed_at, workout_templates(name),
      workout_logs(exercise_id, set_number, reps_completed, weight_kg, actual_rpe,
        exercises(name))
    `).eq("client_id", clientId).eq("completed", true).order("completed_at", { ascending: false }).limit(10),
    supabase.from("nutrition_targets").select("daily_calories, daily_protein_grams, daily_carbs_grams, daily_fat_grams").eq("user_id", clientId).maybeSingle(),
    supabase.from("client_goals").select("title, status").eq("client_id", clientId).eq("status", "active"),
    supabase.from("coaching_events").select("created_at, event_type, area, title, description, source").eq("client_id", clientId).order("created_at", { ascending: false }).limit(15),
  ])

  const p = profileRes.data
  const intake = intakeRes.data
  const weeklyCheckIns = weeklyRes.data || []
  const dailyCheckIns = dailyRes.data || []

  // Calculate age
  let age: number | null = null
  if (p?.date_of_birth) {
    age = Math.floor((Date.now() - new Date(p.date_of_birth).getTime()) / 31557600000)
  }

  // Calculate weight trend from daily check-ins
  let weightTrend: number | null = null
  const weights = dailyCheckIns.filter((c: any) => c.weight != null).map((c: any) => c.weight as number)
  if (weights.length >= 2) {
    weightTrend = Math.round((weights[0] - weights[weights.length - 1]) * 10) / 10
  }

  // Transform workout logs
  const workoutLogs = (workoutRes.data || []).map((w: any) => ({
    templateName: w.workout_templates?.name || "Onbekend",
    completedAt: w.completed_at || "",
    exercises: groupWorkoutLogs(w.workout_logs || []),
  }))

  // Current program
  let currentProgram: ClientContext["currentProgram"] = null
  if (programRes.data) {
    const pd = programRes.data as any
    // Fetch program blocks separately
    const { data: blocks } = await supabase
      .from("program_blocks")
      .select("name, duration_weeks")
      .eq("program_id", pd.program_id)
      .order("order_index")
    currentProgram = {
      name: pd.training_programs?.name || "Onbekend",
      status: pd.status,
      blocks: (blocks || []).map((b: any) => ({ name: b.name, durationWeeks: b.duration_weeks })),
    }
  }

  return {
    profile: {
      firstName: p?.first_name || "",
      lastName: p?.last_name || "",
      age,
      heightCm: p?.height_cm || null,
      currentWeightKg: p?.current_weight_kg || null,
      goalWeightKg: p?.goal_weight_kg || null,
      activityLevel: p?.activity_level || null,
    },
    intake: intake ? {
      goals: intake.goals,
      fitnessExperience: intake.fitness_experience,
      trainingHistory: intake.training_history,
      injuries: intake.injuries,
      medicalConditions: intake.medical_conditions,
      medications: intake.medications,
      dietaryRestrictions: intake.dietary_restrictions,
      allergies: intake.allergies,
      sleepHours: intake.sleep_hours ? Number(intake.sleep_hours) : null,
      stressLevel: intake.stress_level,
      occupation: intake.occupation,
      availableDays: intake.available_days || [],
      preferredTrainingTime: intake.preferred_training_time,
      equipmentAccess: intake.equipment_access,
      additionalNotes: intake.additional_notes,
    } : null,
    recentWeeklyCheckIns: weeklyCheckIns.map((c: any) => ({
      weekNumber: c.week_number,
      year: c.year,
      weight: c.weight ? Number(c.weight) : null,
      feeling: c.feeling,
      energyLevel: c.energy_level,
      sleepQuality: c.sleep_quality,
      stressLevel: c.stress_level,
      nutritionAdherence: c.nutrition_adherence,
      trainingAdherence: c.training_adherence,
      notes: c.notes,
    })),
    recentDailyCheckIns: dailyCheckIns.map((c: any) => ({
      date: c.check_in_date || c.created_at?.slice(0, 10) || "",
      weight: c.weight ? Number(c.weight) : null,
      mood: c.mood,
      sleepQuality: c.sleep_quality,
    })),
    currentProgram,
    recentWorkoutLogs: workoutLogs,
    nutritionTargets: targetsRes.data ? {
      dailyCalories: targetsRes.data.daily_calories,
      dailyProteinGrams: targetsRes.data.daily_protein_grams,
      dailyCarbsGrams: targetsRes.data.daily_carbs_grams,
      dailyFatGrams: targetsRes.data.daily_fat_grams,
    } : null,
    goals: (goalsRes.data || []).map((g: any) => ({ title: g.title, status: g.status })),
    weightTrend,
    coachingHistory: (coachingEventsRes.data || []).map((e: any) => ({
      date: e.created_at?.slice(0, 10) || "",
      eventType: e.event_type,
      area: e.area,
      title: e.title,
      description: e.description,
      source: e.source,
    })),
  }
}

/** Group workout_logs by exercise into a cleaner structure */
function groupWorkoutLogs(logs: any[]): Array<{
  name: string
  sets: Array<{ reps: number; weightKg: number | null; rpe: number | null }>
}> {
  const byExercise = new Map<string, { name: string; sets: any[] }>()
  for (const log of logs) {
    const eid = log.exercise_id
    if (!byExercise.has(eid)) {
      byExercise.set(eid, { name: log.exercises?.name || "Onbekend", sets: [] })
    }
    byExercise.get(eid)!.sets.push({
      reps: log.reps_completed,
      weightKg: log.weight_kg,
      rpe: log.actual_rpe,
    })
  }
  return Array.from(byExercise.values())
}

/**
 * Format ClientContext into a human-readable text block for the LLM prompt.
 */
export function formatClientContextForPrompt(ctx: ClientContext): string {
  const lines: string[] = []

  // Profile
  const name = `${ctx.profile.firstName} ${ctx.profile.lastName}`.trim()
  if (name) lines.push(`Naam: ${name}`)
  if (ctx.profile.age) lines.push(`Leeftijd: ${ctx.profile.age} jaar`)
  if (ctx.profile.heightCm) lines.push(`Lengte: ${ctx.profile.heightCm} cm`)
  if (ctx.profile.currentWeightKg) lines.push(`Huidig gewicht: ${ctx.profile.currentWeightKg} kg`)
  if (ctx.profile.goalWeightKg) lines.push(`Doelgewicht: ${ctx.profile.goalWeightKg} kg`)
  if (ctx.profile.activityLevel) lines.push(`Activiteitsniveau: ${ctx.profile.activityLevel}`)

  // Intake
  if (ctx.intake) {
    const i = ctx.intake
    if (i.goals) lines.push(`Doelen: ${i.goals}`)
    if (i.fitnessExperience) lines.push(`Fitnesservaring: ${i.fitnessExperience}`)
    if (i.trainingHistory) lines.push(`Trainingsgeschiedenis: ${i.trainingHistory}`)
    if (i.injuries) lines.push(`Blessures: ${i.injuries}`)
    if (i.medicalConditions) lines.push(`Medische aandoeningen: ${i.medicalConditions}`)
    if (i.medications) lines.push(`Medicijnen: ${i.medications}`)
    if (i.dietaryRestrictions) lines.push(`Voedingsrestricties: ${i.dietaryRestrictions}`)
    if (i.allergies) lines.push(`Allergieën: ${i.allergies}`)
    if (i.sleepHours != null) lines.push(`Slaap: ${i.sleepHours} uur per nacht`)
    if (i.stressLevel != null) lines.push(`Stressniveau: ${i.stressLevel}/5`)
    if (i.occupation) lines.push(`Beroep: ${i.occupation}`)
    if (i.availableDays?.length) lines.push(`Beschikbare trainingsdagen: ${i.availableDays.join(", ")}`)
    if (i.preferredTrainingTime) lines.push(`Voorkeurstijd training: ${i.preferredTrainingTime}`)
    if (i.equipmentAccess) lines.push(`Beschikbare uitrusting: ${i.equipmentAccess}`)
    if (i.additionalNotes) lines.push(`Opmerkingen: ${i.additionalNotes}`)
  }

  // Weight trend
  if (ctx.weightTrend != null) {
    const dir = ctx.weightTrend > 0 ? "+" : ""
    lines.push(`Gewichtstrend (laatste 2 weken): ${dir}${ctx.weightTrend} kg`)
  }

  // Recent check-ins summary
  if (ctx.recentWeeklyCheckIns.length > 0) {
    const recent = ctx.recentWeeklyCheckIns.slice(0, 4)
    const avgEnergy = avg(recent.map(c => c.energyLevel))
    const avgSleep = avg(recent.map(c => c.sleepQuality))
    const avgStress = avg(recent.map(c => c.stressLevel))
    const avgNutrition = avg(recent.map(c => c.nutritionAdherence))
    const avgTraining = avg(recent.map(c => c.trainingAdherence))
    lines.push(`\nRecente check-ins (gem. laatste ${recent.length} weken):`)
    if (avgEnergy) lines.push(`  Energie: ${avgEnergy}/10`)
    if (avgSleep) lines.push(`  Slaapkwaliteit: ${avgSleep}/10`)
    if (avgStress) lines.push(`  Stress: ${avgStress}/10`)
    if (avgNutrition) lines.push(`  Voeding naleving: ${avgNutrition}/10`)
    if (avgTraining) lines.push(`  Training naleving: ${avgTraining}/10`)
  }

  // Current program
  if (ctx.currentProgram) {
    lines.push(`\nHuidig programma: ${ctx.currentProgram.name} (${ctx.currentProgram.status})`)
    for (const b of ctx.currentProgram.blocks) {
      lines.push(`  Blok: ${b.name} — ${b.durationWeeks} weken`)
    }
  }

  // Recent workout summary
  if (ctx.recentWorkoutLogs.length > 0) {
    lines.push(`\nLaatste ${ctx.recentWorkoutLogs.length} trainingen:`)
    for (const w of ctx.recentWorkoutLogs.slice(0, 5)) {
      const exSummary = w.exercises.map(e => {
        const topSet = e.sets.reduce((best, s) => (s.weightKg || 0) > (best.weightKg || 0) ? s : best, e.sets[0])
        return `${e.name}: ${e.sets.length}x${topSet?.reps || "?"}@${topSet?.weightKg || "BW"}kg`
      }).join(", ")
      lines.push(`  ${w.completedAt.slice(0, 10)}: ${w.templateName} — ${exSummary}`)
    }
  }

  // Nutrition targets
  if (ctx.nutritionTargets) {
    const t = ctx.nutritionTargets
    lines.push(`\nHuidige voedingstargets: ${t.dailyCalories || "?"}kcal, ${t.dailyProteinGrams || "?"}g eiwit, ${t.dailyCarbsGrams || "?"}g koolhydraten, ${t.dailyFatGrams || "?"}g vet`)
  }

  // Goals
  if (ctx.goals.length > 0) {
    lines.push(`\nActieve doelen: ${ctx.goals.map(g => g.title).join(", ")}`)
  }

  // Coaching history (AI memory)
  if (ctx.coachingHistory.length > 0) {
    const sourceLabel: Record<string, string> = {
      manual: "Handmatig",
      ai: "AI",
      ai_applied: "AI Toegepast",
      system: "Systeem",
    }
    lines.push(`\nCoaching Geschiedenis (laatste ${ctx.coachingHistory.length} beslissingen):`)
    for (const e of ctx.coachingHistory) {
      const src = sourceLabel[e.source] || e.source
      const desc = e.description ? ` — ${e.description}` : ""
      lines.push(`  ${e.date}: [${e.area}] ${e.title} [${src}]${desc}`)
    }
  }

  return lines.join("\n")
}

function avg(nums: (number | null | undefined)[]): string | null {
  const valid = nums.filter((n): n is number => n != null)
  if (valid.length === 0) return null
  return (valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(1)
}
