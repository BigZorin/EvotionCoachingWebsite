"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  getCoachClientsOverview,
  getDashboardRecentCheckIns,
  getComplianceChartData,
  getClientActivityChartData,
  type EnrichedClient,
  type RecentCheckIn,
  type ComplianceChartPoint,
  type ActivityChartPoint,
} from "@/app/actions/admin-clients"
import {
  Users,
  TrendingUp,
  AlertTriangle,
  MessageCircle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

// Fallback empty data for charts when no data is available
const emptyComplianceData: ComplianceChartPoint[] = []
const emptyActivityData: ActivityChartPoint[] = []

function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return "Zojuist"
  if (diffMins < 60) return `${diffMins} min geleden`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} uur geleden`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return "Gisteren"
  return `${diffDays} dagen geleden`
}

export default function CoachDashboardClient() {
  const [clients, setClients] = useState<EnrichedClient[]>([])
  const [recentCheckIns, setRecentCheckIns] = useState<RecentCheckIn[]>([])
  const [complianceData, setComplianceData] = useState<ComplianceChartPoint[]>(emptyComplianceData)
  const [clientActiviteitData, setClientActiviteitData] = useState<ActivityChartPoint[]>(emptyActivityData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        const [clientsResult, checkInsResult, complianceResult, activityResult] = await Promise.all([
          getCoachClientsOverview(),
          getDashboardRecentCheckIns(6),
          getComplianceChartData(),
          getClientActivityChartData(),
        ])
        if (clientsResult?.success && clientsResult.clients) {
          setClients(clientsResult.clients)
        } else if (clientsResult?.error) {
          setError(clientsResult.error)
        }
        if (checkInsResult?.success && checkInsResult.checkIns) {
          setRecentCheckIns(checkInsResult.checkIns)
        }
        if (complianceResult?.success && complianceResult.data) {
          setComplianceData(complianceResult.data)
        }
        if (activityResult?.success && activityResult.data) {
          setClientActiviteitData(activityResult.data)
        }
      } catch (err: any) {
        console.error("Error loading dashboard:", err)
        setError(err.message || "Er is een fout opgetreden")
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const activeClients = clients.filter(c => c.activity_status === "active").length
  const needAttention = clients.filter(c => c.needs_attention).length
  const pendingFeedback = clients.filter(c => c.has_pending_feedback).length
  const avgCompliance = clients.length > 0
    ? Math.round(clients.reduce((s, c) => s + c.compliance_30d, 0) / clients.length)
    : 0
  const totalWorkouts30d = clients.reduce((s, c) => s + c.workout_logs_30d, 0)

  // Top clients by compliance for progress section
  const topClients = [...clients]
    .filter(c => c.compliance_30d > 0)
    .sort((a, b) => b.compliance_30d - a.compliance_30d)
    .slice(0, 4)

  const statCards = [
    {
      title: "Actieve cliënten",
      value: String(activeClients),
      change: `${clients.length} totaal`,
      trend: "up" as const,
      icon: Users,
      description: `${needAttention} aandacht nodig`,
    },
    {
      title: "Gem. compliance",
      value: `${avgCompliance}%`,
      change: avgCompliance >= 75 ? "Goed" : avgCompliance >= 50 ? "Matig" : "Laag",
      trend: avgCompliance >= 50 ? ("up" as const) : ("down" as const),
      icon: TrendingUp,
      description: "training & voeding",
    },
    {
      title: "Open feedback",
      value: String(pendingFeedback),
      change: pendingFeedback === 0 ? "Alles beantwoord" : "Review nodig",
      trend: pendingFeedback === 0 ? ("up" as const) : ("down" as const),
      icon: MessageCircle,
      description: "check-ins zonder feedback",
    },
    {
      title: "Aandacht nodig",
      value: String(needAttention),
      change: needAttention === 0 ? "Geen red flags" : `${needAttention} clients`,
      trend: needAttention === 0 ? ("up" as const) : ("down" as const),
      icon: AlertTriangle,
      description: "7+ dagen geen check-in",
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Dashboard laden...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold mb-2">Er is een fout opgetreden</h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <stat.icon className="size-5 text-primary" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === "up" ? "text-emerald-600" : "text-amber-600"
                }`}>
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="size-3" />
                  ) : (
                    <ArrowDownRight className="size-3" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Compliance overzicht</CardTitle>
            <p className="text-xs text-muted-foreground">Training & voeding compliance per week</p>
          </CardHeader>
          <CardContent className="pb-4">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={complianceData}>
                <defs>
                  <linearGradient id="trainingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="voedingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} className="text-muted-foreground" axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[60, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number, name: string) => [`${value}%`, name === "training" ? "Training" : "Voeding"]}
                />
                <Area type="monotone" dataKey="training" stroke="#10b981" strokeWidth={2} fill="url(#trainingGradient)" />
                <Area type="monotone" dataKey="voeding" stroke="#3b82f6" strokeWidth={2} fill="url(#voedingGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Cliëntactiviteit</CardTitle>
            <p className="text-xs text-muted-foreground">Check-ins & workouts deze week</p>
          </CardHeader>
          <CardContent className="pb-4">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={clientActiviteitData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="dag" tick={{ fontSize: 12 }} className="text-muted-foreground" axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="checkins" name="Check-ins" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="workouts" name="Workouts" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row: Check-ins + Quick actions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Recent Check-ins */}
        <Card className="shadow-sm lg:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Recente check-ins</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Laatste cliëntupdates</p>
              </div>
              {pendingFeedback > 0 && (
                <Badge variant="secondary" className="text-xs font-medium">
                  {pendingFeedback} review nodig
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            {recentCheckIns.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">Nog geen check-ins</p>
            ) : (
              <div className="flex flex-col gap-1">
                {recentCheckIns.map((checkin) => (
                  <Link
                    key={checkin.id}
                    href={`/coach/dashboard/clients/${checkin.user_id}`}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-secondary/50"
                  >
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {checkin.client_initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{checkin.client_name}</p>
                        {checkin.has_coach_feedback ? (
                          <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                        ) : (
                          <AlertCircle className="size-3.5 text-amber-500 shrink-0" />
                        )}
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 shrink-0">
                          {checkin.type === "weekly" ? "Wekelijks" : "Dagelijks"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {checkin.note || (checkin.weight ? `Gewicht: ${checkin.weight} kg` : "Geen notitie")}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                      <Clock className="size-3" />
                      {timeAgo(checkin.created_at)}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Snelle acties</CardTitle>
            <p className="text-xs text-muted-foreground">Veelgebruikte links</p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <Link
                href="/coach/dashboard/clients"
                className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-secondary/50"
              >
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="size-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Cliënten</p>
                  <p className="text-xs text-muted-foreground">{clients.length} clients</p>
                </div>
              </Link>
              <Link
                href="/coach/dashboard/check-ins"
                className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-secondary/50"
              >
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircle2 className="size-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Check-ins</p>
                  <p className="text-xs text-muted-foreground">Dagelijks & wekelijks</p>
                </div>
              </Link>
              <Link
                href="/coach/dashboard/progress"
                className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-secondary/50"
              >
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="size-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Voortgang</p>
                  <p className="text-xs text-muted-foreground">Trends & red flags</p>
                </div>
              </Link>
              <Link
                href="/coach/dashboard/workouts/programs"
                className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-secondary/50"
              >
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                  <MessageCircle className="size-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Programma&apos;s</p>
                  <p className="text-xs text-muted-foreground">Training programma&apos;s</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client Progress */}
      {topClients.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Cliënt voortgang</CardTitle>
            <p className="text-xs text-muted-foreground">Compliance afgelopen 30 dagen</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {topClients.map((client) => (
                <Link
                  key={client.id}
                  href={`/coach/dashboard/clients/${client.id}`}
                  className="flex flex-col gap-3 rounded-lg border p-4 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {client.avatar_initial}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{client.full_name || "Onbekend"}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {client.workout_logs_30d} workouts / 30d
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Compliance</span>
                      <span className="font-semibold">{client.compliance_30d}%</span>
                    </div>
                    <Progress value={client.compliance_30d} className="h-1.5" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
