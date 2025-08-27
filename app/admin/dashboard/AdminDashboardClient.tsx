"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getCookieLogs, getCalculatorLogs, getContactLogs, clearCookieLogs } from "@/utils/cookie-utils"
import {
  Users,
  Activity,
  TrendingUp,
  Mail,
  Download,
  Trash2,
  RefreshCw,
  Calendar,
  Globe,
  CheckCircle,
  Clock,
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

export default function AdminDashboardClient() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>("")

  const calculateRealAnalytics = (): AnalyticsData => {
    const cookieLogs = getCookieLogs()
    const calculatorLogs = getCalculatorLogs()
    const contactLogs = getContactLogs()

    // Calculate unique visitors based on userAgent + date combination
    const uniqueVisitors = new Set()
    const pageVisits: Record<string, number> = {}
    const recentActivity: Array<{ timestamp: string; action: string; url: string }> = []

    // Process cookie logs
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

    // Process calculator logs
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

    // Process contact logs
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

    // Calculate statistics
    const cookieAcceptance = cookieLogs.filter((log) => log.action === "accept_all").length
    const calculatorStarts = calculatorLogs.filter((log) => log.action === "started").length
    const calculatorCompletions = calculatorLogs.filter((log) => log.action === "completed").length
    const contactSubmissions = contactLogs.length

    // Calculate consent breakdown
    const consentBreakdown = {
      analytics: cookieLogs.filter((log) => log.preferences?.analytics).length,
      marketing: cookieLogs.filter((log) => log.preferences?.marketing).length,
      preferences: cookieLogs.filter((log) => log.preferences?.preferences).length,
      necessary: cookieLogs.filter((log) => log.preferences?.necessary).length,
    }

    // Top pages
    const topPages = Object.entries(pageVisits)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([url, visits]) => ({ url, visits }))

    // Sort recent activity by timestamp (most recent first)
    recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Calculate date range
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

  const loadAnalytics = () => {
    setIsLoading(true)
    try {
      const data = calculateRealAnalytics()
      setAnalytics(data)
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
    if (!analytics) return

    const exportData = {
      summary: analytics,
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

  const clearAllData = () => {
    if (confirm("Weet je zeker dat je alle analytics data wilt verwijderen? Dit kan niet ongedaan gemaakt worden.")) {
      try {
        clearCookieLogs()
        localStorage.removeItem("evotion-calculator-logs")
        localStorage.removeItem("evotion-contact-logs")
        loadAnalytics()
        alert("Alle data is succesvol verwijderd.")
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
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center">
            <div className="text-white text-xl">Analytics laden...</div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1e1839] via-[#2a2054] to-[#1e1839]">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Geen data beschikbaar</h1>
            <p className="mb-4">Er zijn nog geen analytics gegevens verzameld.</p>
            <Button onClick={loadAnalytics} className="bg-[#bad4e1] hover:bg-[#bad4e1]/90 text-[#1e1839]">
              <RefreshCw className="w-4 h-4 mr-2" />
              Opnieuw laden
            </Button>
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
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Admin Dashboard</h1>
            <p className="text-xl text-gray-300 mb-6">Evotion Coaching Analytics & Statistieken</p>

            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <Badge variant="secondary" className="bg-white/10 text-white">
                <Calendar className="w-4 h-4 mr-2" />
                {getCookieLogs().length + getCalculatorLogs().length + getContactLogs().length} logs totaal
              </Badge>
              <Badge variant="secondary" className="bg-white/10 text-white">
                <Clock className="w-4 h-4 mr-2" />
                Laatste update: {lastUpdated}
              </Badge>
              {analytics.dateRange.first && (
                <Badge variant="secondary" className="bg-white/10 text-white">
                  <Globe className="w-4 h-4 mr-2" />
                  Data vanaf: {new Date(analytics.dateRange.first).toLocaleDateString("nl-NL")}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button onClick={loadAnalytics} className="bg-[#bad4e1] hover:bg-[#bad4e1]/90 text-[#1e1839]">
                <RefreshCw className="w-4 h-4 mr-2" />
                Vernieuwen
              </Button>
              <Button
                onClick={exportData}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#1e1839] bg-transparent"
              >
                <Download className="w-4 h-4 mr-2" />
                Exporteren
              </Button>
              <Button
                onClick={clearAllData}
                variant="outline"
                className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white bg-transparent"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Data Wissen
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Unieke Bezoekers</CardTitle>
                <Users className="h-4 w-4 text-[#bad4e1]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{analytics.totalVisitors}</div>
                <p className="text-xs text-gray-300">Gebaseerd op userAgent + datum</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Cookie Acceptatie</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{analytics.cookieAcceptance}</div>
                <p className="text-xs text-gray-300">Volledige acceptaties</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Calculator Conversie</CardTitle>
                <TrendingUp className="h-4 w-4 text-[#bad4e1]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{analytics.conversionRate}%</div>
                <p className="text-xs text-gray-300">
                  {analytics.calculatorCompletions}/{analytics.calculatorStarts} voltooid
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Contact Submissions</CardTitle>
                <Mail className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{analytics.contactSubmissions}</div>
                <p className="text-xs text-gray-300">Leads gegenereerd</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Cookie Consent Breakdown */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Cookie Consent Breakdown</CardTitle>
                <CardDescription className="text-gray-300">Aantal gebruikers per consent type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white">Analytics Cookies</span>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                    {analytics.consentBreakdown.analytics}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Marketing Cookies</span>
                  <Badge variant="secondary" className="bg-orange-500/20 text-orange-300">
                    {analytics.consentBreakdown.marketing}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Preference Cookies</span>
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                    {analytics.consentBreakdown.preferences}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Necessary Cookies</span>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                    {analytics.consentBreakdown.necessary}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Top Pages */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Top Pagina's</CardTitle>
                <CardDescription className="text-gray-300">Meest bezochte pagina's</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics.topPages.length > 0 ? (
                  analytics.topPages.map((page, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-white text-sm truncate">{page.url}</span>
                      <Badge variant="secondary" className="bg-[#bad4e1]/20 text-[#bad4e1]">
                        {page.visits}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">Geen pagina data beschikbaar</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Recente Activiteit</CardTitle>
              <CardDescription className="text-gray-300">Laatste gebruikersacties op de website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.recentActivity.length > 0 ? (
                  analytics.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Activity className="h-4 w-4 text-[#bad4e1]" />
                        <div>
                          <p className="text-white text-sm font-medium">{activity.action}</p>
                          <p className="text-gray-400 text-xs">{activity.url}</p>
                        </div>
                      </div>
                      <span className="text-gray-400 text-xs">
                        {new Date(activity.timestamp).toLocaleString("nl-NL")}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-8">Geen recente activiteit</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Calculator Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Calculator Performance</CardTitle>
                <CardDescription className="text-gray-300">
                  Statistieken van de caloriebehoefte calculator
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white">Gestart</span>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                    {analytics.calculatorStarts}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Voltooid</span>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                    {analytics.calculatorCompletions}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Conversie Rate</span>
                  <Badge variant="secondary" className="bg-[#bad4e1]/20 text-[#bad4e1]">
                    {analytics.conversionRate}%
                  </Badge>
                </div>
                <Separator className="bg-white/20" />
                <div className="flex justify-between items-center">
                  <span className="text-white">Afgebroken</span>
                  <Badge variant="secondary" className="bg-red-500/20 text-red-300">
                    {analytics.calculatorStarts - analytics.calculatorCompletions}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* System Info */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Systeem Informatie</CardTitle>
                <CardDescription className="text-gray-300">Data opslag en systeem status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white">Cookie Logs</span>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                    {getCookieLogs().length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Calculator Logs</span>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                    {getCalculatorLogs().length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Contact Logs</span>
                  <Badge variant="secondary" className="bg-orange-500/20 text-orange-300">
                    {getContactLogs().length}
                  </Badge>
                </div>
                <Separator className="bg-white/20" />
                <div className="flex justify-between items-center">
                  <span className="text-white">Data Range</span>
                  <div className="text-right">
                    {analytics.dateRange.first ? (
                      <>
                        <div className="text-xs text-gray-400">
                          {new Date(analytics.dateRange.first).toLocaleDateString("nl-NL")}
                        </div>
                        <div className="text-xs text-gray-400">
                          tot{" "}
                          {analytics.dateRange.last
                            ? new Date(analytics.dateRange.last).toLocaleDateString("nl-NL")
                            : "nu"}
                        </div>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400">Geen data</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
