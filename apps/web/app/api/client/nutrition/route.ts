import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { prisma } from '@evotion/database'

/**
 * GET /api/client/nutrition
 * Fetch assigned meal plan for the authenticated client
 */
export async function GET(request: Request) {
  try {
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch client's assigned meal plan
    const client = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        mealPlan: {
          include: {
            meals: {
              include: {
                meal: true,
              },
              orderBy: {
                dayOfWeek: 'asc',
              },
            },
            coach: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    })

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      mealPlan: client.mealPlan,
    })
  } catch (error: any) {
    console.error('Error fetching client meal plan:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
