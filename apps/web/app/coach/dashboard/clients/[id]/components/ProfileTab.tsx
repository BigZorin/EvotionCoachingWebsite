"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Camera, StickyNote, Target, Pin, Trash2, Plus, Check, X, Calendar, ArrowRight,
} from "lucide-react"
import {
  getCoachNotes, addCoachNote, deleteCoachNote, togglePinNote,
  getClientGoals, addClientGoal, updateGoalStatus, deleteClientGoal,
  type CoachNote, type ClientGoal,
} from "@/app/actions/admin-clients"

interface ProfileTabProps {
  clientId: string
  photos: any[]
  notes: any[]
  goals: any[]
  onDataRefresh: () => void
}

export default function ProfileTab({
  clientId,
  photos,
  notes: initialNotes,
  goals: initialGoals,
  onDataRefresh,
}: ProfileTabProps) {
  const [notes, setNotes] = useState<CoachNote[]>(initialNotes as CoachNote[])
  const [newNote, setNewNote] = useState("")
  const [goals, setGoals] = useState<ClientGoal[]>(initialGoals as ClientGoal[])
  const [newGoal, setNewGoal] = useState({ title: "", description: "", target_date: "" })
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null)

  const activeGoals = goals.filter((g) => g.status === "active")
  const completedGoals = goals.filter((g) => g.status === "completed")

  const handleAddNote = async () => {
    if (!newNote.trim()) return
    await addCoachNote(clientId, newNote.trim())
    setNewNote("")
    const res = await getCoachNotes(clientId)
    if (res.success) setNotes((res.notes || []) as CoachNote[])
  }

  const handleAddGoal = async () => {
    if (!newGoal.title.trim()) return
    await addClientGoal(clientId, newGoal)
    setNewGoal({ title: "", description: "", target_date: "" })
    setShowGoalForm(false)
    const res = await getClientGoals(clientId)
    if (res.success) setGoals((res.goals || []) as ClientGoal[])
  }

  return (
    <div className="space-y-4">
      {/* Lightbox */}
      {lightboxPhoto && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setLightboxPhoto(null)}>
          <button onClick={() => setLightboxPhoto(null)} className="absolute top-4 right-4 text-white/70 hover:text-white p-2" aria-label="Sluiten">
            <X className="w-6 h-6" />
          </button>
          <img src={lightboxPhoto} alt="Voortgangsfoto" className="max-w-full max-h-[90vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* SECTION 1: Photos */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50">
              <Camera className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm font-semibold text-foreground">{"Foto's"}</span>
            {photos.length > 0 && (
              <span className="text-xs text-muted-foreground">({photos.length})</span>
            )}
          </div>
          {photos.length > 0 && (
            <Link
              href={`/coach/dashboard/clients/${clientId}/photos`}
              className="flex items-center gap-1 text-xs font-medium text-foreground hover:text-foreground/70 transition-colors"
            >
              Vergelijking <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
              <Camera className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-foreground font-medium">{"Nog geen voortgangsfoto's"}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {"Foto's worden automatisch getoond zodra de client ze uploadt"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {photos.map((photo: any) => (
              <button
                key={photo.id}
                onClick={() => setLightboxPhoto(photo.photo_url)}
                className="group bg-muted/30 rounded-lg overflow-hidden border border-border hover:border-foreground/20 transition-all text-left"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={photo.photo_url}
                    alt="Voortgangsfoto"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-2.5">
                  <p className="text-xs text-muted-foreground">
                    {new Date(photo.taken_at).toLocaleDateString("nl-NL", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  {photo.category && (
                    <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded mt-1 inline-block">
                      {photo.category}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: Coach Notes */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-50">
            <StickyNote className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-sm font-semibold text-foreground">Notities</span>
          {notes.length > 0 && (
            <span className="text-xs text-muted-foreground">({notes.length})</span>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
            placeholder="Schrijf een notitie..."
            className="flex-1 px-3 py-2.5 text-sm bg-muted/50 border border-border rounded-lg focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 outline-none transition-all placeholder:text-muted-foreground/60"
          />
          <button
            onClick={handleAddNote}
            disabled={!newNote.trim()}
            className="px-4 py-2.5 bg-foreground text-background text-sm rounded-lg disabled:opacity-30 hover:bg-foreground/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground">
          Notities zijn alleen zichtbaar voor jou als coach.
        </p>

        {notes.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
              <StickyNote className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Nog geen notities</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Pinned notes first */}
            {notes.filter(n => n.is_pinned).map((note) => (
              <NoteCard key={note.id} note={note} clientId={clientId} setNotes={setNotes} isPinned />
            ))}
            {notes.filter(n => !n.is_pinned).map((note) => (
              <NoteCard key={note.id} note={note} clientId={clientId} setNotes={setNotes} />
            ))}
          </div>
        )}
      </div>

      {/* SECTION 3: Goals */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-evotion-primary/5">
              <Target className="w-4 h-4 text-evotion-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">Doelen</span>
            {goals.length > 0 && (
              <span className="text-xs text-muted-foreground">({activeGoals.length} actief)</span>
            )}
          </div>
          <button
            onClick={() => setShowGoalForm(!showGoalForm)}
            className="flex items-center gap-1.5 px-3 py-2 bg-foreground text-background text-xs font-medium rounded-lg hover:bg-foreground/90 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Nieuw Doel
          </button>
        </div>

        {/* Goal form */}
        {showGoalForm && (
          <div className="border border-border rounded-lg p-4 space-y-3 bg-muted/30">
            <input
              type="text"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              placeholder="Doel titel *"
              className="w-full px-3 py-2.5 text-sm bg-card border border-border rounded-lg outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 transition-all"
            />
            <input
              type="text"
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              placeholder="Beschrijving (optioneel)"
              className="w-full px-3 py-2.5 text-sm bg-card border border-border rounded-lg outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 transition-all"
            />
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="date"
                value={newGoal.target_date}
                onChange={(e) => setNewGoal({ ...newGoal, target_date: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-card border border-border rounded-lg outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 transition-all"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowGoalForm(false)}
                className="px-4 py-2 text-sm text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Annuleren
              </button>
              <button
                onClick={handleAddGoal}
                disabled={!newGoal.title.trim()}
                className="px-4 py-2 text-sm bg-foreground text-background rounded-lg disabled:opacity-30 hover:bg-foreground/90 transition-colors"
              >
                Toevoegen
              </button>
            </div>
          </div>
        )}

        {/* Active goals */}
        {activeGoals.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Actief</h4>
            <div className="space-y-2">
              {activeGoals.map((goal) => {
                const daysLeft = goal.target_date
                  ? Math.ceil((new Date(goal.target_date).getTime() - Date.now()) / 86400000)
                  : null
                const totalDays = goal.target_date && goal.created_at
                  ? Math.ceil((new Date(goal.target_date).getTime() - new Date(goal.created_at).getTime()) / 86400000)
                  : null
                const progressPct = totalDays && daysLeft !== null ? Math.min(Math.max(((totalDays - daysLeft) / totalDays) * 100, 0), 100) : 0

                return (
                  <div
                    key={goal.id}
                    className="p-3.5 bg-muted/30 rounded-lg border border-border"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{goal.title}</p>
                        {goal.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{goal.description}</p>
                        )}
                        {/* Progress bar */}
                        {daysLeft !== null && totalDays && totalDays > 0 && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-xs font-medium ${daysLeft <= 0 ? "text-red-500" : daysLeft <= 7 ? "text-amber-600" : "text-muted-foreground"}`}>
                                {daysLeft > 0 ? `${daysLeft} dagen over` : "Deadline bereikt"}
                              </span>
                              <span className="text-xs text-muted-foreground">{Math.round(progressPct)}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${daysLeft <= 0 ? "bg-red-500" : daysLeft <= 7 ? "bg-amber-500" : "bg-foreground"}`}
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {daysLeft !== null && (!totalDays || totalDays <= 0) && (
                          <p className={`text-xs mt-1 ${daysLeft <= 0 ? "text-red-500" : "text-muted-foreground"}`}>
                            {daysLeft > 0 ? `${daysLeft} dagen over` : "Deadline bereikt"}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 ml-3">
                        <button
                          onClick={async () => {
                            await updateGoalStatus(goal.id, "completed")
                            const r = await getClientGoals(clientId)
                            if (r.success) setGoals((r.goals || []) as ClientGoal[])
                          }}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Voltooid"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={async () => {
                            await deleteClientGoal(goal.id)
                            const r = await getClientGoals(clientId)
                            if (r.success) setGoals((r.goals || []) as ClientGoal[])
                          }}
                          className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Verwijderen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Completed goals */}
        {completedGoals.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Voltooid ({completedGoals.length})
            </h4>
            <div className="space-y-2">
              {completedGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-lg border border-emerald-100"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Check className="w-3 h-3 text-emerald-600" />
                    </div>
                    <span className="text-sm text-muted-foreground line-through">{goal.title}</span>
                  </div>
                  {goal.completed_at && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(goal.completed_at).toLocaleDateString("nl-NL", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {goals.length === 0 && !showGoalForm && (
          <div className="text-center py-10">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
              <Target className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-foreground font-medium">Nog geen doelen ingesteld</p>
            <p className="text-xs text-muted-foreground mt-1">
              Stel motiverende doelen in voor deze client
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── NoteCard ────────────────────────────────────────────

function NoteCard({ note, clientId, setNotes, isPinned }: { note: CoachNote; clientId: string; setNotes: React.Dispatch<React.SetStateAction<CoachNote[]>>; isPinned?: boolean }) {
  return (
    <div className={`p-3.5 rounded-lg border transition-colors ${isPinned ? "bg-amber-50/50 border-amber-200/60" : "bg-muted/30 border-border"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {isPinned && (
            <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-medium mb-1">
              <Pin className="w-3 h-3" /> Vastgepind
            </span>
          )}
          <p className="text-sm text-foreground leading-relaxed">{note.content}</p>
          <p className="text-xs text-muted-foreground mt-1.5">
            {new Date(note.created_at).toLocaleDateString("nl-NL", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={async () => {
              await togglePinNote(note.id)
              const r = await getCoachNotes(clientId)
              if (r.success) setNotes((r.notes || []) as CoachNote[])
            }}
            className={`p-2 rounded-lg transition-colors ${isPinned ? "text-amber-500 hover:bg-amber-100" : "text-muted-foreground hover:text-amber-500 hover:bg-amber-50"}`}
            title="Vastpinnen"
          >
            <Pin className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={async () => {
              await deleteCoachNote(note.id)
              const r = await getCoachNotes(clientId)
              if (r.success) setNotes((r.notes || []) as CoachNote[])
            }}
            className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Verwijderen"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
