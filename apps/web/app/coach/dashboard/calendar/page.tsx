"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Video,
  MapPin,
  Calendar,
  Settings,
  ExternalLink,
  Check,
  Clock,
  Users,
  RefreshCw,
  X,
  LinkIcon,
  Loader2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

import {
  getCoachSessions,
  createSession,
  updateSessionStatus,
  deleteSession,
  getCoachAvailability,
  updateCoachAvailability,
  getWeekStats,
  type ClientSession,
  type AvailabilitySlot,
  type WeekStats,
  type SessionType,
  type SessionMode,
} from "@/app/actions/scheduling"
import { getClients } from "@/app/actions/admin-clients"

// ============================================================================
// DATE HELPERS
// ============================================================================

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function getMondayOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })
}

// ============================================================================
// CONSTANTS
// ============================================================================

const dagen = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"]

const tijdslots = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
]

const dagNamen: Record<number, string> = {
  0: "Zondag",
  1: "Maandag",
  2: "Dinsdag",
  3: "Woensdag",
  4: "Donderdag",
  5: "Vrijdag",
  6: "Zaterdag",
}

const maandNamen = [
  "Januari",
  "Februari",
  "Maart",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Augustus",
  "September",
  "Oktober",
  "November",
  "December",
]

const typeLabels: Record<SessionType, string> = {
  pt_session: "PT Sessie",
  video_call: "Video Call",
  check_in_gesprek: "Check-in gesprek",
  programma_review: "Programma review",
}

