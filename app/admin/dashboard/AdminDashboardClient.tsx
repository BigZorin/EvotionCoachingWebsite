"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Users, Shield, Target, Download, RefreshCw } from "lucide-react"

interface CookieLog {
  timestamp: string
  action: string
  preferences: {
    necessary: boolean
    analytics: boolean
    marketing: boolean
    preferences: boolean
  }
  userAgent: string
  url: string
}

interface AnalyticsData {
  totalVisitors: number
  cookieConsent: {
    accepted: number
    rejected: number
    partial: number
  }
  calculatorUsage: {
    started: number
    completed: number
    conversionRate: number
  }
  leadGeneration: {
    total: number
    fromCalculator: number
    fromContact: number
  }
}

export default function AdminDashboardClient() {
  const [cookieLogs, setCookieLogs] = useState<CookieLog[]>([])
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = () => {
    setLoading(true)

    // Load cookie logs from localStorage
    try {
      const logs = JSON.parse(localStorage.getItem("evotion-cookie-logs") || "[]")
      setCookieLogs(logs)

      // Generate mock analytics data based on logs
      const mockAnalytics: AnalyticsData = {
        totalVisitors: Math.floor(Math.random() * 1000) + 500,
        cookieConsent: {
          accepted: Math.floor(Math.random() * 300) + 200,
          rejected: Math.floor(Math.random() * 100) + 50,
          partial: Math.floor(Math.random() * 150) + 75,
        },
        calculatorUsage: {
          started: Math.floor(Math.random() * 200) + 100,
          completed: Math.floor(Math.random() * 150) + 75,
          conversionRate: 0,
        },
        leadGeneration: {
          total: Math.floor(Math.random() * 50) + 25,
          fromCalculator: Math.floor(Math.random() * 30) + 15,
          fromContact: Math.floor(Math.random() * 20) + 10,
        },
      }

      // Calculate conversion rate
      mockAnalytics.calculatorUsage.conversionRate =
        mockAnalytics.calculatorUsage.started > 0
          ? (mockAnalytics.calculatorUsage.completed / mockAnalytics.calculatorUsage.started) * 100
          : 0

      setAnalyticsData(mockAnalytics)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    }

    setLoading(false)
  }

  const exportData = () => {
    const data = {
      cookieLogs,
      analyticsData,
      exportDate: new Date().toISOString(),
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

  const clearLogs = () => {
    if (confirm("Weet je zeker dat je alle logs wilt verwijderen?")) {
      localStorage.removeItem("evotion-cookie-logs")
      setCookieLogs([])
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[#1e1839]" />
          <p className="text-gray-600">Dashboard laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1e1839] mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Cookie Analytics & User Data</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button onClick={loadDashboardData} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Vernieuwen
            </Button>
            <Button onClick={exportData} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exporteren
            </Button>
            <Button onClick={clearLogs} variant="destructive" size="sm">
              Logs Wissen
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        {analyticsData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Totaal Bezoekers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.totalVisitors}</div>
                <p className="text-xs text-muted-foreground">Deze maand</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cookie Acceptatie</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.cookieConsent.accepted}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((analyticsData.cookieConsent.accepted / analyticsData.totalVisitors) * 100)}% van
                  bezoekers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Calculator Gebruik</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.calculatorUsage.completed}</div>
                <p className="text-xs text-muted-foreground">
                  {analyticsData.calculatorUsage.conversionRate.toFixed(1)}% conversie rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Leads Gegenereerd</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.leadGeneration.total}</div>
                <p className="text-xs text-muted-foreground">
                  {analyticsData.leadGeneration.fromCalculator} van calculator
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Detailed Analytics */}
        <Tabs defaultValue="cookies" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cookies">Cookie Analytics</TabsTrigger>
            <TabsTrigger value="calculator">Calculator Data</TabsTrigger>
            <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="cookies" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cookie Voorkeuren</CardTitle>
                  <CardDescription>Verdeling van cookie acceptatie</CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsData && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Alles Geaccepteerd</span>
                        <Badge variant="default">{analyticsData.cookieConsent.accepted}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Gedeeltelijk Geaccepteerd</span>
                        <Badge variant="secondary">{analyticsData.cookieConsent.partial}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Alleen Noodzakelijk</span>
                        <Badge variant="outline">{analyticsData.cookieConsent.rejected}</Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>GDPR Compliance</CardTitle>
                  <CardDescription>Privacy en compliance status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Cookie Banner Getoond</span>
                      <Badge variant="default">✓ Actief</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Expliciete Toestemming</span>
                      <Badge variant="default">✓ Vereist</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Opt-out Mogelijk</span>
                      <Badge variant="default">✓ Beschikbaar</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Data Logging</span>
                      <Badge variant="default">✓ Actief</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="calculator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Calculator Performance</CardTitle>
                  <CardDescription>Gebruik en conversie statistieken</CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsData && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Gestart</span>
                        <Badge variant="outline">{analyticsData.calculatorUsage.started}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Voltooid</span>
                        <Badge variant="default">{analyticsData.calculatorUsage.completed}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Conversie Rate</span>
                        <Badge variant="secondary">{analyticsData.calculatorUsage.conversionRate.toFixed(1)}%</Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lead Generation</CardTitle>
                  <CardDescription>Leads gegenereerd via verschillende kanalen</CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsData && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Via Calculator</span>
                        <Badge variant="default">{analyticsData.leadGeneration.fromCalculator}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Via Contact Form</span>
                        <Badge variant="secondary">{analyticsData.leadGeneration.fromContact}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Totaal</span>
                        <Badge variant="outline">{analyticsData.leadGeneration.total}</Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Logs</CardTitle>
                <CardDescription>Recente cookie en gebruikersactiviteit ({cookieLogs.length} entries)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {cookieLogs.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Geen logs beschikbaar</p>
                  ) : (
                    cookieLogs
                      .slice()
                      .reverse()
                      .slice(0, 50)
                      .map((log, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge
                              variant={
                                log.action === "accept_all"
                                  ? "default"
                                  : log.action === "reject_all"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {log.action.replace("_", " ")}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(log.timestamp).toLocaleString("nl-NL")}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>URL: {log.url}</p>
                            <p>
                              Voorkeuren: Analytics: {log.preferences?.analytics ? "✓" : "✗"}, Marketing:{" "}
                              {log.preferences?.marketing ? "✓" : "✗"}
                            </p>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
