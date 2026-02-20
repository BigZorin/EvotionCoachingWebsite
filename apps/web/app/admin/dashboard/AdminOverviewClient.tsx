"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  getClients,
  getAllUsers,
  type ClientWithStats,
  type ManagedUser,
} from "@/app/actions/admin-clients"
import {
  Users,
  Shield,
  UserCheck,
  Hourglass,
  AlertCircle,
  Globe,
  Dumbbell,
  ChevronRight,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Loader2,
} from "lucide-react"

export default function AdminOverviewClient() {
  const [clients, setClients] = useState<ClientWithStats[]>([])
  const [users, setUsers] = useState<ManagedUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [clientsRes, usersRes] = await Promise.all([
        getClients(),
        getAllUsers(),
      ])
      if (clientsRes?.success && clientsRes.clients) setClients(clientsRes.clients)
      if (usersRes?.success && usersRes.users) setUsers(usersRes.users)
    } catch (err: any) {
      console.error("Error loading admin data:", err)
      setError(err.message || "Er is een fout opgetreden")
    } finally {
      setIsLoading(false)
    }
  }

  const pendingClients = clients.filter(c => c.client_status === "pending").length
  const approvedClients = clients.filter(c => c.client_status === "approved" || !c.client_status).length
  const totalCoaches = users.filter(u => u.role === "COACH").length
  const totalAdmins = users.filter(u => u.role === "ADMIN").length

  // Recent clients (signed up in last 7 days)
  const recentClients = clients
    .filter(c => {
      const created = new Date(c.created_at)
      return (Date.now() - created.getTime()) / 86400000 < 7
    })
    .slice(0, 5)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Dashboard laden...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold mb-2">Fout bij laden</h3>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    )
  }

  const kpiCards = [
    {
      label: "Totaal Gebruikers",
      value: String(users.length),
      detail: `${totalAdmins} admin · ${totalCoaches} coaches`,
      icon: Shield,
    },
    {
      label: "Actieve Clients",
      value: String(approvedClients),
      detail: `${clients.length} totaal`,
      icon: UserCheck,
    },
    {
      label: "Wachtrij",
      value: String(pendingClients),
      detail: "Wacht op goedkeuring",
      icon: Hourglass,
      highlight: pendingClients > 0,
    },
    {
      label: "Coaches",
      value: String(totalCoaches),
      detail: "Actieve coaches",
      icon: Dumbbell,
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.label} className={`shadow-sm ${kpi.highlight ? "ring-2 ring-primary/20" : ""}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground">{kpi.label}</span>
                <kpi.icon className="size-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions + Pending Queue */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Snelle acties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Link
                href="/admin/dashboard/clients"
                className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-secondary/50"
              >
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="size-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Clients beheren</p>
                  <p className="text-xs text-muted-foreground">Goedkeuring & toewijzing</p>
                </div>
                {pendingClients > 0 && (
                  <Badge className="bg-primary/10 text-primary text-[10px]">{pendingClients} wachtend</Badge>
                )}
              </Link>
              <Link
                href="/admin/dashboard/users"
                className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-secondary/50"
              >
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="size-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Gebruikers</p>
                  <p className="text-xs text-muted-foreground">Rollen & permissies</p>
                </div>
              </Link>
              <Link
                href="/coach/dashboard"
                className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-secondary/50"
              >
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                  <Dumbbell className="size-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Coach Dashboard</p>
                  <p className="text-xs text-muted-foreground">Client details & coaching</p>
                </div>
              </Link>
              <Link
                href="/admin/dashboard/analytics"
                className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-secondary/50"
              >
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                  <Globe className="size-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Website Analytics</p>
                  <p className="text-xs text-muted-foreground">Bezoekers & conversies</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Pending / Recent Activity */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                {pendingClients > 0 ? "Wachtende clients" : "Recente aanmeldingen"}
              </CardTitle>
              <Link
                href="/admin/dashboard/clients"
                className="text-xs text-primary hover:underline flex items-center gap-0.5"
              >
                Bekijk alle <ChevronRight className="size-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {pendingClients > 0 ? (
              <div className="flex flex-col gap-2">
                {clients
                  .filter(c => c.client_status === "pending")
                  .slice(0, 5)
                  .map(client => (
                    <div key={client.id} className="flex items-center gap-3 rounded-lg bg-primary/5 border border-primary/10 p-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {(client.raw_user_meta_data?.full_name || client.email)[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {client.raw_user_meta_data?.full_name || "Naamloos"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{client.email}</p>
                      </div>
                      <Badge className="bg-primary text-primary-foreground text-[10px]">Wachtend</Badge>
                    </div>
                  ))}
              </div>
            ) : recentClients.length > 0 ? (
              <div className="flex flex-col gap-2">
                {recentClients.map(client => (
                  <div key={client.id} className="flex items-center gap-3 rounded-lg border p-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-semibold">
                        {(client.raw_user_meta_data?.full_name || client.email)[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {client.raw_user_meta_data?.full_name || "Naamloos"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{client.email}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(client.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Geen recente aanmeldingen
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
