"use client"

import { useState } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog"
import {
  Sparkles, ChevronDown, ChevronRight, Dumbbell, AlertTriangle, Calendar, X
} from "lucide-react"
import type { AITrainingProgram } from "@/app/actions/ai-coaching"

interface AITrainingPreviewProps {
  open: boolean
  onClose: () => void
  program: AITrainingProgram
  tokensUsed: number
  model: string
  ragUsed: boolean
  warnings: string[]
  onSave: () => Promise<void>
  onSaveAndAssign: (startDate: string) => Promise<void>
  saving: boolean
}

export default function AITrainingPreview({
  open, onClose, program, tokensUsed, model, ragUsed, warnings,
  onSave, onSaveAndAssign, saving,
}: AITrainingPreviewProps) {
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set(["0-0"]))
  const [showAssignDate, setShowAssignDate] = useState(false)
  const [startDate, setStartDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7)) // next Monday
    return d.toISOString().slice(0, 10)
  })

  const toggleDay = (key: string) => {
    setExpandedDays(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const sectionLabel = (s: string) => {
    if (s === "warm_up") return "Warm-up"
    if (s === "cool_down") return "Cool Down"
    return "Workout"
  }

  const sectionColor = (s: string) => {
    if (s === "warm_up") return "bg-amber-100 text-amber-700"
    if (s === "cool_down") return "bg-blue-100 text-blue-700"
    return "bg-purple-100 text-purple-700"
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1e1839] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg">{program.name}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-400">{model} — {tokensUsed} tokens</span>
                {ragUsed && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-700">RAG</span>
                )}
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-700">AI Generated</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Description */}
        {program.description && (
          <p className="text-sm text-gray-600 -mt-1">{program.description}</p>
        )}

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-amber-700 text-sm font-medium mb-1">
              <AlertTriangle className="w-4 h-4" />
              {warnings.length} waarschuwing{warnings.length > 1 ? "en" : ""}
            </div>
            <ul className="text-xs text-amber-600 space-y-0.5">
              {warnings.map((w, i) => <li key={i}>• {w}</li>)}
            </ul>
          </div>
        )}

        {/* Blocks & Days */}
        {program.blocks.map((block, bi) => (
          <div key={bi} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Block header */}
            <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">{block.name}</h3>
                <span className="text-xs text-gray-500">{block.durationWeeks} weken</span>
              </div>
            </div>

            {/* Days */}
            <div className="divide-y divide-gray-100">
              {block.days.map((day, di) => {
                const key = `${bi}-${di}`
                const isExpanded = expandedDays.has(key)

                return (
                  <div key={di}>
                    {/* Day header */}
                    <button
                      onClick={() => toggleDay(key)}
                      className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 transition text-left"
                    >
                      {isExpanded
                        ? <ChevronDown className="w-4 h-4 text-gray-400" />
                        : <ChevronRight className="w-4 h-4 text-gray-400" />
                      }
                      <Dumbbell className="w-4 h-4 text-[#1e1839]" />
                      <span className="text-sm font-medium text-gray-900">{day.name}</span>
                      {day.isRestDay && (
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-500">Rustdag</span>
                      )}
                      {!day.isRestDay && (
                        <span className="text-xs text-gray-400 ml-auto">{day.exercises.length} oefeningen</span>
                      )}
                    </button>

                    {/* Exercises */}
                    {isExpanded && !day.isRestDay && (
                      <div className="px-4 pb-3">
                        {(["warm_up", "workout", "cool_down"] as const).map(section => {
                          const exercises = day.exercises.filter(e => e.section === section)
                          if (exercises.length === 0) return null
                          return (
                            <div key={section} className="mb-3">
                              <div className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider mb-1.5 ${sectionColor(section)}`}>
                                {sectionLabel(section)}
                              </div>
                              <div className="space-y-1.5">
                                {exercises.map((ex, ei) => (
                                  <div key={ei} className="flex items-start gap-3 bg-gray-50 rounded-lg px-3 py-2">
                                    <span className="text-xs font-bold text-[#1e1839] mt-0.5 w-5 shrink-0">
                                      {String.fromCharCode(65 + ei)}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">{ex.exerciseName || ex.exerciseId}</p>
                                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                                        <span className="text-xs text-gray-500">{ex.sets} × {ex.reps}</span>
                                        {ex.restSeconds > 0 && <span className="text-xs text-gray-500">Rest {ex.restSeconds}s</span>}
                                        {ex.prescribedRpe && <span className="text-xs text-gray-500">RPE {ex.prescribedRpe}</span>}
                                        {ex.prescribedRir != null && <span className="text-xs text-gray-500">RIR {ex.prescribedRir}</span>}
                                        {ex.tempo && <span className="text-xs text-gray-500">Tempo {ex.tempo}</span>}
                                      </div>
                                      {ex.notes && <p className="text-xs text-gray-400 mt-0.5">{ex.notes}</p>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* AI Rationale */}
        <div className="space-y-3 mt-2">
          {program.periodizationRationale && (
            <div className="bg-[#1e1839]/[0.03] rounded-lg p-3">
              <h4 className="text-xs font-semibold text-[#1e1839] uppercase tracking-wider mb-1">Periodisering Rationale</h4>
              <p className="text-sm text-gray-700">{program.periodizationRationale}</p>
            </div>
          )}
          {program.progressionStrategy && (
            <div className="bg-[#1e1839]/[0.03] rounded-lg p-3">
              <h4 className="text-xs font-semibold text-[#1e1839] uppercase tracking-wider mb-1">Progressie Strategie</h4>
              <p className="text-sm text-gray-700">{program.progressionStrategy}</p>
            </div>
          )}
          {program.coachNotes && (
            <div className="bg-[#1e1839]/[0.03] rounded-lg p-3">
              <h4 className="text-xs font-semibold text-[#1e1839] uppercase tracking-wider mb-1">Coach Notities</h4>
              <p className="text-sm text-gray-700">{program.coachNotes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
          >
            Annuleren
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-[#1e1839] bg-[#1e1839]/10 rounded-lg hover:bg-[#1e1839]/20 transition disabled:opacity-50"
          >
            {saving ? "Opslaan..." : "Opslaan als Template"}
          </button>
          {!showAssignDate ? (
            <button
              onClick={() => setShowAssignDate(true)}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-[#1e1839] rounded-lg hover:bg-[#2a2050] transition disabled:opacity-50"
            >
              Opslaan & Toewijzen
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200">
                <Calendar className="w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="text-sm bg-transparent border-none outline-none w-36"
                />
              </div>
              <button
                onClick={() => onSaveAndAssign(startDate)}
                disabled={saving || !startDate}
                className="px-4 py-2 text-sm font-medium text-white bg-[#1e1839] rounded-lg hover:bg-[#2a2050] transition disabled:opacity-50"
              >
                {saving ? "Opslaan..." : "Bevestigen"}
              </button>
              <button onClick={() => setShowAssignDate(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
