"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  getCoachClientsOverview,
  type EnrichedClient,
} from "@/app/actions/admin-clients"
import {
  Users,
  Search,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Flame,
  Dumbbell,
  Clock,
  MessageSquare,
  ArrowUpDown,
  Loader2,
  Minus,
  MoreHorizontal,
  Mail,
} from "lucide-react"

type SortType = "attention" | "name" | "recent" | "compliance"

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return "Vandaag"
  if (days === 1) return "Gisteren"
  if (days < 7) return `${days}d geleden`
  if (days < 30) return `${Math.floor(days / 7)}w geleden`
  return `${Math.floor(days / 30)}m geleden`
}

function getStatusBadge(client: EnrichedClient) {
  if (client.client_status === "pending") {
    return <Badge className="bg-primary/10 text-primary border-primary/20 text-[11px]">Wachtrij</Badge>
  }
  if (client.needs_attention) {
    return <Badge className="bg-amber-500/10 text-amber-700 border-amber-500/20 text-[11px]">Risico</Badge>
  }
  if (client.activity_status === "active") {
    return <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20 text-[11px]">Actief</Badge>
  }
  if (client.activity_status === "inactive") {
    return <Badge variant="secondary" className="text-[11px]">Inactief</Badge>
  }
  return <Badge variant="secondary" className="text-[11px]">Matig</Badge>
}

function getTrendIcon(client: EnrichedClient) {
  if (client.weight_trend !== null && client.weight_trend !== 0) {
    return client.weight_trend > 0 ? (
      <TrendingUp className="size-3.5 text-destructive" />
    ) : (
      <TrendingDown className="size-3.5 text-emerald-500" />
    )
  }
  return <Minus className="size-3.5 text-muted-foreground" />
}

export default function CoachClientsClient() {
  const [clients, setClients] = useState<EnrichedClient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
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

  function filterAndSort(statusFilter: string): EnrichedClient[] {
    let filtered = clients

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(c =>
        c.full_name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
      )
    }

    // Status filter
    if (statusFilter === "actief") {
      filtered = filtered.filter(c => c.activity_status === "active" && !c.needs_attention)
    } else if (statusFilter === "risico") {
      filtered = filtered.filter(c => c.needs_attention || c.has_pending_feedback)
    } else if (statusFilter === "inactief") {
      filtered = filtered.filter(c => c.activity_status === "inactive" || c.client_status === "pending")
    }

    // Sort
    return [...filtered].sort((a, b) => {
      if (sort === "name") return a.full_name.localeCompare(b.full_name)
      if (sort === "compliance") return b.compliance_30d - a.compliance_30d
      if (sort === "recent") {
        if (!a.last_checkin_date && !b.last_checkin_date) return 0
        if (!a.last_checkin_date) return 1
        if (!b.last_checkin_date) return -1
        return new Date(b.last_checkin_date).getTime() - new Date(a.last_checkin_date).getTime()
      }
      // Default: attention first
      if (a.needs_attention !== b.needs_attention) return a.needs_attention ? -1 : 1
      if (a.has_pending_feedback !== b.has_pending_feedback) return a.has_pending_feedback ? -1 : 1
      return 0
    })
  }

  const activeCount = clients.filter(c => c.activity_status === "active" && !c.needs_attention).length
  const risicoCount = clients.filter(c => c.needs_attention || c.has_pending_feedback).length
  const inactiefCount = clients.filter(c => c.activity_status === "inactive" || c.client_status === "pending").length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Clients laden...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Tabs defaultValue="alle">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="alle">Alle ({clients.length})</TabsTrigger>
            <TabsTrigger value="actief">Actief ({activeCount})</TabsTrigger>
            <TabsTrigger value="risico">Risico ({risicoCount})</TabsTrigger>
            <TabsTrigger value="inactief">Inactief ({inactiefCount})</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Zoek cliënten..."
                className="pl-9 h-9 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <ArrowUpDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSort("attention")}>Aandacht eerst</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSort("name")}>Naam A-Z</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSort("recent")}>Recent actief</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSort("compliance")}>Compliance</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {(["alle", "actief", "risico", "inactief"] as const).map(tab => (
          <TabsContent key={tab} value={tab} className="mt-4">
            <ClientGrid clients={filterAndSort(tab)} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function ClientGrid({ clients }: { clients: EnrichedClient[] }) {
  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Users className="h-10 w-10 text-muted-foreground/30 mb-3" />
        <h3 className="font-semibold mb-1">Geen clients gevonden</h3>
        <p className="text-sm text-muted-foreground">Pas je zoekopdracht of filters aan</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {clients.map((client) => (
        <ClientCard key={client.id} client={client} />
      ))}
    </div>
  )
}

function ClientCard({ client }: { client: EnrichedClient }) {
  const complianceColor = client.compliance_30d >= 75
    ? "text-emerald-600"
    : client.compliance_30d >= 50
    ? "text-amber-600"
    : "text-destructive"

  return (
    <Card className="shadow-sm hover:border-primary/30 transition-all group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <Link
            href={`/coach/dashboard/clients/${client.id}`}
            className="flex items-center gap-3 flex-1 min-w-0"
          >
            <Avatar className="size-10">
              {client.avatar_url ? (
                <AvatarImage src={client.avatar_url} alt={client.full_name} />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                {client.avatar_initial}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                {client.full_name || "Onbekend"}
              </p>
              <p className="text-xs text-muted-foreground truncate">{client.email}</p>
            </div>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/coach/dashboard/clients/${client.id}`}>Bekijk profiel</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/coach/dashboard/messages`}>
                  <Mail className="mr-2 size-4" />Bericht sturen
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Link href={`/coach/dashboard/clients/${client.id}`} className="block mt-4">
          <div className="flex flex-col gap-3">
            {/* Status + trend */}
            <div className="flex items-center justify-between">
              {getStatusBadge(client)}
              <div className="flex items-center gap-1.5">
                {getTrendIcon(client)}
                <span className="text-xs text-muted-foreground">
                  {client.last_checkin_date ? timeAgo(client.last_checkin_date) : "Geen check-in"}
                </span>
              </div>
            </div>

            {/* Compliance bar */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Compliance (30d)</span>
                <span className={`font-semibold ${complianceColor}`}>{client.compliance_30d}%</span>
              </div>
              <Progress value={client.compliance_30d} className="h-1.5" />
            </div>

            {/* Bottom metrics */}
            <div className="flex items-center justify-between">
              <div className="flex gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Flame className={`size-3.5 ${client.checkin_streak > 0 ? "text-orange-500" : "text-muted-foreground/30"}`} />
                  {client.checkin_streak}w
                </span>
                <span className="flex items-center gap-1">
                  <Dumbbell className="size-3.5 text-primary" />
                  {client.workout_logs_30d}
                </span>
                {client.latest_weight && (
                  <span>{client.latest_weight}kg</span>
                )}
              </div>
              {client.has_pending_feedback && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 border-amber-500/30 text-amber-600">
                  <MessageSquare className="size-3 mr-0.5" />
                  Feedback
                </Badge>
              )}
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}
