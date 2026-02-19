"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { getCoachClientsOverview, type EnrichedClient } from "@/app/actions/admin-clients"
import {
  Users,
  UserCheck,
  Activity,
  AlertCircle,
  TrendingUp,
  CalendarCheck,
  ClipboardList,
  Flame,
  AlertTriangle,
  MessageSquare,
} from "lucide-react"

export default function CoachDashboardClient() {
  const [clients, setClients] = useState<EnrichedClient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await getCoachClientsOverview()
      if (result?.success && result.clients) {
        setClients(result.clients)
      } else if (result?.error) {
        setError(result.error)
      }
    } catch (error: any) {
      console.error("Error loading clients:", error)
      setError(error.message || "Er is een fout opgetreden")
    } finally {
      setIsLoading(false)
    }
  }

  // Stats from enriched data
  const activeClients = clients.filter(c => c.activity_status === "active").length
  const needAttention = clients.filter(c => c.needs_attention).length
  const pendingFeedback = clients.filter(c => c.has_pending_feedback).length
  const pendingApproval = clients.filter(c => c.client_status === "pending").length
  const avgCompliance = clients.length > 0
    ? Math.round(clients.reduce((s, c) => s + c.compliance_30d, 0) / clients.length)
    : 0

  const newClientsLast7Days = clients.filter((c) => {
    const createdDate = new Date(c.created_at)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    return createdDate >= sevenDaysAgo
  }).length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welkom terug! Hier is een overzicht van je clients.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-900 text-xl flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1e1839]"></div>
            Laden...
          </div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Er is een fout opgetreden</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      ) : (
        <>
          {/* Primary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">TOTAAL CLIENTS</p>
                    <p className="text-4xl font-bold text-gray-900">{clients.length}</p>
                    {pendingApproval > 0 && (
                      <p className="text-xs text-purple-600 mt-1">{pendingApproval} in wachtrij</p>
                    )}
                  </div>
                  <div className="p-3 bg-[#1e1839] rounded-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">ACTIEF</p>
                    <p className="text-4xl font-bold text-green-600">{activeClients}</p>
                    <p className="text-xs text-gray-500 mt-1">van {clients.length} clients</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">AANDACHT NODIG</p>
                    <p className={`text-4xl font-bold ${needAttention > 0 ? "text-amber-600" : "text-gray-900"}`}>{needAttention}</p>
                    {pendingFeedback > 0 && (
                      <p className="text-xs text-blue-600 mt-1">{pendingFeedback} feedback open</p>
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${needAttention > 0 ? "bg-amber-100" : "bg-gray-100"}`}>
                    <AlertTriangle className={`h-6 w-6 ${needAttention > 0 ? "text-amber-600" : "text-gray-400"}`} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">GEM. COMPLIANCE</p>
                    <p className={`text-4xl font-bold ${avgCompliance >= 75 ? "text-green-600" : avgCompliance >= 50 ? "text-amber-600" : "text-red-500"}`}>{avgCompliance}%</p>
                    <p className="text-xs text-gray-500 mt-1">laatste 4 weken</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Links */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Snelle Acties</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/coach/dashboard/clients"
                  className="p-6 bg-gradient-to-br from-[#1e1839] to-[#2a2054] hover:from-[#2a2054] hover:to-[#1e1839] rounded-xl text-left transition-all shadow-sm hover:shadow-md block"
                >
                  <Users className="h-8 w-8 text-white mb-3" />
                  <h3 className="text-white font-semibold mb-1">Bekijk Clients</h3>
                  <p className="text-sm text-white/70">Beheer je client overzicht</p>
                </Link>

                <Link
                  href="/coach/dashboard/check-ins"
                  className="p-6 bg-white hover:bg-gray-50 rounded-xl text-left transition-all shadow-sm hover:shadow-md border border-gray-200 block"
                >
                  <Activity className="h-8 w-8 text-[#1e1839] mb-3" />
                  <h3 className="text-gray-900 font-semibold mb-1">Check-ins Bekijken</h3>
                  <p className="text-sm text-gray-600">Dagelijkse en wekelijkse updates</p>
                </Link>

                <Link
                  href="/coach/dashboard/progress"
                  className="p-6 bg-white hover:bg-gray-50 rounded-xl text-left transition-all shadow-sm hover:shadow-md border border-gray-200 block"
                >
                  <TrendingUp className="h-8 w-8 text-[#1e1839] mb-3" />
                  <h3 className="text-gray-900 font-semibold mb-1">Voortgang</h3>
                  <p className="text-sm text-gray-600">Trends, compliance en red flags</p>
                </Link>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
