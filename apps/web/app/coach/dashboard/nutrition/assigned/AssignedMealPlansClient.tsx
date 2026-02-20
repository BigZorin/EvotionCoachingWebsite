"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getAllAssignments, unassignMealPlan } from "@/app/actions/nutrition"
import { Users, UtensilsCrossed, AlertCircle, X, Calendar } from "lucide-react"

type Assignment = {
  id: string
  client_id: string
  meal_plan_id: string
  is_active: boolean
  start_date: string | null
  end_date: string | null
  notes: string | null
  created_at: string
  meal_plans: { id: string; name: string } | null
  profile: { user_id: string; first_name: string | null; last_name: string | null; avatar_url: string | null } | null
}

export default function AssignedMealPlansClient() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)

  useEffect(() => {
    loadAssignments()
  }, [])

  const loadAssignments = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await getAllAssignments()
      if (result.success && result.assignments) {
        setAssignments(result.assignments as Assignment[])
      } else {
        setError(result.error || "Fout bij laden")
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnassign = async (id: string) => {
    if (!confirm("Weet je zeker dat je deze toewijzing wilt deactiveren?")) return
    setRemovingId(id)
    try {
      const result = await unassignMealPlan(id)
      if (result.success) {
        setAssignments((prev) =>
          prev.map((a) => a.id === id ? { ...a, is_active: false } : a)
        )
      } else {
        alert(result.error || "Fout")
      }
    } finally {
      setRemovingId(null)
    }
  }

  const activeAssignments = assignments.filter((a) => a.is_active)
  const inactiveAssignments = assignments.filter((a) => !a.is_active)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Toegewezen Meal Plans</h1>
        <p className="text-muted-foreground">Overzicht van alle client meal plan toewijzingen</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center py-12">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <p className="text-muted-foreground">{error}</p>
        </div>
      ) : assignments.length === 0 ? (
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-12 text-center">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Geen Toewijzingen</h3>
            <p className="text-muted-foreground">
              Wijs een meal plan toe via de Meal Plans pagina.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Active */}
          {activeAssignments.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Actief ({activeAssignments.length})
              </h2>
              <div className="space-y-3">
                {activeAssignments.map((a) => (
                  <Card key={a.id} className="bg-card border-border shadow-sm">
                    <CardContent className="p-4 flex items-center gap-4">
                      {a.profile?.avatar_url ? (
                        <img src={a.profile.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground font-medium">
                          {(a.profile?.first_name?.[0] || "?").toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">
                          {a.profile?.first_name} {a.profile?.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <UtensilsCrossed className="h-3.5 w-3.5" />
                          {a.meal_plans?.name || "Onbekend plan"}
                        </p>
                      </div>
                      {(a.start_date || a.end_date) && (
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {a.start_date && new Date(a.start_date).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}
                          {a.start_date && a.end_date && " - "}
                          {a.end_date && new Date(a.end_date).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}
                        </div>
                      )}
                      <Badge className="bg-emerald-500/10 text-green-800">Actief</Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnassign(a.id)}
                        disabled={removingId === a.id}
                        className="text-destructive hover:text-destructive hover:bg-destructive/5"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Inactive */}
          {inactiveAssignments.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-muted-foreground mb-4">
                Inactief ({inactiveAssignments.length})
              </h2>
              <div className="space-y-3 opacity-60">
                {inactiveAssignments.map((a) => (
                  <Card key={a.id} className="bg-card border-border shadow-sm">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground font-medium">
                        {(a.profile?.first_name?.[0] || "?").toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-muted-foreground">
                          {a.profile?.first_name} {a.profile?.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">{a.meal_plans?.name || "Onbekend"}</p>
                      </div>
                      <Badge variant="outline" className="text-muted-foreground">Inactief</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
