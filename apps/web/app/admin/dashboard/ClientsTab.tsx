"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  getClients, getClientCheckIns, approveClient, rejectClient, assignCoachToClient, unassignCoach, getCoaches,
  type ClientWithStats, type CheckIn, type CoachOption,
} from "@/app/actions/admin-clients"
import {
  Users,
  XCircle,
  Calendar,
  Search,
  Mail,
  Activity,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Hourglass,
  ShieldCheck,
  Dumbbell,
  UserX,
  X,
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
      if (result.success && result.clients) {
        setClients(result.clients)
      } else if (result.error) {
        setError(result.error)
      }
    } catch (error: any) {
      setError(error.message || "Er is een fout opgetreden bij het laden van clients")
    } finally {
      setIsLoading(false)
    }
  }

  const loadCoaches = async () => {
    const result = await getCoaches()
    if (result.success && result.coaches) {
      setCoaches(result.coaches)
    }
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
    if (result.success) {
      setClients(prev => prev.map(c => c.id === clientId ? { ...c, client_status: "approved" } : c))
    }
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
      // Unassign coach
      const result = await unassignCoach(clientId)
      if (result.success) {
        setClients(prev => prev.map(c =>
          c.id === clientId ? { ...c, assigned_coach_id: null, assigned_coach_name: null } : c
        ))
      } else {
        alert(`Coach verwijderen mislukt: ${result.error || "Onbekende fout"}`)
      }
    } else {
      const result = await assignCoachToClient(clientId, coachId)
      if (result.success) {
        const coach = coaches.find(c => c.id === coachId)
        const coachName = coach?.full_name || coach?.email || "Coach"
        setClients(prev => prev.map(c =>
          c.id === clientId ? { ...c, assigned_coach_id: coachId, assigned_coach_name: coachName } : c
        ))
      } else {
        alert(`Coach toewijzing mislukt: ${result.error || "Onbekende fout"}`)
      }
    }

    setActionLoading(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("nl-NL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  // Filtering
  const filtered = clients.filter(client => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      if (!client.email.toLowerCase().includes(q) && !client.raw_user_meta_data?.full_name?.toLowerCase().includes(q)) return false
    }
    if (statusFilter === "pending") { if (client.client_status !== "pending") return false }
    if (statusFilter === "approved") { if (client.client_status !== "approved" && client.client_status !== null) return false }
    if (statusFilter === "rejected") { if (client.client_status !== "rejected") return false }
    if (coachFilter === "unassigned") { if (client.assigned_coach_id) return false }
    else if (coachFilter !== "all") { if (client.assigned_coach_id !== coachFilter) return false }
    return true
  })

  // Sort: pending first
  const sorted = [...filtered].sort((a, b) => {
    const order: Record<string, number> = { pending: 0, rejected: 1, approved: 2 }
    const aOrder = order[a.client_status || "approved"] ?? 2
    const bOrder = order[b.client_status || "approved"] ?? 2
    return aOrder - bOrder
  })

  // Stats
  const pendingCount = clients.filter(c => c.client_status === "pending").length
  const approvedCount = clients.filter(c => c.client_status === "approved" || !c.client_status).length
  const rejectedCount = clients.filter(c => c.client_status === "rejected").length
  const unassignedCount = clients.filter(c => !c.assigned_coach_id).length

  // Coach distribution
  const coachDistribution = coaches.map(coach => ({
    ...coach,
    clientCount: clients.filter(c => c.assigned_coach_id === coach.id).length,
  }))

  const getStatusBadge = (status: string | null) => {
    if (status === "pending") return <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">Wachtrij</Badge>
    if (status === "rejected") return <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">Afgewezen</Badge>
    return <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">Goedgekeurd</Badge>
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1e1839]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="w-12 h-12 text-red-400 mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Er is een fout opgetreden</h3>
        <p className="text-sm text-gray-500 text-center max-w-md mb-4">{error}</p>
        <Button onClick={loadClients} size="sm" variant="outline">
          Opnieuw proberen
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-white border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-gray-400" />
              <p className="text-xs font-medium text-gray-500">Totaal</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{clients.length}</p>
          </CardContent>
        </Card>

        <Card
          className={`bg-white border shadow-sm cursor-pointer transition hover:shadow-md ${
            statusFilter === "pending" ? "ring-2 ring-purple-300 border-purple-200" : ""
          }`}
          onClick={() => setStatusFilter(statusFilter === "pending" ? "all" : "pending")}
        >
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <Hourglass className="w-4 h-4 text-purple-500" />
              <p className="text-xs font-medium text-gray-500">Wachtrij</p>
            </div>
            <p className={`text-3xl font-bold ${pendingCount > 0 ? "text-purple-600" : "text-gray-900"}`}>{pendingCount}</p>
          </CardContent>
        </Card>

        <Card className="bg-white border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <p className="text-xs font-medium text-gray-500">Goedgekeurd</p>
            </div>
            <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
          </CardContent>
        </Card>

        <Card className="bg-white border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-red-400" />
              <p className="text-xs font-medium text-gray-500">Afgewezen</p>
            </div>
            <p className="text-3xl font-bold text-red-500">{rejectedCount}</p>
          </CardContent>
        </Card>

        <Card
          className={`bg-white border shadow-sm cursor-pointer transition hover:shadow-md ${
            coachFilter === "unassigned" ? "ring-2 ring-amber-300 border-amber-200" : ""
          }`}
          onClick={() => setCoachFilter(coachFilter === "unassigned" ? "all" : "unassigned")}
        >
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <UserX className="w-4 h-4 text-amber-500" />
              <p className="text-xs font-medium text-gray-500">Zonder Coach</p>
            </div>
            <p className={`text-3xl font-bold ${unassignedCount > 0 ? "text-amber-600" : "text-gray-900"}`}>{unassignedCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Coach Distribution */}
      {coachDistribution.length > 0 && (
        <Card className="bg-white border shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-gray-500 mb-3">COACH VERDELING</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCoachFilter("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  coachFilter === "all"
                    ? "bg-[#1e1839] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Alle coaches
              </button>
              {coachDistribution.map(coach => (
                <button
                  key={coach.id}
                  onClick={() => setCoachFilter(coachFilter === coach.id ? "all" : coach.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1.5 ${
                    coachFilter === coach.id
                      ? "bg-blue-600 text-white"
                      : "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                  }`}
                >
                  <Dumbbell className="w-3 h-3" />
                  {coach.full_name || coach.email}
                  <span className={`ml-0.5 ${coachFilter === coach.id ? "text-blue-200" : "text-blue-400"}`}>
                    ({coach.clientCount})
                  </span>
                </button>
              ))}
              <button
                onClick={() => setCoachFilter(coachFilter === "unassigned" ? "all" : "unassigned")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1.5 ${
                  coachFilter === "unassigned"
                    ? "bg-amber-600 text-white"
                    : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                }`}
              >
                <UserX className="w-3 h-3" />
                Niet toegewezen
                <span className={`ml-0.5 ${coachFilter === "unassigned" ? "text-amber-200" : "text-amber-400"}`}>
                  ({unassignedCount})
                </span>
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search + Status Filter */}
      <Card className="bg-white border shadow-sm">
        <CardContent className="pt-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Zoek op naam of email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "pending", "approved", "rejected"] as StatusFilter[]).map(f => {
              const count = f === "all" ? clients.length
                : f === "pending" ? pendingCount
                : f === "approved" ? approvedCount
                : rejectedCount
              return (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    statusFilter === f
                      ? "bg-[#1e1839] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {f === "all" ? "Alle" : f === "pending" ? "Wachtrij" : f === "approved" ? "Goedgekeurd" : "Afgewezen"}
                  <span className="ml-1 opacity-70">({count})</span>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Clients List */}
      <Card className="bg-white border shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-400" />
            Clients ({sorted.length})
          </CardTitle>
          <CardDescription>Beheer clients, goedkeuring en coach toewijzing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sorted.length > 0 ? (
              sorted.map((client) => {
                const isExpanded = expandedClients.has(client.id)
                const checkIns = clientCheckIns[client.id] || []
                const isActioning = actionLoading === client.id

                return (
                  <div key={client.id} className="border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition">
                    {/* Client Row */}
                    <div className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold flex-shrink-0">
                          {client.raw_user_meta_data?.full_name?.[0]?.toUpperCase() || client.email[0].toUpperCase()}
                        </div>

                        {/* Client Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="text-gray-900 font-medium truncate">
                              {client.raw_user_meta_data?.full_name || "Naamloos"}
                            </h3>
                            {getStatusBadge(client.client_status)}
                            {/* Coach Badge - always visible */}
                            {client.assigned_coach_name ? (
                              <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs flex items-center gap-1">
                                <Dumbbell className="w-3 h-3" />
                                {client.assigned_coach_name}
                              </Badge>
                            ) : (
                              <Badge className="bg-amber-50 text-amber-600 border-amber-200 text-xs flex items-center gap-1">
                                <UserX className="w-3 h-3" />
                                Geen coach
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {client.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(client.created_at)}
                            </span>
                          </div>
                        </div>

                        {/* Coach Assignment Dropdown */}
                        <div className="flex-shrink-0">
                          <select
                            value={client.assigned_coach_id || ""}
                            onChange={(e) => {
                              if (e.target.value) handleAssignCoach(client.id, e.target.value)
                            }}
                            disabled={isActioning}
                            className="text-xs bg-white border border-gray-200 text-gray-700 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1e1839]/20 focus:border-[#1e1839] disabled:opacity-50"
                          >
                            <option value="">{client.assigned_coach_id ? "Wijzig coach..." : "Coach toewijzen..."}</option>
                            {client.assigned_coach_id && (
                              <option value="__none__">Geen coach (verwijder toewijzing)</option>
                            )}
                            {coaches.map(coach => (
                              <option key={coach.id} value={coach.id}>
                                {coach.full_name || coach.email}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {client.client_status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(client.id)}
                                disabled={isActioning}
                                className="px-3 py-1.5 text-xs bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 disabled:opacity-50 transition font-medium"
                              >
                                Goedkeuren
                              </button>
                              <button
                                onClick={() => setRejectInputId(rejectInputId === client.id ? null : client.id)}
                                disabled={isActioning}
                                className="px-3 py-1.5 text-xs bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 transition font-medium"
                              >
                                Afwijzen
                              </button>
                            </>
                          )}
                          {client.client_status === "rejected" && (
                            <button
                              onClick={() => handleApprove(client.id)}
                              disabled={isActioning}
                              className="px-3 py-1.5 text-xs bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 disabled:opacity-50 transition font-medium"
                            >
                              Alsnog goedkeuren
                            </button>
                          )}
                          <button
                            onClick={() => toggleClientExpanded(client.id)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 transition"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Reject reason input */}
                      {rejectInputId === client.id && (
                        <div className="flex items-center gap-2 mt-3 ml-14">
                          <input
                            type="text"
                            placeholder="Reden voor afwijzing (optioneel)..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="flex-1 px-3 py-2 text-sm bg-white border border-red-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300"
                          />
                          <button
                            onClick={() => handleReject(client.id)}
                            disabled={isActioning}
                            className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition font-medium"
                          >
                            Bevestig
                          </button>
                          <button
                            onClick={() => { setRejectInputId(null); setRejectReason("") }}
                            className="p-2 text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Expanded Check-ins */}
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-gray-100">
                        <div className="mt-4 space-y-3">
                          {checkIns.length > 0 ? (
                            checkIns.map((checkIn) => (
                              <div
                                key={checkIn.id}
                                className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <div className="text-gray-900 font-medium">
                                      Week {checkIn.week_number}, {checkIn.year}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {formatDate(checkIn.created_at)}
                                    </div>
                                  </div>
                                  {checkIn.weight && (
                                    <Badge variant="secondary" className="text-xs">
                                      {checkIn.weight}kg
                                    </Badge>
                                  )}
                                </div>

                                {/* Metrics Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                                  {checkIn.feeling !== null && (
                                    <div className="text-sm">
                                      <span className="text-gray-500">Gevoel:</span>{" "}
                                      <span className="text-gray-900 font-medium">{checkIn.feeling}/10</span>
                                    </div>
                                  )}
                                  {checkIn.energy_level !== null && (
                                    <div className="text-sm">
                                      <span className="text-gray-500">Energie:</span>{" "}
                                      <span className="text-gray-900 font-medium">{checkIn.energy_level}/10</span>
                                    </div>
                                  )}
                                  {checkIn.sleep_quality !== null && (
                                    <div className="text-sm">
                                      <span className="text-gray-500">Slaap:</span>{" "}
                                      <span className="text-gray-900 font-medium">{checkIn.sleep_quality}/10</span>
                                    </div>
                                  )}
                                  {checkIn.stress_level !== null && (
                                    <div className="text-sm">
                                      <span className="text-gray-500">Stress:</span>{" "}
                                      <span className="text-gray-900 font-medium">{checkIn.stress_level}/10</span>
                                    </div>
                                  )}
                                </div>

                                {/* Notes */}
                                {checkIn.notes && (
                                  <div className="mt-3 pt-3 border-t border-gray-100">
                                    <div className="text-xs text-gray-500 mb-1">Notities:</div>
                                    <div className="text-sm text-gray-700">{checkIn.notes}</div>
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-6 text-gray-400">
                              <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                              <p>Nog geen check-ins</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg">Geen clients gevonden</p>
                {searchQuery && (
                  <p className="text-sm mt-2">Probeer een andere zoekopdracht</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
