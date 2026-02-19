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
 * Get all exercises with optional filters
 */
export async function getExercises(filters?: {
  category?: string
  difficulty?: string
  muscleGroups?: string[]
  search?: string
}) {
  try {
    const auth = await checkAuth()
    if (!auth.authorized || !auth.user) {
      return { success: false, error: 'Not authorized' }
    }

    const where: any = {
      OR: [
        { createdBy: auth.user.id }, // Coach's own exercises
        { isPublic: true }, // Public exercises from the platform
      ],
    }

    // Apply filters
    if (filters?.category) {
      where.category = filters.category
    }

    if (filters?.difficulty) {
      where.difficulty = filters.difficulty
    }

    if (filters?.search) {
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { name: { contains: filters.search, mode: 'insensitive' } },
            { description: { contains: filters.search, mode: 'insensitive' } },
          ],
        },
      ]
    }

    const exercises = await prisma.exercise.findMany({
      where,
      include: {
        creator: {
          select: {
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    // Filter by muscle groups if provided (JSONB filtering)
    let filtered = exercises
    if (filters?.muscleGroups && filters.muscleGroups.length > 0) {
      filtered = exercises.filter((ex) => {
        const groups = ex.muscleGroups as string[] | null
        return (
          groups && filters.muscleGroups!.some((g) => groups.includes(g))
        )
      })
    }

    return { success: true, exercises: filtered }
  } catch (error: any) {
    console.error('Error fetching exercises:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get a single exercise by ID
 */
export async function getExercise(exerciseId: string) {
  try {
    const auth = await checkAuth()
    if (!auth.authorized || !auth.user) {
      return { success: false, error: 'Not authorized' }
    }

    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
      include: {
        creator: {
          select: {
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    })

    if (!exercise) {
      return { success: false, error: 'Exercise not found' }
    }

    // Check access: own exercise or public
    if (exercise.createdBy !== auth.user.id && !exercise.isPublic) {
      return { success: false, error: 'Not authorized to view this exercise' }
    }

    return { success: true, exercise }
  } catch (error: any) {
    console.error('Error fetching exercise:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Create a new exercise
 */
export async function createExercise(data: {
  name: string
  description?: string
  category: string
  difficulty?: string
  muscleGroups?: string[]
  equipmentNeeded?: string
  cues?: string
  videoUrl?: string
  thumbnailUrl?: string
  videoStoragePath?: string
  imageStoragePath?: string
  isPublic?: boolean
}) {
  try {
    const auth = await checkAuth()
    if (!auth.authorized || !auth.user) {
      return { success: false, error: 'Not authorized' }
    }

    const exercise = await prisma.exercise.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category as any,
        difficulty: data.difficulty as any,
        muscleGroups: data.muscleGroups || [],
        equipmentNeeded: data.equipmentNeeded,
        cues: data.cues,
        videoUrl: data.videoUrl,
        thumbnailUrl: data.thumbnailUrl,
        videoStoragePath: data.videoStoragePath,
        imageStoragePath: data.imageStoragePath,
        isPublic: data.isPublic || false,
        createdBy: auth.user.id,
      },
      include: {
        creator: {
          select: {
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    })

    return { success: true, exercise }
  } catch (error: any) {
    console.error('Error creating exercise:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Update an existing exercise
 */
export async function updateExercise(
  exerciseId: string,
  data: {
    name?: string
    description?: string
    category?: string
    difficulty?: string
    muscleGroups?: string[]
    equipmentNeeded?: string
    cues?: string
    videoUrl?: string
    thumbnailUrl?: string
    videoStoragePath?: string
    imageStoragePath?: string
    isPublic?: boolean
  }
) {
  try {
    const auth = await checkAuth()
    if (!auth.authorized || !auth.user) {
      return { success: false, error: 'Not authorized' }
    }

    // Check ownership
    const existing = await prisma.exercise.findUnique({
      where: { id: exerciseId },
    })

    if (!existing) {
      return { success: false, error: 'Exercise not found' }
    }

    if (existing.createdBy !== auth.user.id) {
      return { success: false, error: 'Not authorized to edit this exercise' }
    }

    const updated = await prisma.exercise.update({
      where: { id: exerciseId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.category && { category: data.category as any }),
        ...(data.difficulty !== undefined && { difficulty: data.difficulty as any }),
        ...(data.muscleGroups !== undefined && { muscleGroups: data.muscleGroups }),
        ...(data.equipmentNeeded !== undefined && { equipmentNeeded: data.equipmentNeeded }),
        ...(data.cues !== undefined && { cues: data.cues }),
        ...(data.videoUrl !== undefined && { videoUrl: data.videoUrl }),
        ...(data.thumbnailUrl !== undefined && { thumbnailUrl: data.thumbnailUrl }),
        ...(data.videoStoragePath !== undefined && { videoStoragePath: data.videoStoragePath }),
        ...(data.imageStoragePath !== undefined && { imageStoragePath: data.imageStoragePath }),
        ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
      },
      include: {
        creator: {
          select: {
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    })

    return { success: true, exercise: updated }
  } catch (error: any) {
    console.error('Error updating exercise:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Delete an exercise
 */
export async function deleteExercise(exerciseId: string) {
  try {
    const auth = await checkAuth()
    if (!auth.authorized || !auth.user) {
      return { success: false, error: 'Not authorized' }
    }

    // Check ownership and usage
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
      include: {
        workoutTemplateExercises: true,
      },
    })

    if (!exercise) {
      return { success: false, error: 'Exercise not found' }
    }

    if (exercise.createdBy !== auth.user.id) {
      return { success: false, error: 'Not authorized to delete this exercise' }
    }

    if (exercise.workoutTemplateExercises.length > 0) {
      return {
        success: false,
        error: 'Cannot delete exercise that is used in workout templates',
      }
    }

    await prisma.exercise.delete({
      where: { id: exerciseId },
    })

    return { success: true }
  } catch (error: any) {
    console.error('Error deleting exercise:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get exercise categories enum values
 */
export async function getExerciseCategories() {
  try {
    const auth = await checkAuth()
    if (!auth.authorized || !auth.user) {
      return { success: false, error: 'Not authorized' }
    }

    return {
      success: true,
      categories: ['STRENGTH', 'CARDIO', 'FLEXIBILITY', 'MOBILITY', 'CORE'],
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Get difficulty levels enum values
 */
export async function getDifficultyLevels() {
  try {
    const auth = await checkAuth()
    if (!auth.authorized || !auth.user) {
      return { success: false, error: 'Not authorized' }
    }

    return {
      success: true,
      levels: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'],
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Get common muscle groups
 */
export async function getMuscleGroups() {
  try {
    const auth = await checkAuth()
    if (!auth.authorized || !auth.user) {
      return { success: false, error: 'Not authorized' }
    }

    return {
      success: true,
      muscleGroups: [
        'chest',
        'back',
        'shoulders',
        'biceps',
        'triceps',
        'forearms',
        'abs',
        'obliques',
        'lower back',
        'glutes',
        'quads',
        'hamstrings',
        'calves',
        'hip flexors',
        'adductors',
        'abductors',
      ],
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Upload exercise media (video and/or thumbnail)
 */
export async function uploadExerciseMedia(formData: FormData) {
  try {
    const auth = await checkAuth()
    if (!auth.authorized || !auth.user) {
      return { success: false, error: 'Not authorized' }
    }

    const videoFile = formData.get('video') as File | null
    const thumbnailFile = formData.get('thumbnail') as File | null
    const exerciseId = formData.get('exerciseId') as string

    if (!exerciseId) {
      return { success: false, error: 'Exercise ID is required' }
    }

    const result: {
      videoUrl?: string
      videoStoragePath?: string
      thumbnailUrl?: string
      imageStoragePath?: string
    } = {}

    // Upload video if provided
    if (videoFile && videoFile.size > 0) {
      const { uploadExerciseVideo } = await import('@/lib/supabase/storage')
      const videoResult = await uploadExerciseVideo(
        videoFile,
        exerciseId,
        auth.user.id
      )

      if (!videoResult.success) {
        return { success: false, error: videoResult.error }
      }

      result.videoUrl = videoResult.publicUrl
      result.videoStoragePath = videoResult.storagePath
    }

    // Upload thumbnail if provided
    if (thumbnailFile && thumbnailFile.size > 0) {
      const { uploadExerciseThumbnail } = await import('@/lib/supabase/storage')
      const thumbnailResult = await uploadExerciseThumbnail(
        thumbnailFile,
        exerciseId,
        auth.user.id
      )

      if (!thumbnailResult.success) {
        return { success: false, error: thumbnailResult.error }
      }

      result.thumbnailUrl = thumbnailResult.publicUrl
      result.imageStoragePath = thumbnailResult.storagePath
    }

    return { success: true, ...result }
  } catch (error: any) {
    console.error('Error uploading exercise media:', error)
    return { success: false, error: error.message }
  }
}
