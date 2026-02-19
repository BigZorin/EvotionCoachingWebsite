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
  Flame,
  Clock,
  MessageSquare,
  ArrowUpDown,
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
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-evotion-primary" />
          <p className="text-sm text-muted-foreground">Clients laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clients</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overzicht van al je clients en hun voortgang
          </p>
        </div>
        <button
          onClick={loadClients}
          className="p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition"
          title="Vernieuwen"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Summary Stats - reduced to 4 core metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => setFilter("all")}
          className={`relative bg-card rounded-xl border p-5 text-left transition hover:shadow-md ${filter === "all" ? "ring-2 ring-evotion-primary border-transparent" : "border-border"}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-secondary">
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            {pendingApproval > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-evotion-primary/10 text-evotion-primary">
                <Hourglass className="h-3 w-3" />
                {pendingApproval}
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-foreground">{totalClients}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Totaal clients</p>
        </button>

        <button
          onClick={() => setFilter(filter === "active" ? "all" : "active")}
          className={`relative bg-card rounded-xl border p-5 text-left transition hover:shadow-md ${filter === "active" ? "ring-2 ring-emerald-500 border-transparent" : "border-border"}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-emerald-50">
              <Activity className="h-4 w-4 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{activeClients}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Actief</p>
        </button>

        <button
          onClick={() => setFilter(filter === "attention" ? "all" : "attention")}
          className={`relative bg-card rounded-xl border p-5 text-left transition hover:shadow-md ${filter === "attention" ? "ring-2 ring-amber-500 border-transparent" : "border-border"}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </div>
            {pendingFeedback > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                <MessageSquare className="h-3 w-3" />
                {pendingFeedback}
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-foreground">{needAttention}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Aandacht nodig</p>
        </button>

        <div className="bg-card rounded-xl border border-border p-5 text-left">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-evotion-primary/5">
              <TrendingUp className="h-4 w-4 text-evotion-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{avgCompliance}%</p>
          <p className="text-xs text-muted-foreground mt-0.5">Gem. compliance</p>
        </div>
      </div>

      {/* Search, Sort & Filter Bar */}
      <div className="bg-card rounded-xl border border-border shadow-sm mb-6">
        <div className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Zoek op naam of email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-evotion-primary/20 focus:border-evotion-primary transition"
            />
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortType)}
              className="text-sm border border-border rounded-lg px-3 py-2.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-evotion-primary/20"
            >
              <option value="attention">Aandacht eerst</option>
              <option value="name">Naam A-Z</option>
              <option value="recent">Recent actief</option>
              <option value="compliance">Compliance</option>
            </select>
          </div>
        </div>

        {/* Filter pills */}
        <div className="px-4 pb-4 flex flex-wrap gap-2">
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
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
                  filter === f
                    ? "bg-evotion-primary text-white shadow-sm"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {f === "all" ? "Alle" : f === "pending" ? "Wachtrij" : f === "active" ? "Actief" : f === "attention" ? "Aandacht nodig" : "Inactief"}
                <span className="ml-1.5 opacity-70">({count})</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-muted-foreground">
          {sorted.length} client{sorted.length !== 1 ? "s" : ""}
          {filter !== "all" || searchQuery ? " gevonden" : ""}
        </p>
      </div>

      {/* Clients List */}
      {sorted.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {searchQuery ? "Geen resultaten" : "Geen clients"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            {searchQuery ? "Probeer een andere zoekopdracht of pas je filters aan" : "Je hebt nog geen clients toegevoegd"}
          </p>
          {(searchQuery || filter !== "all") && (
            <button
              onClick={() => { setSearchQuery(""); setFilter("all") }}
              className="mt-5 inline-flex items-center px-4 py-2 text-sm font-medium text-evotion-primary bg-evotion-primary/5 rounded-lg hover:bg-evotion-primary/10 transition"
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
              className="block bg-card rounded-xl border border-border hover:border-evotion-primary/20 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-4">
                  {/* Avatar + Status indicator */}
                  <div className="relative flex-shrink-0">
                    {client.avatar_url ? (
                      <img src={client.avatar_url} alt="" className="w-11 h-11 rounded-full object-cover ring-2 ring-border" />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-evotion-primary flex items-center justify-center text-white text-sm font-bold ring-2 ring-evotion-primary/20">
                        {client.avatar_initial}
                      </div>
                    )}
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card ${
                      client.activity_status === "active" ? "bg-emerald-500" :
                      client.activity_status === "moderate" ? "bg-amber-400" : "bg-muted-foreground/30"
                    }`} />
                  </div>

                  {/* Client info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-foreground truncate group-hover:text-evotion-primary transition">
                        {client.full_name}
                      </h3>
                      {client.client_status === "pending" && (
                        <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-evotion-primary/10 text-evotion-primary">
                          <Hourglass className="h-3 w-3" />
                          Wachtrij
                        </span>
                      )}
                      {client.client_status === "rejected" && (
                        <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                          Afgewezen
                        </span>
                      )}
                      {client.needs_attention && client.client_status !== "pending" && (
                        <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                          <AlertTriangle className="h-3 w-3" />
                          Aandacht
                        </span>
                      )}
                      {client.has_pending_feedback && !client.needs_attention && client.client_status !== "pending" && (
                        <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          <MessageSquare className="h-3 w-3" />
                          Feedback
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="truncate">{client.email}</span>
                      <span className="flex-shrink-0 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {memberSince(client.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Key metrics - Desktop */}
                  <div className="hidden lg:flex items-center gap-6">
                    {/* Compliance bar */}
                    <div className="text-center min-w-[72px]">
                      <div className="flex items-center justify-center gap-1.5 mb-1.5">
                        <span className="font-semibold text-foreground text-xs">{client.compliance_30d}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            client.compliance_30d >= 75 ? "bg-emerald-500" :
                            client.compliance_30d >= 50 ? "bg-amber-400" : "bg-destructive"
                          }`}
                          style={{ width: `${client.compliance_30d}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Compliance</p>
                    </div>

                    {/* Streak */}
                    <div className="text-center min-w-[48px]">
                      <div className="flex items-center justify-center gap-1">
                        <Flame className={`h-3.5 w-3.5 ${client.checkin_streak > 0 ? "text-orange-500" : "text-muted-foreground/30"}`} />
                        <span className="font-semibold text-foreground text-xs">{client.checkin_streak}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">Streak</p>
                    </div>

                    {/* Weight */}
                    <div className="text-center min-w-[56px]">
                      {client.latest_weight ? (
                        <>
                          <div className="flex items-center justify-center gap-0.5">
                            <span className="font-semibold text-foreground text-xs">{client.latest_weight}</span>
                            <span className="text-xs text-muted-foreground">kg</span>
                            {client.weight_trend !== null && client.weight_trend !== 0 && (
                              client.weight_trend > 0 ? (
                                <TrendingUp className="h-3 w-3 text-destructive" />
                              ) : (
                                <TrendingDown className="h-3 w-3 text-emerald-500" />
                              )
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">Gewicht</p>
                        </>
                      ) : (
                        <>
                          <span className="font-semibold text-muted-foreground/30 text-xs">--</span>
                          <p className="text-xs text-muted-foreground mt-0.5">Gewicht</p>
                        </>
                      )}
                    </div>

                    {/* Workouts */}
                    <div className="text-center min-w-[48px]">
                      <div className="flex items-center justify-center gap-1">
                        <Dumbbell className={`h-3.5 w-3.5 ${client.workout_logs_30d > 0 ? "text-evotion-primary" : "text-muted-foreground/30"}`} />
                        <span className="font-semibold text-foreground text-xs">{client.workout_logs_30d}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">Workouts</p>
                    </div>

                    {/* Goals */}
                    <div className="text-center min-w-[48px]">
                      <div className="flex items-center justify-center gap-1">
                        <Target className={`h-3.5 w-3.5 ${client.active_goals_count > 0 ? "text-evotion-primary" : "text-muted-foreground/30"}`} />
                        <span className="font-semibold text-foreground text-xs">{client.active_goals_count}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">Doelen</p>
                    </div>
                  </div>

                  {/* Last activity + arrow */}
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      {client.last_checkin_date ? (
                        <p className="text-xs text-muted-foreground">
                          {timeAgo(client.last_checkin_date)}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground/60">Geen check-ins</p>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-evotion-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>

                {/* Mobile metrics row */}
                <div className="flex lg:hidden items-center gap-4 mt-3 pt-3 border-t border-border/50 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-10 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          client.compliance_30d >= 75 ? "bg-emerald-500" :
                          client.compliance_30d >= 50 ? "bg-amber-400" : "bg-destructive"
                        }`}
                        style={{ width: `${client.compliance_30d}%` }}
                      />
                    </div>
                    <span className="text-muted-foreground font-medium">{client.compliance_30d}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className={`h-3 w-3 ${client.checkin_streak > 0 ? "text-orange-500" : "text-muted-foreground/30"}`} />
                    <span className="text-muted-foreground font-medium">{client.checkin_streak}w</span>
                  </div>
                  {client.latest_weight && (
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground font-medium">{client.latest_weight}kg</span>
                      {client.weight_trend !== null && client.weight_trend !== 0 && (
                        client.weight_trend > 0 ? (
                          <TrendingUp className="h-3 w-3 text-destructive" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-emerald-500" />
                        )
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Dumbbell className="h-3 w-3 text-evotion-primary" />
                    <span className="text-muted-foreground font-medium">{client.workout_logs_30d}</span>
                  </div>
                  {client.last_checkin_date && (
                    <div className="flex items-center gap-1 ml-auto">
                      <span className="text-muted-foreground">{timeAgo(client.last_checkin_date)}</span>
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
