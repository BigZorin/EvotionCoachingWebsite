type ClientContext = {
  firstName: string
  activityLevel: string
  currentWeightKg?: number | null
  goalWeightKg?: number | null
  recentCheckIns: Array<{
    energyRating?: number | null
    sleepHours?: number | null
    moodRating?: number | null
  }>
}

type PreferencesContext = {
  goals: string
  experience: string
  equipment: string[]
  sessionsPerWeek: number
  sessionDuration: number
  injuries?: string[]
}

type ExerciseContext = {
  id: string
  name: string
  category: string
  muscleGroups: string[]
  equipmentNeeded?: string | null
  difficulty?: string | null
}

/**
 * Build a comprehensive prompt for AI workout generation
 * Includes knowledge base, client context, and available exercises
 */
export function buildWorkoutPrompt(context: {
  client: ClientContext
  preferences: PreferencesContext
  knowledgeBase: string
  availableExercises: ExerciseContext[]
}): string {
  const { client, preferences, knowledgeBase, availableExercises } = context

  // Format recent check-ins
  const checkInsText =
    client.recentCheckIns.length > 0
      ? client.recentCheckIns
          .map(
            (c, i) => `
Check-in ${i + 1}:
  Energy: ${c.energyRating || 'N/A'}/10
  Sleep: ${c.sleepHours || 'N/A'}h
  Mood: ${c.moodRating || 'N/A'}/10`
          )
          .join('\n')
      : 'No recent check-ins available'

  // Format injuries
  const injuriesText =
    preferences.injuries && preferences.injuries.length > 0
      ? `\n- Injuries/Limitations: ${preferences.injuries.join(', ')}`
      : ''

  // Format available exercises
  const exercisesText = availableExercises
    .map(
      (ex) =>
        `- ${ex.name} (${ex.category}, targets: ${ex.muscleGroups.join(', ')}, equipment: ${ex.equipmentNeeded || 'bodyweight'}, difficulty: ${ex.difficulty || 'N/A'})`
    )
    .join('\n')

  return `You are an expert strength and conditioning coach trained in evidence-based programming principles. Your task is to design a comprehensive training program based on scientific research and best practices.

KNOWLEDGE BASE (Evidence-Based Principles):
${knowledgeBase}

CLIENT PROFILE:
- Name: ${client.firstName}
- Experience Level: ${preferences.experience}
- Activity Level: ${client.activityLevel}
- Current Weight: ${client.currentWeightKg ? `${client.currentWeightKg} kg` : 'Not provided'}
- Goal Weight: ${client.goalWeightKg ? `${client.goalWeightKg} kg` : 'Not provided'}
- Goals: ${preferences.goals}
- Available Equipment: ${preferences.equipment.join(', ')}
- Sessions per Week: ${preferences.sessionsPerWeek}
- Session Duration: ${preferences.sessionDuration} minutes${injuriesText}

RECENT CHECK-INS (Last 3):
${checkInsText}

AVAILABLE EXERCISES:
${exercisesText}

TASK:
Design a ${preferences.sessionsPerWeek}-day training program that:
1. Follows evidence-based programming principles from the knowledge base
2. Matches the client's experience level and goals
3. Fits within their available equipment and time constraints
4. Accounts for their current recovery status (based on check-ins)
5. Respects any injury limitations
6. Uses ONLY exercises from the available exercises list above

IMPORTANT GUIDELINES:
- Select exercises appropriate for the client's experience level
- Balance pushing, pulling, squatting, hinging, and core movements
- Consider the client's energy and recovery levels from recent check-ins
- Progressive overload should be built into the program structure
- Include proper warm-up considerations in the notes
- Provide specific set/rep schemes based on the training goal
- Include rest periods appropriate for the goal (strength: 3-5min, hypertrophy: 60-90sec, endurance: 30-60sec)

OUTPUT FORMAT (JSON only, no markdown):
{
  "programName": "Descriptive program name (e.g., '4-Day Hypertrophy Split')",
  "description": "Brief overview explaining the program structure, training split, and rationale based on client goals and evidence-based principles (2-3 sentences)",
  "sessions": [
    {
      "name": "Session 1: [Focus Area]",
      "exercises": [
        {
          "exerciseId": "uuid-from-available-exercises",
          "sets": 3,
          "reps": "8-12",
          "restSeconds": 90,
          "notes": "Coaching cues and technique reminders"
        }
      ]
    }
  ],
  "progressionNotes": "How the client should progress this program over the next 4-6 weeks (increase weight, reps, sets, etc.)",
  "coachingNotes": "Important points for the coach about monitoring progress, potential adjustments, and key considerations for this specific client"
}

CRITICAL:
- Return ONLY valid JSON, no markdown code blocks, no explanations
- Use ONLY exercise IDs from the available exercises list
- Ensure proper exercise distribution across sessions
- Match exercise difficulty to client experience level
- Provide specific, actionable coaching notes

Generate the program now:`
}

/**
 * Build a simpler prompt for testing or minimal contexts
 */
export function buildSimpleWorkoutPrompt(
  goals: string,
  experience: string,
  sessionsPerWeek: number
): string {
  return `Design a ${sessionsPerWeek}-day training program for someone with ${experience} experience level.
Goals: ${goals}

Return a JSON object with programName, description, and sessions array.`
}

/**
 * Extract JSON from AI response that might contain markdown code blocks
 */
export function extractJsonFromResponse(response: string): string {
  // Remove markdown code blocks if present
  const jsonMatch = response.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
  if (jsonMatch) {
    return jsonMatch[1]
  }

  // Try to find JSON object directly
  const directJsonMatch = response.match(/\{[\s\S]*\}/)
  if (directJsonMatch) {
    return directJsonMatch[0]
  }

  return response
}
