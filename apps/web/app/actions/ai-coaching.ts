"use server"

import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { callGroq, fetchRagContext } from "@/lib/ai/groq-client"
import { buildClientContext, formatClientContextForPrompt } from "@/lib/ai/client-context"
import { getCoachExerciseLibrary, formatExerciseLibraryForPrompt, resolveExerciseIds } from "@/lib/ai/exercise-resolver"

// ── Auth helpers (same pattern as ai-intake.ts) ──

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
  if (!user) return { authorized: false as const, user: null, coachId: "" }
  const role = user.user_metadata?.role || "CLIENT"
  if (role !== "ADMIN" && role !== "COACH") return { authorized: false as const, user: null, coachId: "" }
  return { authorized: true as const, user, coachId: user.id }
}

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

// ══════════════════════════════════════════════════════
// Phase 1: AI Training Program Generator
// ══════════════════════════════════════════════════════

export interface AITrainingExercise {
  exerciseId: string
  exerciseName: string
  section: "warm_up" | "workout" | "cool_down"
  sets: number
  reps: string
  restSeconds: number
  notes: string
  prescribedRpe?: number
  prescribedRir?: number
  tempo?: string
}

export interface AITrainingDay {
  name: string
  isRestDay: boolean
  dayOfWeek?: number
  exercises: AITrainingExercise[]
}

export interface AITrainingBlock {
  name: string
  durationWeeks: number
  days: AITrainingDay[]
}

export interface AITrainingProgram {
  name: string
  description: string
  blocks: AITrainingBlock[]
  periodizationRationale: string
  progressionStrategy: string
  coachNotes: string
}

export interface AITrainingProgramResult {
  program: AITrainingProgram
  tokensUsed: number
  model: string
  ragUsed: boolean
  warnings: string[]
}

const TRAINING_SYSTEM_PROMPT = `Je bent een expert strength & conditioning coach. Je ontwerpt evidence-based trainingsschema's.

RETOURNEER UITSLUITEND een geldig JSON-object met deze exacte structuur:
{
  "name": "Programma naam",
  "description": "Korte beschrijving (2-3 zinnen)",
  "blocks": [{
    "name": "Blok naam (bijv. Hypertrofie Fase 1)",
    "durationWeeks": 4,
    "days": [{
      "name": "Dag 1: Upper Body",
      "isRestDay": false,
      "dayOfWeek": 1,
      "exercises": [{
        "exerciseId": "uuid-uit-de-bibliotheek",
        "exerciseName": "Bench Press",
        "section": "workout",
        "sets": 3,
        "reps": "8-12",
        "restSeconds": 90,
        "notes": "Volledige ROM, schouderbladen retractie",
        "prescribedRpe": 7
      }]
    }]
  }],
  "periodizationRationale": "Waarom deze opbouw",
  "progressionStrategy": "Hoe te progresseren",
  "coachNotes": "Belangrijke aandachtspunten"
}

KRITIEKE REGELS:
1. Gebruik UITSLUITEND exerciseId's uit de meegeleverde OEFENBIBLIOTHEEK. Kopieer de exacte UUID.
2. Vul ook exerciseName in met de naam van de oefening uit de bibliotheek.
3. Elke trainingsdag: 5-8 oefeningen in de "workout" sectie.
4. Optioneel: 1-3 oefeningen als "warm_up" sectie.
5. Balanceer bewegingspatronen: push, pull, squat, hinge, core.
6. dayOfWeek: 1=maandag t/m 7=zondag. Gebruik de beschikbare dagen van de client.
7. Stel RPE/RIR voor passend bij ervaringsniveau (beginners: RPE 6-7, gevorderd: RPE 8-9).
8. Beperk tot 1 blok voor beginners, 1-2 blokken voor gevorderden.
9. Retourneer ALLEEN geldig JSON, geen markdown, geen uitleg buiten de JSON.
10. Gebruik de RAG-kennis (indien aanwezig) om je keuzes te onderbouwen in periodizationRationale.`

