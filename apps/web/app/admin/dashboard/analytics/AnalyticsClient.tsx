"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getCookieLogs, getCalculatorLogs, getContactLogs, clearCookieLogs } from "@/utils/cookie-utils"
import {
  Activity,
  TrendingUp,
  Mail,
  Download,
  Trash2,
  RefreshCw,
  Globe,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react"

interface ServerDashboardData {
  stats: {
    visitors: number
    calculatorStarts: number
    calculatorCompletions: number
    leads: number
    contactSubmissions: number
  }
  topPages: Array<{ url: string; visits: number }>
  recentActivity: Array<any>
}

interface AnalyticsData {
  totalVisitors: number
  cookieAcceptance: number
  calculatorStarts: number
  calculatorCompletions: number
  contactSubmissions: number
  conversionRate: number
  topPages: Array<{ url: string; visits: number }>
  recentActivity: Array<{ timestamp: string; action: string; url: string }>
  consentBreakdown: {
    analytics: number
    marketing: number
    preferences: number
    necessary: number
  }
  dateRange: {
    first: string | null
    last: string | null
  }
}

export default function AnalyticsClient() {
  const [serverData, setServerData] = useState<ServerDashboardData | null>(null)
  const [localAnalytics, setLocalAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const [activeView, setActiveView] = useState<"server" | "local">("server")

  const calculateLocalAnalytics = (): AnalyticsData => {
    const cookieLogs = getCookieLogs()
    const calculatorLogs = getCalculatorLogs()
    const contactLogs = getContactLogs()

    const uniqueVisitors = new Set()
    const pageVisits: Record<string, number> = {}
    const recentActivity: Array<{ timestamp: string; action: string; url: string }> = []

    cookieLogs.forEach((log) => {
      const date = new Date(log.timestamp).toDateString()
      const visitorId = `${log.userAgent}-${date}`
      uniqueVisitors.add(visitorId)
      if (log.url) {
        const url = new URL(log.url).pathname
        pageVisits[url] = (pageVisits[url] || 0) + 1
      }
      recentActivity.push({ timestamp: log.timestamp, action: `Cookie ${log.action}`, url: log.url || "" })
    })

    calculatorLogs.forEach((log) => {
      const date = new Date(log.timestamp).toDateString()
      const visitorId = `${log.userAgent}-${date}`
      uniqueVisitors.add(visitorId)
      if (log.url) {
        const url = new URL(log.url).pathname
        pageVisits[url] = (pageVisits[url] || 0) + 1
      }
      recentActivity.push({ timestamp: log.timestamp, action: `Calculator ${log.action}`, url: log.url || "" })
    })

    contactLogs.forEach((log) => {
      const date = new Date(log.timestamp).toDateString()
      const visitorId = `${log.userAgent}-${date}`
      uniqueVisitors.add(visitorId)
      if (log.url) {
        const url = new URL(log.url).pathname
        pageVisits[url] = (pageVisits[url] || 0) + 1
      }
      recentActivity.push({ timestamp: log.timestamp, action: `Contact ${log.type}`, url: log.url || "" })
    })

    const cookieAcceptance = cookieLogs.filter((log) => log.action === "accept_all").length
    const calculatorStarts = calculatorLogs.filter((log) => log.action === "started").length
    const calculatorCompletions = calculatorLogs.filter((log) => log.action === "completed").length
    const contactSubmissions = contactLogs.length

    const consentBreakdown = {
      analytics: cookieLogs.filter((log) => log.preferences?.analytics).length,
      marketing: cookieLogs.filter((log) => log.preferences?.marketing).length,
      preferences: cookieLogs.filter((log) => log.preferences?.preferences).length,
      necessary: cookieLogs.filter((log) => log.preferences?.necessary).length,
    }

    const topPages = Object.entries(pageVisits)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([url, visits]) => ({ url, visits }))

    recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    const allTimestamps = [
      ...cookieLogs.map((log) => log.timestamp),
      ...calculatorLogs.map((log) => log.timestamp),
      ...contactLogs.map((log) => log.timestamp),
    ].filter(Boolean)

    const dateRange = {
      first: allTimestamps.length > 0 ? allTimestamps.sort()[0] : null,
      last: allTimestamps.length > 0 ? allTimestamps.sort().reverse()[0] : null,
    }

    return {
      totalVisitors: uniqueVisitors.size,
      cookieAcceptance,
      calculatorStarts,
      calculatorCompletions,
      contactSubmissions,
      conversionRate: calculatorStarts > 0 ? Math.round((calculatorCompletions / calculatorStarts) * 100) : 0,
      topPages,
      recentActivity: recentActivity.slice(0, 10),
      consentBreakdown,
      dateRange,
    }
  }

  const loadAnalytics = async () => {
    setIsLoading(true)
    try {
      const localData = calculateLocalAnalytics()
      setLocalAnalytics(localData)

      const response = await fetch("/api/admin/analytics")
      if (response.ok) {
        const sData = await response.json()
        setServerData(sData)
      }

      setLastUpdated(new Date().toLocaleString("nl-NL"))
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [])

  const exportData = () => {
    if (!localAnalytics) return
    const data = {
      serverData,
      localSummary: localAnalytics,
      cookieLogs: getCookieLogs(),
      calculatorLogs: getCalculatorLogs(),
      contactLogs: getContactLogs(),
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `evotion-analytics-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const clearLocalData = () => {
    if (confirm("Weet je zeker dat je alle lokale analytics data wilt verwijderen?")) {
      try {
        clearCookieLogs()
        localStorage.removeItem("evotion-calculator-logs")
        localStorage.removeItem("evotion-contact-logs")
        loadAnalytics()
      } catch (error) {
        console.error("Error clearing data:", error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-5 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground mb-1">Website Analytics</h1>
          <p className="text-xs text-muted-foreground">Bezoekers, calculator en contact statistieken</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadAnalytics} size="sm" variant="outline" className="text-muted-foreground">
            <RefreshCw className="size-4 mr-1.5" />
            Vernieuwen
          </Button>
          <Button onClick={exportData} size="sm" variant="outline" className="text-muted-foreground">
            <Download className="size-4 mr-1.5" />
            Export
          </Button>
        </div>
      </div>

      {lastUpdated && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="size-3.5" />
          Laatste update: {lastUpdated}
        </div>
      )}

      {/* View toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveView("server")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
            activeView === "server" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground border border-border hover:text-foreground"
          }`}
        >
          <Globe className="size-4 inline mr-1.5" />
          Server Analytics
        </button>
        <button
          onClick={() => setActiveView("local")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
            activeView === "local" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground border border-border hover:text-foreground"
          }`}
        >
          <Clock className="size-4 inline mr-1.5" />
          Debug Logs
        </button>
      </div>

      {/* Server Analytics */}
      {activeView === "server" && (
        <>
          {serverData ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: "Bezoekers", value: serverData.stats.visitors, icon: Globe },
                  { label: "Calculator Starts", value: serverData.stats.calculatorStarts, icon: TrendingUp },
                  { label: "Voltooid", value: serverData.stats.calculatorCompletions, icon: Activity },
                  { label: "Leads", value: serverData.stats.leads, icon: TrendingUp },
                  { label: "Contact", value: serverData.stats.contactSubmissions, icon: Mail },
                ].map((stat) => (
                  <Card key={stat.label} className="bg-card border-border shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <stat.icon className="size-4 text-muted-foreground" />
                        <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                      </div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card border-border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2 text-base">
                      <Globe className="size-4 text-muted-foreground" />
                      Populaire Pagina's
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {serverData.topPages.length > 0 ? (
                      <div className="space-y-3">
                        {serverData.topPages.map((page, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground font-mono text-xs w-5">{i + 1}.</span>
                              <span className="text-sm text-foreground truncate">{page.url}</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">{page.visits}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-6">Nog geen data</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2 text-base">
                      <Activity className="size-4 text-muted-foreground" />
                      Recente Activiteit
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {serverData.recentActivity.length > 0 ? (
                      <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {serverData.recentActivity.map((a, i) => (
                          <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {a.type?.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">{a.path || a.url || ""}</p>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-3">
                              {new Date(a.timestamp).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-6">Geen recente activiteit</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card className="bg-card border-border shadow-sm">
              <CardContent className="flex flex-col items-center py-12">
                <AlertCircle className="size-10 text-muted-foreground/50 mb-3" />
                <h3 className="text-base font-semibold text-foreground mb-1">Server niet bereikbaar</h3>
                <p className="text-sm text-muted-foreground mb-4">Kon geen verbinding maken met de analytics server</p>
                <Button onClick={loadAnalytics} size="sm" variant="outline">Opnieuw proberen</Button>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Debug Logs */}
      {activeView === "local" && (
        <>
          <Card className="bg-amber-500/10 border-amber-500/20">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertCircle className="size-4 text-amber-600 mt-0.5" />
              <p className="text-sm text-amber-700">
                Lokale debug logs — alleen zichtbaar in jouw browser
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Sessies", value: localAnalytics?.totalVisitors || 0 },
              { label: "Events", value: getCookieLogs().length + getCalculatorLogs().length + getContactLogs().length },
              { label: "Calculator", value: localAnalytics?.calculatorStarts || 0 },
              { label: "Cookie Logs", value: getCookieLogs().length },
            ].map((stat) => (
              <Card key={stat.label} className="bg-card border-border shadow-sm">
                <CardContent className="p-5">
                  <p className="text-xs font-medium text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end">
            <Button onClick={clearLocalData} variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
              <Trash2 className="size-4 mr-1.5" />
              Lokale Logs Wissen
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
