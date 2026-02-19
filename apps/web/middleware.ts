import { updateSession } from '@evotion/auth/src/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect /admin/login to /login
  if (pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Handle Supabase Auth session
  const { supabaseResponse, user } = await updateSession(request)

  // Admin routes - require ADMIN role only
  if (pathname.startsWith('/admin')) {
    if (!user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Only ADMIN allowed
    if (user.role !== 'ADMIN') {
      // Redirect COACH to their dashboard, others to client dashboard
      if (user.role === 'COACH') {
        return NextResponse.redirect(new URL('/coach/dashboard', request.url))
      }
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Coach routes - require COACH or ADMIN role
  if (pathname.startsWith('/coach')) {
    if (!user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // COACH and ADMIN allowed (admin is super-user)
    if (user.role !== 'COACH' && user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Protected client routes that require Supabase authentication
  const protectedRoutes = ['/dashboard', '/profile', '/workouts', '/nutrition', '/courses']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // Auth routes (redirect if already logged in)
  const authRoutes = ['/login', '/register']
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // Redirect to login if trying to access protected route without auth
  if (isProtectedRoute && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to appropriate dashboard if trying to access auth routes while logged in
  if (isAuthRoute && user) {
    if (user.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
    if (user.role === 'COACH') {
      return NextResponse.redirect(new URL('/coach/dashboard', request.url))
    }
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
