"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Camera, StickyNote, Target, Pin, Trash2, Plus, Check, X,
} from "lucide-react"
import {
  getCoachNotes, addCoachNote, deleteCoachNote, togglePinNote,
  getClientGoals, addClientGoal, updateGoalStatus, deleteClientGoal,
  type CoachNote, type ClientGoal,
} from "@/app/actions/admin-clients"

// ─── Props ────────────────────────────────────────────────

interface ProfileTabProps {
  clientId: string
  photos: any[]
  notes: any[]
  goals: any[]
  onDataRefresh: () => void
}

// ─── Component ────────────────────────────────────────────

export default function ProfileTab({
  clientId,
  photos,
  notes: initialNotes,
  goals: initialGoals,
  onDataRefresh,
}: ProfileTabProps) {
  // Notes state
  const [notes, setNotes] = useState<CoachNote[]>(initialNotes as CoachNote[])
  const [newNote, setNewNote] = useState("")

  // Goals state
  const [goals, setGoals] = useState<ClientGoal[]>(initialGoals as ClientGoal[])
  const [newGoal, setNewGoal] = useState({ title: "", description: "", target_date: "" })
  const [showGoalForm, setShowGoalForm] = useState(false)

  // Derived
  const activeGoals = goals.filter((g) => g.status === "active")
  const completedGoals = goals.filter((g) => g.status === "completed")

  // ── Handlers ──────────────────────────────────────────────

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

  // ── Render ────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* ═══════════════════════════════════════════════
          SECTION 1: Voortgangsfoto's
          ═══════════════════════════════════════════════ */}
      <div className="bg-white rounded-xl border p-5">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2 mb-4">
          <Camera className="w-4 h-4" /> Foto&apos;s
        </h3>

        {photos.length === 0 ? (
          <div className="text-center py-8">
            <Camera className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Nog geen voortgangsfoto&apos;s</p>
            <p className="text-xs text-gray-400 mt-1">
              Foto&apos;s worden automatisch getoond zodra de client ze uploadt
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {photos.map((photo: any) => (
              <div key={photo.id} className="bg-white rounded-xl border overflow-hidden">
                <img
                  src={photo.photo_url}
                  alt="Progress"
                  className="w-full h-48 object-cover"
                />
                <div className="p-3">
                  <p className="text-xs text-gray-500">
                    {new Date(photo.taken_at).toLocaleDateString("nl-NL", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  {photo.category && (
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {photo.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <Link
          href={`/coach/dashboard/clients/${clientId}/photos`}
          className="block text-center text-sm text-[#1e1839] hover:underline mt-4"
        >
          Naar foto vergelijking &rarr;
        </Link>
      </div>

      {/* ═══════════════════════════════════════════════
          SECTION 2: Coach Notities
          ═══════════════════════════════════════════════ */}
      <div className="bg-white rounded-xl border p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2">
          <StickyNote className="w-4 h-4" /> Notities
        </h3>

        <div className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
            placeholder="Schrijf een priv\u00E9 notitie..."
            className="flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#1e1839]/20 outline-none"
          />
          <button
            onClick={handleAddNote}
            disabled={!newNote.trim()}
            className="px-4 py-2 bg-[#1e1839] text-white text-sm rounded-lg disabled:opacity-40"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[10px] text-gray-400">
          Notities zijn alleen zichtbaar voor jou als coach.
        </p>

        {notes.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">Nog geen notities</p>
        ) : (
          <div className="space-y-2">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`p-3 rounded-lg border ${
                  note.is_pinned
                    ? "bg-amber-50 border-amber-200"
                    : "bg-gray-50 border-gray-100"
                }`}
              >
                <div className="flex items-start justify-between">
                  <p className="text-sm text-gray-800 flex-1">{note.content}</p>
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={async () => {
                        await togglePinNote(note.id)
                        const r = await getCoachNotes(clientId)
                        if (r.success) setNotes((r.notes || []) as CoachNote[])
                      }}
                      className="p-1 text-gray-400 hover:text-amber-500"
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
                      className="p-1 text-gray-400 hover:text-red-500"
                      title="Verwijderen"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  {new Date(note.created_at).toLocaleDateString("nl-NL", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════
          SECTION 3: Client Doelen
          ═══════════════════════════════════════════════ */}
      <div className="bg-white rounded-xl border p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2">
            <Target className="w-4 h-4" /> Doelen
          </h3>
          <button
            onClick={() => setShowGoalForm(!showGoalForm)}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#1e1839] text-white text-sm rounded-lg"
          >
            <Plus className="w-4 h-4" /> Nieuw Doel
          </button>
        </div>

        {/* Goal form */}
        {showGoalForm && (
          <div className="border rounded-lg p-4 space-y-3">
            <input
              type="text"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              placeholder="Doel titel *"
              className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-[#1e1839]/20"
            />
            <input
              type="text"
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              placeholder="Beschrijving (optioneel)"
              className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-[#1e1839]/20"
            />
            <input
              type="date"
              value={newGoal.target_date}
              onChange={(e) => setNewGoal({ ...newGoal, target_date: e.target.value })}
              className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-[#1e1839]/20"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowGoalForm(false)}
                className="px-4 py-2 text-sm text-gray-600 border rounded-lg"
              >
                Annuleren
              </button>
              <button
                onClick={handleAddGoal}
                disabled={!newGoal.title.trim()}
                className="px-4 py-2 text-sm bg-[#1e1839] text-white rounded-lg disabled:opacity-40"
              >
                Toevoegen
              </button>
            </div>
          </div>
        )}

        {/* Active goals */}
        {activeGoals.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Actief</h4>
            <div className="space-y-2">
              {activeGoals.map((goal) => {
                const daysLeft = goal.target_date
                  ? Math.ceil((new Date(goal.target_date).getTime() - Date.now()) / 86400000)
                  : null
                return (
                  <div
                    key={goal.id}
                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{goal.title}</p>
                      {goal.description && (
                        <p className="text-xs text-gray-500">{goal.description}</p>
                      )}
                      {daysLeft !== null && (
                        <p className="text-xs text-blue-600 mt-0.5">
                          {daysLeft > 0 ? `${daysLeft} dagen over` : "Deadline bereikt!"}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={async () => {
                          await updateGoalStatus(goal.id, "completed")
                          const r = await getClientGoals(clientId)
                          if (r.success) setGoals((r.goals || []) as ClientGoal[])
                        }}
                        className="p-1.5 text-green-600 hover:bg-green-100 rounded"
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
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded"
                        title="Verwijderen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Voltooid ({completedGoals.length})
            </h4>
            <div className="space-y-2">
              {completedGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600 line-through">{goal.title}</span>
                  </div>
                  {goal.completed_at && (
                    <span className="text-xs text-gray-400">
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
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Nog geen doelen ingesteld</p>
            <p className="text-xs text-gray-400 mt-1">
              Stel motiverende doelen in voor deze client
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