export async function generateTrainingProgram(clientId: string): Promise<{
  success: boolean
  data?: AITrainingProgramResult
  error?: string
}> {
  // Step 1: Auth
  console.log("[AI Training] Step 1: Checking auth...")
  let auth
  try {
    auth = await checkAuth()
  } catch (e: any) {
    console.error("[AI Training] Auth failed:", e)
    return { success: false, error: `Auth fout: ${e.message}` }
  }
  if (!auth.authorized) return { success: false, error: "Niet geautoriseerd" }
  console.log("[AI Training] Step 1 OK — coach:", auth.coachId)

  const supabase = getSupabaseAdmin()

  // Step 2: Gather all client data + exercise library
  console.log("[AI Training] Step 2: Building client context + exercise library...")
  let clientContext, exerciseLibrary
  try {
    ;[clientContext, exerciseLibrary] = await Promise.all([
      buildClientContext(supabase, clientId),
      getCoachExerciseLibrary(supabase, auth.coachId),
    ])
  } catch (e: any) {
    console.error("[AI Training] Client data fetch failed:", e)
    return { success: false, error: `Database fout: ${e.message}` }
  }
  console.log("[AI Training] Step 2 OK — intake:", !!clientContext.intake, "exercises:", exerciseLibrary.length)

  if (!clientContext.intake) {
    return { success: false, error: "Client heeft geen intake formulier. Vul eerst de intake in." }
  }

  if (exerciseLibrary.length === 0) {
    return { success: false, error: "Geen oefeningen in de bibliotheek. Voeg eerst oefeningen toe." }
  }

  // Build context texts
  const clientText = formatClientContextForPrompt(clientContext)
  const exerciseText = formatExerciseLibraryForPrompt(exerciseLibrary)

  // Step 3: Query RAG (graceful — failure = empty context)
  console.log("[AI Training] Step 3: Querying RAG...")
  const ragQuery = `Geef evidence-based richtlijnen voor trainingsprogramma-ontwerp, periodisering, volume-aanbevelingen en oefenselectie voor een client met: ${clientContext.intake.goals || "algemene fitness"}, ervaring: ${clientContext.intake.fitnessExperience || "onbekend"}, beschikbare dagen: ${clientContext.intake.availableDays?.join(", ") || "onbekend"}`
  const ragContext = await fetchRagContext(ragQuery, 8)
  const ragUsed = ragContext.length > 0
  console.log("[AI Training] Step 3 OK — RAG used:", ragUsed, "context length:", ragContext.length)

  // Build user message
  let userMessage = `CLIENTGEGEVENS:\n${clientText}\n\n---\n\nOEFENBIBLIOTHEEK (gebruik ALLEEN deze exercise IDs):\n${exerciseText}`
  if (ragUsed) {
    userMessage += `\n\n---\n\nEVIDENCE-BASED KENNIS UIT DE COACHING KENNISBANK:\n${ragContext}`
  }
  userMessage += `\n\n---\n\nGenereer een compleet trainingsprogramma voor deze client. Gebruik de beschikbare oefeningen en onderbouw je keuzes met de kennisbank-informatie.`

  // Step 4: Call Groq LLM
  console.log("[AI Training] Step 4: Calling Groq (message length:", userMessage.length, "chars)...")
  let response
  try {
    response = await callGroq({
      systemPrompt: TRAINING_SYSTEM_PROMPT,
      userMessage,
      maxTokens: 6000,
      temperature: 0.3,
      jsonMode: true,
    })
  } catch (e: any) {
    console.error("[AI Training] Groq API failed:", e)
    return { success: false, error: `AI (Groq) fout: ${e.message}` }
  }
  console.log("[AI Training] Step 4 OK — tokens:", response.tokensUsed)

  // Step 5: Parse JSON response
  let program: AITrainingProgram
  try {
    program = JSON.parse(response.content)
  } catch {
    // Try extracting JSON from the response if it contains extra text
    const jsonMatch = response.content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error("[AI Training] No JSON in response:", response.content.slice(0, 200))
      return { success: false, error: "AI retourneerde geen geldig JSON. Probeer opnieuw." }
    }
    try {
      program = JSON.parse(jsonMatch[0])
    } catch (e2: any) {
      console.error("[AI Training] JSON parse failed:", e2.message)
      return { success: false, error: "AI JSON parsing mislukt. Probeer opnieuw." }
    }
  }

  // Validate required fields
  if (!program.name || !program.blocks || !Array.isArray(program.blocks)) {
    return { success: false, error: "AI output mist vereiste velden (name, blocks). Probeer opnieuw." }
  }

  // Validate and resolve exercise IDs
  const { warnings } = resolveExerciseIds(program.blocks, exerciseLibrary)

  return {
    success: true,
    data: {
      program,
      tokensUsed: response.tokensUsed,
      model: response.model,
      ragUsed,
      warnings,
    },
  }
}

// ══════════════════════════════════════════════════════
// Save AI-generated program (reuses saveProgramFromBuilder)
// ══════════════════════════════════════════════════════

export async function saveAITrainingProgram(
  clientId: string,
  program: AITrainingProgram,
  assignToClient: boolean = false,
  startDate?: string
): Promise<{ success: boolean; programId?: string; error?: string }> {
  try {
    const auth = await checkAuth()
    if (!auth.authorized) return { success: false, error: "Niet geautoriseerd" }

    // Import saveProgramFromBuilder dynamically to avoid circular deps
    const { saveProgramFromBuilder, assignProgramToClient } = await import("./training-programs")

    const result = await saveProgramFromBuilder({
      name: program.name,
      description: program.description,
      tags: "ai-generated",
      useBlocks: true,
      blocks: program.blocks.map(block => ({
        name: block.name,
        durationWeeks: block.durationWeeks,
        days: block.days.map(day => ({
          name: day.name,
          isRestDay: day.isRestDay,
          dayOfWeek: day.dayOfWeek,
          exercises: (day.exercises || []).map((ex, i) => ({
            exerciseId: ex.exerciseId,
            section: ex.section || "workout",
            sets: ex.sets,
            reps: ex.reps,
            restSeconds: ex.restSeconds,
            notes: ex.notes,
            prescribedRpe: ex.prescribedRpe,
            prescribedRir: ex.prescribedRir,
            tempo: ex.tempo,
          })),
        })),
      })),
    })

    if (!result.success || !result.programId) {
      return { success: false, error: result.error || "Opslaan mislukt" }
    }

    // Optionally assign to client
    if (assignToClient && startDate) {
      await assignProgramToClient({
        clientId,
        programId: result.programId,
        startDate,
      })
    }

    return { success: true, programId: result.programId }
  } catch (error: any) {
    console.error("Save AI training program failed:", error)
    return { success: false, error: error.message || "Opslaan mislukt" }
  }
}

// ══════════════════════════════════════════════════════
// Phase 2: AI Nutrition Plan Generator
// ══════════════════════════════════════════════════════

export interface AINutritionTargets {
  dailyCalories: number
  dailyProteinGrams: number
  dailyCarbsGrams: number
  dailyFatGrams: number
  rationale: string
}

export interface AINutritionResult {
  targets: AINutritionTargets
  generalAdvice: string
  timingRecommendations: string
  supplementAdvice: string
  warnings: string[]
  tokensUsed: number
  model: string
  ragUsed: boolean
}

