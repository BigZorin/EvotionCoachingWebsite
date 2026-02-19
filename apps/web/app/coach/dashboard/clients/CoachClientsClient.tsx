"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  getCoachClientsOverview,
  type EnrichedClient,
} from "@/app/actions/admin-clients"
import {
  Users,
  Search,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  ChevronRight,
  Target,
  Dumbbell,
  Weight,
  Flame,
  Calendar,
  MessageSquare,
  ArrowUpDown,
  Clock,
  RefreshCw,
  Hourglass,
} from "lucide-react"

type FilterType = "all" | "active" | "attention" | "inactive" | "pending"
type SortType = "attention" | "name" | "recent" | "compliance"

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return "Vandaag"
  if (days === 1) return "Gisteren"
  if (days < 7) return `${days} dagen geleden`
  if (days < 30) return `${Math.floor(days / 7)} weken geleden`
  if (days < 365) return `${Math.floor(days / 30)} maanden geleden`
  return `${Math.floor(days / 365)} jaar geleden`
}

function memberSince(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const weeks = Math.floor(diff / (7 * 86400000))
  if (weeks < 1) return "Nieuw"
  if (weeks < 5) return `${weeks}w`
  const months = Math.floor(weeks / 4.33)
  if (months < 12) return `${months}m`
  return `${Math.floor(months / 12)}j`
}

