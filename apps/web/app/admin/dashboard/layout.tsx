import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import AdminSidebar from "./AdminSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"

export const metadata: Metadata = {
  title: "Admin Dashboard - Evotion",
  description: "Beheer clients, gebruikers en analytics",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminDashboardLayout({
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
    redirect("/login?redirect=/admin/dashboard")
  }

  const role = user.user_metadata?.role || 'CLIENT'

  if (role !== 'ADMIN') {
    if (role === 'COACH') {
      redirect("/coach/dashboard")
    } else {
      redirect("/dashboard")
    }
  }

  // Read sidebar cookie for persisted state
  const sidebarState = cookieStore.get("sidebar_state")
  const defaultOpen = sidebarState?.value !== "false"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AdminSidebar />
      <SidebarInset>
        <DashboardHeader />
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