const NUTRITION_SYSTEM_PROMPT = `Je bent een expert voedingscoach. Je berekent macro-targets en geeft evidence-based voedingsadvies.

RETOURNEER UITSLUITEND een geldig JSON-object met deze exacte structuur:
{
  "targets": {
    "dailyCalories": <getal>,
    "dailyProteinGrams": <getal>,
    "dailyCarbsGrams": <getal>,
    "dailyFatGrams": <getal>,
    "rationale": "Uitleg met berekening waarom deze targets gekozen zijn (3-5 zinnen, toon de berekening)"
  },
  "generalAdvice": "Algemeen voedingsadvies voor deze client (3-5 zinnen, specifiek voor hun situatie)",
  "timingRecommendations": "Aanbevelingen voor maaltijdtiming rondom training en door de dag (2-4 zinnen)",
  "supplementAdvice": "Relevante supplementen-aanbevelingen indien van toepassing (1-3 zinnen)"
}

VERPLICHTE BEREKENINGEN — volg deze EXACT:
1. EIWIT (EERSTE berekenen): minimaal 1.6g × lichaamsgewicht in kg. Bij afvallen: 2.0-2.2g × lichaamsgewicht. Voorbeeld: client van 126kg die afvalt → minimaal 126 × 2.0 = 252g eiwit.
2. VET: minimaal 0.8g × lichaamsgewicht, ideaal 1.0g × lichaamsgewicht. Voorbeeld: 126kg → minimaal 101g vet.
3. CALORIEËN: Bereken TDEE via Mifflin-St Jeor + activiteitsfactor. Bij afvallen: -300 tot -500 kcal. Bij opbouwen: +200 tot +300 kcal.
4. KOOLHYDRATEN: resterende calorieën na eiwit (4kcal/g) en vet (9kcal/g).

KRITIEKE REGELS:
- Houd ALTIJD rekening met het WERKELIJKE lichaamsgewicht. Eiwit en vet schalen mee met het gewicht.
- Bij zeer hoog gewicht (>100kg): gebruik een eiwitinname van minimaal 1.6g/kg, bij afvallen minimaal 2.0g/kg.
- Houd rekening met blessures, medische aandoeningen, dieetrestricties en allergieën.
- Gebruik de RAG-kennis (indien aanwezig) om je keuzes te onderbouwen. Citeer specifieke richtlijnen.
- Toon je berekening in de rationale (bijv. "126kg × 2.0g = 252g eiwit").
- Retourneer ALLEEN geldig JSON, geen markdown, geen uitleg buiten de JSON.
- Alle tekst in het Nederlands.`

export async function generateNutritionPlan(clientId: string): Promise<{
  success: boolean
  data?: AINutritionResult
  error?: string
}> {
  // Step 1: Auth
  console.log("[AI Nutrition] Step 1: Checking auth...")
  let auth
  try {
    auth = await checkAuth()
  } catch (e: any) {
    console.error("[AI Nutrition] Auth failed:", e)
    return { success: false, error: `Auth fout: ${e.message}` }
  }
  if (!auth.authorized) return { success: false, error: "Niet geautoriseerd" }

  const supabase = getSupabaseAdmin()

  // Step 2: Gather client data
  console.log("[AI Nutrition] Step 2: Building client context...")
  let clientContext
  try {
    clientContext = await buildClientContext(supabase, clientId)
  } catch (e: any) {
    console.error("[AI Nutrition] Client data fetch failed:", e)
    return { success: false, error: `Database fout: ${e.message}` }
  }

  if (!clientContext.intake) {
    return { success: false, error: "Client heeft geen intake formulier. Vul eerst de intake in." }
  }

  const clientText = formatClientContextForPrompt(clientContext)

  // Step 3: Query RAG
  console.log("[AI Nutrition] Step 3: Querying RAG...")
  const ragQuery = `Geef evidence-based richtlijnen voor voedingsberekeningen, macro-verdeling, calorieberekening, maaltijdtiming en supplementen voor een client met: doel ${clientContext.intake.goals || "algemene gezondheid"}, gewicht ${clientContext.profile.currentWeightKg || "onbekend"}kg, activiteitsniveau ${clientContext.profile.activityLevel || "onbekend"}`
  const ragContext = await fetchRagContext(ragQuery, 8)
  const ragUsed = ragContext.length > 0
  console.log("[AI Nutrition] Step 3 OK — RAG used:", ragUsed)

  // Build user message
  let userMessage = `CLIENTGEGEVENS:\n${clientText}`
  if (clientContext.nutritionTargets) {
    const t = clientContext.nutritionTargets
    userMessage += `\n\nHUIDIGE VOEDINGSTARGETS (ter referentie):\nCalorieën: ${t.dailyCalories || "niet ingesteld"}\nEiwit: ${t.dailyProteinGrams || "niet ingesteld"}g\nKoolhydraten: ${t.dailyCarbsGrams || "niet ingesteld"}g\nVet: ${t.dailyFatGrams || "niet ingesteld"}g`
  }
  if (ragUsed) {
    userMessage += `\n\n---\n\nEVIDENCE-BASED KENNIS UIT DE COACHING KENNISBANK:\n${ragContext}`
  }
  userMessage += `\n\n---\n\nBereken optimale macro-targets en geef voedingsadvies voor deze client.`

  // Step 4: Call Groq
  console.log("[AI Nutrition] Step 4: Calling Groq...")
  let response
  try {
    response = await callGroq({
      systemPrompt: NUTRITION_SYSTEM_PROMPT,
      userMessage,
      maxTokens: 2000,
      temperature: 0.3,
      jsonMode: true,
    })
  } catch (e: any) {
    console.error("[AI Nutrition] Groq API failed:", e)
    return { success: false, error: `AI (Groq) fout: ${e.message}` }
  }
  console.log("[AI Nutrition] Step 4 OK — tokens:", response.tokensUsed)

  // Parse JSON
  let parsed: any
  try {
    parsed = JSON.parse(response.content)
  } catch {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return { success: false, error: "AI retourneerde geen geldig JSON. Probeer opnieuw." }
    }
    try {
      parsed = JSON.parse(jsonMatch[0])
    } catch {
      return { success: false, error: "AI JSON parsing mislukt. Probeer opnieuw." }
    }
  }

  // Validate basic structure
  if (!parsed.targets || !parsed.targets.dailyCalories) {
    return { success: false, error: "AI output mist voedingstargets. Probeer opnieuw." }
  }

  let protein = Math.round(parsed.targets.dailyProteinGrams)
  let fat = Math.round(parsed.targets.dailyFatGrams)
  let calories = Math.round(parsed.targets.dailyCalories)
  let carbs = Math.round(parsed.targets.dailyCarbsGrams)
  let rationale = parsed.targets.rationale || ""
  const warnings: string[] = []

  // Post-generation validation: enforce minimums based on body weight
  const weightKg = clientContext.profile.currentWeightKg
  if (weightKg && weightKg > 0) {
    const minProtein = Math.round(weightKg * 1.6)
    const minFat = Math.round(weightKg * 0.8)

    if (protein < minProtein) {
      warnings.push(`AI stelde ${protein}g eiwit voor, gecorrigeerd naar minimum ${minProtein}g (1.6g/kg × ${weightKg}kg)`)
      protein = minProtein
    }
    if (fat < minFat) {
      warnings.push(`AI stelde ${fat}g vet voor, gecorrigeerd naar minimum ${minFat}g (0.8g/kg × ${weightKg}kg)`)
      fat = minFat
    }

    // Recalculate calories if macros were corrected
    if (warnings.length > 0) {
      const newCals = (protein * 4) + (carbs * 4) + (fat * 9)
      if (newCals > calories) {
        calories = newCals
        warnings.push(`Calorieën aangepast naar ${calories} kcal op basis van gecorrigeerde macro's`)
      }
    }
  }

  return {
    success: true,
    data: {
      targets: {
        dailyCalories: calories,
        dailyProteinGrams: protein,
        dailyCarbsGrams: carbs,
        dailyFatGrams: fat,
        rationale,
      },
      generalAdvice: parsed.generalAdvice || "",
      timingRecommendations: parsed.timingRecommendations || "",
      supplementAdvice: parsed.supplementAdvice || "",
      warnings,
      tokensUsed: response.tokensUsed,
      model: response.model,
      ragUsed,
    },
  }
}

