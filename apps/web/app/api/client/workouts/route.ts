import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { prisma } from '@evotion/database'

/**
 * GET /api/client/workouts
 * Fetch all assigned workouts for the authenticated client
 */
export async function GET(request: Request) {
  try {
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

    // Get query params for filtering
    const { searchParams } = new URL(request.url)
    const completed = searchParams.get('completed')
    const limit = searchParams.get('limit')

    // Build where clause
    const where: any = {
      clientId: user.id,
    }

    if (completed !== null) {
      where.completed = completed === 'true'
    }

    // Fetch assigned workouts
    const workouts = await prisma.clientWorkout.findMany({
      where,
      include: {
        workoutTemplate: {
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
        coach: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        scheduledDate: 'desc',
      },
      take: limit ? parseInt(limit) : undefined,
    })

    return NextResponse.json({
      success: true,
      workouts,
    })
  } catch (error: any) {
    console.error('Error fetching client workouts:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
