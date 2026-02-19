"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  getAllUsers, changeUserRole, deleteUser,
  type ManagedUser,
} from "@/app/actions/admin-clients"
import {
  Users, Shield, UserCog, Trash2, Search, Crown, Dumbbell, User,
} from "lucide-react"

const ROLE_CONFIG: Record<string, { label: string; icon: any; color: string; badgeBg: string }> = {
  ADMIN: { label: "Admin", icon: Crown, color: "text-amber-600", badgeBg: "bg-amber-100 border-amber-200 text-amber-700" },
  COACH: { label: "Coach", icon: Dumbbell, color: "text-blue-600", badgeBg: "bg-blue-100 border-blue-200 text-blue-700" },
  CLIENT: { label: "Client", icon: User, color: "text-gray-600", badgeBg: "bg-gray-100 border-gray-200 text-gray-700" },
}

export default function UsersTab() {
  const [users, setUsers] = useState<ManagedUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => { loadUsers() }, [])

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const result = await getAllUsers()
      if (result.success && result.users) setUsers(result.users)
    } catch (error) {
      console.error("Failed to load users:", error)
    }
    setIsLoading(false)
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    setActionLoading(userId)
    const result = await changeUserRole(userId, newRole)
    if (result.success) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
    } else {
      alert(result.error || "Fout bij wijzigen rol")
    }
    setActionLoading(null)
  }

  const handleDelete = async (user: ManagedUser) => {
    if (!confirm(`Weet je zeker dat je ${user.full_name || user.email} wilt verwijderen? Dit kan niet ongedaan worden.`)) return
    if (!confirm(`LAATSTE WAARSCHUWING: Account "${user.email}" wordt permanent verwijderd.`)) return

    setActionLoading(user.id)
    const result = await deleteUser(user.id)
    if (result.success) {
      setUsers(prev => prev.filter(u => u.id !== user.id))
    } else {
      alert(result.error || "Fout bij verwijderen")
    }
    setActionLoading(null)
  }

  const filtered = users.filter(u => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (!u.email.toLowerCase().includes(q) && !u.full_name.toLowerCase().includes(q)) return false
    }
    if (roleFilter !== "all" && u.role !== roleFilter) return false
    return true
  })

  const roleCounts = {
    all: users.length,
    ADMIN: users.filter(u => u.role === "ADMIN").length,
    COACH: users.filter(u => u.role === "COACH").length,
    CLIENT: users.filter(u => u.role === "CLIENT").length,
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1e1839]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-gray-400" />
              <p className="text-xs font-medium text-gray-500">Totaal</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{roleCounts.all}</p>
          </CardContent>
        </Card>
        {(["ADMIN", "COACH", "CLIENT"] as const).map(role => {
          const cfg = ROLE_CONFIG[role]
          const isActive = roleFilter === role
          return (
            <Card
              key={role}
              className={`bg-white border shadow-sm cursor-pointer transition hover:shadow-md ${
                isActive ? "ring-2 ring-[#1e1839]/20 border-[#1e1839]/30" : ""
              }`}
              onClick={() => setRoleFilter(roleFilter === role ? "all" : role)}
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <cfg.icon className={`w-4 h-4 ${cfg.color}`} />
                  <p className="text-xs font-medium text-gray-500">{cfg.label}s</p>
                </div>
                <p className="text-3xl font-bold text-gray-900">{roleCounts[role]}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Zoek op naam of email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-1">
          {[
            { value: "all", label: "Alle" },
            { value: "ADMIN", label: "Admin" },
            { value: "COACH", label: "Coach" },
            { value: "CLIENT", label: "Client" },
          ].map(f => (
            <Button
              key={f.value}
              size="sm"
              variant={roleFilter === f.value ? "default" : "outline"}
              onClick={() => setRoleFilter(f.value)}
              className={roleFilter === f.value
                ? "bg-[#1e1839] text-white hover:bg-[#2a2054]"
                : ""
              }
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Users list */}
      <Card className="bg-white border shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-400" />
            Geregistreerde Gebruikers ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <p className="text-center text-gray-400 py-8">Geen gebruikers gevonden</p>
            ) : filtered.map(user => {
              const cfg = ROLE_CONFIG[user.role] || ROLE_CONFIG.CLIENT
              const isLoadingThis = actionLoading === user.id
              return (
                <div
                  key={user.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <cfg.icon className={`w-5 h-5 ${cfg.color}`} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.full_name || "Naamloos"}
                      </p>
                      <Badge className={`text-[10px] border ${cfg.badgeBg}`}>
                        {cfg.label}
                      </Badge>
                      {user.client_status === "pending" && (
                        <Badge className="text-[10px] bg-purple-100 border-purple-200 text-purple-700 border">
                          Wachtrij
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    <p className="text-[10px] text-gray-400">
                      Geregistreerd: {new Date(user.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })}
                      {user.last_sign_in_at && ` · Laatst actief: ${new Date(user.last_sign_in_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}`}
                    </p>
                  </div>

                  {/* Role selector */}
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      disabled={isLoadingThis}
                      className="text-sm bg-white border border-gray-200 text-gray-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1e1839]/20 focus:border-[#1e1839] disabled:opacity-50 cursor-pointer"
                    >
                      <option value="CLIENT">Client</option>
                      <option value="COACH">Coach</option>
                      <option value="ADMIN">Admin</option>
                    </select>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(user)}
                      disabled={isLoadingThis}
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50 px-2"
                      title="Account verwijderen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
