"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  getAllUsers, changeUserRole, deleteUser,
  type ManagedUser,
} from "@/app/actions/admin-clients"
import {
  Users, Crown, Dumbbell, User, Trash2, Search, Loader2,
} from "lucide-react"

type Rol = "ADMIN" | "COACH" | "CLIENT"

const rolConfig: Record<string, { label: string; icon: typeof Crown; kleur: string; avatarKleur: string }> = {
  ADMIN: { label: "Admin", icon: Crown, kleur: "bg-amber-500/10 text-amber-600 border-amber-500/20", avatarKleur: "bg-amber-500/10 text-amber-600" },
  COACH: { label: "Coach", icon: Dumbbell, kleur: "bg-primary/10 text-primary border-primary/20", avatarKleur: "bg-primary/10 text-primary" },
  CLIENT: { label: "Client", icon: User, kleur: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", avatarKleur: "bg-secondary text-foreground" },
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
    if (!confirm(`Weet je zeker dat je ${user.full_name || user.email} wilt verwijderen?`)) return
    if (!confirm(`LAATSTE WAARSCHUWING: Account "${user.email}" wordt permanent verwijderd.`)) return
    setActionLoading(user.id)
    const result = await deleteUser(user.id)
    if (result.success) setUsers(prev => prev.filter(u => u.id !== user.id))
    else alert(result.error || "Fout bij verwijderen")
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

  const telRol = (rol: string) => users.filter(u => u.role === rol).length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Gebruikers laden...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold">Gebruikers</h2>
        <p className="text-xs text-muted-foreground">Rollen beheren en accounts verwijderen</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Totaal", waarde: users.length, icon: Users },
          { label: "Admins", waarde: telRol("ADMIN"), icon: Crown },
          { label: "Coaches", waarde: telRol("COACH"), icon: Dumbbell },
          { label: "Clients", waarde: telRol("CLIENT"), icon: User },
        ].map((kpi) => (
          <Card key={kpi.label} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <kpi.icon className="size-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{kpi.label}</span>
              </div>
              <p className="text-2xl font-bold">{kpi.waarde}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + Filter */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="Zoek op naam of email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
            </div>
            <div className="flex gap-1.5">
              {(["all", "ADMIN", "COACH", "CLIENT"] as const).map((rol) => (
                <button
                  key={rol}
                  onClick={() => setRoleFilter(rol)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    roleFilter === rol ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {rol === "all" ? "Alle" : rolConfig[rol]?.label || rol}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card className="shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Geregistreerde Gebruikers ({filtered.length})</h3>
          </div>

          <div className="flex flex-col gap-1">
            {filtered.length === 0 ? (
              <p className="text-center text-muted-foreground py-8 text-sm">Geen gebruikers gevonden</p>
            ) : filtered.map(user => {
              const cfg = rolConfig[user.role] || rolConfig.CLIENT
              const isLoadingThis = actionLoading === user.id
              const initials = user.full_name
                ? user.full_name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
                : user.email[0].toUpperCase()

              return (
                <div key={user.id} className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9 border border-border">
                      <AvatarFallback className={`text-xs font-semibold ${cfg.avatarKleur}`}>
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{user.full_name || "Naamloos"}</p>
                        <Badge variant="outline" className={`text-[10px] border ${cfg.kleur}`}>{cfg.label}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {user.email} &middot; Geregistreerd: {new Date(user.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })}
                        {user.last_sign_in_at && ` · Laatst actief: ${new Date(user.last_sign_in_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      disabled={isLoadingThis}
                      className="text-xs bg-card border rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                    >
                      <option value="CLIENT">Client</option>
                      <option value="COACH">Coach</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(user)}
                      disabled={isLoadingThis}
                      className="size-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
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
