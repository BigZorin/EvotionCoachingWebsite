"use server"

import Anthropic from "@anthropic-ai/sdk"
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

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey || apiKey === "your_anthropic_api_key_here") {
    throw new Error("ANTHROPIC_API_KEY is not configured")
  }
  return new Anthropic({ apiKey })
}

const INTAKE_ANALYSIS_PROMPT = `Je bent een ervaren fitness- en voedingscoach-assistent. Je analyseert intake formulieren van nieuwe clients en genereert een gestructureerd rapport voor de coach.

Analyseer de intake data grondig en genereer een rapport met EXACT deze secties:

## Clientprofiel
Korte samenvatting (3-4 zinnen) van wie deze client is: doelen, ervaringsniveau, leefstijl, beschikbaarheid.

## Rode Vlaggen
Identificeer mogelijke risico's op basis van blessures, medische aandoeningen, medicijnen, stressniveau, slaaptekort of andere zorgpunten. Als er geen rode vlaggen zijn, vermeld dit expliciet.

## Trainingsadvies
Concrete aanbevelingen:
- Aanbevolen trainingsfrequentie en split
- Focus-gebieden op basis van doelen
- Intensiteitsrichting (hypertrofie, kracht, conditie)
- Periodiseringsvoorstel (eerste 4-8 weken)
- Aanpassingen op basis van ervaring en beperkingen

## Voedingsadvies
Concrete richtlijnen:
- Geschatte calorische richting (surplus/deficit/onderhoud) op basis van doel
- Macro-verdeling advies (eiwit/koolhydraten/vetten)
- Aandachtspunten bij restricties of allergieën
- Timing-suggesties op basis van trainingsmoment

## Aandachtspunten
Wat de coach extra moet uitvragen, monitoren of bespreken:
- Ontbrekende informatie die belangrijk is
- Verwachtingsmanagement
- Potentiële compliance-risico's
- Suggesties voor het eerste coachgesprek

Wees concreet, praktisch en direct toepasbaar. Geen vage algemeenheden. De coach moet dit rapport kunnen gebruiken als basis voor het eerste programma.`

export interface IntakeAnalysis {
  analysis: string
  tokensUsed: number
  model: string
}

export async function analyzeClientIntake(clientId: string): Promise<{
  success: boolean
  data?: IntakeAnalysis
  error?: string
}> {
  try {
    const auth = await checkAuth()
    if (!auth.authorized) return { success: false, error: "Niet geautoriseerd" }

    const supabase = getSupabaseAdmin()

    // Fetch intake form
    const { data: intake, error: intakeErr } = await supabase
      .from("intake_forms")
      .select("*")
      .eq("user_id", clientId)
      .maybeSingle()

    if (intakeErr) return { success: false, error: intakeErr.message }
    if (!intake) return { success: false, error: "Geen intake formulier gevonden" }
    if (!intake.completed_at) return { success: false, error: "Intake formulier is nog niet voltooid" }

    // Fetch client profile for extra context
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, last_name, date_of_birth")
      .eq("id", clientId)
      .maybeSingle()

    // Build structured intake text for the LLM
    const stressLabels: Record<number, string> = {
      1: "Zeer laag", 2: "Laag", 3: "Gemiddeld", 4: "Hoog", 5: "Zeer hoog",
    }

    const sections: string[] = []

    if (profile?.first_name) {
      sections.push(`Naam: ${profile.first_name} ${profile.last_name || ""}`.trim())
    }
    if (profile?.date_of_birth) {
      const age = Math.floor((Date.now() - new Date(profile.date_of_birth).getTime()) / 31557600000)
      sections.push(`Leeftijd: ${age} jaar`)
    }
    if (intake.goals) sections.push(`Doelen: ${intake.goals}`)
    if (intake.fitness_experience) sections.push(`Fitnesservaring: ${intake.fitness_experience}`)
    if (intake.training_history) sections.push(`Trainingsgeschiedenis: ${intake.training_history}`)
    if (intake.injuries) sections.push(`Blessures: ${intake.injuries}`)
    if (intake.medical_conditions) sections.push(`Medische aandoeningen: ${intake.medical_conditions}`)
    if (intake.medications) sections.push(`Medicijnen: ${intake.medications}`)
    if (intake.dietary_restrictions) sections.push(`Voedingsrestricties: ${intake.dietary_restrictions}`)
    if (intake.allergies) sections.push(`Allergieën: ${intake.allergies}`)
    if (intake.sleep_hours != null) sections.push(`Slaap: ${intake.sleep_hours} uur per nacht`)
    if (intake.stress_level != null) sections.push(`Stressniveau: ${stressLabels[intake.stress_level] || intake.stress_level} (${intake.stress_level}/5)`)
    if (intake.occupation) sections.push(`Beroep: ${intake.occupation}`)
    if (intake.available_days?.length) sections.push(`Beschikbare trainingsdagen: ${intake.available_days.join(", ")}`)
    if (intake.preferred_training_time) sections.push(`Voorkeurstijd training: ${intake.preferred_training_time}`)
    if (intake.equipment_access) sections.push(`Beschikbare uitrusting: ${intake.equipment_access}`)
    if (intake.additional_notes) sections.push(`Overige opmerkingen: ${intake.additional_notes}`)

    const intakeText = sections.join("\n")

    // Call Claude
    const anthropic = getAnthropicClient()
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      temperature: 0.3,
      system: INTAKE_ANALYSIS_PROMPT,
      messages: [
        {
          role: "user",
          content: `Analyseer het volgende intake formulier:\n\n${intakeText}`,
        },
      ],
    })

    const responseText = message.content[0].type === "text" ? message.content[0].text : ""
    if (!responseText) return { success: false, error: "Geen antwoord van AI" }

    return {
      success: true,
      data: {
        analysis: responseText,
        tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
        model: "claude-sonnet-4-20250514",
      },
    }
  } catch (error: any) {
    console.error("AI intake analysis failed:", error)
    return { success: false, error: error.message || "AI analyse mislukt" }
  }
}