// ══════════════════════════════════════════════════════
// Phase 3: AI Weekly Review
// ══════════════════════════════════════════════════════

export interface AIFlaggedConcern {
  severity: "info" | "warning" | "critical"
  area: string
  description: string
}

export interface AIRecommendation {
  area: "training" | "nutrition" | "recovery" | "general"
  action: string
  rationale: string
}

export interface AIActionableRecommendation {
  area: "training" | "nutrition" | "recovery" | "supplements" | "general"
  action: string
  rationale: string
  proposalType: "nutrition_adjust" | "supplement_add" | "supplement_remove" | "training_deload" | "recovery_focus" | "general_advice"
  proposal: {
    calorieChange?: number
    newCalories?: number
    newProtein?: number
    newCarbs?: number
    newFat?: number
    supplementName?: string
    supplementDosage?: string
    supplementTiming?: string
  }
  canApply: boolean
}

export interface AIWeeklyReviewResult {
  summary: string
  complianceAnalysis: {
    training: string
    nutrition: string
    checkIns: string
  }
  progressAnalysis: string
  flaggedConcerns: AIFlaggedConcern[]
  recommendations: AIRecommendation[]
  actionableRecommendations?: AIActionableRecommendation[]
  tokensUsed: number
  model: string
  ragUsed: boolean
}

const WEEKLY_REVIEW_SYSTEM_PROMPT = `Je bent een expert coaching assistent. Je analyseert wekelijks de voortgang van een client en geeft concrete aanbevelingen aan de coach.

RETOURNEER UITSLUITEND een geldig JSON-object met deze exacte structuur:
{
  "summary": "Korte samenvatting van de week (2-3 zinnen)",
  "complianceAnalysis": {
    "training": "Analyse van trainings-naleving en prestaties (2-3 zinnen)",
    "nutrition": "Analyse van voeding-naleving en patronen (2-3 zinnen)",
    "checkIns": "Analyse van check-in consistentie en trends (1-2 zinnen)"
  },
  "progressAnalysis": "Analyse van gewichtstrend, kracht-progressie en algemene voortgang (2-4 zinnen)",
  "flaggedConcerns": [
    {
      "severity": "warning",
      "area": "Herstel",
      "description": "Slaapkwaliteit is 3 weken op rij gedaald (van 8 naar 5/10)"
    }
  ],
  "recommendations": [
    {
      "area": "training",
      "action": "Volume met 10% verlagen komende week",
      "rationale": "Herstel-indicatoren wijzen op accumulatie van vermoeidheid"
    }
  ],
  "actionableRecommendations": [
    {
      "area": "nutrition",
      "action": "Calorieën verhogen met 200 kcal",
      "rationale": "Gewichtsstagnatie bij huidige inname, metabolisme vraagt om meer energie",
      "proposalType": "nutrition_adjust",
      "proposal": {
        "calorieChange": 200,
        "newCalories": 2600,
        "newProtein": 200,
        "newCarbs": 280,
        "newFat": 85
      },
      "canApply": true
    },
    {
      "area": "supplements",
      "action": "Magnesium bisglycinaat toevoegen",
      "rationale": "Slaapkwaliteit is dalend, magnesium kan slaapkwaliteit verbeteren",
      "proposalType": "supplement_add",
      "proposal": {
        "supplementName": "Magnesium Bisglycinaat",
        "supplementDosage": "400mg",
        "supplementTiming": "30 min voor het slapen"
      },
      "canApply": true
    }
  ]
}

KRITIEKE REGELS:
1. Wees specifiek en data-gedreven — verwijs naar exacte cijfers uit de check-ins.
2. flaggedConcerns: gebruik "info" voor positieve trends, "warning" voor aandachtspunten, "critical" voor urgente zaken.
3. recommendations: maximaal 5, concreet en actionable. Elke aanbeveling moet direct uitvoerbaar zijn.
4. actionableRecommendations: maximaal 3 CONCRETE voorstellen die direct toepasbaar zijn. Alleen als er huidige targets of data beschikbaar zijn.
   - proposalType "nutrition_adjust": VERPLICHT newCalories, newProtein, newCarbs, newFat. Bereken op basis van HUIDIGE targets + gewenste delta.
   - proposalType "supplement_add": VERPLICHT supplementName, supplementDosage, supplementTiming.
   - proposalType "supplement_remove": VERPLICHT supplementName.
   - proposalType "training_deload" / "recovery_focus" / "general_advice": canApply = false (geen automatische toepassing).
   - Laat actionableRecommendations LEEG als er geen concrete numerieke aanpassingen zinvol zijn.
5. Als er onvoldoende data is (bijv. geen check-ins), geef dat eerlijk aan.
6. Gebruik de RAG-kennis (indien aanwezig) om aanbevelingen te onderbouwen.
7. Houd rekening met de COACHING GESCHIEDENIS — verwijs naar eerdere beslissingen en vermijd herhalingen van wat al is geprobeerd.
8. Retourneer ALLEEN geldig JSON, geen markdown, geen uitleg buiten de JSON.
9. Alle tekst in het Nederlands.`

