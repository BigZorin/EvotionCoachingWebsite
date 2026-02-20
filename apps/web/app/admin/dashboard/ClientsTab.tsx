"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  getClients, getClientCheckIns, approveClient, rejectClient, assignCoachToClient, unassignCoach, getCoaches,
  type ClientWithStats, type CheckIn, type CoachOption,
} from "@/app/actions/admin-clients"
import {
  Users,
  XCircle,
  Search,
  Mail,
  Activity,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  Dumbbell,
  UserX,
  X,
  CalendarDays,
  Loader2,
  AlertTriangle,
} from "lucide-react"

type StatusFilter = "all" | "pending" | "approved" | "rejected"

export default function ClientsTab() {
  const [clients, setClients] = useState<ClientWithStats[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [coachFilter, setCoachFilter] = useState<string>("all")
  const [clientCheckIns, setClientCheckIns] = useState<Record<string, CheckIn[]>>({})
  const [expandedClients, setExpandedClients] = useState<Set<string>>(new Set())
  const [coaches, setCoaches] = useState<CoachOption[]>([])
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [rejectInputId, setRejectInputId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState("")

  useEffect(() => {
    loadClients()
    loadCoaches()
  }, [])

  const loadClients = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await getClients()
      if (result.success && result.clients) setClients(result.clients)
      else if (result.error) setError(result.error)
    } catch (error: any) {
      setError(error.message || "Er is een fout opgetreden")
    } finally {
      setIsLoading(false)
    }
  }

  const loadCoaches = async () => {
    const result = await getCoaches()
    if (result.success && result.coaches) setCoaches(result.coaches)
  }

  const loadClientCheckIns = async (userId: string) => {
    if (clientCheckIns[userId]) return
    try {
      const result = await getClientCheckIns(userId)
      if (result.success && result.checkIns) {
        setClientCheckIns((prev) => ({ ...prev, [userId]: result.checkIns! }))
      }
    } catch (error) {
      console.error("Error loading check-ins:", error)
    }
  }

  const toggleClientExpanded = async (userId: string) => {
    const newExpanded = new Set(expandedClients)
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId)
    } else {
      newExpanded.add(userId)
      await loadClientCheckIns(userId)
    }
    setExpandedClients(newExpanded)
  }

  const handleApprove = async (clientId: string) => {
    setActionLoading(clientId)
    const result = await approveClient(clientId)
    if (result.success) setClients(prev => prev.map(c => c.id === clientId ? { ...c, client_status: "approved" } : c))
    setActionLoading(null)
  }

  const handleReject = async (clientId: string) => {
    setActionLoading(clientId)
    const result = await rejectClient(clientId, rejectReason || undefined)
    if (result.success) {
      setClients(prev => prev.map(c => c.id === clientId ? { ...c, client_status: "rejected" } : c))
      setRejectInputId(null)
      setRejectReason("")
    }
    setActionLoading(null)
  }

  const handleAssignCoach = async (clientId: string, coachId: string) => {
    setActionLoading(clientId)
    if (coachId === "__none__") {
      const result = await unassignCoach(clientId)
      if (result.success) {
        setClients(prev => prev.map(c => c.id === clientId ? { ...c, assigned_coach_id: null, assigned_coach_name: null } : c))
      }
    } else {
      const result = await assignCoachToClient(clientId, coachId)
      if (result.success) {
        const coach = coaches.find(c => c.id === coachId)
        setClients(prev => prev.map(c => c.id === clientId
          ? { ...c, assigned_coach_id: coachId, assigned_coach_name: coach?.full_name || coach?.email || "Coach" }
          : c
        ))
      }
    }
    setActionLoading(null)
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })

  const filtered = clients.filter(client => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      if (!client.email.toLowerCase().includes(q) && !client.raw_user_meta_data?.full_name?.toLowerCase().includes(q)) return false
    }
    if (statusFilter === "pending" && client.client_status !== "pending") return false
    if (statusFilter === "approved" && client.client_status !== "approved" && client.client_status !== null) return false
    if (statusFilter === "rejected" && client.client_status !== "rejected") return false
    if (coachFilter === "unassigned" && client.assigned_coach_id) return false
    else if (coachFilter !== "all" && coachFilter !== "unassigned" && client.assigned_coach_id !== coachFilter) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    const order: Record<string, number> = { pending: 0, rejected: 1, approved: 2 }
    return (order[a.client_status || "approved"] ?? 2) - (order[b.client_status || "approved"] ?? 2)
  })

  const pendingCount = clients.filter(c => c.client_status === "pending").length
  const approvedCount = clients.filter(c => c.client_status === "approved" || !c.client_status).length
  const rejectedCount = clients.filter(c => c.client_status === "rejected").length
  const unassignedCount = clients.filter(c => !c.assigned_coach_id).length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Clients laden...</span>
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
        <Button onClick={loadClients} variant="outline" size="sm">Opnieuw proberen</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold">Clients</h2>
        <p className="text-xs text-muted-foreground">Goedkeuring, afwijzing en coach toewijzing</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {[
          { label: "Totaal", waarde: clients.length, icon: Users },
          { label: "Wachtrij", waarde: pendingCount, icon: Clock, kleur: pendingCount > 0 ? "text-amber-600" : undefined },
          { label: "Goedgekeurd", waarde: approvedCount, icon: CheckCircle2, kleur: "text-emerald-600" },
          { label: "Afgewezen", waarde: rejectedCount, icon: XCircle, kleur: "text-destructive" },
          { label: "Zonder Coach", waarde: unassignedCount, icon: AlertTriangle, kleur: unassignedCount > 0 ? "text-amber-600" : undefined },
        ].map((kpi) => (
          <Card key={kpi.label} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <kpi.icon className={`size-4 ${kpi.kleur || "text-muted-foreground"}`} />
                <span className="text-xs text-muted-foreground">{kpi.label}</span>
              </div>
              <p className={`text-2xl font-bold ${kpi.kleur || ""}`}>{kpi.waarde}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coach Distribution */}
      {coaches.length > 0 && (
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Coach verdeling</p>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setCoachFilter("all")} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${coachFilter === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                Alle coaches
              </button>
              {coaches.map((coach) => {
                const count = clients.filter(c => c.assigned_coach_id === coach.id).length
                return (
                  <button key={coach.id} onClick={() => setCoachFilter(coachFilter === coach.id ? "all" : coach.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${coachFilter === coach.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                    <Dumbbell className="size-3" />{coach.full_name || coach.email}
                    <Badge variant="outline" className="text-[9px] h-4 px-1 ml-0.5">{count}</Badge>
                  </button>
                )
              })}
              <button onClick={() => setCoachFilter(coachFilter === "unassigned" ? "all" : "unassigned")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${coachFilter === "unassigned" ? "bg-destructive text-destructive-foreground" : "bg-destructive/5 text-destructive hover:bg-destructive/10"}`}>
                <AlertTriangle className="size-3" />Niet toegewezen
                <Badge variant="outline" className="text-[9px] h-4 px-1 ml-0.5 border-destructive/20 text-destructive">{unassignedCount}</Badge>
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search + Filter */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="Zoek op naam of email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
            </div>
            <div className="flex gap-1.5">
              {([
                { value: "all" as StatusFilter, label: "Alle", count: clients.length },
                { value: "pending" as StatusFilter, label: "Wachtrij", count: pendingCount },
                { value: "approved" as StatusFilter, label: "Goedgekeurd", count: approvedCount },
                { value: "rejected" as StatusFilter, label: "Afgewezen", count: rejectedCount },
              ]).map((f) => (
                <button key={f.value} onClick={() => setStatusFilter(f.value)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${statusFilter === f.value ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                  {f.label} ({f.count})
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client List */}
      <Card className="shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Clients ({sorted.length})</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Beheer clients, goedkeuring en coach toewijzing</p>

          <div className="flex flex-col gap-1">
            {sorted.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="size-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">Geen clients gevonden</p>
              </div>
            ) : sorted.map((client) => {
              const isExpanded = expandedClients.has(client.id)
              const checkIns = clientCheckIns[client.id] || []
              const isActioning = actionLoading === client.id
              const initials = (client.raw_user_meta_data?.full_name || client.email)[0].toUpperCase()
              const status = (client.client_status || "approved") as string
              const statusLabels: Record<string, { label: string; kleur: string }> = {
                pending: { label: "Wachtrij", kleur: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
                approved: { label: "Goedgekeurd", kleur: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
                rejected: { label: "Afgewezen", kleur: "bg-destructive/10 text-destructive border-destructive/20" },
              }
              const cfg = statusLabels[status] || statusLabels.approved

              return (
                <div key={client.id} className="rounded-lg border hover:bg-secondary/30 transition-colors">
                  <div className="flex items-center justify-between py-3 px-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9 border border-border">
                        <AvatarFallback className="bg-secondary text-foreground text-xs font-semibold">{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium">{client.raw_user_meta_data?.full_name || "Naamloos"}</p>
                          <Badge variant="outline" className={`text-[10px] border ${cfg.kleur}`}>{cfg.label}</Badge>
                          {client.assigned_coach_name ? (
                            <Badge variant="outline" className="text-[10px] border-primary/20 text-primary bg-primary/5">
                              <Dumbbell className="size-2.5 mr-1" />{client.assigned_coach_name}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] border-amber-500/20 text-amber-600 bg-amber-500/5">
                              <UserX className="size-2.5 mr-1" />Geen coach
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                          <span className="flex items-center gap-1"><Mail className="size-3" />{client.email}</span>
                          <span className="flex items-center gap-1"><CalendarDays className="size-3" />{formatDate(client.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <select value={client.assigned_coach_id || ""} onChange={(e) => { if (e.target.value) handleAssignCoach(client.id, e.target.value) }} disabled={isActioning} className="text-xs bg-card border rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50">
                        <option value="">{client.assigned_coach_id ? "Wijzig coach..." : "Coach toewijzen..."}</option>
                        {client.assigned_coach_id && <option value="__none__">Geen coach</option>}
                        {coaches.map(c => <option key={c.id} value={c.id}>{c.full_name || c.email}</option>)}
                      </select>

                      {client.client_status === "pending" && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => setRejectInputId(rejectInputId === client.id ? null : client.id)} disabled={isActioning} className="h-7 text-xs border-destructive/30 text-destructive hover:bg-destructive/5">Afwijzen</Button>
                          <Button size="sm" onClick={() => handleApprove(client.id)} disabled={isActioning} className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white">Goedkeuren</Button>
                        </>
                      )}
                      {client.client_status === "rejected" && (
                        <Button size="sm" onClick={() => handleApprove(client.id)} disabled={isActioning} className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white">Alsnog goedkeuren</Button>
                      )}
                      <button onClick={() => toggleClientExpanded(client.id)} className="p-1.5 text-muted-foreground hover:text-foreground transition">
                        {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                      </button>
                    </div>
                  </div>

                  {rejectInputId === client.id && (
                    <div className="flex items-center gap-2 px-3 pb-3 ml-12">
                      <input type="text" placeholder="Reden voor afwijzing (optioneel)..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} className="flex-1 px-2.5 py-1.5 text-xs border border-destructive/30 rounded-md bg-background focus:ring-1 focus:ring-destructive/20 outline-none" />
                      <Button size="sm" variant="destructive" onClick={() => handleReject(client.id)} disabled={isActioning} className="h-7 text-xs">Bevestig</Button>
                      <button onClick={() => { setRejectInputId(null); setRejectReason("") }} className="p-1 text-muted-foreground hover:text-foreground"><X className="size-3.5" /></button>
                    </div>
                  )}

                  {isExpanded && (
                    <div className="px-3 pb-3 border-t border-border/50 mt-1">
                      <div className="mt-3 space-y-2">
                        {checkIns.length > 0 ? checkIns.map((checkIn) => (
                          <div key={checkIn.id} className="p-3 bg-secondary/50 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="text-sm font-medium">Week {checkIn.week_number}, {checkIn.year}</p>
                                <p className="text-[11px] text-muted-foreground">{formatDate(checkIn.created_at)}</p>
                              </div>
                              {checkIn.weight && <Badge variant="outline" className="text-xs">{checkIn.weight}kg</Badge>}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {checkIn.feeling !== null && <div className="text-xs"><span className="text-muted-foreground">Gevoel:</span> <span className="font-medium">{checkIn.feeling}/10</span></div>}
                              {checkIn.energy_level !== null && <div className="text-xs"><span className="text-muted-foreground">Energie:</span> <span className="font-medium">{checkIn.energy_level}/10</span></div>}
                              {checkIn.sleep_quality !== null && <div className="text-xs"><span className="text-muted-foreground">Slaap:</span> <span className="font-medium">{checkIn.sleep_quality}/10</span></div>}
                              {checkIn.stress_level !== null && <div className="text-xs"><span className="text-muted-foreground">Stress:</span> <span className="font-medium">{checkIn.stress_level}/10</span></div>}
                            </div>
                            {checkIn.notes && (
                              <div className="mt-2 pt-2 border-t border-border/50">
                                <p className="text-xs text-muted-foreground">{checkIn.notes}</p>
                              </div>
                            )}
                          </div>
                        )) : (
                          <div className="text-center py-6">
                            <Activity className="size-6 text-muted-foreground/30 mx-auto mb-2" />
                            <p className="text-xs text-muted-foreground">Nog geen check-ins</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
