"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
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
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Fout bij laden</h3>
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Overzicht van het hele systeem</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">TOTAAL GEBRUIKERS</p>
                <p className="text-4xl font-bold text-gray-900">{users.length}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {totalAdmins} admin{totalAdmins !== 1 ? "s" : ""} · {totalCoaches} coach{totalCoaches !== 1 ? "es" : ""}
                </p>
              </div>
              <div className="p-3 bg-[#1e1839] rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">CLIENTS</p>
                <p className="text-4xl font-bold text-gray-900">{clients.length}</p>
                <p className="text-xs text-gray-500 mt-1">{approvedClients} goedgekeurd</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-white border shadow-sm hover:shadow-md transition-shadow ${pendingClients > 0 ? "ring-2 ring-purple-200" : ""}`}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">WACHTRIJ</p>
                <p className={`text-4xl font-bold ${pendingClients > 0 ? "text-purple-600" : "text-gray-900"}`}>{pendingClients}</p>
                <p className="text-xs text-gray-500 mt-1">Wacht op goedkeuring</p>
              </div>
              <div className={`p-3 rounded-lg ${pendingClients > 0 ? "bg-purple-100" : "bg-gray-100"}`}>
                <Hourglass className={`h-6 w-6 ${pendingClients > 0 ? "text-purple-600" : "text-gray-400"}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">COACHES</p>
                <p className="text-4xl font-bold text-gray-900">{totalCoaches}</p>
                <p className="text-xs text-gray-500 mt-1">Actieve coaches</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Dumbbell className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <Card className="bg-white border shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Snelle Acties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/dashboard/clients"
              className="p-5 bg-gradient-to-br from-[#1e1839] to-[#2a2054] hover:from-[#2a2054] hover:to-[#1e1839] rounded-xl text-left transition-all shadow-sm hover:shadow-md block"
            >
              <Users className="h-7 w-7 text-white mb-3" />
              <h3 className="text-white font-semibold mb-1">Clients Beheren</h3>
              <p className="text-sm text-white/70">Goedkeuring & coach toewijzing</p>
              {pendingClients > 0 && (
                <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-purple-500 text-white rounded-full">
                  {pendingClients} in wachtrij
                </span>
              )}
            </Link>

            <Link
              href="/admin/dashboard/users"
              className="p-5 bg-white hover:bg-gray-50 rounded-xl text-left transition-all shadow-sm hover:shadow-md border border-gray-200 block"
            >
              <Shield className="h-7 w-7 text-[#1e1839] mb-3" />
              <h3 className="text-gray-900 font-semibold mb-1">Gebruikers</h3>
              <p className="text-sm text-gray-600">Rollen & permissies beheren</p>
            </Link>

            <Link
              href="/coach/dashboard"
              className="p-5 bg-white hover:bg-gray-50 rounded-xl text-left transition-all shadow-sm hover:shadow-md border border-gray-200 block"
            >
              <Dumbbell className="h-7 w-7 text-[#1e1839] mb-3" />
              <h3 className="text-gray-900 font-semibold mb-1">Coach Dashboard</h3>
              <p className="text-sm text-gray-600">Client details & coaching</p>
            </Link>

            <Link
              href="/admin/dashboard/analytics"
              className="p-5 bg-white hover:bg-gray-50 rounded-xl text-left transition-all shadow-sm hover:shadow-md border border-gray-200 block"
            >
              <Globe className="h-7 w-7 text-[#1e1839] mb-3" />
              <h3 className="text-gray-900 font-semibold mb-1">Website Analytics</h3>
              <p className="text-sm text-gray-600">Bezoekers & conversies</p>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Pending clients quick list */}
      {pendingClients > 0 && (
        <Card className="bg-white border shadow-sm border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Hourglass className="h-5 w-5 text-purple-600" />
                Wachtende Clients
              </h2>
              <Link href="/admin/dashboard/clients" className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                Bekijk alle <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-2">
              {clients
                .filter(c => c.client_status === "pending")
                .slice(0, 5)
                .map(client => (
                  <div key={client.id} className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 border border-purple-100">
                    <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 text-sm font-bold">
                      {(client.raw_user_meta_data?.full_name || client.email)[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {client.raw_user_meta_data?.full_name || "Naamloos"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{client.email}</p>
                    </div>
                    <Link
                      href="/admin/dashboard/clients"
                      className="px-3 py-1.5 text-xs font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                      Bekijk
                    </Link>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