export async function generateWeeklyReview(clientId: string): Promise<{
  success: boolean
  data?: AIWeeklyReviewResult
  error?: string
}> {
  // Step 1: Auth
  console.log("[AI Review] Step 1: Checking auth...")
  let auth
  try {
    auth = await checkAuth()
  } catch (e: any) {
    return { success: false, error: `Auth fout: ${e.message}` }
  }
  if (!auth.authorized) return { success: false, error: "Niet geautoriseerd" }

  const supabase = getSupabaseAdmin()

  // Step 2: Gather client data
  console.log("[AI Review] Step 2: Building client context...")
  let clientContext
  try {
    clientContext = await buildClientContext(supabase, clientId)
  } catch (e: any) {
    return { success: false, error: `Database fout: ${e.message}` }
  }

  const clientText = formatClientContextForPrompt(clientContext)

  // Check if there's enough data
  const hasCheckIns = clientContext.recentWeeklyCheckIns.length > 0 || clientContext.recentDailyCheckIns.length > 0
  const hasWorkouts = clientContext.recentWorkoutLogs.length > 0

  if (!hasCheckIns && !hasWorkouts) {
    return { success: false, error: "Onvoldoende data voor een review. Er zijn check-ins of workout logs nodig." }
  }

  // Step 3: Query RAG
  console.log("[AI Review] Step 3: Querying RAG...")
  const ragQuery = `Geef richtlijnen voor het evalueren van trainingsvoortgang, herstel-indicatoren, overtraining-signalen en wanneer programmering bij te sturen. Client doel: ${clientContext.intake?.goals || "onbekend"}`
  const ragContext = await fetchRagContext(ragQuery, 6)
  const ragUsed = ragContext.length > 0

  // Build user message
  let userMessage = `CLIENTGEGEVENS EN RECENTE DATA:\n${clientText}`
  if (ragUsed) {
    userMessage += `\n\n---\n\nEVIDENCE-BASED KENNIS UIT DE COACHING KENNISBANK:\n${ragContext}`
  }
  userMessage += `\n\n---\n\nAnalyseer de recente voortgang van deze client en geef een wekelijkse review met concrete aanbevelingen voor de coach.`

  // Step 4: Call Groq
  console.log("[AI Review] Step 4: Calling Groq...")
  let response
  try {
    response = await callGroq({
      systemPrompt: WEEKLY_REVIEW_SYSTEM_PROMPT,
      userMessage,
      maxTokens: 3000,
      temperature: 0.3,
      jsonMode: true,
    })
  } catch (e: any) {
    return { success: false, error: `AI (Groq) fout: ${e.message}` }
  }

  // Parse JSON
  let parsed: any
  try {
    parsed = JSON.parse(response.content)
  } catch {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return { success: false, error: "AI retourneerde geen geldig JSON. Probeer opnieuw." }
    }
    try {
      parsed = JSON.parse(jsonMatch[0])
    } catch {
      return { success: false, error: "AI JSON parsing mislukt. Probeer opnieuw." }
    }
  }

  if (!parsed.summary) {
    return { success: false, error: "AI output mist samenvatting. Probeer opnieuw." }
  }

  // Parse actionable recommendations
  const actionableRecs: AIActionableRecommendation[] = (parsed.actionableRecommendations || []).slice(0, 3).map((r: any) => {
    const validTypes = ["nutrition_adjust", "supplement_add", "supplement_remove", "training_deload", "recovery_focus", "general_advice"]
    const validAreas = ["training", "nutrition", "recovery", "supplements", "general"]
    return {
      area: validAreas.includes(r.area) ? r.area : "general",
      action: r.action || "",
      rationale: r.rationale || "",
      proposalType: validTypes.includes(r.proposalType) ? r.proposalType : "general_advice",
      proposal: r.proposal || {},
      canApply: r.proposalType === "nutrition_adjust" || r.proposalType === "supplement_add" || r.proposalType === "supplement_remove",
    } as AIActionableRecommendation
  })

  return {
    success: true,
    data: {
      summary: parsed.summary || "",
      complianceAnalysis: {
        training: parsed.complianceAnalysis?.training || "",
        nutrition: parsed.complianceAnalysis?.nutrition || "",
        checkIns: parsed.complianceAnalysis?.checkIns || "",
      },
      progressAnalysis: parsed.progressAnalysis || "",
      flaggedConcerns: (parsed.flaggedConcerns || []).map((c: any) => ({
        severity: ["info", "warning", "critical"].includes(c.severity) ? c.severity : "info",
        area: c.area || "",
        description: c.description || "",
      })),
      recommendations: (parsed.recommendations || []).slice(0, 5).map((r: any) => ({
        area: ["training", "nutrition", "recovery", "general"].includes(r.area) ? r.area : "general",
        action: r.action || "",
        rationale: r.rationale || "",
      })),
      actionableRecommendations: actionableRecs.length > 0 ? actionableRecs : undefined,
      tokensUsed: response.tokensUsed,
      model: response.model,
      ragUsed,
    },
  }
}

// ── Apply actionable recommendation from weekly review ──

export async function applyReviewRecommendation(
  clientId: string,
  recommendation: AIActionableRecommendation,
  reviewLogId?: string
): Promise<{ success: boolean; error?: string }> {
  const auth = await checkAuth()
  if (!auth.authorized) return { success: false, error: "Niet geautoriseerd" }

  const { setNutritionTargets, addClientSupplement, removeClientSupplement } = await import("./nutrition")
  const { logCoachingEventDirect } = await import("./coaching-events")
  const supabase = getSupabaseAdmin()

  try {
    if (recommendation.proposalType === "nutrition_adjust") {
      const p = recommendation.proposal
      if (!p.newCalories || !p.newProtein || !p.newCarbs || !p.newFat) {
        return { success: false, error: "Onvolledige voedingsdata in voorstel" }
      }
      const result = await setNutritionTargets(clientId, {
        daily_calories: p.newCalories,
        daily_protein_grams: p.newProtein,
        daily_carbs_grams: p.newCarbs,
        daily_fat_grams: p.newFat,
      }, {
        source: "ai",
        rationale: recommendation.rationale,
      })
      if (!result.success) return { success: false, error: result.error }

      await logCoachingEventDirect(supabase, {
        clientId,
        coachId: auth.coachId,
        eventType: "nutrition_targets_adjusted",
        area: "nutrition",
        title: recommendation.action,
        description: recommendation.rationale,
        source: "ai_applied",
        aiGenerationLogId: reviewLogId,
        eventData: {
          newCalories: p.newCalories,
          newProtein: p.newProtein,
          newCarbs: p.newCarbs,
          newFat: p.newFat,
          calorieChange: p.calorieChange,
        },
      })
      return { success: true }
    }

    if (recommendation.proposalType === "supplement_add") {
      const p = recommendation.proposal
      if (!p.supplementName || !p.supplementDosage) {
        return { success: false, error: "Onvolledige supplementdata in voorstel" }
      }
      const result = await addClientSupplement(clientId, {
        name: p.supplementName,
        dosage: p.supplementDosage,
        timing: p.supplementTiming,
        source: "ai",
        aiRationale: recommendation.rationale,
      })
      if (!result.success) return { success: false, error: result.error }

      await logCoachingEventDirect(supabase, {
        clientId,
        coachId: auth.coachId,
        eventType: "supplement_added",
        area: "supplements",
        title: `${p.supplementName} toegevoegd`,
        description: recommendation.rationale,
        source: "ai_applied",
        aiGenerationLogId: reviewLogId,
        eventData: {
          supplementName: p.supplementName,
          dosage: p.supplementDosage,
          timing: p.supplementTiming,
        },
      })
      return { success: true }
    }

    return { success: false, error: `Voorsteltype "${recommendation.proposalType}" kan niet automatisch worden toegepast` }
  } catch (e: any) {
    console.error("[applyReviewRecommendation] Error:", e)
    return { success: false, error: e.message || "Toepassen mislukt" }
  }
}

