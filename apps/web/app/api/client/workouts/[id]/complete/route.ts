import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { prisma } from '@evotion/database'

/**
 * POST /api/client/workouts/[id]/complete
 * Mark workout as completed and optionally log exercise data
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get Authorization header for mobile app support
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')

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

    // Get user - either from Bearer token (mobile) or cookies (web)
    const { data: { user } } = token
      ? await supabase.auth.getUser(token)
      : await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { exerciseLogs } = body

    // Verify workout exists and belongs to user, include exercises
    const workout = await prisma.clientWorkout.findUnique({
      where: {
        id,
        clientId: user.id,
      },
      include: {
        workoutTemplate: {
          include: {
            exercises: true,
          },
        },
      },
    })

    if (!workout) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 })
    }

    // Mark workout as completed
    const updatedWorkout = await prisma.clientWorkout.update({
      where: { id },
      data: {
        completed: true,
        completedAt: new Date(),
      },
    })

    // Create individual workout logs if exercise data is provided
    if (exerciseLogs && Array.isArray(exerciseLogs) && exerciseLogs.length > 0) {
      await prisma.workoutLog.createMany({
        data: exerciseLogs.map((log: any) => ({
          clientWorkoutId: id,
          userId: user.id,
          exerciseId: log.exerciseId,
          setNumber: log.setNumber,
          repsCompleted: log.repsCompleted,
          weightKg: log.weightKg || null,
          notes: log.notes || null,
        })),
      })
    }

    return NextResponse.json({
      success: true,
      workout: updatedWorkout,
    })
  } catch (error: any) {
    console.error('Error completing workout:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
