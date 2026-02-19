"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Calendar, ClipboardList, Weight, Smile, Moon, MessageSquare, Send, Check,
} from "lucide-react"
import { submitCoachFeedback, updateClientCheckInDay } from "@/app/actions/admin-clients"
import {
  getClientTemplateAssignments, assignTemplateToClient, removeTemplateAssignment,
  type CheckInTemplate,
} from "@/app/actions/check-in-templates"
import SubTabNavigation from "./SubTabNavigation"

const MOOD_LABELS: Record<number, string> = { 1: "Slecht", 2: "Matig", 3: "Oke", 4: "Goed", 5: "Top" }
const SLEEP_LABELS: Record<number, string> = { 1: "Slecht", 2: "Matig", 3: "Oke", 4: "Goed", 5: "Diep" }

interface CheckInsTabProps {
  clientId: string
  weeklyCheckIns: any[]
  dailyCheckIns: any[]
  weeklyCheckInDay: number
  clientTemplateAssignments: any[]
  coachTemplates: any[]
  onDataRefresh: () => void
}

export default function CheckInsTab({
  clientId,
  weeklyCheckIns,
  dailyCheckIns,
  weeklyCheckInDay,
  clientTemplateAssignments: initialTemplateAssignments,
  coachTemplates,
  onDataRefresh,
}: CheckInsTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<"weekly" | "daily">("weekly")
  const [feedbackText, setFeedbackText] = useState<Record<string, string>>({})
  const [feedbackSending, setFeedbackSending] = useState<string | null>(null)
  const [daySaving, setDaySaving] = useState(false)
  const [daySaved, setDaySaved] = useState(false)
  const [templateAssigning, setTemplateAssigning] = useState(false)
  const [clientTemplateAssignments, setClientTemplateAssignments] = useState<any[]>(initialTemplateAssignments)

  const handleFeedback = async (checkInId: string, type: "daily" | "weekly") => {
    const text = feedbackText[checkInId]
    if (!text?.trim()) return
    setFeedbackSending(checkInId)
    const result = await submitCoachFeedback(checkInId, type, text.trim())
    if (result.success) {
      setFeedbackText((prev) => ({ ...prev, [checkInId]: "" }))
      onDataRefresh()
    }
    setFeedbackSending(null)
  }

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
    <div className="space-y-6">
      <SubTabNavigation
        tabs={[
          { id: "weekly", label: "Wekelijks", icon: Calendar },
          { id: "daily", label: "Dagelijks", icon: ClipboardList },
        ]}
        active={activeSubTab}
        onChange={(id) => setActiveSubTab(id as "weekly" | "daily")}
      />

      {/* WEEKLY SUB-TAB */}
      {activeSubTab === "weekly" && (
        <div className="space-y-6">
          {/* Check-in Template Assignment */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <ClipboardList className="w-4 h-4" /> Check-in Templates
              </h3>
              <Link href="/coach/dashboard/check-ins/templates" className="text-xs text-evotion-primary font-medium hover:underline">
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
                        type === "weekly" ? "bg-evotion-primary/10 text-evotion-primary" : "bg-secondary text-muted-foreground"
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
                      className="text-xs border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:ring-2 focus:ring-evotion-primary/20 outline-none disabled:opacity-50"
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

          {/* Check-in Day Picker */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Wekelijkse check-in dag
              </h3>
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
                      ? "bg-evotion-primary text-white shadow-sm"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  } ${daySaving ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Weekly Check-ins List */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Wekelijkse Check-ins ({weeklyCheckIns.length})
            </h3>
            {weeklyCheckIns.length === 0 ? (
              <div className="bg-card rounded-xl border border-border p-10 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-3">
                  <Calendar className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Nog geen wekelijkse check-ins</p>
              </div>
            ) : (
              <div className="space-y-3">
                {weeklyCheckIns.slice(0, 12).map((ci) => (
                  <div key={ci.id} className="bg-card rounded-xl border border-border p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-evotion-primary bg-evotion-primary/10 px-2.5 py-1 rounded-full">
                          Week {ci.week_number}, {ci.year}
                        </span>
                        {ci.weight && (
                          <span className="text-sm text-foreground flex items-center gap-1">
                            <Weight className="w-3.5 h-3.5 text-muted-foreground" /> {ci.weight} kg
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(ci.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}
                      </span>
                    </div>

                    {/* Metrics grid */}
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {[
                        { label: "Gevoel", value: ci.feeling },
                        { label: "Energie", value: ci.energy_level },
                        { label: "Slaap", value: ci.sleep_quality },
                        { label: "Stress", value: ci.stress_level },
                        { label: "Voeding", value: ci.nutrition_adherence },
                      ].filter(m => m.value != null).map(m => (
                        <div key={m.label} className="bg-secondary/50 rounded-lg p-2.5 text-center">
                          <p className="text-xs text-muted-foreground mb-0.5">{m.label}</p>
                          <p className="text-sm font-bold text-foreground">{m.value}/10</p>
                        </div>
                      ))}
                    </div>

                    {ci.notes && (
                      <div className="bg-secondary/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Notities</p>
                        <p className="text-sm text-foreground leading-relaxed">{ci.notes}</p>
                      </div>
                    )}
                    {ci.coach_feedback && (
                      <div className="bg-evotion-primary/5 rounded-lg p-3">
                        <p className="text-xs text-evotion-primary mb-1 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" /> Jouw feedback
                        </p>
                        <p className="text-sm text-foreground leading-relaxed">{ci.coach_feedback}</p>
                      </div>
                    )}

                    {/* Feedback input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Feedback op deze check-in..."
                        value={feedbackText[ci.id] || ""}
                        onChange={(e) => setFeedbackText((prev) => ({ ...prev, [ci.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === "Enter" && handleFeedback(ci.id, "weekly")}
                        className="flex-1 px-3 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-evotion-primary/20 outline-none"
                      />
                      <button
                        onClick={() => handleFeedback(ci.id, "weekly")}
                        disabled={!feedbackText[ci.id]?.trim() || feedbackSending === ci.id}
                        className="px-3 py-2.5 bg-evotion-primary text-white rounded-lg disabled:opacity-40 hover:bg-evotion-primary/90 transition"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* DAILY SUB-TAB */}
      {activeSubTab === "daily" && (
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <ClipboardList className="w-4 h-4" /> Dagelijkse Check-ins ({dailyCheckIns.length})
          </h3>
          {dailyCheckIns.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-10 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-3">
                <ClipboardList className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Nog geen dagelijkse check-ins</p>
            </div>
          ) : (
            <div className="space-y-2">
              {dailyCheckIns.slice(0, 14).map((ci) => (
                <div key={ci.id} className="bg-card rounded-xl border border-border p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-muted-foreground bg-secondary px-2.5 py-1 rounded-md">
                        {new Date(ci.check_in_date).toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" })}
                      </span>
                      {ci.weight && (
                        <span className="text-sm text-foreground flex items-center gap-1">
                          <Weight className="w-3.5 h-3.5 text-muted-foreground" /> {ci.weight} kg
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {ci.mood && (
                        <span className="flex items-center gap-1">
                          <Smile className="w-3.5 h-3.5" /> {MOOD_LABELS[ci.mood]}
                        </span>
                      )}
                      {ci.sleep_quality && (
                        <span className="flex items-center gap-1">
                          <Moon className="w-3.5 h-3.5" /> {SLEEP_LABELS[ci.sleep_quality]}
                        </span>
                      )}
                    </div>
                  </div>
                  {ci.notes && (
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <p className="text-sm text-foreground leading-relaxed">{ci.notes}</p>
                    </div>
                  )}
                  {ci.coach_feedback && (
                    <div className="bg-evotion-primary/5 rounded-lg p-3">
                      <p className="text-xs text-evotion-primary mb-1 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" /> Jouw feedback
                      </p>
                      <p className="text-sm text-foreground leading-relaxed">{ci.coach_feedback}</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Feedback..."
                      value={feedbackText[ci.id] || ""}
                      onChange={(e) => setFeedbackText((prev) => ({ ...prev, [ci.id]: e.target.value }))}
                      onKeyDown={(e) => e.key === "Enter" && handleFeedback(ci.id, "daily")}
                      className="flex-1 px-3 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-evotion-primary/20 outline-none"
                    />
                    <button
                      onClick={() => handleFeedback(ci.id, "daily")}
                      disabled={!feedbackText[ci.id]?.trim() || feedbackSending === ci.id}
                      className="px-3 py-2.5 bg-evotion-primary text-white rounded-lg disabled:opacity-40 hover:bg-evotion-primary/90 transition"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
