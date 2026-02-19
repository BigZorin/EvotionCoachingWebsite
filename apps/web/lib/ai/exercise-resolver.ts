/**
 * Exercise library fetching + AI output validation.
 * Ensures AI-generated programs only reference real exercise IDs.
 */
import { SupabaseClient } from "@supabase/supabase-js"

export interface ExerciseForAI {
  id: string
  name: string
  category: string
  muscleGroups: string[]
  equipmentNeeded: string | null
  difficulty: string | null
}

/**
 * Fetch the coach's available exercises (own + public).
 */
export async function getCoachExerciseLibrary(
  supabase: SupabaseClient,
  coachId: string
): Promise<ExerciseForAI[]> {
  const { data, error } = await supabase
    .from("exercises")
    .select("id, name, category, muscle_groups, equipment_needed, difficulty")
    .or(`created_by.eq.${coachId},is_public.eq.true`)
    .order("name")

  if (error || !data) return []

  return data.map((e: any) => ({
    id: e.id,
    name: e.name,
    category: e.category || "STRENGTH",
    muscleGroups: e.muscle_groups || [],
    equipmentNeeded: e.equipment_needed || null,
    difficulty: e.difficulty || null,
  }))
}

/**
 * Format exercise library into a compact string for the AI prompt.
 * Uses pipe-delimited format to minimize tokens.
 */
export function formatExerciseLibraryForPrompt(exercises: ExerciseForAI[]): string {
  if (exercises.length === 0) return "Geen oefeningen beschikbaar."

  const header = "ID | Naam | Categorie | Spiergroepen | Uitrusting | Niveau"
  const rows = exercises.map(e =>
    `${e.id} | ${e.name} | ${e.category} | ${e.muscleGroups.join(",")} | ${e.equipmentNeeded || "geen"} | ${e.difficulty || "?"}`
  )

  return `${header}\n${rows.join("\n")}`
}

/**
 * Validate and resolve exercise IDs in an AI-generated program.
 * Returns the program with corrected IDs and a list of warnings.
 */
export function resolveExerciseIds(
  blocks: Array<{
    days: Array<{
      exercises: Array<{ exerciseId: string; exerciseName?: string; [key: string]: any }>
    }>
    [key: string]: any
  }>,
  library: ExerciseForAI[]
): { warnings: string[] } {
  const idSet = new Set(library.map(e => e.id))
  const nameMap = new Map(library.map(e => [e.name.toLowerCase(), e.id]))
  const warnings: string[] = []

  for (const block of blocks) {
    for (const day of block.days) {
      const validExercises: typeof day.exercises = []

      for (const ex of day.exercises) {
        // ID is valid
        if (idSet.has(ex.exerciseId)) {
          // Enrich with name if missing
          if (!ex.exerciseName) {
            const found = library.find(e => e.id === ex.exerciseId)
            if (found) ex.exerciseName = found.name
          }
          validExercises.push(ex)
          continue
        }

        // Try fuzzy match by name
        const nameToMatch = (ex.exerciseName || ex.exerciseId || "").toLowerCase()
        const matchedId = nameMap.get(nameToMatch)

        if (matchedId) {
          ex.exerciseId = matchedId
          const found = library.find(e => e.id === matchedId)
          if (found) ex.exerciseName = found.name
          warnings.push(`Oefening "${nameToMatch}" had ongeldig ID, gecorrigeerd via naam-match.`)
          validExercises.push(ex)
          continue
        }

        // Try partial name match
        const partial = library.find(e =>
          e.name.toLowerCase().includes(nameToMatch) ||
          nameToMatch.includes(e.name.toLowerCase())
        )
        if (partial) {
          ex.exerciseId = partial.id
          ex.exerciseName = partial.name
          warnings.push(`Oefening "${nameToMatch}" had ongeldig ID, gecorrigeerd via deelmatch: "${partial.name}".`)
          validExercises.push(ex)
          continue
        }

        // No match — skip exercise
        warnings.push(`Oefening "${nameToMatch}" niet gevonden in bibliotheek — verwijderd uit programma.`)
      }

      day.exercises = validExercises
    }
  }

  return { warnings }
}
