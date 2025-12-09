import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const sessionCookie = request.cookies.get("admin_session")

    if (!sessionCookie?.value) {
      // Redirect to login if no session cookie
      const loginUrl = new URL("/admin/login", request.url)
      loginUrl.searchParams.set("from", pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Note: Full session validation happens server-side in the page
    // The middleware just checks for the presence of the cookie
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