const statusLabels: Record<string, string> = {
  scheduled: "gepland",
  confirmed: "bevestigd",
  completed: "voltooid",
  no_show: "no-show",
  cancelled: "geannuleerd",
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function CalendarPage() {
  // Dialog states
  const [beschikbaarheidOpen, setBeschikbaarheidOpen] = useState(false)
  const [gcalDialogOpen, setGcalDialogOpen] = useState(false)
  const [gcalVerbonden, setGcalVerbonden] = useState(false)
  const [nieuweSessieOpen, setNieuweSessieOpen] = useState(false)

  // Data state
  const [sessions, setSessions] = useState<ClientSession[]>([])
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([])
  const [weekStats, setWeekStats] = useState<WeekStats | null>(null)
  const [clients, setClients] = useState<
    Array<{ id: string; name: string; initials: string }>
  >([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    getMondayOfWeek(new Date())
  )

  // New session form state
  const [newSessionType, setNewSessionType] =
    useState<SessionType>("pt_session")
  const [newSessionClient, setNewSessionClient] = useState("")
  const [newSessionDate, setNewSessionDate] = useState("")
  const [newSessionTime, setNewSessionTime] = useState("")
  const [newSessionDuration, setNewSessionDuration] = useState("60")
  const [newSessionSaving, setNewSessionSaving] = useState(false)

  // Availability form state
  const [availabilityForm, setAvailabilityForm] = useState<
    Array<{
      dag: string
      dayOfWeek: number
      start: string
      eind: string
      actief: boolean
    }>
  >([
    { dag: "Maandag", dayOfWeek: 1, start: "08:00", eind: "18:00", actief: true },
    { dag: "Dinsdag", dayOfWeek: 2, start: "08:00", eind: "18:00", actief: true },
    { dag: "Woensdag", dayOfWeek: 3, start: "08:00", eind: "18:00", actief: true },
    { dag: "Donderdag", dayOfWeek: 4, start: "08:00", eind: "17:00", actief: true },
    { dag: "Vrijdag", dayOfWeek: 5, start: "09:00", eind: "15:00", actief: true },
    { dag: "Zaterdag", dayOfWeek: 6, start: "09:00", eind: "12:00", actief: false },
    { dag: "Zondag", dayOfWeek: 0, start: "", eind: "", actief: false },
  ])
  const [availabilitySaving, setAvailabilitySaving] = useState(false)

  // Computed: week dates (Ma-Zo) from currentWeekStart
  const weekDates: Date[] = Array.from({ length: 7 }, (_, i) =>
    addDays(currentWeekStart, i)
  )
  const datums = weekDates.map((d) => d.getDate())

  // Computed: which day index is today (0=Ma .. 6=Zo), or -1 if not in this week
  const today = new Date()
  const huidigeDag = weekDates.findIndex((d) => isSameDay(d, today))

  // Computed: month/year display
  const firstMonth = currentWeekStart.getMonth()
  const lastMonth = weekDates[6].getMonth()
  const firstYear = currentWeekStart.getFullYear()
  const lastYear = weekDates[6].getFullYear()
  const monthYearLabel =
    firstMonth === lastMonth
      ? `${maandNamen[firstMonth]} ${firstYear}`
      : firstYear === lastYear
        ? `${maandNamen[firstMonth]} / ${maandNamen[lastMonth]} ${firstYear}`
        : `${maandNamen[firstMonth]} ${firstYear} / ${maandNamen[lastMonth]} ${lastYear}`

  // Computed: today's agenda (sessions for today, sorted)
  const todaySessions = sessions
    .filter((s) => {
      const d = new Date(s.start_time)
      return isSameDay(d, today)
    })
    .sort(
      (a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    )

  // Computed: today display label
  const todayDagNaam = dagNamen[today.getDay()]
  const todayLabel = `${todayDagNaam}, ${today.getDate()} ${maandNamen[today.getMonth()].substring(0, 3).toLowerCase()}`

  // ================================================================
  // DATA LOADING
  // ================================================================

  const loadWeekData = useCallback(async () => {
    setIsLoading(true)
    const weekStartStr = currentWeekStart.toISOString()

    const [sessionsRes, availRes, statsRes, clientsRes] = await Promise.all([
      getCoachSessions(weekStartStr),
      getCoachAvailability(),
      getWeekStats(weekStartStr),
      getClients(),
    ])

    if (sessionsRes.success && sessionsRes.data) {
      setSessions(sessionsRes.data)
    } else {
      setSessions([])
    }

    if (availRes.success && availRes.data) {
      setAvailability(availRes.data)
      // Build availability form from DB data
      const dayMap = new Map(
        availRes.data.map((slot) => [slot.day_of_week, slot])
      )
      setAvailabilityForm((prev) =>
        prev.map((row) => {
          const slot = dayMap.get(row.dayOfWeek)
          if (slot) {
            return {
              ...row,
              start: slot.start_time,
              eind: slot.end_time,
              actief: slot.active,
            }
          }
          return row
        })
      )
    }

    if (statsRes.success && statsRes.data) {
      setWeekStats(statsRes.data)
    } else {
      setWeekStats(null)
    }

    if (clientsRes.success && clientsRes.clients) {
      setClients(
        clientsRes.clients.map((c) => {
          const name =
            c.raw_user_meta_data?.full_name || c.email || "Naamloos"
          const parts = name.split(" ")
          const initials = (
            (parts[0]?.[0] || "") + (parts[parts.length - 1]?.[0] || "")
          ).toUpperCase()
          return { id: c.id, name, initials }
        })
      )
    }

    setIsLoading(false)
  }, [currentWeekStart])

  useEffect(() => {
    loadWeekData()
  }, [loadWeekData])

  // ================================================================
  // HANDLERS
  // ================================================================

  function goToPreviousWeek() {
    setCurrentWeekStart((prev) => addDays(prev, -7))
  }

  function goToNextWeek() {
    setCurrentWeekStart((prev) => addDays(prev, 7))
  }

  function goToToday() {
    setCurrentWeekStart(getMondayOfWeek(new Date()))
  }

  async function handleCreateSession() {
    if (!newSessionClient || !newSessionDate || !newSessionTime) return
    setNewSessionSaving(true)

    const startDateTime = new Date(`${newSessionDate}T${newSessionTime}:00`)
    const durationMs = parseInt(newSessionDuration) * 60 * 1000
    const endDateTime = new Date(startDateTime.getTime() + durationMs)

    const mode: SessionMode =
      newSessionType === "video_call" ? "video" : "in_person"

    const result = await createSession({
      clientId: newSessionClient,
      type: newSessionType,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      mode,
    })

    setNewSessionSaving(false)

    if (result.success) {
      setNieuweSessieOpen(false)
      // Reset form
      setNewSessionType("pt_session")
      setNewSessionClient("")
      setNewSessionDate("")
      setNewSessionTime("")
      setNewSessionDuration("60")
      // Reload data
      await loadWeekData()
    }
  }

  async function handleSaveAvailability() {
    setAvailabilitySaving(true)

    const slots = availabilityForm.map((row) => ({
      dayOfWeek: row.dayOfWeek,
      startTime: row.start || "08:00",
      endTime: row.eind || "18:00",
      active: row.actief,
    }))

    await updateCoachAvailability(slots)
    setAvailabilitySaving(false)
    setBeschikbaarheidOpen(false)
    // Reload to confirm
    await loadWeekData()
  }

  // ================================================================
  // SESSION -> GRID MAPPING HELPERS
  // ================================================================

  function getSessionForSlot(dagIdx: number, tijdIdx: number) {
    const slotDate = weekDates[dagIdx]
    if (!slotDate) return null

    const slotHour = 7 + tijdIdx // tijdslots start at 07:00

    return sessions.find((s) => {
      const start = new Date(s.start_time)
      if (!isSameDay(start, slotDate)) return false
      return start.getHours() === slotHour && start.getMinutes() < 30
    })
  }

  function getSessionGridProps(session: ClientSession) {
    const start = new Date(session.start_time)
    const end = new Date(session.end_time)
    const durationHours = (end.getTime() - start.getTime()) / 3600000
    // Each time slot is 64px high (h-16)
    const heightSlots = Math.max(durationHours, 0.5)
    const heightPx = heightSlots * 64 - 4

    const isVideo =
      session.mode === "video" || session.type === "video_call"
    const kleur = isVideo
      ? "bg-violet-500/15 border-violet-500/30 text-violet-600"
      : "bg-orange-500/15 border-orange-500/30 text-orange-600"

    return { heightPx, isVideo, kleur }
  }

  // ================================================================
  // RENDER
  // ================================================================

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Agenda</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Beheer je sessies, beschikbaarheid en kalenderkoppeling
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => setBeschikbaarheidOpen(true)}
          >
            <Clock className="size-3.5" />
            Beschikbaarheid
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`gap-1.5 text-xs ${gcalVerbonden ? "border-emerald-500/30 text-emerald-600" : ""}`}
            onClick={() => setGcalDialogOpen(true)}
          >
            <Calendar className="size-3.5" />
            {gcalVerbonden ? "Google Calendar" : "Koppel Agenda"}
            {gcalVerbonden && <Check className="size-3" />}
          </Button>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 text-xs"
            size="sm"
            onClick={() => setNieuweSessieOpen(true)}
          >
            <Plus className="size-3.5" />
            Nieuwe sessie
          </Button>
        </div>
      </div>

      {/* Google Calendar banner als nog niet verbonden */}
      {!gcalVerbonden && (
        <Card className="border-primary/20 bg-primary/[0.03] p-0 gap-0 overflow-hidden">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Calendar className="size-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                Verbind je Google Calendar
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Synchroniseer sessies twee-weg en laat clienten alleen boeken
                wanneer je beschikbaar bent.
              </p>
            </div>
            <Button
              size="sm"
              className="gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
              onClick={() => setGcalDialogOpen(true)}
            >
              <LinkIcon className="size-3.5" />
              Verbinden
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground shrink-0"
            >
              <X className="size-3.5" />
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        {/* Kalender grid -- 3/4 breedte */}
        <Card className="border-border shadow-sm xl:col-span-3 overflow-hidden p-0 gap-0">
          <CardHeader className="pb-0 pt-4 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-foreground">
                {monthYearLabel}
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={goToPreviousWeek}
                >
                  <ChevronLeft className="size-4" />
                  <span className="sr-only">Vorige week</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs border-border"
                  onClick={goToToday}
                >
                  Vandaag
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={goToNextWeek}
                >
                  <ChevronRight className="size-4" />
                  <span className="sr-only">Volgende week</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-3">
            {/* Dag headers */}
            <div className="grid grid-cols-8 border-b border-border">
              <div className="p-2" />
              {dagen.map((dag, i) => (
                <div
                  key={dag}
                  className={`flex flex-col items-center gap-0.5 p-2 ${i === huidigeDag ? "bg-primary/5" : ""}`}
                >
                  <span className="text-[11px] text-muted-foreground font-medium uppercase">
                    {dag}
                  </span>
                  <span
                    className={`text-sm font-semibold flex items-center justify-center size-7 rounded-full ${
                      i === huidigeDag
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {datums[i]}
                  </span>
                </div>
              ))}
            </div>
            {/* Tijdgrid */}
            <div className="max-h-[480px] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="grid grid-cols-8">
                  {tijdslots.map((tijd, tijdIdx) => (
                    <div key={tijd} className="contents">
                      <div className="flex items-start justify-end pr-2 pt-1 h-16 border-b border-border/50">
                        <span className="text-[11px] text-muted-foreground">
                          {tijd}
                        </span>
                      </div>
                      {dagen.map((_, dagIdx) => {
                        const sessie = getSessionForSlot(dagIdx, tijdIdx)
                        return (
                          <div
                            key={`${tijd}-${dagIdx}`}
                            className={`relative h-16 border-b border-r border-border/50 ${
                              dagIdx === huidigeDag ? "bg-primary/[0.02]" : ""
                            }`}
                          >
                            {sessie && (() => {
                              const { heightPx, isVideo, kleur } =
                                getSessionGridProps(sessie)
                              return (
                                <div
                                  className={`absolute inset-x-0.5 top-0.5 rounded-md border px-2 py-1 cursor-pointer hover:opacity-90 transition-opacity ${kleur}`}
                                  style={{
                                    height: `${heightPx}px`,
                                  }}
                                >
                                  <div className="flex items-center gap-1">
                                    {isVideo ? (
                                      <Video className="size-2.5 shrink-0" />
                                    ) : (
                                      <MapPin className="size-2.5 shrink-0" />
                                    )}
                                    <p className="text-[11px] font-semibold truncate">
                                      {sessie.client_name}
                                    </p>
                                  </div>
                                  <p className="text-[10px] opacity-75 truncate">
                                    {formatTime(sessie.start_time)} -{" "}
                                    {formatTime(sessie.end_time)}
                                  </p>
                                </div>
                              )
                            })()}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Rechter kolom -- 1/4 breedte */}
        <div className="flex flex-col gap-4">
          {/* Agenda vandaag */}
          <Card className="border-border shadow-sm p-0 gap-0">
            <CardHeader className="pb-3 px-4 pt-4">
              <CardTitle className="text-sm font-semibold text-foreground">
                Vandaag
              </CardTitle>
              <p className="text-xs text-muted-foreground">{todayLabel}</p>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="size-5 animate-spin text-muted-foreground" />
                </div>
              ) : todaySessions.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">
                  Geen sessies vandaag
                </p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {todaySessions.map((sessie) => {
                    const isVideo =
                      sessie.mode === "video" ||
                      sessie.type === "video_call"
                    return (
                      <div
                        key={sessie.id}
                        className="flex items-center gap-3 rounded-lg border border-border p-2.5 hover:border-primary/30 transition-colors cursor-pointer"
                      >
                        <div
                          className={`size-8 rounded-md flex items-center justify-center shrink-0 ${
                            isVideo ? "bg-primary/10" : "bg-orange-500/10"
                          }`}
                        >
                          {isVideo ? (
                            <Video className="size-3.5 text-primary" />
                          ) : (
                            <MapPin className="size-3.5 text-orange-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">
                            {sessie.client_name}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {typeLabels[sessie.type] || sessie.type}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-0.5">
                          <span className="text-xs font-medium text-foreground">
                            {formatTime(sessie.start_time)}
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-[9px] px-1.5 py-0 ${
                              sessie.status === "confirmed"
                                ? "border-emerald-500/30 text-emerald-600"
                                : sessie.status === "completed"
                                  ? "border-emerald-500/30 text-emerald-600"
                                  : "border-border text-muted-foreground"
                            }`}
                          >
                            {statusLabels[sessie.status] || sessie.status}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Week statistieken */}
          <Card className="border-border shadow-sm p-0 gap-0">
            <CardHeader className="pb-3 px-4 pt-4">
              <CardTitle className="text-sm font-semibold text-foreground">
                Deze week
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="size-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Totaal sessies
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {weekStats?.totalSessions ?? 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      PT Sessies
                    </span>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="size-3 text-orange-500" />
                      <span className="text-sm font-semibold text-foreground">
                        {weekStats?.byType?.pt_session ?? 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Video Calls
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Video className="size-3 text-primary" />
                      <span className="text-sm font-semibold text-foreground">
                        {weekStats?.byType?.video_call ?? 0}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-border pt-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Opkomst
                    </span>
                    <span className="text-sm font-semibold text-emerald-600">
                      {weekStats?.attendanceRate ?? 100}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      No-shows
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {weekStats?.noShows ?? 0}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Google Calendar status kaart (alleen als verbonden) */}
          {gcalVerbonden && (
            <Card className="border-border shadow-sm p-0 gap-0">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="size-8 rounded-md bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Calendar className="size-4 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground">
                    Google Calendar
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Laatste sync: 2 min geleden
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground hover:text-foreground"
                  onClick={() => setGcalDialogOpen(true)}
                >
                  <Settings className="size-3.5" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* ============================================================= */}
      {/* Google Calendar koppeling dialog                              */}
      {/* ============================================================= */}
      <Dialog open={gcalDialogOpen} onOpenChange={setGcalDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">
              Google Calendar koppeling
            </DialogTitle>
            <DialogDescription className="text-sm">
              Verbind je Google Calendar voor twee-weg synchronisatie. Sessies
              verschijnen automatisch in beide agenda{"'"}s.
            </DialogDescription>
          </DialogHeader>

          {!gcalVerbonden ? (
            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <RefreshCw className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Twee-weg sync
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Sessies worden automatisch naar Google Calendar gestuurd en
                      bezette tijden uit GCal worden geblokkeerd.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Slimme beschikbaarheid
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Clienten zien alleen vrije tijdslots op basis van je
                      beschikbaarheid en Google Calendar.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                className="w-full gap-2 bg-foreground text-background hover:bg-foreground/90"
                onClick={() => {
                  // Placeholder: hier komt de OAuth2 redirect naar Google
                  setGcalVerbonden(true)
                  setGcalDialogOpen(false)
                }}
              >
                <svg className="size-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Verbind met Google
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 py-2">
              <div className="flex items-center gap-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3">
                <Check className="size-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Verbonden
                  </p>
                  <p className="text-xs text-muted-foreground">
                    coach@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">
                    Sync nieuwe sessies
                  </span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">
                    Blokkeer GCal events
                  </span>
                  <Switch defaultChecked />
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
                onClick={() => {
                  setGcalVerbonden(false)
                  setGcalDialogOpen(false)
                }}
              >
                Ontkoppelen
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ============================================================= */}
      {/* Beschikbaarheid dialog                                        */}
      {/* ============================================================= */}
      <Dialog
        open={beschikbaarheidOpen}
        onOpenChange={setBeschikbaarheidOpen}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base">
              Beschikbaarheid instellen
            </DialogTitle>
            <DialogDescription className="text-sm">
              Stel je wekelijkse beschikbare uren in. Clienten kunnen alleen
              boeken binnen deze tijden.
              {gcalVerbonden &&
                " Bezette tijden in Google Calendar worden automatisch geblokkeerd."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2 py-2">
            {availabilityForm.map((dag, idx) => (
              <div key={dag.dag} className="flex items-center gap-3">
                <div className="w-24 shrink-0">
                  <span
                    className={`text-sm ${dag.actief ? "font-medium text-foreground" : "text-muted-foreground"}`}
                  >
                    {dag.dag}
                  </span>
                </div>
                <Switch
                  checked={dag.actief}
                  onCheckedChange={(checked) => {
                    setAvailabilityForm((prev) => {
                      const next = [...prev]
                      next[idx] = { ...next[idx], actief: checked }
                      return next
                    })
                  }}
                />
                {dag.actief ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      type="time"
                      value={dag.start}
                      onChange={(e) => {
                        setAvailabilityForm((prev) => {
                          const next = [...prev]
                          next[idx] = { ...next[idx], start: e.target.value }
                          return next
                        })
                      }}
                      className="h-8 text-xs w-28"
                    />
                    <span className="text-xs text-muted-foreground">tot</span>
                    <Input
                      type="time"
                      value={dag.eind}
                      onChange={(e) => {
                        setAvailabilityForm((prev) => {
                          const next = [...prev]
                          next[idx] = { ...next[idx], eind: e.target.value }
                          return next
                        })
                      }}
                      className="h-8 text-xs w-28"
                    />
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Niet beschikbaar
                  </span>
                )}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBeschikbaarheidOpen(false)}
            >
              Annuleren
            </Button>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleSaveAvailability}
              disabled={availabilitySaving}
            >
              {availabilitySaving ? (
                <Loader2 className="size-3.5 animate-spin mr-1.5" />
              ) : null}
              Opslaan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============================================================= */}
      {/* Nieuwe sessie dialog                                          */}
      {/* ============================================================= */}
      <Dialog open={nieuweSessieOpen} onOpenChange={setNieuweSessieOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">
              Nieuwe sessie plannen
            </DialogTitle>
            <DialogDescription className="text-sm">
              Plan een PT sessie of video call met een client.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">
                Type sessie
              </label>
              <Select
                value={newSessionType}
                onValueChange={(v) => setNewSessionType(v as SessionType)}
              >
                <SelectTrigger className="text-sm h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt_session">
                    <div className="flex items-center gap-2">
                      <MapPin className="size-3.5 text-orange-500" />
                      PT Sessie (fysiek)
                    </div>
                  </SelectItem>
                  <SelectItem value="video_call">
                    <div className="flex items-center gap-2">
                      <Video className="size-3.5 text-primary" />
                      Video Call (online)
                    </div>
                  </SelectItem>
                  <SelectItem value="check_in_gesprek">
                    <div className="flex items-center gap-2">
                      <Users className="size-3.5 text-primary" />
                      Check-in gesprek
                    </div>
                  </SelectItem>
                  <SelectItem value="programma_review">
                    <div className="flex items-center gap-2">
                      <Clock className="size-3.5 text-primary" />
                      Programma review
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">
                Client
              </label>
              <Select
                value={newSessionClient}
                onValueChange={setNewSessionClient}
              >
                <SelectTrigger className="text-sm h-9">
                  <SelectValue placeholder="Selecteer een client..." />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                  {clients.length === 0 && (
                    <SelectItem value="_none" disabled>
                      Geen clienten gevonden
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">
                  Datum
                </label>
                <Input
                  type="date"
                  className="text-sm h-9"
                  value={newSessionDate}
                  onChange={(e) => setNewSessionDate(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">
                  Tijd
                </label>
                <Input
                  type="time"
                  className="text-sm h-9"
                  value={newSessionTime}
                  onChange={(e) => setNewSessionTime(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">
                Duur
              </label>
              <Select
                value={newSessionDuration}
                onValueChange={setNewSessionDuration}
              >
                <SelectTrigger className="text-sm h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minuten</SelectItem>
                  <SelectItem value="45">45 minuten</SelectItem>
                  <SelectItem value="60">60 minuten</SelectItem>
                  <SelectItem value="90">90 minuten</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNieuweSessieOpen(false)}
            >
              Annuleren
            </Button>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleCreateSession}
              disabled={
                newSessionSaving ||
                !newSessionClient ||
                !newSessionDate ||
                !newSessionTime
              }
            >
              {newSessionSaving ? (
                <Loader2 className="size-3.5 animate-spin mr-1.5" />
              ) : null}
              Sessie inplannen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
