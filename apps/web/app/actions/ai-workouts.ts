"use server"

import Anthropic from "@anthropic-ai/sdk"
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { prisma } from "@evotion/database"
import { buildWorkoutPrompt, extractJsonFromResponse } from "@/lib/ai/prompts"
import { loadKnowledgeBase } from "@/knowledge-base"

/**
 * Check if the current user is authenticated as ADMIN or COACH
 */
async function checkAuth() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { authorized: false, user: null }
  }

  const role = user.user_metadata?.role || 'CLIENT'

  if (role !== 'ADMIN' && role !== 'COACH') {
    return { authorized: false, user: null }
  }

  return { authorized: true, user }
}

/**
 * Initialize Anthropic client
 */
function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
    throw new Error(
      'ANTHROPIC_API_KEY is not configured. Please add your API key to .env.local'
    )
  }

  return new Anthropic({ apiKey })
}

type GenerateWorkoutParams = {
  clientId: string
  preferences: {
    goals: string
    experience: string
    equipment: string[]
    sessionsPerWeek: number
    sessionDuration: number
    injuries?: string[]
  }
}

/**
 * Generate a workout program using Claude AI
 */
export async function generateWorkoutWithAI(params: GenerateWorkoutParams) {
  try {
    const auth = await checkAuth()
    if (!auth.authorized || !auth.user) {
      return { success: false, error: 'Not authorized' }
    }

    const { clientId, preferences } = params

    // Fetch client data
    const client = await prisma.user.findUnique({
      where: { id: clientId },
      include: {
        profile: true,
        checkInsAsClient: {
          orderBy: { date: 'desc' },
          take: 3,
        },
      },
    })

    if (!client) {
      return { success: false, error: 'Client not found' }
    }

    // Fetch available exercises
    const exercises = await prisma.exercise.findMany({
      where: {
        OR: [
          { createdBy: auth.user.id }, // Coach's exercises
          { isPublic: true }, // Platform exercises
        ],
      },
      select: {
        id: true,
        name: true,
        category: true,
        muscleGroups: true,
        equipmentNeeded: true,
        difficulty: true,
      },
    })

    if (exercises.length === 0) {
      return {
        success: false,
        error: 'No exercises available. Please add exercises to your library first.',
      }
    }

    // Load knowledge base
    const knowledgeBase = loadKnowledgeBase()

    // Build AI prompt
    const prompt = buildWorkoutPrompt({
      client: {
        firstName: client.profile?.firstName || 'Client',
        activityLevel: client.profile?.activityLevel || 'MODERATELY_ACTIVE',
        currentWeightKg: client.profile?.currentWeightKg,
        goalWeightKg: client.profile?.goalWeightKg,
        recentCheckIns: client.checkInsAsClient.map((c) => ({
          energyRating: c.energyRating,
          sleepHours: c.sleepHours,
          moodRating: c.moodRating,
        })),
      },
      preferences,
      knowledgeBase,
      availableExercises: exercises.map((ex) => ({
        ...ex,
        muscleGroups: (ex.muscleGroups as string[]) || [],
      })),
    })

    // Create generation record
    const generation = await prisma.aIWorkoutGeneration.create({
      data: {
        coachId: auth.user.id,
        clientId,
        status: 'GENERATING',
        clientGoals: preferences.goals,
        experience: preferences.experience,
        availableEquipment: preferences.equipment,
        sessionsPerWeek: preferences.sessionsPerWeek,
        sessionDuration: preferences.sessionDuration,
        promptUsed: prompt,
        modelVersion: process.env.AI_MODEL_VERSION || 'claude-3-5-sonnet-20241022',
      },
    })

    try {
      // Call Anthropic API
      const anthropic = getAnthropicClient()

      const message = await anthropic.messages.create({
        model: process.env.AI_MODEL_VERSION || 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      })

      // Extract response text
      const responseText =
        message.content[0].type === 'text' ? message.content[0].text : ''

      if (!responseText) {
        throw new Error('No response from AI')
      }

      // Extract and parse JSON
      const jsonText = extractJsonFromResponse(responseText)
      const workoutData = JSON.parse(jsonText)

      // Validate response structure
      if (
        !workoutData.programName ||
        !workoutData.sessions ||
        !Array.isArray(workoutData.sessions)
      ) {
        throw new Error('Invalid AI response structure')
      }

      // Create workout template
      const template = await prisma.workoutTemplate.create({
        data: {
          coachId: auth.user.id,
          name: workoutData.programName,
          description: `${workoutData.description}\n\n**Progression:**\n${workoutData.progressionNotes}\n\n**Coaching Notes:**\n${workoutData.coachingNotes}`,
          durationMinutes: preferences.sessionDuration,
          exercises: {
            create: workoutData.sessions.flatMap(
              (session: any, sessionIdx: number) =>
                session.exercises.map((ex: any, exIdx: number) => ({
                  exerciseId: ex.exerciseId,
                  orderIndex: sessionIdx * 100 + exIdx,
                  sets: ex.sets,
                  reps: ex.reps,
                  restSeconds: ex.restSeconds,
                  notes: `${session.name}\n${ex.notes}`,
                }))
            ),
          },
        },
      })

      // Update generation record
      await prisma.aIWorkoutGeneration.update({
        where: { id: generation.id },
        data: {
          status: 'COMPLETED',
          generatedTemplateId: template.id,
          tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
          completedAt: new Date(),
        },
      })

      return {
        success: true,
        templateId: template.id,
        generationId: generation.id,
        tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
      }
    } catch (error: any) {
      console.error('Error generating workout:', error)

      // Update generation record with error
      await prisma.aIWorkoutGeneration.update({
        where: { id: generation.id },
        data: {
          status: 'FAILED',
          errorMessage: error.message,
          completedAt: new Date(),
        },
      })

      return {
        success: false,
        error: error.message || 'Failed to generate workout',
      }
    }
  } catch (error: any) {
    console.error('Error in generateWorkoutWithAI:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get AI generation history for a client
 */
export async function getAIGenerationHistory(clientId: string) {
  try {
    const auth = await checkAuth()
    if (!auth.authorized || !auth.user) {
      return { success: false, error: 'Not authorized' }
    }

    const generations = await prisma.aIWorkoutGeneration.findMany({
      where: {
        clientId,
        coachId: auth.user.id,
      },
      include: {
        generatedTemplate: {
          select: {
            id: true,
            name: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, generations }
  } catch (error: any) {
    console.error('Error fetching AI generation history:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get a single AI generation by ID
 */
export async function getAIGeneration(generationId: string) {
  try {
    const auth = await checkAuth()
    if (!auth.authorized || !auth.user) {
      return { success: false, error: 'Not authorized' }
    }

    const generation = await prisma.aIWorkoutGeneration.findUnique({
      where: {
        id: generationId,
        coachId: auth.user.id,
      },
      include: {
        client: {
          select: {
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        generatedTemplate: {
          include: {
            exercises: {
              include: {
                exercise: true,
              },
              orderBy: {
                orderIndex: 'asc',
              },
            },
          },
        },
      },
    })

    if (!generation) {
      return { success: false, error: 'Generation not found' }
    }

    return { success: true, generation }
  } catch (error: any) {
    console.error('Error fetching AI generation:', error)
    return { success: false, error: error.message }
  }
}
