"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  getClients,
  getClientDailyCheckIns,
  getClientCheckIns,
  submitCoachFeedback,
  type ClientWithStats,
  type DailyCheckIn,
  type CheckIn,
} from "@/app/actions/admin-clients"
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Send,
  Calendar,
  Moon,
  Smile,
  Weight,
} from "lucide-react"

const MOOD_LABELS: Record<number, string> = { 1: "Slecht", 2: "Matig", 3: "Oké", 4: "Goed", 5: "Top" }
const SLEEP_LABELS: Record<number, string> = { 1: "Slecht", 2: "Matig", 3: "Oké", 4: "Goed", 5: "Diep" }

export default function CheckInsOverviewClient() {
  const [clients, setClients] = useState<ClientWithStats[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedDaily, setExpandedDaily] = useState<Set<string>>(new Set())
  const [expandedWeekly, setExpandedWeekly] = useState<Set<string>>(new Set())
  const [weeklyCheckIns, setWeeklyCheckIns] = useState<Record<string, CheckIn[]>>({})
  const [feedbackText, setFeedbackText] = useState<Record<string, string>>({})
  const [feedbackSending, setFeedbackSending] = useState<string | null>(null)

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    setIsLoading(true)
    try {
      const result = await getClients()
      if (result.success && result.clients) {
        setClients(result.clients)
      }
    } catch (error) {
      console.error("Error loading clients:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleExpandDaily = (clientId: string) => {
    setExpandedDaily((prev) => {
      const next = new Set(prev)
      if (next.has(clientId)) next.delete(clientId)
      else next.add(clientId)
      return next
    })
  }

  const toggleExpandWeekly = async (clientId: string) => {
    setExpandedWeekly((prev) => {
      const next = new Set(prev)
      if (next.has(clientId)) next.delete(clientId)
      else next.add(clientId)
      return next
    })

    if (!weeklyCheckIns[clientId]) {
      const result = await getClientCheckIns(clientId)
      if (result.success && result.checkIns) {
        setWeeklyCheckIns((prev) => ({ ...prev, [clientId]: result.checkIns! }))
      }
    }
  }

  const handleFeedback = async (checkInId: string, type: "daily" | "weekly") => {
    const text = feedbackText[checkInId]
    if (!text?.trim()) return

    setFeedbackSending(checkInId)
    try {
      const result = await submitCoachFeedback(checkInId, type, text.trim())
      if (result.success) {
        setFeedbackText((prev) => ({ ...prev, [checkInId]: "" }))
        loadClients() // Refresh data
      }
    } catch (error) {
      console.error("Error sending feedback:", error)
    } finally {
      setFeedbackSending(null)
    }
  }

  const clientsWithDailyToday = clients.filter((c) => c.todayDailyCheckIn)
  const clientsWithoutDailyToday = clients.filter((c) => !c.todayDailyCheckIn)

  const getWeekNumber = () => {
    const d = new Date()
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  }

  const currentWeek = getWeekNumber()
  const currentYear = new Date().getFullYear()

  const clientsWithWeeklyThisWeek = clients.filter(
    (c) => c.latestCheckIn && c.latestCheckIn.week_number === currentWeek && c.latestCheckIn.year === currentYear
  )
  const clientsWithoutWeeklyThisWeek = clients.filter(
    (c) => !c.latestCheckIn || c.latestCheckIn.week_number !== currentWeek || c.latestCheckIn.year !== currentYear
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-900 text-xl flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1e1839]"></div>
          Laden...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Check-ins Overzicht</h1>
        <p className="text-gray-600 mt-1">Bekijk dagelijkse en wekelijkse check-ins van je clients</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{clientsWithDailyToday.length}</p>
            <p className="text-xs text-gray-500 mt-1">Dagelijks ingevuld</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-500">{clientsWithoutDailyToday.length}</p>
            <p className="text-xs text-gray-500 mt-1">Dagelijks open</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{clientsWithWeeklyThisWeek.length}</p>
            <p className="text-xs text-gray-500 mt-1">Wekelijks ingevuld</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-500">{clientsWithoutWeeklyThisWeek.length}</p>
            <p className="text-xs text-gray-500 mt-1">Wekelijks open</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">Dagelijks</TabsTrigger>
          <TabsTrigger value="weekly">Wekelijks</TabsTrigger>
        </TabsList>

        {/* Daily Tab */}
        <TabsContent value="daily" className="space-y-6">
          {/* Submitted today */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Ingevuld vandaag ({clientsWithDailyToday.length})
            </h3>
            {clientsWithDailyToday.length === 0 ? (
              <p className="text-gray-400 text-sm py-4">Nog geen check-ins vandaag</p>
            ) : (
              <div className="space-y-2">
                {clientsWithDailyToday.map((client) => {
                  const ci = client.todayDailyCheckIn!
                  const isExpanded = expandedDaily.has(client.id)
                  return (
                    <Card key={client.id} className="bg-white border-gray-200">
                      <CardContent className="p-0">
                        <button
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                          onClick={() => toggleExpandDaily(client.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-sm font-semibold text-green-700">
                              {(client.raw_user_meta_data?.full_name?.[0] || client.email[0]).toUpperCase()}
                            </div>
                            <div className="text-left">
                              <p className="font-medium text-gray-900 text-sm">
                                {client.raw_user_meta_data?.full_name || client.email}
                              </p>
                              <div className="flex items-center gap-3 mt-0.5">
                                {ci.weight && (
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Weight className="w-3 h-3" /> {ci.weight} kg
                                  </span>
                                )}
                                {ci.mood && (
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Smile className="w-3 h-3" /> {MOOD_LABELS[ci.mood]}
                                  </span>
                                )}
                                {ci.sleep_quality && (
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Moon className="w-3 h-3" /> {SLEEP_LABELS[ci.sleep_quality]}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </button>
                        {isExpanded && (
                          <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
                            {ci.notes && (
                              <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-1">Notities</p>
                                <p className="text-sm text-gray-700">{ci.notes}</p>
                              </div>
                            )}
                            {ci.coach_feedback && (
                              <div className="bg-blue-50 rounded-lg p-3">
                                <p className="text-xs text-blue-600 mb-1 flex items-center gap-1">
                                  <MessageSquare className="w-3 h-3" /> Jouw feedback
                                </p>
                                <p className="text-sm text-blue-800">{ci.coach_feedback}</p>
                              </div>
                            )}
                            <div className="flex gap-2">
                              <Textarea
                                placeholder="Feedback voor deze client..."
                                value={feedbackText[ci.id] || ""}
                                onChange={(e) => setFeedbackText((prev) => ({ ...prev, [ci.id]: e.target.value }))}
                                className="text-sm min-h-[60px]"
                              />
                              <Button
                                size="sm"
                                onClick={() => handleFeedback(ci.id, "daily")}
                                disabled={!feedbackText[ci.id]?.trim() || feedbackSending === ci.id}
                                className="bg-[#1e1839] hover:bg-[#2a2054] self-end"
                              >
                                <Send className="w-4 h-4" />
                              </Button>
                            </div>
                            <Link
                              href={`/coach/dashboard/clients/${client.id}`}
                              className="text-xs text-[#1e1839] hover:underline font-medium"
                            >
                              Bekijk volledig profiel →
                            </Link>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>

          {/* Not submitted today */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-orange-500" />
              Nog niet ingevuld ({clientsWithoutDailyToday.length})
            </h3>
            {clientsWithoutDailyToday.length === 0 ? (
              <p className="text-green-600 text-sm py-4">Alle clients hebben vandaag ingecheckt!</p>
            ) : (
              <div className="space-y-2">
                {clientsWithoutDailyToday.map((client) => (
                  <Card key={client.id} className="bg-white border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-sm font-semibold text-orange-700">
                            {(client.raw_user_meta_data?.full_name?.[0] || client.email[0]).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {client.raw_user_meta_data?.full_name || client.email}
                            </p>
                            <p className="text-xs text-gray-400">
                              {client.latestDailyCheckIn
                                ? `Laatste: ${new Date(client.latestDailyCheckIn.check_in_date).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}`
                                : "Nog nooit ingecheckt"}
                            </p>
                          </div>
                        </div>
                        <Link
                          href={`/coach/dashboard/clients/${client.id}`}
                          className="text-xs text-[#1e1839] hover:underline font-medium"
                        >
                          Bekijk →
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Weekly Tab */}
        <TabsContent value="weekly" className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Ingevuld deze week — Week {currentWeek} ({clientsWithWeeklyThisWeek.length})
            </h3>
            {clientsWithWeeklyThisWeek.length === 0 ? (
              <p className="text-gray-400 text-sm py-4">Nog geen wekelijkse check-ins deze week</p>
            ) : (
              <div className="space-y-2">
                {clientsWithWeeklyThisWeek.map((client) => {
                  const ci = client.latestCheckIn!
                  const isExpanded = expandedWeekly.has(client.id)
                  return (
                    <Card key={client.id} className="bg-white border-gray-200">
                      <CardContent className="p-0">
                        <button
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                          onClick={() => toggleExpandWeekly(client.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-sm font-semibold text-green-700">
                              {(client.raw_user_meta_data?.full_name?.[0] || client.email[0]).toUpperCase()}
                            </div>
                            <div className="text-left">
                              <p className="font-medium text-gray-900 text-sm">
                                {client.raw_user_meta_data?.full_name || client.email}
                              </p>
                              <div className="flex items-center gap-3 mt-0.5">
                                {ci.weight && <Badge variant="secondary" className="text-xs">{ci.weight} kg</Badge>}
                                {ci.feeling && <Badge variant="outline" className="text-xs">Gevoel: {ci.feeling}/5</Badge>}
                              </div>
                            </div>
                          </div>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </button>
                        {isExpanded && (
                          <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
                            <div className="grid grid-cols-3 gap-2">
                              <div className="bg-gray-50 rounded-lg p-2 text-center">
                                <p className="text-xs text-gray-500">Energie</p>
                                <p className="text-sm font-semibold">{ci.energy_level ?? "—"}/5</p>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-2 text-center">
                                <p className="text-xs text-gray-500">Slaap</p>
                                <p className="text-sm font-semibold">{ci.sleep_quality ?? "—"}/5</p>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-2 text-center">
                                <p className="text-xs text-gray-500">Stress</p>
                                <p className="text-sm font-semibold">{ci.stress_level ?? "—"}/5</p>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-2 text-center">
                                <p className="text-xs text-gray-500">Voeding</p>
                                <p className="text-sm font-semibold">{ci.nutrition_adherence ?? "—"}/5</p>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-2 text-center">
                                <p className="text-xs text-gray-500">Training</p>
                                <p className="text-sm font-semibold">{ci.training_adherence ?? "—"}/5</p>
                              </div>
                            </div>
                            {ci.notes && (
                              <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-1">Notities</p>
                                <p className="text-sm text-gray-700">{ci.notes}</p>
                              </div>
                            )}
                            <div className="flex gap-2">
                              <Textarea
                                placeholder="Feedback voor deze client..."
                                value={feedbackText[ci.id] || ""}
                                onChange={(e) => setFeedbackText((prev) => ({ ...prev, [ci.id]: e.target.value }))}
                                className="text-sm min-h-[60px]"
                              />
                              <Button
                                size="sm"
                                onClick={() => handleFeedback(ci.id, "weekly")}
                                disabled={!feedbackText[ci.id]?.trim() || feedbackSending === ci.id}
                                className="bg-[#1e1839] hover:bg-[#2a2054] self-end"
                              >
                                <Send className="w-4 h-4" />
                              </Button>
                            </div>
                            <Link
                              href={`/coach/dashboard/clients/${client.id}`}
                              className="text-xs text-[#1e1839] hover:underline font-medium"
                            >
                              Bekijk volledig profiel →
                            </Link>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-orange-500" />
              Nog niet ingevuld deze week ({clientsWithoutWeeklyThisWeek.length})
            </h3>
            <div className="space-y-2">
              {clientsWithoutWeeklyThisWeek.map((client) => (
                <Card key={client.id} className="bg-white border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-sm font-semibold text-orange-700">
                          {(client.raw_user_meta_data?.full_name?.[0] || client.email[0]).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {client.raw_user_meta_data?.full_name || client.email}
                          </p>
                          <p className="text-xs text-gray-400">
                            {client.latestCheckIn
                              ? `Laatste: Week ${client.latestCheckIn.week_number}`
                              : "Nog nooit ingecheckt"}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/coach/dashboard/clients/${client.id}`}
                        className="text-xs text-[#1e1839] hover:underline font-medium"
                      >
                        Bekijk →
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
