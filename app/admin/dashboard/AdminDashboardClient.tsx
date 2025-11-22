"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCookieLogs, getCalculatorLogs, getContactLogs, clearCookieLogs } from "@/utils/cookie-utils"
import { getDashboardData } from "@/app/actions/analytics"
import {
  Activity,
  TrendingUp,
  Mail,
  Download,
  Trash2,
  RefreshCw,
  Globe,
  Clock,
  Server,
  AlertCircle,
} from "lucide-react"

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

export default function AdminDashboardClient() {
  const [serverData, setServerData] = useState<ServerDashboardData | null>(null)
  const [localAnalytics, setLocalAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>("")

  const calculateLocalAnalytics = (): AnalyticsData => {
    const cookieLogs = getCookieLogs()
    const calculatorLogs = getCalculatorLogs()
    const contactLogs = getContactLogs()

    const uniqueVisitors = new Set()
    const pageVisits: Record<string, number> = {}
    const recentActivity: Array<{ timestamp: string; action: string; url: string }> = []

    // ... existing calculation logic ...
    cookieLogs.forEach((log) => {
      const date = new Date(log.timestamp).toDateString()
      const visitorId = `${log.userAgent}-${date}`
      uniqueVisitors.add(visitorId)

      if (log.url) {
        const url = new URL(log.url).pathname
        pageVisits[url] = (pageVisits[url] || 0) + 1
      }

      recentActivity.push({
        timestamp: log.timestamp,
        action: `Cookie ${log.action}`,
        url: log.url || "",
      })
    })

    calculatorLogs.forEach((log) => {
      const date = new Date(log.timestamp).toDateString()
      const visitorId = `${log.userAgent}-${date}`
      uniqueVisitors.add(visitorId)

      if (log.url) {
        const url = new URL(log.url).pathname
        pageVisits[url] = (pageVisits[url] || 0) + 1
      }

      recentActivity.push({
        timestamp: log.timestamp,
        action: `Calculator ${log.action}`,
        url: log.url || "",
      })
    })

    contactLogs.forEach((log) => {
      const date = new Date(log.timestamp).toDateString()
      const visitorId = `${log.userAgent}-${date}`
      uniqueVisitors.add(visitorId)

      if (log.url) {
        const url = new URL(log.url).pathname
        pageVisits[url] = (pageVisits[url] || 0) + 1
      }

      recentActivity.push({
        timestamp: log.timestamp,
        action: `Contact ${log.type}`,
        url: log.url || "",
      })
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

      const sData = await getDashboardData()
      setServerData(sData)

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

    const exportData = {
      serverData,
      localSummary: localAnalytics,
      cookieLogs: getCookieLogs(),
      calculatorLogs: getCalculatorLogs(),
      contactLogs: getContactLogs(),
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
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
        alert("Lokale data is succesvol verwijderd.")
      } catch (error) {
        console.error("Error clearing data:", error)
        alert("Er is een fout opgetreden bij het verwijderen van de data.")
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1e1839] via-[#2a2054] to-[#1e1839]">
        <Header />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-white text-xl flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            Analytics laden...
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1839] via-[#2a2054] to-[#1e1839]">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-lg text-gray-300">Evotion Coaching Analytics & Statistieken</p>
            </div>

            <div className="flex gap-2">
              <Button onClick={loadAnalytics} size="sm" className="bg-[#bad4e1] hover:bg-[#bad4e1]/90 text-[#1e1839]">
                <RefreshCw className="w-4 h-4 mr-2" />
                Vernieuwen
              </Button>
              <Button
                onClick={exportData}
                size="sm"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#1e1839] bg-transparent"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
              <Clock className="w-4 h-4 mr-2" />
              Laatste update: {lastUpdated}
            </Badge>
            <Badge
              variant="secondary"
              className={`bg-white/10 text-white hover:bg-white/20 ${serverData ? "border-green-400/50" : "border-red-400/50"}`}
            >
              <Server className="w-4 h-4 mr-2" />
              Server Status: {serverData ? "Online" : "Offline"}
            </Badge>
          </div>

          <Tabs defaultValue="server" className="space-y-8">
            <TabsList className="bg-white/10 border border-white/10 text-gray-300">
              <TabsTrigger
                value="server"
                className="data-[state=active]:bg-[#bad4e1] data-[state=active]:text-[#1e1839]"
              >
                <Globe className="w-4 h-4 mr-2" />
                Live Overzicht
              </TabsTrigger>
              <TabsTrigger
                value="local"
                className="data-[state=active]:bg-[#bad4e1] data-[state=active]:text-[#1e1839]"
              >
                <Clock className="w-4 h-4 mr-2" />
                Lokale Debug Logs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="server" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {serverData ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <Card className="bg-blue-900/20 backdrop-blur-sm border-blue-500/30 hover:bg-blue-900/30 transition-colors">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-blue-200">Unieke Bezoekers</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-white">{serverData.stats.visitors}</div>
                        <p className="text-xs text-blue-300 mt-1 flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Vandaag
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-purple-900/20 backdrop-blur-sm border-purple-500/30 hover:bg-purple-900/30 transition-colors">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-purple-200">Calculator Starts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-white">{serverData.stats.calculatorStarts}</div>
                        <p className="text-xs text-purple-300 mt-1">Potentiële leads</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-green-900/20 backdrop-blur-sm border-green-500/30 hover:bg-green-900/30 transition-colors">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-green-200">Calculator Voltooid</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-white">{serverData.stats.calculatorCompletions}</div>
                        <p className="text-xs text-green-300 mt-1">
                          {serverData.stats.calculatorStarts > 0
                            ? Math.round(
                                (serverData.stats.calculatorCompletions / serverData.stats.calculatorStarts) * 100,
                              )
                            : 0}
                          % Conversie
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-orange-900/20 backdrop-blur-sm border-orange-500/30 hover:bg-orange-900/30 transition-colors">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-orange-200">Nieuwe Leads</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-white">{serverData.stats.leads}</div>
                        <p className="text-xs text-orange-300 mt-1">Hoog potentieel</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-pink-900/20 backdrop-blur-sm border-pink-500/30 hover:bg-pink-900/30 transition-colors">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-pink-200">Contact Berichten</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-white">{serverData.stats.contactSubmissions}</div>
                        <p className="text-xs text-pink-300 mt-1">Direct contact</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Globe className="w-5 h-5" />
                          Populaire Pagina's
                        </CardTitle>
                        <CardDescription className="text-gray-400">Meest bezochte pagina's vandaag</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {serverData.topPages.length > 0 ? (
                            serverData.topPages.map((page, index) => (
                              <div key={index} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3 overflow-hidden">
                                  <span className="text-gray-500 font-mono text-sm w-6">{index + 1}.</span>
                                  <span className="text-gray-200 truncate group-hover:text-white transition-colors">
                                    {page.url}
                                  </span>
                                </div>
                                <Badge
                                  variant="secondary"
                                  className="bg-[#bad4e1]/10 text-[#bad4e1] border border-[#bad4e1]/20"
                                >
                                  {page.visits}
                                </Badge>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-gray-500 flex flex-col items-center">
                              <Activity className="w-8 h-8 mb-2 opacity-50" />
                              <p>Nog geen data beschikbaar voor vandaag</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Activity className="w-5 h-5" />
                          Recente Activiteit
                        </CardTitle>
                        <CardDescription className="text-gray-400">Real-time gebruikersacties</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                          {serverData.recentActivity.length > 0 ? (
                            serverData.recentActivity.map((activity, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5"
                              >
                                <div className="mt-1">
                                  {activity.type.includes("page_view") ? (
                                    <Globe className="w-4 h-4 text-blue-400" />
                                  ) : activity.type.includes("calculator") ? (
                                    <TrendingUp className="w-4 h-4 text-green-400" />
                                  ) : (
                                    <Mail className="w-4 h-4 text-orange-400" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-white truncate">
                                    {activity.type.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                  </p>
                                  <p className="text-xs text-gray-400 truncate">
                                    {activity.path || activity.url || "Onbekende pagina"}
                                  </p>
                                </div>
                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                  {new Date(activity.timestamp).toLocaleTimeString("nl-NL", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <p>Geen recente activiteit</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <AlertCircle className="w-12 h-12 mb-4 text-red-400/50" />
                  <h3 className="text-xl font-semibold text-white mb-2">Server Verbinding Mislukt</h3>
                  <p className="max-w-md text-center mb-6">
                    Kon geen verbinding maken met de analytics database. Controleer je internetverbinding of probeer het
                    later opnieuw.
                  </p>
                  <Button
                    onClick={loadAnalytics}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    Opnieuw Proberen
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="local" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="bg-orange-900/10 border-orange-500/20 mb-6">
                <CardContent className="p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-200">Lokale Debug Modus</h4>
                    <p className="text-sm text-orange-200/70">
                      Deze data is alleen zichtbaar voor jou en toont de logs die in jouw browser zijn opgeslagen. Dit
                      is handig om te testen of tracking werkt.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-400">Jouw Sessies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{localAnalytics?.totalVisitors || 0}</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-400">Jouw Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {getCookieLogs().length + getCalculatorLogs().length + getContactLogs().length}
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-400">Calculator Acties</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{localAnalytics?.calculatorStarts || 0}</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-400">Cookie Logs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{getCookieLogs().length}</div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={clearLocalData}
                  variant="destructive"
                  size="sm"
                  className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Lokale Logs Wissen
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  )
}
