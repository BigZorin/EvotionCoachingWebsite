"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Settings, Calendar, ClipboardList, Check, UserCircle,
} from "lucide-react"
import { updateClientCheckInDay } from "@/app/actions/admin-clients"
import {
  getClientTemplateAssignments, assignTemplateToClient, removeTemplateAssignment,
  type CheckInTemplate,
} from "@/app/actions/check-in-templates"

interface InstellingenTabProps {
  clientId: string
  profile: any
  client: any
  weeklyCheckInDay: number
  clientTemplateAssignments: any[]
  coachTemplates: CheckInTemplate[]
  onDataRefresh: () => void
}

export default function InstellingenTab({
  clientId,
  profile,
  client,
  weeklyCheckInDay,
  clientTemplateAssignments: initialTemplateAssignments,
  coachTemplates,
  onDataRefresh,
}: InstellingenTabProps) {
  const [daySaving, setDaySaving] = useState(false)
  const [daySaved, setDaySaved] = useState(false)
  const [templateAssigning, setTemplateAssigning] = useState(false)
  const [clientTemplateAssignments, setClientTemplateAssignments] = useState<any[]>(initialTemplateAssignments)

  const handleCheckInDayChange = async (day: number) => {
    setDaySaving(true)
    setDaySaved(false)
    const result = await updateClientCheckInDay(clientId, day)
    if (result.success) {
      setDaySaved(true)
      setTimeout(() => setDaySaved(false), 2000)
    }
    setDaySaving(false)
    onDataRefresh()
  }

  return (
    <div className="space-y-4">
      {/* Client Info */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-lg bg-secondary">
            <UserCircle className="w-4 h-4 text-muted-foreground" />
          </div>
          <span className="text-sm font-semibold text-foreground">Client Gegevens</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-muted/40 rounded-lg p-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Email</p>
            <p className="text-sm text-foreground">{client?.email || "Onbekend"}</p>
          </div>
          <div className="bg-muted/40 rounded-lg p-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Lid sinds</p>
            <p className="text-sm text-foreground">{client?.created_at ? new Date(client.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" }) : "Onbekend"}</p>
          </div>
          {profile?.phone && (
            <div className="bg-muted/40 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Telefoon</p>
              <p className="text-sm text-foreground">{profile.phone}</p>
            </div>
          )}
          {profile?.date_of_birth && (
            <div className="bg-muted/40 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Geboortedatum</p>
              <p className="text-sm text-foreground">{new Date(profile.date_of_birth).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}</p>
            </div>
          )}
        </div>
      </div>

      {/* Check-in Day Picker */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-secondary">
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">Wekelijkse check-in dag</span>
          </div>
          {daySaved && (
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <Check className="w-3 h-3" /> Opgeslagen
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Op deze dag verschijnt de wekelijkse check-in in de app.
        </p>
        <div className="flex gap-2">
          {[
            { day: 1, label: "Ma" },
            { day: 2, label: "Di" },
            { day: 3, label: "Wo" },
            { day: 4, label: "Do" },
            { day: 5, label: "Vr" },
            { day: 6, label: "Za" },
            { day: 0, label: "Zo" },
          ].map(({ day, label }) => (
            <button
              key={day}
              onClick={() => handleCheckInDayChange(day)}
              disabled={daySaving}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
                weeklyCheckInDay === day
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              } ${daySaving ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Check-in Template Assignment */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-secondary">
              <ClipboardList className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">Check-in Templates</span>
          </div>
          <Link href="/coach/dashboard/check-ins/templates" className="text-xs text-primary font-medium hover:underline">
            Templates beheren
          </Link>
        </div>
        <div className="space-y-0">
          {["weekly", "daily"].map((type, i) => {
            const assigned = clientTemplateAssignments.find((a: any) => a.template?.check_in_type === type)
            const defaultTemplate = coachTemplates.find((t: any) => t.check_in_type === type && t.is_default && t.is_active)
            const availableTemplates = coachTemplates.filter((t: any) => t.check_in_type === type && t.is_active)
            const current = assigned?.template || null
            const displayName = current ? current.name : defaultTemplate ? `${defaultTemplate.name} (standaard)` : "Geen template"
            const questionCount = current?.questions?.length || defaultTemplate?.questions?.length || 0

            return (
              <div key={type} className={`flex items-center justify-between py-4 ${i > 0 ? "border-t border-border" : ""}`}>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold uppercase ${
                    type === "weekly" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                  }`}>
                    {type === "weekly" ? "Wekelijks" : "Dagelijks"}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{displayName}</p>
                    <p className="text-xs text-muted-foreground">{questionCount} vragen</p>
                  </div>
                </div>
                <select
                  value={assigned?.template_id || ""}
                  onChange={async (e) => {
                    const templateId = e.target.value
                    setTemplateAssigning(true)
                    if (templateId) {
                      await assignTemplateToClient(templateId, clientId)
                    } else if (assigned) {
                      await removeTemplateAssignment(assigned.template_id, clientId)
                    }
                    const res = await getClientTemplateAssignments(clientId)
                    if (res.success && res.assignments) setClientTemplateAssignments(res.assignments)
                    setTemplateAssigning(false)
                    onDataRefresh()
                  }}
                  disabled={templateAssigning}
                  className="text-xs border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:ring-2 focus:ring-primary/20 outline-none disabled:opacity-50"
                >
                  <option value="">{defaultTemplate ? `Standaard (${defaultTemplate.name})` : "Geen"}</option>
                  {availableTemplates.map((t: any) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
