import type { Metadata } from "next"
import AdminDashboardClient from "./AdminDashboardClient"

export const metadata: Metadata = {
  title: "Admin Dashboard - Cookie Analytics",
  description: "View cookie consent analytics and user data",
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminDashboardPage() {
  return <AdminDashboardClient />
}
