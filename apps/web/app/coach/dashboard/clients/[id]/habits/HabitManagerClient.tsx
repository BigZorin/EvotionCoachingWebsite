"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2, Edit2, Flame, Check, X } from "lucide-react"
import {
  getClientHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  getClientHabitLogs,
  getClientHabitStreaks,
  type Habit,
  type HabitLog,
  type HabitStreak,
} from "@/app/actions/habits"

export default function HabitManagerClient({ clientId }: { clientId: string }) {
  const [habits, setHabits] = useState<Habit[]>([])
  const [logs, setLogs] = useState<HabitLog[]>([])
  const [streaks, setStreaks] = useState<HabitStreak[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newName, setNewName] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")

  useEffect(() => {
    loadData()
  }, [clientId])

  async function loadData() {
    setLoading(true)
    const [habitsRes, logsRes, streaksRes] = await Promise.all([
      getClientHabits(clientId),
      getClientHabitLogs(clientId, 30),
      getClientHabitStreaks(clientId),
    ])
    if (habitsRes.success && habitsRes.habits) setHabits(habitsRes.habits)
    if (logsRes.success && logsRes.logs) setLogs(logsRes.logs)
    if (streaksRes.success && streaksRes.streaks) setStreaks(streaksRes.streaks)
    setLoading(false)
  }

  async function handleCreate() {
    if (!newName.trim()) return
    const result = await createHabit({
      clientId,
      name: newName.trim(),
      description: newDescription.trim() || undefined,
    })
    if (result.success) {
      setNewName("")
      setNewDescription("")
      setShowCreateForm(false)
      loadData()
    }
  }

  async function handleUpdate(habitId: string) {
    if (!editName.trim()) return
    await updateHabit(habitId, {
      name: editName.trim(),
      description: editDescription.trim(),
    })
    setEditingId(null)
    loadData()
  }

  async function handleDelete(habitId: string) {
    if (!confirm("Weet je zeker dat je deze gewoonte wilt verwijderen?")) return
    await deleteHabit(habitId)
    loadData()
  }

  async function handleToggleActive(habitId: string, currentActive: boolean) {
    await updateHabit(habitId, { isActive: !currentActive })
    loadData()
  }

  function getStreak(habitId: string): number {
    const streak = streaks.find((s) => s.habit_id === habitId)
    return streak?.current_streak_days || 0
  }

  function getLongestStreak(habitId: string): number {
    const streak = streaks.find((s) => s.habit_id === habitId)
    return streak?.longest_streak_days || 0
  }

  function getCompletionRate(habitId: string): number {
    const habitLogs = logs.filter((l) => l.habit_id === habitId)
    if (habitLogs.length === 0) return 0
    const completed = habitLogs.filter((l) => l.completed).length
    return Math.round((completed / 30) * 100)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e1839]"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href={`/coach/dashboard/clients/${clientId}`}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gewoontes</h1>
            <p className="text-sm text-gray-500">Beheer dagelijkse gewoontes voor deze client</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1e1839] text-white rounded-lg hover:bg-[#2d2550] transition"
        >
          <Plus className="h-4 w-4" />
          Nieuwe Gewoonte
        </button>
      </div>

      {/* Create form */}
      {showCreateForm && (
        <div className="bg-white rounded-xl border p-6 mb-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Nieuwe Gewoonte</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Naam (bijv. 10.000 stappen)"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e1839]/20"
            />
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Beschrijving (optioneel)"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e1839]/20"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-[#1e1839] text-white rounded-lg hover:bg-[#2d2550] transition"
              >
                Opslaan
              </button>
              <button
                onClick={() => { setShowCreateForm(false); setNewName(""); setNewDescription(""); }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Annuleren
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Habits list */}
      {habits.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <p className="text-gray-500 text-lg mb-2">Nog geen gewoontes</p>
          <p className="text-gray-400 text-sm">Maak een gewoonte aan om de client dagelijks te laten bijhouden.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className={`bg-white rounded-xl border p-5 shadow-sm ${!habit.is_active ? 'opacity-60' : ''}`}
            >
              {editingId === habit.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e1839]/20"
                  />
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Beschrijving"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e1839]/20"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(habit.id)}
                      className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">{habit.name}</h3>
                      {getStreak(habit.id) > 0 && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                          <Flame className="h-3 w-3" />
                          {getStreak(habit.id)} dagen
                        </span>
                      )}
                      {!habit.is_active && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">Inactief</span>
                      )}
                    </div>
                    {habit.description && (
                      <p className="text-sm text-gray-500 mt-1">{habit.description}</p>
                    )}
                    <div className="flex gap-4 mt-3 text-xs text-gray-400">
                      <span>Compliance (30d): {getCompletionRate(habit.id)}%</span>
                      <span>Langste streak: {getLongestStreak(habit.id)} dagen</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingId(habit.id)
                        setEditName(habit.name)
                        setEditDescription(habit.description || "")
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                      title="Bewerken"
                    >
                      <Edit2 className="h-4 w-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleToggleActive(habit.id, habit.is_active)}
                      className={`p-2 hover:bg-gray-100 rounded-lg transition text-xs ${
                        habit.is_active ? 'text-gray-400' : 'text-green-600'
                      }`}
                      title={habit.is_active ? "Deactiveren" : "Activeren"}
                    >
                      {habit.is_active ? "Pauze" : "Actief"}
                    </button>
                    <button
                      onClick={() => handleDelete(habit.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition"
                      title="Verwijderen"
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