// ══════════════════════════════════════════════════════
// Phase 4: AI Supplement Analyzer
// ══════════════════════════════════════════════════════

export interface AISupplementRecommendation {
  name: string
  dosage: string
  timing: string
  frequency: string
  rationale: string
  evidenceLevel: "strong" | "moderate" | "limited"
  interactions: string | null
}

export interface AISupplementResult {
  recommendations: AISupplementRecommendation[]
  medicalDisclaimer: string
  generalNotes: string
  tokensUsed: number
  model: string
  ragUsed: boolean
}

const SUPPLEMENT_SYSTEM_PROMPT = `Je bent een evidence-based voedingscoach die supplementaanbevelingen doet. Je bent GEEN arts.

RETOURNEER UITSLUITEND een geldig JSON-object met deze exacte structuur:
{
  "recommendations": [
    {
      "name": "Creatine Monohydraat",
      "dosage": "5g",
      "timing": "Na de training of bij ontbijt",
      "frequency": "dagelijks",
      "rationale": "Bewezen effectief voor kracht- en spieropbouw. Meest onderzochte supplement met sterk bewijs.",
      "evidenceLevel": "strong",
      "interactions": null
    }
  ],
  "medicalDisclaimer": "Dit zijn algemene aanbevelingen op basis van sportwetenschappelijk onderzoek. Supplementatie is GEEN vervanging voor medisch advies. Overleg ALTIJD met je arts, vooral bij gebruik van medicijnen, zwangerschap, of bestaande aandoeningen.",
  "generalNotes": "Algemene opmerkingen over de supplement-strategie (2-3 zinnen)"
}

KRITIEKE REGELS:
1. Maximaal 7 supplementen, alleen wat evidence-based zinvol is voor deze specifieke client.
2. evidenceLevel: "strong" = meerdere meta-analyses, "moderate" = goed onderzoek maar beperkt, "limited" = veelbelovend maar onvoldoende bewijs.
3. CHECK medicatie-interacties. Als de client medicijnen gebruikt, vermeld mogelijke interacties in het "interactions" veld.
4. Bij twijfel over veiligheid: NIET aanbevelen. Liever te weinig dan te veel.
5. De medicalDisclaimer is VERPLICHT en moet altijd verwijzen naar overleg met arts.
6. Gebruik RAG-kennis (indien aanwezig) voor evidence-based doseringen.
7. Alle tekst in het Nederlands.
8. Retourneer ALLEEN geldig JSON, geen markdown buiten de JSON.`

export async function generateSupplementAnalysis(clientId: string): Promise<{
  success: boolean
  data?: AISupplementResult
  error?: string
}> {
  let auth
  try {
    auth = await checkAuth()
  } catch (e: any) {
    return { success: false, error: `Auth fout: ${e.message}` }
  }
  if (!auth.authorized) return { success: false, error: "Niet geautoriseerd" }

  const supabase = getSupabaseAdmin()

  let clientContext
  try {
    clientContext = await buildClientContext(supabase, clientId)
  } catch (e: any) {
    return { success: false, error: `Database fout: ${e.message}` }
  }

  const clientText = formatClientContextForPrompt(clientContext)

  // RAG query for supplement evidence
  const ragQuery = `Evidence-based supplementen dosering timing creatine vitamine D omega-3 eiwitten magnesium zink ijzer sportprestaties spierherstel. ${clientContext.intake?.goals || ""}`
  const ragContext = await fetchRagContext(ragQuery, 8)
  const ragUsed = ragContext.length > 0

  let userMessage = `CLIENTGEGEVENS:\n${clientText}`
  if (ragUsed) {
    userMessage += `\n\n---\n\nEVIDENCE-BASED KENNIS UIT DE COACHING KENNISBANK:\n${ragContext}`
  }

  // Add medication warning
  const medications = clientContext.intake?.medications
  if (medications) {
    userMessage += `\n\n⚠️ BELANGRIJK — HUIDIGE MEDICATIE: ${medications}\nControleer interacties met alle aanbevolen supplementen!`
  }

  userMessage += `\n\n---\n\nGenereer een evidence-based supplementadvies voor deze client. Focus op wat wetenschappelijk onderbouwd en veilig is.`

  let response
  try {
    response = await callGroq({
      systemPrompt: SUPPLEMENT_SYSTEM_PROMPT,
      userMessage,
      maxTokens: 2500,
      temperature: 0.3,
      jsonMode: true,
    })
  } catch (e: any) {
    return { success: false, error: `AI (Groq) fout: ${e.message}` }
  }

  let parsed: any
  try {
    parsed = JSON.parse(response.content)
  } catch {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return { success: false, error: "AI retourneerde geen geldig JSON." }
    try { parsed = JSON.parse(jsonMatch[0]) } catch { return { success: false, error: "AI JSON parsing mislukt." } }
  }

  return {
    success: true,
    data: {
      recommendations: (parsed.recommendations || []).slice(0, 7).map((r: any) => ({
        name: r.name || "",
        dosage: r.dosage || "",
        timing: r.timing || "",
        frequency: r.frequency || "dagelijks",
        rationale: r.rationale || "",
        evidenceLevel: ["strong", "moderate", "limited"].includes(r.evidenceLevel) ? r.evidenceLevel : "limited",
        interactions: r.interactions || null,
      })),
      medicalDisclaimer: parsed.medicalDisclaimer || "Overleg altijd met je arts voordat je supplementen gebruikt of wijzigt.",
      generalNotes: parsed.generalNotes || "",
      tokensUsed: response.tokensUsed,
      model: response.model,
      ragUsed,
    },
  }
}

