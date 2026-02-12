import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { checkAdminSession } from "@/app/actions/admin-auth"
import AdminDashboardClient from "./AdminDashboardClient"

export const metadata: Metadata = {
  title: "Admin Dashboard - Cookie Analytics",
  description: "View cookie consent analytics and user data",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminDashboardPage() {
  const isAuthenticated = await checkAdminSession()

  if (!isAuthenticated) {
    redirect("/admin/login")
  }

  return <AdminDashboardClient />
}