export default function CoachClientsClient() {
  const [clients, setClients] = useState<EnrichedClient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<FilterType>("all")
  const [sort, setSort] = useState<SortType>("attention")

  useEffect(() => {
    loadClients()
  }, [])

  async function loadClients() {
    setLoading(true)
    try {
      const result = await getCoachClientsOverview()
      if (result?.success && result.clients) {
        setClients(result.clients)
      }
    } catch (error) {
      console.error("Failed to load clients:", error)
    }
    setLoading(false)
  }

  // Filter
  const filtered = clients.filter(c => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (!c.full_name.toLowerCase().includes(q) && !c.email.toLowerCase().includes(q)) return false
    }
    if (filter === "active") return c.activity_status === "active"
    if (filter === "attention") return c.needs_attention || c.has_pending_feedback
    if (filter === "inactive") return c.activity_status === "inactive"
    if (filter === "pending") return c.client_status === "pending" || c.client_status === "rejected"
    return true
  })

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "name") return a.full_name.localeCompare(b.full_name)
    if (sort === "compliance") return b.compliance_30d - a.compliance_30d
    if (sort === "recent") {
      if (!a.last_checkin_date && !b.last_checkin_date) return 0
      if (!a.last_checkin_date) return 1
      if (!b.last_checkin_date) return -1
      return new Date(b.last_checkin_date).getTime() - new Date(a.last_checkin_date).getTime()
    }
    // Default: pending first, then attention
    const aPending = a.client_status === "pending" ? 1 : 0
    const bPending = b.client_status === "pending" ? 1 : 0
    if (aPending !== bPending) return bPending - aPending
    if (a.needs_attention !== b.needs_attention) return a.needs_attention ? -1 : 1
    if (a.has_pending_feedback !== b.has_pending_feedback) return a.has_pending_feedback ? -1 : 1
    return 0
  })

  // Stats
  const totalClients = clients.length
  const activeClients = clients.filter(c => c.activity_status === "active").length
  const needAttention = clients.filter(c => c.needs_attention).length
  const pendingFeedback = clients.filter(c => c.has_pending_feedback).length
  const pendingApproval = clients.filter(c => c.client_status === "pending").length
  const avgCompliance = clients.length > 0
    ? Math.round(clients.reduce((s, c) => s + c.compliance_30d, 0) / clients.length)
    : 0

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e1839]" />
          <p className="text-sm text-gray-400">Clients laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-sm text-gray-500 mt-1">
            Overzicht van al je clients en hun voortgang
          </p>
        </div>
        <button
          onClick={loadClients}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          title="Vernieuwen"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        <button
          onClick={() => setFilter(filter === "all" ? "all" : "all")}
          className={`bg-white rounded-xl border p-4 text-center transition hover:shadow-md ${filter === "all" ? "ring-2 ring-[#1e1839] shadow-sm" : ""}`}
        >
          <Users className="h-5 w-5 text-gray-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900">{totalClients}</p>
          <p className="text-xs text-gray-500">Totaal</p>
        </button>
        {pendingApproval > 0 && (
          <button
            onClick={() => setFilter(filter === "pending" ? "all" : "pending")}
            className={`bg-white rounded-xl border p-4 text-center transition hover:shadow-md ${filter === "pending" ? "ring-2 ring-[#1e1839] shadow-sm" : ""}`}
          >
            <Hourglass className="h-5 w-5 text-[#1e1839] mx-auto mb-1" />
            <p className="text-2xl font-bold text-[#1e1839]">{pendingApproval}</p>
            <p className="text-xs text-gray-500">Wachtrij</p>
          </button>
        )}
        <button
          onClick={() => setFilter(filter === "active" ? "all" : "active")}
          className={`bg-white rounded-xl border p-4 text-center transition hover:shadow-md ${filter === "active" ? "ring-2 ring-green-500 shadow-sm" : ""}`}
        >
          <Activity className="h-5 w-5 text-green-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-green-600">{activeClients}</p>
          <p className="text-xs text-gray-500">Actief</p>
        </button>
        <button
          onClick={() => setFilter(filter === "attention" ? "all" : "attention")}
          className={`bg-white rounded-xl border p-4 text-center transition hover:shadow-md ${filter === "attention" ? "ring-2 ring-amber-500 shadow-sm" : ""}`}
        >
          <AlertTriangle className="h-5 w-5 text-amber-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-amber-600">{needAttention}</p>
          <p className="text-xs text-gray-500">Aandacht nodig</p>
        </button>
        <button
          onClick={() => setFilter(filter === "attention" ? "all" : "attention")}
          className="bg-white rounded-xl border p-4 text-center transition hover:shadow-md"
        >
          <MessageSquare className="h-5 w-5 text-blue-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-blue-600">{pendingFeedback}</p>
          <p className="text-xs text-gray-500">Feedback open</p>
        </button>
        <div className="bg-white rounded-xl border p-4 text-center">
          <TrendingUp className="h-5 w-5 text-purple-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-purple-600">{avgCompliance}%</p>
          <p className="text-xs text-gray-500">Gem. compliance</p>
        </div>
      </div>

      {/* Search & Sort Bar */}
      <div className="bg-white rounded-xl border shadow-sm mb-6">
        <div className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Zoek op naam of email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e1839]/20 focus:border-[#1e1839]"
            />
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-gray-400" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortType)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#1e1839]/20"
            >
              <option value="attention">Aandacht eerst</option>
              <option value="name">Naam A-Z</option>
              <option value="recent">Recent actief</option>
              <option value="compliance">Compliance</option>
            </select>
          </div>
        </div>

        {/* Filter pills */}
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {(["all", "pending", "active", "attention", "inactive"] as FilterType[]).map(f => {
            const count = f === "all" ? totalClients
              : f === "pending" ? pendingApproval
              : f === "active" ? activeClients
              : f === "attention" ? needAttention
              : clients.filter(c => c.activity_status === "inactive").length
            if (f === "pending" && pendingApproval === 0) return null
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  filter === f
                    ? "bg-[#1e1839] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f === "all" ? "Alle" : f === "pending" ? "Wachtrij" : f === "active" ? "Actief" : f === "attention" ? "Aandacht nodig" : "Inactief"}
                <span className="ml-1 opacity-70">({count})</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-400">
          {sorted.length} client{sorted.length !== 1 ? "s" : ""}
          {filter !== "all" || searchQuery ? " gevonden" : ""}
        </p>
      </div>

      {/* Clients List */}
      {sorted.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {searchQuery ? "Geen resultaten" : "Geen clients"}
          </h3>
          <p className="text-sm text-gray-500">
            {searchQuery ? "Probeer een andere zoekopdracht" : "Je hebt nog geen clients"}
          </p>
          {(searchQuery || filter !== "all") && (
            <button
              onClick={() => { setSearchQuery(""); setFilter("all") }}
              className="mt-4 text-sm text-[#1e1839] font-medium hover:underline"
            >
              Filters wissen
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map(client => (
            <Link
              key={client.id}
              href={`/coach/dashboard/clients/${client.id}`}
              className="block bg-white rounded-xl border hover:border-gray-300 shadow-sm hover:shadow-md transition-all overflow-hidden group"
            >
              <div className="p-4 sm:px-5 sm:py-4">
                <div className="flex items-center gap-4">
                  {/* Avatar + Status indicator */}
                  <div className="relative flex-shrink-0">
                    {client.avatar_url ? (
                      <img src={client.avatar_url} alt="" className="w-11 h-11 rounded-full object-cover" />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-[#1e1839] flex items-center justify-center text-white text-sm font-bold">
                        {client.avatar_initial}
                      </div>
                    )}
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      client.activity_status === "active" ? "bg-green-500" :
                      client.activity_status === "moderate" ? "bg-amber-400" : "bg-gray-300"
                    }`} />
                  </div>

                  {/* Client info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-gray-900 truncate group-hover:text-[#1e1839] transition">
                        {client.full_name}
                      </h3>
                      {client.client_status === "pending" && (
                        <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
                          <Hourglass className="h-2.5 w-2.5" />
                          Wachtrij
                        </span>
                      )}
                      {client.client_status === "rejected" && (
                        <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-50 text-red-700 border border-red-200">
                          Afgewezen
                        </span>
                      )}
                      {client.needs_attention && client.client_status !== "pending" && (
                        <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertTriangle className="h-2.5 w-2.5" />
                          Aandacht
                        </span>
                      )}
                      {client.has_pending_feedback && !client.needs_attention && client.client_status !== "pending" && (
                        <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          <MessageSquare className="h-2.5 w-2.5" />
                          Feedback
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="truncate">{client.email}</span>
                      <span className="flex-shrink-0 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {memberSince(client.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Key metrics - Desktop */}
                  <div className="hidden lg:flex items-center gap-5 text-sm">
                    {/* Compliance bar */}
                    <div className="text-center min-w-[70px]">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <span className="font-semibold text-gray-900 text-xs">{client.compliance_30d}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            client.compliance_30d >= 75 ? "bg-green-500" :
                            client.compliance_30d >= 50 ? "bg-amber-400" : "bg-red-400"
                          }`}
                          style={{ width: `${client.compliance_30d}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">Compliance</p>
                    </div>

                    {/* Streak */}
                    <div className="text-center min-w-[44px]">
                      <div className="flex items-center justify-center gap-1">
                        <Flame className={`h-3.5 w-3.5 ${client.checkin_streak > 0 ? "text-orange-500" : "text-gray-300"}`} />
                        <span className="font-semibold text-gray-900 text-xs">{client.checkin_streak}</span>
                      </div>
                      <p className="text-[10px] text-gray-400">Streak</p>
                    </div>

                    {/* Weight */}
                    <div className="text-center min-w-[56px]">
                      {client.latest_weight ? (
                        <>
                          <div className="flex items-center justify-center gap-0.5">
                            <span className="font-semibold text-gray-900 text-xs">{client.latest_weight}</span>
                            <span className="text-[10px] text-gray-400">kg</span>
                            {client.weight_trend !== null && client.weight_trend !== 0 && (
                              client.weight_trend > 0 ? (
                                <TrendingUp className="h-3 w-3 text-red-400" />
                              ) : (
                                <TrendingDown className="h-3 w-3 text-green-500" />
                              )
                            )}
                          </div>
                          <p className="text-[10px] text-gray-400">Gewicht</p>
                        </>
                      ) : (
                        <>
                          <span className="font-semibold text-gray-300 text-xs">—</span>
                          <p className="text-[10px] text-gray-400">Gewicht</p>
                        </>
                      )}
                    </div>

                    {/* Workouts */}
                    <div className="text-center min-w-[44px]">
                      <div className="flex items-center justify-center gap-1">
                        <Dumbbell className={`h-3.5 w-3.5 ${client.workout_logs_30d > 0 ? "text-blue-500" : "text-gray-300"}`} />
                        <span className="font-semibold text-gray-900 text-xs">{client.workout_logs_30d}</span>
                      </div>
                      <p className="text-[10px] text-gray-400">Workouts</p>
                    </div>

                    {/* Goals */}
                    <div className="text-center min-w-[44px]">
                      <div className="flex items-center justify-center gap-1">
                        <Target className={`h-3.5 w-3.5 ${client.active_goals_count > 0 ? "text-purple-500" : "text-gray-300"}`} />
                        <span className="font-semibold text-gray-900 text-xs">{client.active_goals_count}</span>
                      </div>
                      <p className="text-[10px] text-gray-400">Doelen</p>
                    </div>
                  </div>

                  {/* Last activity + arrow */}
                  <div className="flex items-center gap-2">
                    <div className="text-right hidden sm:block">
                      {client.last_checkin_date ? (
                        <p className="text-[11px] text-gray-500">
                          {timeAgo(client.last_checkin_date)}
                        </p>
                      ) : (
                        <p className="text-[11px] text-gray-400">Geen check-ins</p>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[#1e1839] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>

                {/* Mobile metrics row */}
                <div className="flex lg:hidden items-center gap-4 mt-3 pt-3 border-t border-gray-50 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-8 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          client.compliance_30d >= 75 ? "bg-green-500" :
                          client.compliance_30d >= 50 ? "bg-amber-400" : "bg-red-400"
                        }`}
                        style={{ width: `${client.compliance_30d}%` }}
                      />
                    </div>
                    <span className="text-gray-600">{client.compliance_30d}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className={`h-3 w-3 ${client.checkin_streak > 0 ? "text-orange-500" : "text-gray-300"}`} />
                    <span className="text-gray-600">{client.checkin_streak}w</span>
                  </div>
                  {client.latest_weight && (
                    <div className="flex items-center gap-1">
                      <span className="text-gray-600">{client.latest_weight}kg</span>
                      {client.weight_trend !== null && client.weight_trend !== 0 && (
                        client.weight_trend > 0 ? (
                          <TrendingUp className="h-3 w-3 text-red-400" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-green-500" />
                        )
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Dumbbell className="h-3 w-3 text-blue-500" />
                    <span className="text-gray-600">{client.workout_logs_30d}</span>
                  </div>
                  {client.last_checkin_date && (
                    <div className="flex items-center gap-1 ml-auto">
                      <span className="text-gray-400">{timeAgo(client.last_checkin_date)}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