// ══════════════════════════════════════════════════════
// Phase 5: AI Client Summary (Cockpit)
// ══════════════════════════════════════════════════════

export interface AIPriorityAction {
  area: "training" | "nutrition" | "recovery" | "supplements" | "general"
  action: string
  urgency: "high" | "medium" | "low"
}

export interface AIClientSummaryResult {
  overallAssessment: string
  trainingStatus: {
    currentProgram: string | null
    adherence: string
    keyInsight: string
  }
  nutritionStatus: {
    currentTargets: string | null
    adherence: string
    keyInsight: string
  }
  supplementStatus: string | null
  progressHighlights: string[]
  priorityActions: AIPriorityAction[]
  tokensUsed: number
  model: string
  ragUsed: boolean
}

const CLIENT_SUMMARY_SYSTEM_PROMPT = `Je bent een senior coaching assistent die een totaaloverzicht maakt van een client. Dit helpt de coach het grote plaatje te zien.

RETOURNEER UITSLUITEND een geldig JSON-object met deze exacte structuur:
{
  "overallAssessment": "Totaaloverzicht in 3-5 zinnen. Hoe gaat het met de client? Waar staan ze nu?",
  "trainingStatus": {
    "currentProgram": "Naam en korte beschrijving huidig programma, of null als geen",
    "adherence": "Hoe goed volgt de client het schema? (1-2 zinnen)",
    "keyInsight": "Belangrijkste observatie over training (1 zin)"
  },
  "nutritionStatus": {
    "currentTargets": "Huidige macro-samenvatting, of null als niet ingesteld",
    "adherence": "Hoe goed volgt de client de voedingsdoelen? (1-2 zinnen)",
    "keyInsight": "Belangrijkste observatie over voeding (1 zin)"
  },
  "supplementStatus": "Samenvatting van actieve supplementen en naleving, of null als niet van toepassing",
  "progressHighlights": [
    "Gewicht gedaald van 128kg naar 126kg in 4 weken",
    "Squat PR: 120kg (was 110kg vorige maand)"
  ],
  "priorityActions": [
    {
      "area": "nutrition",
      "action": "Eiwitinname verhogen naar minimaal 200g/dag",
      "urgency": "high"
    }
  ]
}

KRITIEKE REGELS:
1. Wees specifiek en data-gedreven — verwijs naar exacte cijfers.
2. progressHighlights: 3-5 concrete, meetbare highlights.
3. priorityActions: maximaal 5, gesorteerd op urgentie. Elk direct uitvoerbaar.
4. urgency: "high" = deze week aanpakken, "medium" = komende 2 weken, "low" = nice-to-have.
5. Als er weinig data is, wees eerlijk en geef aan wat ontbreekt.
6. Alle tekst in het Nederlands.
7. Retourneer ALLEEN geldig JSON.`

export async function generateClientSummary(clientId: string): Promise<{
  success: boolean
  data?: AIClientSummaryResult
  error?: string
}> {
  let auth
  try {
    auth = await checkAuth()
  } catch (e: any) {
    return { success: false, error: `Auth fout: ${e.message}` }
  }
  if (!auth.authorized) return { success: false, error: "Niet geautoriseerd" }

  const supabase = getSupabaseAdmin()

  let clientContext
  try {
    clientContext = await buildClientContext(supabase, clientId)
  } catch (e: any) {
    return { success: false, error: `Database fout: ${e.message}` }
  }

  const clientText = formatClientContextForPrompt(clientContext)

  // Also fetch supplements
  const { data: supplements } = await supabase
    .from("client_supplements")
    .select("*")
    .eq("client_id", clientId)
    .eq("is_active", true)

  let supplementText = ""
  if (supplements && supplements.length > 0) {
    supplementText = `\n\nACTIEVE SUPPLEMENTEN:\n` + supplements.map((s: any) =>
      `- ${s.name}: ${s.dosage}, ${s.timing || "geen specifieke timing"}, ${s.frequency}`
    ).join("\n")
  }

  // RAG for holistic coaching insights
  const ragQuery = `Coaching evaluatie voortgang programmering periodisering voeding supplementatie ${clientContext.intake?.goals || ""}`
  const ragContext = await fetchRagContext(ragQuery, 6)
  const ragUsed = ragContext.length > 0

  let userMessage = `COMPLETE CLIENTGEGEVENS:\n${clientText}${supplementText}`
  if (ragUsed) {
    userMessage += `\n\n---\n\nEVIDENCE-BASED KENNIS:\n${ragContext}`
  }
  userMessage += `\n\n---\n\nMaak een compleet totaaloverzicht van deze client. Combineer training, voeding, supplementen en voortgang tot één samenhangend beeld voor de coach.`

  let response
  try {
    response = await callGroq({
      systemPrompt: CLIENT_SUMMARY_SYSTEM_PROMPT,
      userMessage,
      maxTokens: 2500,
      temperature: 0.3,
      jsonMode: true,
    })
  } catch (e: any) {
    return { success: false, error: `AI (Groq) fout: ${e.message}` }
  }

  let parsed: any
  try {
    parsed = JSON.parse(response.content)
  } catch {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return { success: false, error: "AI retourneerde geen geldig JSON." }
    try { parsed = JSON.parse(jsonMatch[0]) } catch { return { success: false, error: "AI JSON parsing mislukt." } }
  }

  return {
    success: true,
    data: {
      overallAssessment: parsed.overallAssessment || "",
      trainingStatus: {
        currentProgram: parsed.trainingStatus?.currentProgram || null,
        adherence: parsed.trainingStatus?.adherence || "",
        keyInsight: parsed.trainingStatus?.keyInsight || "",
      },
      nutritionStatus: {
        currentTargets: parsed.nutritionStatus?.currentTargets || null,
        adherence: parsed.nutritionStatus?.adherence || "",
        keyInsight: parsed.nutritionStatus?.keyInsight || "",
      },
      supplementStatus: parsed.supplementStatus || null,
      progressHighlights: (parsed.progressHighlights || []).slice(0, 5),
      priorityActions: (parsed.priorityActions || []).slice(0, 5).map((a: any) => ({
        area: ["training", "nutrition", "recovery", "supplements", "general"].includes(a.area) ? a.area : "general",
        action: a.action || "",
        urgency: ["high", "medium", "low"].includes(a.urgency) ? a.urgency : "medium",
      })),
      tokensUsed: response.tokensUsed,
      model: response.model,
      ragUsed,
    },
  }
}

