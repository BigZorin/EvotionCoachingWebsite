"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getMealPlan, assignMealPlan, getAssignedClients } from "@/app/actions/nutrition"
import { getCoachClients } from "@/app/actions/groups"
import { ArrowLeft, UserPlus, Check, Loader2 } from "lucide-react"

type Client = {
  user_id: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
}

export default function AssignMealPlanClient() {
  const router = useRouter()
  const params = useParams()
  const mealPlanId = params.id as string

  const [planName, setPlanName] = useState("")
  const [clients, setClients] = useState<Client[]>([])
  const [assignedClientIds, setAssignedClientIds] = useState<Set<string>>(new Set())
  const [selectedClients, setSelectedClients] = useState<Set<string>>(new Set())
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [assigning, setAssigning] = useState(false)

  useEffect(() => {
    loadData()
  }, [mealPlanId])

  const loadData = async () => {
    const [planResult, clientsResult, assignedResult] = await Promise.all([
      getMealPlan(mealPlanId),
      getCoachClients(),
      getAssignedClients(mealPlanId),
    ])

    if (planResult.success && planResult.mealPlan) {
      setPlanName((planResult.mealPlan as any).name)
    }

    if (clientsResult.success && clientsResult.clients) {
      setClients(clientsResult.clients as Client[])
    }

    if (assignedResult.success && assignedResult.clients) {
      setAssignedClientIds(new Set((assignedResult.clients as any[]).map((c) => c.client_id)))
    }

    setIsLoading(false)
  }

  const toggleClient = (clientId: string) => {
    setSelectedClients((prev) => {
      const next = new Set(prev)
      if (next.has(clientId)) next.delete(clientId)
      else next.add(clientId)
      return next
    })
  }

  const handleAssign = async () => {
    if (selectedClients.size === 0) {
      alert("Selecteer minstens één client")
      return
    }
    setAssigning(true)
    try {
      const promises = Array.from(selectedClients).map((clientId) =>
        assignMealPlan({
          client_id: clientId,
          meal_plan_id: mealPlanId,
          start_date: startDate || undefined,
          end_date: endDate || undefined,
          notes: notes.trim() || undefined,
        })
      )
      const results = await Promise.all(promises)
      const failed = results.filter((r) => !r.success)
      if (failed.length > 0) {
        alert(`${results.length - failed.length} van ${results.length} toewijzingen gelukt`)
      }
      router.push("/coach/dashboard/nutrition/assigned")
    } finally {
      setAssigning(false)
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div></div>
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Meal Plan Toewijzen</h1>
          <p className="text-muted-foreground">{planName}</p>
        </div>
      </div>

      {/* Client selection */}
      <Card className="bg-card border-border shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Selecteer Clients</h2>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {clients.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center">Geen clients gevonden</p>
            ) : (
              clients.map((client) => {
                const alreadyAssigned = assignedClientIds.has(client.user_id)
                const isSelected = selectedClients.has(client.user_id)
                return (
                  <button
                    key={client.user_id}
                    onClick={() => !alreadyAssigned && toggleClient(client.user_id)}
                    disabled={alreadyAssigned}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                      alreadyAssigned
                        ? "bg-emerald-500/5 opacity-60 cursor-default"
                        : isSelected
                        ? "bg-primary/5 border-2 border-primary"
                        : "hover:bg-secondary/50 border-2 border-transparent"
                    }`}
                  >
                    {client.avatar_url ? (
                      <img src={client.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground font-medium">
                        {(client.first_name?.[0] || "").toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {client.first_name} {client.last_name}
                      </p>
                    </div>
                    {alreadyAssigned && (
                      <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                        <Check className="h-3.5 w-3.5" /> Toegewezen
                      </span>
                    )}
                    {isSelected && !alreadyAssigned && (
                      <div className="w-5 h-5 bg-primary rounded flex items-center justify-center">
                        <Check className="h-3.5 w-3.5 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Options */}
      <Card className="bg-card border-border shadow-sm">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Opties</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Startdatum</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Einddatum</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Notities</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optionele notities voor de client..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-3 pb-8">
        <Button variant="outline" onClick={() => router.back()}>Annuleren</Button>
        <Button
          onClick={handleAssign}
          disabled={assigning || selectedClients.size === 0}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {assigning ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Toewijzen...</>
          ) : (
            <><UserPlus className="h-4 w-4 mr-2" /> Toewijzen aan {selectedClients.size} client{selectedClients.size !== 1 ? "s" : ""}</>
          )}
        </Button>
      </div>
    </div>
  )
}
