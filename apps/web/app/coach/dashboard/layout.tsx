import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import CoachSidebar from "./CoachSidebar"

export const metadata: Metadata = {
  title: "Coach Dashboard - Evotion",
  description: "Beheer je clients en hun trainingen",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function CoachDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
    redirect("/login?redirect=/coach/dashboard")
  }

  const role = user.user_metadata?.role || 'CLIENT'

  // COACH and ADMIN allowed (admin is super-user)
  if (role !== 'COACH' && role !== 'ADMIN') {
    redirect("/dashboard")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <CoachSidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