// ══════════════════════════════════════════════════════════════
// Phase 6: Initial Coaching Plan Orchestrator
// ══════════════════════════════════════════════════════════════

export interface InitialPlanOptions {
  training: boolean
  nutrition: boolean
  supplements: boolean
}

export interface InitialPlanStepResult {
  step: "intake_analysis" | "training" | "nutrition" | "supplements"
  success: boolean
  data?: any
  error?: string
}

export interface InitialPlanResult {
  steps: InitialPlanStepResult[]
  totalTokens: number
}

export async function generateInitialCoachingPlan(
  clientId: string,
  options: InitialPlanOptions,
  onStepComplete?: (step: InitialPlanStepResult) => void
): Promise<{ success: boolean; data?: InitialPlanResult; error?: string }> {
  const auth = await checkAuth()
  if (!auth.authorized) return { success: false, error: "Niet geautoriseerd" }

  const steps: InitialPlanStepResult[] = []
  let totalTokens = 0

  // Step 1: Intake analysis (always)
  const { analyzeClientIntake } = await import("./ai-intake")
  const intakeRes = await analyzeClientIntake(clientId)
  const intakeStep: InitialPlanStepResult = {
    step: "intake_analysis",
    success: !!intakeRes.success,
    data: intakeRes.success ? intakeRes.data : undefined,
    error: intakeRes.success ? undefined : intakeRes.error,
  }
  steps.push(intakeStep)
  if (intakeRes.success && intakeRes.data?.tokensUsed) totalTokens += intakeRes.data.tokensUsed

  // Step 2: Training (optional)
  if (options.training) {
    const trainingRes = await generateTrainingProgram(clientId)
    const step: InitialPlanStepResult = {
      step: "training",
      success: !!trainingRes.success,
      data: trainingRes.data,
      error: trainingRes.error,
    }
    steps.push(step)
    if (trainingRes.data?.tokensUsed) totalTokens += trainingRes.data.tokensUsed
  }

  // Step 3: Nutrition (optional)
  if (options.nutrition) {
    const nutritionRes = await generateNutritionPlan(clientId)
    const step: InitialPlanStepResult = {
      step: "nutrition",
      success: !!nutritionRes.success,
      data: nutritionRes.data,
      error: nutritionRes.error,
    }
    steps.push(step)
    if (nutritionRes.data?.tokensUsed) totalTokens += nutritionRes.data.tokensUsed
  }

  // Step 4: Supplements (optional)
  if (options.supplements) {
    const supplementRes = await generateSupplementAnalysis(clientId)
    const step: InitialPlanStepResult = {
      step: "supplements",
      success: !!supplementRes.success,
      data: supplementRes.data,
      error: supplementRes.error,
    }
    steps.push(step)
    if (supplementRes.data?.tokensUsed) totalTokens += supplementRes.data.tokensUsed
  }

  return {
    success: true,
    data: { steps, totalTokens },
  }
}

// ══════════════════════════════════════════════════════════════
// Phase 7: AI Generation Logs
// ══════════════════════════════════════════════════════════════

export type AIGenerationType =
  | "training_program"
  | "nutrition_plan"
  | "weekly_review"
  | "supplement_analysis"
  | "client_summary"

export interface AIGenerationLog {
  id: string
  client_id: string
  coach_id: string
  generation_type: AIGenerationType
  title: string | null
  result: any
  model: string | null
  tokens_used: number | null
  rag_used: boolean
  created_at: string
}

const generationTypeLabels: Record<AIGenerationType, string> = {
  training_program: "Training Programma",
  nutrition_plan: "Voedingsplan",
  weekly_review: "Wekelijkse Review",
  supplement_analysis: "Supplementen Analyse",
  client_summary: "Client Samenvatting",
}

export async function getGenerationTypeLabel(type: AIGenerationType): Promise<string> {
  return generationTypeLabels[type] || type
}

export async function saveAIGenerationLog(
  clientId: string,
  generationType: AIGenerationType,
  result: any,
  options?: { title?: string; model?: string; tokensUsed?: number; ragUsed?: boolean }
): Promise<{ success: boolean; id?: string; error?: string }> {
  const auth = await checkAuth()
  if (!auth.authorized) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("ai_generation_logs")
    .insert({
      client_id: clientId,
      coach_id: auth.coachId,
      generation_type: generationType,
      title: options?.title || null,
      result,
      model: options?.model || null,
      tokens_used: options?.tokensUsed || null,
      rag_used: options?.ragUsed || false,
    })
    .select("id")
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, id: data.id }
}

export async function getAIGenerationLogs(
  clientId: string,
  options?: { type?: AIGenerationType; limit?: number }
): Promise<{ success: boolean; logs?: AIGenerationLog[]; error?: string }> {
  const auth = await checkAuth()
  if (!auth.authorized) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()
  let query = supabase
    .from("ai_generation_logs")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false })
    .limit(options?.limit || 20)

  if (options?.type) {
    query = query.eq("generation_type", options.type)
  }

  const { data, error } = await query
  if (error) return { success: false, error: error.message }
  return { success: true, logs: (data || []) as AIGenerationLog[] }
}

export async function deleteAIGenerationLog(logId: string): Promise<{ success: boolean; error?: string }> {
  const auth = await checkAuth()
  if (!auth.authorized) return { success: false, error: "Not authorized" }

  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from("ai_generation_logs")
    .delete()
    .eq("id", logId)

  if (error) return { success: false, error: error.message }
  return { success: true }
}
