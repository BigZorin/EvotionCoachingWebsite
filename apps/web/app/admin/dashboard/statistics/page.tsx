"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import {
  Users,
  UserCheck,
  Dumbbell,
  LinkIcon,
  ClipboardCheck,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Loader2,
  AlertCircle,
  BookOpen,
  GraduationCap,
  MessageSquare,
  Camera,
  BarChart3,
  Activity,
} from "lucide-react"
import {
  getPlatformOverview,
  getEngagementStats,
  getUserGrowthData,
  getActivityBreakdown,
  type PlatformOverview,
  type EngagementStats,
  type UserGrowthPoint,
  type ActivityBreakdown,
} from "@/app/actions/statistics"

export default function StatisticsPage() {
  const [overview, setOverview] = useState<PlatformOverview | null>(null)
  const [engagement, setEngagement] = useState<EngagementStats | null>(null)
  const [growth, setGrowth] = useState<UserGrowthPoint[]>([])
  const [activity, setActivity] = useState<ActivityBreakdown | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [overviewRes, engagementRes, growthRes, activityRes] = await Promise.all([
        getPlatformOverview(),
        getEngagementStats(),
        getUserGrowthData(),
        getActivityBreakdown(),
      ])

      if ("error" in overviewRes) throw new Error(overviewRes.error)
      if ("error" in engagementRes) throw new Error(engagementRes.error)
      if ("error" in growthRes) throw new Error(growthRes.error)
      if ("error" in activityRes) throw new Error(activityRes.error)

      setOverview(overviewRes)
      setEngagement(engagementRes)
      setGrowth(growthRes)
      setActivity(activityRes)
    } catch (err: any) {
      console.error("Error loading statistics:", err)
      setError(err.message || "Er is een fout opgetreden bij het laden van statistieken")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Statistieken laden...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold mb-2">Fout bij laden</h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={loadData} variant="outline" size="sm">
          <RefreshCw className="size-4 mr-1.5" />
          Opnieuw proberen
        </Button>
      </div>
    )
  }

  // Growth percentage calculation
  const growthPercent = overview && overview.newUsersLastMonth > 0
    ? Math.round(((overview.newUsersThisMonth - overview.newUsersLastMonth) / overview.newUsersLastMonth) * 100)
    : overview && overview.newUsersThisMonth > 0
      ? 100
      : 0

  const totalCheckInsThisWeek = (engagement?.weeklyCheckIns || 0) + (engagement?.dailyCheckIns || 0)

  const kpiCards = [
    {
      label: "Totaal Gebruikers",
      value: overview?.totalUsers || 0,
      icon: Users,
      detail: `+${overview?.newUsersThisMonth || 0} deze maand`,
      badge: growthPercent !== 0 ? {
        label: `${growthPercent > 0 ? "+" : ""}${growthPercent}%`,
        positive: growthPercent > 0,
      } : null,
    },
    {
      label: "Coaches",
      value: overview?.totalCoaches || 0,
      icon: Dumbbell,
      detail: "Actieve coaches",
    },
    {
      label: "Clients",
      value: overview?.totalClients || 0,
      icon: UserCheck,
      detail: "Geregistreerde clients",
    },
    {
      label: "Actieve Relaties",
      value: overview?.activeRelationships || 0,
      icon: LinkIcon,
      detail: "Coach-client koppelingen",
    },
    {
      label: "Check-ins Deze Week",
      value: totalCheckInsThisWeek,
      icon: ClipboardCheck,
      detail: `${engagement?.weeklyCheckIns || 0} wekelijks \u00b7 ${engagement?.dailyCheckIns || 0} dagelijks`,
    },
    {
      label: "Workouts Voltooid",
      value: engagement?.workoutsCompleted || 0,
      icon: Activity,
      detail: "Deze week",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Platform Statistieken</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Overzicht van gebruikers, engagement en platform activiteit
          </p>
        </div>
        <Button onClick={loadData} size="sm" variant="outline" className="text-muted-foreground">
          <RefreshCw className="size-4 mr-1.5" />
          Vernieuwen
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {kpiCards.map((kpi) => (
          <Card key={kpi.label} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground">{kpi.label}</span>
                <kpi.icon className="size-4 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                {kpi.badge && (
                  <Badge
                    variant="secondary"
                    className={`text-[10px] px-1.5 py-0 h-5 ${
                      kpi.badge.positive
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-red-500/10 text-red-600 border-red-500/20"
                    }`}
                  >
                    {kpi.badge.positive ? (
                      <TrendingUp className="size-3 mr-0.5" />
                    ) : (
                      <TrendingDown className="size-3 mr-0.5" />
                    )}
                    {kpi.badge.label}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{kpi.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* User Growth Chart */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BarChart3 className="size-4 text-muted-foreground" />
              Gebruikers Groei
            </CardTitle>
          </CardHeader>
          <CardContent>
            {growth.length > 0 ? (
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={growth} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      className="text-muted-foreground"
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      className="text-muted-foreground"
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      labelStyle={{ fontWeight: 600 }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: "12px" }}
                    />
                    <Bar
                      dataKey="clients"
                      name="Clients"
                      stackId="a"
                      fill="hsl(var(--primary))"
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar
                      dataKey="coaches"
                      name="Coaches"
                      stackId="a"
                      fill="hsl(var(--chart-2))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[280px] text-sm text-muted-foreground">
                Nog geen groei data beschikbaar
              </div>
            )}
          </CardContent>
        </Card>

        {/* Engagement Overview */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Activity className="size-4 text-muted-foreground" />
              Engagement Overzicht
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-5 pt-2">
              <ProgressRow
                label="Training Compliance"
                value={engagement?.avgTrainingAdherence || 0}
              />
              <ProgressRow
                label="Voeding Compliance"
                value={engagement?.avgNutritionAdherence || 0}
              />
              <ProgressRow
                label="Check-in Rate"
                value={activity?.checkInRate || 0}
              />
              <ProgressRow
                label="Workout Rate"
                value={activity?.workoutCompletionRate || 0}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Activity Cards */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <BarChart3 className="size-4 text-muted-foreground" />
          Platform Activiteit
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Content Library */}
          <Card className="shadow-sm">
            <CardContent className="p-4 flex items-start gap-3">
              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <BookOpen className="size-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Content Library</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activity?.contentItems || 0} items &middot; {activity?.contentViews || 0} views totaal
                </p>
              </div>
              <Badge variant="secondary" className="text-xs shrink-0">
                {activity?.contentItems || 0}
              </Badge>
            </CardContent>
          </Card>

          {/* Courses */}
          <Card className="shadow-sm">
            <CardContent className="p-4 flex items-start gap-3">
              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <GraduationCap className="size-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Courses</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activity?.coursesPublished || 0} gepubliceerd &middot; {activity?.totalEnrollments || 0} inschrijvingen
                </p>
              </div>
              <Badge variant="secondary" className="text-xs shrink-0">
                {activity?.coursesPublished || 0}
              </Badge>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card className="shadow-sm">
            <CardContent className="p-4 flex items-start gap-3">
              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <MessageSquare className="size-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Berichten</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activity?.messagesThisWeek || 0} deze week
                </p>
              </div>
              <Badge variant="secondary" className="text-xs shrink-0">
                {activity?.messagesThisWeek || 0}
              </Badge>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card className="shadow-sm">
            <CardContent className="p-4 flex items-start gap-3">
              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Camera className="size-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Foto's</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activity?.photoUploads || 0} uploads deze maand
                </p>
              </div>
              <Badge variant="secondary" className="text-xs shrink-0">
                {activity?.photoUploads || 0}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Progress Bar Row Component
// ============================================================

function ProgressRow({ label, value }: { label: string; value: number }) {
  const clampedValue = Math.min(100, Math.max(0, value))

  const getColor = (v: number) => {
    if (v >= 75) return "bg-emerald-500"
    if (v >= 50) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-foreground">{label}</span>
        <span className="text-sm font-semibold text-foreground">{clampedValue}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-secondary">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${getColor(clampedValue)}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  )
}
