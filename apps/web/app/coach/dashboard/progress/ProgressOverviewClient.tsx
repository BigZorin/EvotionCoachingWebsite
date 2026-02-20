"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  getClients,
  getClientDailyCheckIns,
  type ClientWithStats,
  type DailyCheckIn,
} from "@/app/actions/admin-clients"
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Flame,
  Weight,
  Loader2,
} from "lucide-react"

export default function ProgressOverviewClient() {
  const [clients, setClients] = useState<ClientWithStats[]>([])
  const [clientDailyData, setClientDailyData] = useState<Record<string, DailyCheckIn[]>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const result = await getClients()
      if (result.success && result.clients) {
        setClients(result.clients)

        // Load daily check-ins for all clients in parallel
        const dailyResults = await Promise.all(
          result.clients.map(async (client) => {
            const res = await getClientDailyCheckIns(client.id)
            return { clientId: client.id, checkIns: res.success ? res.checkIns || [] : [] }
          })
        )

        const dailyMap: Record<string, DailyCheckIn[]> = {}
        dailyResults.forEach((r) => { dailyMap[r.clientId] = r.checkIns })
        setClientDailyData(dailyMap)
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-foreground text-xl flex items-center gap-3">
          <Loader2 className="size-5 animate-spin" />
          Laden...
        </div>
      </div>
    )
  }

  // Calculate streaks and compliance for each client
  const clientStats = clients.map((client) => {
    const dailyCheckIns = clientDailyData[client.id] || []
    const sorted = [...dailyCheckIns].sort((a, b) => b.check_in_date.localeCompare(a.check_in_date))

    // Calculate streak
    let streak = 0
    for (let i = 0; i < sorted.length; i++) {
      const expectedDate = new Date()
      expectedDate.setDate(expectedDate.getDate() - i)
      const expected = expectedDate.toISOString().split("T")[0]
      if (sorted[i]?.check_in_date === expected) {
        streak++
      } else {
        break
      }
    }

    // Days since last check-in
    const lastCheckIn = sorted[0]
    const daysSinceLast = lastCheckIn
      ? Math.floor((new Date().getTime() - new Date(lastCheckIn.check_in_date).getTime()) / 86400000)
      : null

    // Daily compliance (last 30 days)
    const last30 = dailyCheckIns.filter((ci) => {
      const diff = (new Date().getTime() - new Date(ci.check_in_date).getTime()) / 86400000
      return diff <= 30
    })
    const compliance = Math.round((last30.length / 30) * 100)

    // Weight trend
    const weights = dailyCheckIns
      .filter((ci) => ci.weight)
      .sort((a, b) => a.check_in_date.localeCompare(b.check_in_date))
    const latestWeight = weights.length > 0 ? weights[weights.length - 1].weight : null
    const firstWeight = weights.length >= 2 ? weights[0].weight : null
    const weightDiff = latestWeight && firstWeight ? latestWeight - firstWeight : null

    return {
      client,
      streak,
      daysSinceLast,
      compliance,
      latestWeight,
      weightDiff,
      totalDaily: dailyCheckIns.length,
    }
  })

  // Sort by streak (highest first)
  const sortedByStreak = [...clientStats].sort((a, b) => b.streak - a.streak)

  // Red flags: clients who haven't checked in for 3+ days
  const redFlags = clientStats.filter((s) => s.daysSinceLast === null || s.daysSinceLast >= 3)

  // Overall compliance
  const avgCompliance = clientStats.length > 0
    ? Math.round(clientStats.reduce((sum, s) => sum + s.compliance, 0) / clientStats.length)
    : 0

  const todaySubmitted = clients.filter((c) => c.todayDailyCheckIn).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Voortgang</h1>
        <p className="text-muted-foreground mt-1">Trends, compliance en red flags over alle clients</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{avgCompliance}%</p>
            <p className="text-xs text-muted-foreground mt-1">Gem. compliance (30d)</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{todaySubmitted}/{clients.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Vandaag ingecheckt</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-500">{redFlags.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Red flags (3+ dagen)</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {sortedByStreak.length > 0 ? sortedByStreak[0].streak : 0}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Langste streak</p>
          </CardContent>
        </Card>
      </div>

      {/* Red flags */}
      {redFlags.length > 0 && (
        <Card className="bg-orange-500/5 border-orange-500/20 shadow-sm">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-orange-600 uppercase tracking-wide mb-3 flex items-center gap-2">
              <AlertTriangle className="size-4" />
              Aandacht nodig — {redFlags.length} client{redFlags.length !== 1 ? "s" : ""} niet actief
            </h3>
            <div className="space-y-2">
              {redFlags.map(({ client, daysSinceLast }) => (
                <div key={client.id} className="flex items-center justify-between bg-card rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8 border border-border">
                      <AvatarFallback className="bg-orange-500/10 text-orange-600 font-semibold text-sm">
                        {(client.raw_user_meta_data?.full_name?.[0] || client.email[0]).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {client.raw_user_meta_data?.full_name || client.email}
                      </p>
                      <p className="text-xs text-orange-600">
                        {daysSinceLast === null ? "Nog nooit ingecheckt" : `${daysSinceLast} dagen geleden`}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/coach/dashboard/clients/${client.id}`}
                    className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
                  >
                    Bekijk <ArrowRight className="size-4" />
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Client ranking by consistency */}
      <Card className="shadow-sm">
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Client Ranking — Consistentie
          </h3>
          <div className="space-y-2">
            {sortedByStreak.map(({ client, streak, compliance, latestWeight, weightDiff }, index) => (
              <Link
                key={client.id}
                href={`/coach/dashboard/clients/${client.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground w-5 text-right">{index + 1}</span>
                  <Avatar className="size-9 border border-border">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
                      {(client.raw_user_meta_data?.full_name?.[0] || client.email[0]).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {client.raw_user_meta_data?.full_name || client.email}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Flame className="size-4 text-orange-500" /> {streak}d streak
                      </span>
                      <span className="text-xs text-muted-foreground">{compliance}% compliance</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {latestWeight && (
                    <Badge variant="secondary" className="text-xs">
                      <Weight className="size-4 mr-1" />
                      {latestWeight} kg
                    </Badge>
                  )}
                  {weightDiff !== null && (
                    <Badge
                      variant="outline"
                      className={`text-xs ${weightDiff <= 0 ? "text-green-600 border-green-200" : "text-orange-600 border-orange-500/20"}`}
                    >
                      {weightDiff <= 0 ? <TrendingDown className="size-4 mr-1" /> : <TrendingUp className="size-4 mr-1" />}
                      {weightDiff > 0 ? "+" : ""}{weightDiff.toFixed(1)} kg
                    </Badge>
                  )}
                  <ArrowRight className="size-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
