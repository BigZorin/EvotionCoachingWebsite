import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import GroupsClient from "./GroupsClient"

export const metadata: Metadata = {
  title: "Groepen - Coach Dashboard",
  description: "Beheer groepsgesprekken met je clients",
  robots: { index: false, follow: false },
}

export default async function GroupsPage() {
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
  if (!user) redirect("/login?redirect=/coach/dashboard/messages/groups")

  const role = user.user_metadata?.role || "CLIENT"
  if (role !== "COACH" && role !== "ADMIN") redirect("/dashboard")

  return <GroupsClient coachId={user.id} />
}
