"use server"

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { prisma } from '@evotion/database'

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
 * Get all workout templates for the current coach
 */
export async function getWorkoutTemplates() {
  try {
    const auth = await checkAuth()
    if (!auth.authorized || !auth.user) {
      return { success: false, error: 'Not authorized' }
    }

    const templates = await prisma.workoutTemplate.findMany({
      where: {
        coachId: auth.user.id,
      },
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
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { success: true, templates }
  } catch (error: any) {
    console.error('Error fetching workout templates:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get a single workout template by ID
 */
export async function getWorkoutTemplate(templateId: string) {
  try {
    const auth = await checkAuth()
    if (!auth.authorized || !auth.user) {
      return { success: false, error: 'Not authorized' }
    }

    const template = await prisma.workoutTemplate.findUnique({
      where: {
        id: templateId,
        coachId: auth.user.id,
      },
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
    })

    if (!template) {
      return { success: false, error: 'Template not found' }
    }

    return { success: true, template }
  } catch (error: any) {
    console.error('Error fetching workout template:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Create a new workout template
 */
export async function createWorkoutTemplate(data: {
  name: string
  description?: string
  durationMinutes?: number
  exercises: Array<{
    exerciseId: string
    sets?: number
    reps?: string | number
    restSeconds?: number
    notes?: string
    intensityType?: string
    prescribedWeightKg?: number
    prescribedRpe?: number
    prescribedRir?: number
    prescribedPercentage?: number
    tempo?: string
    section?: string
  }>
}) {
  try {
    const auth = await checkAuth()
    if (!auth.authorized || !auth.user) {
      return { success: false, error: 'Not authorized' }
    }

    const template = await prisma.workoutTemplate.create({
      data: {
        coachId: auth.user.id,
        name: data.name,
        description: data.description || null,
        durationMinutes: data.durationMinutes || null,
        exercises: {
          create: data.exercises.map((exercise, index) => ({
            exerciseId: exercise.exerciseId,
            orderIndex: index,
            sets: exercise.sets || null,
            reps: exercise.reps ? String(exercise.reps) : null,
            restSeconds: exercise.restSeconds || null,
            notes: exercise.notes || null,
            intensityType: exercise.intensityType || 'weight',
            prescribedWeightKg: exercise.prescribedWeightKg || null,
            prescribedRpe: exercise.prescribedRpe || null,
            prescribedRir: exercise.prescribedRir || null,
            prescribedPercentage: exercise.prescribedPercentage || null,
            tempo: exercise.tempo || null,
            section: exercise.section || 'workout',
          })),
        },
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
    })

    return { success: true, template }
  } catch (error: any) {
    console.error('Error creating workout template:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Update a workout template
 */
export async function updateWorkoutTemplate(
  templateId: string,
  data: {
    name?: string
    description?: string
    durationMinutes?: number
    exercises?: Array<{
      exerciseId: string
      sets?: number
      reps?: string | number
      restSeconds?: number
      notes?: string
      intensityType?: string
      prescribedWeightKg?: number
      prescribedRpe?: number
      prescribedRir?: number
      prescribedPercentage?: number
      tempo?: string
      section?: string
    }>
  }
) {
  try {
    const auth = await checkAuth()
    if (!auth.authorized || !auth.user) {
      return { success: false, error: 'Not authorized' }
    }

    // Verify ownership
    const existing = await prisma.workoutTemplate.findUnique({
      where: { id: templateId },
    })

    if (!existing || existing.coachId !== auth.user.id) {
      return { success: false, error: 'Template not found or not authorized' }
    }

    // If exercises are being updated, delete old ones and create new ones
    if (data.exercises) {
      await prisma.workoutTemplateExercise.deleteMany({
        where: { workoutTemplateId: templateId },
      })
    }

    const template = await prisma.workoutTemplate.update({
      where: { id: templateId },
      data: {
        name: data.name,
        description: data.description,
        durationMinutes: data.durationMinutes,
        ...(data.exercises && {
          exercises: {
            create: data.exercises.map((exercise, index) => ({
              exerciseId: exercise.exerciseId,
              orderIndex: index,
              sets: exercise.sets || null,
              reps: exercise.reps ? String(exercise.reps) : null,
              restSeconds: exercise.restSeconds || null,
              notes: exercise.notes || null,
              intensityType: exercise.intensityType || 'weight',
              prescribedWeightKg: exercise.prescribedWeightKg || null,
              prescribedRpe: exercise.prescribedRpe || null,
              prescribedRir: exercise.prescribedRir || null,
              prescribedPercentage: exercise.prescribedPercentage || null,
              tempo: exercise.tempo || null,
              section: exercise.section || 'workout',
            })),
          },
        }),
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
    })

    return { success: true, template }
  } catch (error: any) {
    console.error('Error updating workout template:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Delete a workout template
 */
export async function deleteWorkoutTemplate(templateId: string) {
  try {
    const auth = await checkAuth()
    if (!auth.authorized || !auth.user) {
      return { success: false, error: 'Not authorized' }
    }

    // Verify ownership
    const existing = await prisma.workoutTemplate.findUnique({
      where: { id: templateId },
    })

    if (!existing || existing.coachId !== auth.user.id) {
      return { success: false, error: 'Template not found or not authorized' }
    }

    await prisma.workoutTemplate.delete({
      where: { id: templateId },
    })

    return { success: true }
  } catch (error: any) {
    console.error('Error deleting workout template:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Assign a workout to a client
 */
export async function assignWorkoutToClient(data: {
  clientId: string
  workoutTemplateId: string
  scheduledDate?: Date
  notes?: string
}) {
  try {
    const auth = await checkAuth()
    if (!auth.authorized || !auth.user) {
      return { success: false, error: 'Not authorized' }
    }

    // Verify template ownership
    const template = await prisma.workoutTemplate.findUnique({
      where: { id: data.workoutTemplateId },
    })

    if (!template || template.coachId !== auth.user.id) {
      return { success: false, error: 'Template not found or not authorized' }
    }

    // Create the assignment
    const assignment = await prisma.clientWorkout.create({
      data: {
        clientId: data.clientId,
        coachId: auth.user.id,
        workoutTemplateId: data.workoutTemplateId,
        scheduledDate: data.scheduledDate,
        notes: data.notes,
        completed: false,
      },
      include: {
        workoutTemplate: {
          include: {
            exercises: {
              include: {
                exercise: true,
              },
            },
          },
        },
        client: {
          include: {
            profile: true,
          },
        },
      },
    })

    // Create notification for client
    await prisma.notification.create({
      data: {
        userId: data.clientId,
        type: 'WORKOUT_ASSIGNED',
        title: 'Nieuwe Workout Toegewezen',
        message: `${template.name}${data.scheduledDate ? ` - ${new Date(data.scheduledDate).toLocaleDateString('nl-NL')}` : ''}`,
        linkUrl: `/workouts/${assignment.id}`,
      },
    })

    return { success: true, assignment }
  } catch (error: any) {
    console.error('Error assigning workout to client:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get all assigned workouts for the current coach
 */
export async function getAssignedWorkouts() {
  try {
    const auth = await checkAuth()
    if (!auth.authorized || !auth.user) {
      return { success: false, error: 'Not authorized' }
    }

    const assignments = await prisma.clientWorkout.findMany({
      where: {
        coachId: auth.user.id,
      },
      include: {
        client: {
          include: {
            profile: true,
          },
        },
        workoutTemplate: true,
      },
      orderBy: {
        scheduledDate: 'desc',
      },
    })

    return { success: true, assignments }
  } catch (error: any) {
    console.error('Error fetching assigned workouts:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get assigned workouts for a specific client
 */
export async function getClientWorkouts(clientId: string) {
  try {
    const auth = await checkAuth()
    if (!auth.authorized || !auth.user) {
      return { success: false, error: 'Not authorized' }
    }

    const assignments = await prisma.clientWorkout.findMany({
      where: {
        clientId,
        coachId: auth.user.id,
      },
      include: {
        workoutTemplate: {
          include: {
            exercises: {
              include: {
                exercise: true,
              },
            },
          },
        },
      },
      orderBy: {
        scheduledDate: 'desc',
      },
    })

    return { success: true, assignments }
  } catch (error: any) {
    console.error('Error fetching client workouts:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get workout logs for the current coach
 */
export async function getWorkoutLogs() {
  try {
    const auth = await checkAuth()
    if (!auth.authorized || !auth.user) {
      return { success: false, error: 'Not authorized' }
    }

    const logs = await prisma.workoutLog.findMany({
      where: {
        clientWorkout: {
          coachId: auth.user.id,
        },
      },
      include: {
        clientWorkout: {
          include: {
            client: {
              include: {
                profile: true,
              },
            },
            workoutTemplate: true,
          },
        },
      },
      orderBy: {
        loggedAt: 'desc',
      },
    })

    return { success: true, logs }
  } catch (error: any) {
    console.error('Error fetching workout logs:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get all exercises from the library
 */
export async function getExercises() {
  try {
    const auth = await checkAuth()
    if (!auth.authorized) {
      return { success: false, error: 'Not authorized' }
    }

    const exercises = await prisma.exercise.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    return { success: true, exercises }
  } catch (error: any) {
    console.error('Error fetching exercises:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get exercises by category
 */
export async function getExercisesByCategory(category: string) {
  try {
    const auth = await checkAuth()
    if (!auth.authorized) {
      return { success: false, error: 'Not authorized' }
    }

    const exercises = await prisma.exercise.findMany({
      where: {
        category,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return { success: true, exercises }
  } catch (error: any) {
    console.error('Error fetching exercises by category:', error)
    return { success: false, error: error.message }
  }
}
