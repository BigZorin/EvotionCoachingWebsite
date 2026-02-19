import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import CheckInsOverviewClient from "./CheckInsOverviewClient"

export const metadata: Metadata = {
  title: "Check-ins - Coach Dashboard",
  description: "Bekijk dagelijkse en wekelijkse check-ins van je clients",
  robots: { index: false, follow: false },
}

export default async function CheckInsPage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {}
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirect=/coach/dashboard/check-ins")
  }

  const role = user.user_metadata?.role || 'CLIENT'
  if (role !== 'COACH' && role !== 'ADMIN') {
    redirect("/dashboard")
  }

  return <CheckInsOverviewClient />
}
