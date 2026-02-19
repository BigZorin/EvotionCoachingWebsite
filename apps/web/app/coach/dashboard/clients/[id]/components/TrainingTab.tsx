"use client"

import { useState } from "react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts"
import {
  Dumbbell, Sparkles, ChevronRight, ChevronDown, Check, Clock, RotateCcw,
  Trash2, Info, BarChart3, X,
} from "lucide-react"
import {
  generateTrainingProgram, saveAITrainingProgram,
  saveAIGenerationLog, getAIGenerationLogs,
  type AITrainingProgramResult, type AITrainingProgram,
} from "@/app/actions/ai-coaching"
import { removeClientProgram, updateClientProgramStatus } from "@/app/actions/training-programs"
import AITrainingPreview from "@/components/ai/AITrainingPreview"
import AIGeneratorBanner from "./AIGeneratorBanner"
import SubTabNavigation from "./SubTabNavigation"

interface TrainingTabProps {
  clientId: string
  workouts: any[]
  clientPrograms: any[]
  onDataRefresh: () => void
}

export default function TrainingTab({ clientId, workouts, clientPrograms, onDataRefresh }: TrainingTabProps) {
  const [aiTrainingResult, setAiTrainingResult] = useState<AITrainingProgramResult | null>(null)
  const [aiTrainingLoading, setAiTrainingLoading] = useState(false)
  const [aiTrainingError, setAiTrainingError] = useState<string | null>(null)
  const [showAITrainingPreview, setShowAITrainingPreview] = useState(false)
  const [aiTrainingSaving, setAiTrainingSaving] = useState(false)

  const [trainingSubTab, setTrainingSubTab] = useState<"logs" | "analytics">("logs")
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null)
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null)
  const [analyticsExercise, setAnalyticsExercise] = useState<string | null>(null)
  const [removingProgram, setRemovingProgram] = useState<string | null>(null)

  // Compute analytics data
  const allExercises: Record<string, { name: string; category: string }> = {}
  const exerciseWeeklyData: Record<string, Record<number, { totalVolume: number; totalSets: number; totalReps: number; maxWeight: number; avgRpe: number; rpeCount: number; date: string }>> = {}

  workouts.forEach((w: any) => {
    const wk = w.week_number ?? 0
    const logs: any[] = w.workout_logs || []
    logs.forEach((log: any) => {
      const exId = log.exercise_id
      if (!allExercises[exId]) {
        allExercises[exId] = { name: log.exercises?.name || "Oefening", category: log.exercises?.category || "" }
      }
      if (!exerciseWeeklyData[exId]) exerciseWeeklyData[exId] = {}
      if (!exerciseWeeklyData[exId][wk]) {
        exerciseWeeklyData[exId][wk] = { totalVolume: 0, totalSets: 0, totalReps: 0, maxWeight: 0, avgRpe: 0, rpeCount: 0, date: w.completed_at || w.scheduled_date }
      }
      const d = exerciseWeeklyData[exId][wk]
      const vol = (log.weight_kg || 0) * (log.reps_completed || 0)
      d.totalVolume += vol
      d.totalSets += 1
      d.totalReps += log.reps_completed || 0
      if ((log.weight_kg || 0) > d.maxWeight) d.maxWeight = log.weight_kg || 0
      if (log.actual_rpe != null) { d.avgRpe += log.actual_rpe; d.rpeCount += 1 }
    })
  })

  const weeklyTotals: Record<number, { totalVolume: number; totalSets: number; totalReps: number; workoutCount: number; date: string }> = {}
  workouts.forEach((w: any) => {
    const wk = w.week_number ?? 0
    const logs: any[] = w.workout_logs || []
    if (!weeklyTotals[wk]) weeklyTotals[wk] = { totalVolume: 0, totalSets: 0, totalReps: 0, workoutCount: 0, date: w.completed_at || w.scheduled_date }
    weeklyTotals[wk].workoutCount += 1
    logs.forEach((log: any) => {
      weeklyTotals[wk].totalVolume += (log.weight_kg || 0) * (log.reps_completed || 0)
      weeklyTotals[wk].totalSets += 1
      weeklyTotals[wk].totalReps += log.reps_completed || 0
    })
  })
  const sortedWeeks = Object.keys(weeklyTotals).map(Number).sort((a, b) => a - b)

  const exerciseEntries = Object.entries(allExercises).sort((a, b) => a[1].name.localeCompare(b[1].name))
  const selectedExerciseData = analyticsExercise ? exerciseWeeklyData[analyticsExercise] : null
  const selectedExerciseWeeks = selectedExerciseData ? Object.keys(selectedExerciseData).map(Number).sort((a, b) => a - b) : []

  const handleGenerateTraining = async () => {
    setAiTrainingLoading(true)
    setAiTrainingError(null)
    try {
      const res = await generateTrainingProgram(clientId)
      if (res.success && res.data) {
        setAiTrainingResult(res.data)
        setShowAITrainingPreview(true)
        saveAIGenerationLog(clientId, "training_program", res.data, { title: res.data.program.name, model: res.data.model, tokensUsed: res.data.tokensUsed, ragUsed: res.data.ragUsed }).then(logRes => {
          if (logRes.success) getAIGenerationLogs(clientId, { limit: 30 }).catch(() => {})
        })
      } else {
        setAiTrainingError(res.error || "Generatie mislukt")
      }
    } catch (err: any) {
      console.error("[AI Training] Client-side error:", err)
      setAiTrainingError(err?.message || "Verbinding met server mislukt. Probeer opnieuw.")
    } finally {
      setAiTrainingLoading(false)
    }
  }

  const handleSaveTraining = async () => {
    if (!aiTrainingResult) return
    setAiTrainingSaving(true)
    const res = await saveAITrainingProgram(clientId, aiTrainingResult.program, false)
    setAiTrainingSaving(false)
    if (res.success) {
      setShowAITrainingPreview(false)
      setAiTrainingResult(null)
      onDataRefresh()
    } else {
      setAiTrainingError(res.error || "Opslaan mislukt")
    }
  }

  const handleSaveAndAssignTraining = async (startDate: string) => {
    if (!aiTrainingResult) return
    setAiTrainingSaving(true)
    const res = await saveAITrainingProgram(clientId, aiTrainingResult.program, true, startDate)
    setAiTrainingSaving(false)
    if (res.success) {
      setShowAITrainingPreview(false)
      setAiTrainingResult(null)
      onDataRefresh()
    } else {
      setAiTrainingError(res.error || "Opslaan mislukt")
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Training Program Generator */}
      <AIGeneratorBanner
        title="AI Programma Generator"
        description="Genereer een trainingsprogramma op basis van alle clientdata"
        buttonLabel="Genereer Programma"
        loadingLabel="Genereren..."
        loading={aiTrainingLoading}
        error={aiTrainingError}
        onGenerate={handleGenerateTraining}
        onDismissError={() => setAiTrainingError(null)}
        variant="primary"
      />

      {/* AI Training Preview Dialog */}
      {aiTrainingResult && (
        <AITrainingPreview
          open={showAITrainingPreview}
          onClose={() => setShowAITrainingPreview(false)}
          program={aiTrainingResult.program}
          tokensUsed={aiTrainingResult.tokensUsed}
          model={aiTrainingResult.model}
          ragUsed={aiTrainingResult.ragUsed}
          warnings={aiTrainingResult.warnings}
          saving={aiTrainingSaving}
          onSave={handleSaveTraining}
          onSaveAndAssign={handleSaveAndAssignTraining}
        />
      )}

      {/* Assigned Programs */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Toegewezen Programma{"'"}s
        </h3>
        {clientPrograms.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-3">
              <Dumbbell className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Geen programma{"'"}s toegewezen</p>
          </div>
        ) : (
          <div className="space-y-3">
            {clientPrograms.map((cp: any) => {
              const program = cp.training_programs
              const blocks = (program?.program_blocks || []).sort((a: any, b: any) => a.order_index - b.order_index)
              const blockCount = blocks.length
              const isExpProg = expandedProgram === cp.id
              const statusColors: Record<string, string> = {
                active: "bg-emerald-50 text-emerald-700",
                paused: "bg-amber-50 text-amber-700",
                completed: "bg-secondary text-muted-foreground",
              }
              return (
                <div key={cp.id} className="border border-border rounded-xl overflow-hidden">
                  <div className="flex items-center gap-4 p-4 bg-secondary/30">
                    <div className="w-10 h-10 rounded-lg bg-evotion-primary flex items-center justify-center flex-shrink-0">
                      <Dumbbell className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{program?.name || "Onbekend programma"}</p>
                      <p className="text-xs text-muted-foreground">
                        {blockCount} {blockCount === 1 ? "blok" : "blokken"}
                        {cp.start_date && ` / Gestart ${new Date(cp.start_date).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })}`}
                      </p>
                      {program?.description && <p className="text-xs text-muted-foreground/70 mt-0.5 truncate">{program.description}</p>}
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[cp.status] || "bg-secondary text-muted-foreground"}`}>
                      {cp.status === "active" ? "Actief" : cp.status === "paused" ? "Gepauzeerd" : "Afgerond"}
                    </span>
                    {blockCount > 0 && (
                      <button onClick={() => setExpandedProgram(isExpProg ? null : cp.id)} className="p-2 text-muted-foreground hover:text-foreground transition rounded-lg hover:bg-secondary">
                        {isExpProg ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                    )}
                    <div className="flex items-center gap-1">
                      {cp.status === "active" && (
                        <button onClick={async () => { await updateClientProgramStatus(cp.id, "paused"); onDataRefresh() }} className="p-2 text-muted-foreground hover:text-amber-600 transition rounded-lg hover:bg-amber-50" title="Pauzeren">
                          <Clock className="w-4 h-4" />
                        </button>
                      )}
                      {cp.status === "paused" && (
                        <button onClick={async () => { await updateClientProgramStatus(cp.id, "active"); onDataRefresh() }} className="p-2 text-muted-foreground hover:text-emerald-600 transition rounded-lg hover:bg-emerald-50" title="Hervatten">
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={async () => { if (!confirm("Weet je zeker dat je dit programma wilt verwijderen van deze client?")) return; setRemovingProgram(cp.id); await removeClientProgram(cp.id); setRemovingProgram(null); onDataRefresh() }}
                        disabled={removingProgram === cp.id}
                        className="p-2 text-muted-foreground hover:text-destructive transition rounded-lg hover:bg-destructive/5 disabled:opacity-50" title="Verwijderen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {isExpProg && blocks.length > 0 && (
                    <div className="border-t border-border bg-card p-4 space-y-2">
                      {blocks.map((block: any, idx: number) => (
                        <div key={block.id} className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                          <div className="w-7 h-7 rounded-md bg-evotion-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-evotion-primary">{idx + 1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">{block.name}</p>
                            <p className="text-xs text-muted-foreground">{block.duration_weeks} {block.duration_weeks === 1 ? "week" : "weken"}</p>
                          </div>
                          {block.description && (
                            <div className="group relative">
                              <Info className="w-4 h-4 text-muted-foreground hover:text-evotion-primary cursor-help transition" />
                              <div className="absolute right-0 top-6 z-10 w-64 p-3 bg-card rounded-lg shadow-lg border border-border text-xs text-foreground/80 hidden group-hover:block">
                                {block.description}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Sub-tabs: Logs vs Analytics */}
      <SubTabNavigation
        tabs={[
          { id: "logs", label: "Training Logs", icon: Dumbbell },
          { id: "analytics", label: "Analyse", icon: BarChart3 },
        ]}
        active={trainingSubTab}
        onChange={(id) => setTrainingSubTab(id as "logs" | "analytics")}
      />

      {/* TRAINING LOGS SUB-TAB */}
      {trainingSubTab === "logs" && (
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Voltooide Trainingen</h3>
          {workouts.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-3">
                <Dumbbell className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Nog geen trainingen voltooid</p>
            </div>
          ) : (
            <div className="space-y-2">
              {workouts.map((w: any) => {
                const templateName = w.workout_templates?.name || "Training"
                const isExpanded = expandedWorkout === w.id
                const logs: any[] = w.workout_logs || []
                const setCount = logs.length
                const totalVolume = logs.reduce((sum: number, l: any) => sum + (l.weight_kg || 0) * (l.reps_completed || 0), 0)
                const exerciseGroups: Record<string, { name: string; category: string; thumbnailUrl: string | null; sets: any[] }> = {}
                logs.forEach((log: any) => {
                  const exId = log.exercise_id
                  if (!exerciseGroups[exId]) {
                    exerciseGroups[exId] = { name: log.exercises?.name || "Oefening", category: log.exercises?.category || "", thumbnailUrl: log.exercises?.thumbnail_url || null, sets: [] }
                  }
                  exerciseGroups[exId].sets.push(log)
                })
                Object.values(exerciseGroups).forEach((g) => g.sets.sort((a: any, b: any) => a.set_number - b.set_number))
                const exerciseList = Object.entries(exerciseGroups)

                return (
                  <div key={w.id} className="border border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedWorkout(isExpanded ? null : w.id)}
                      className="w-full flex items-center justify-between p-4 bg-secondary/30 hover:bg-secondary/50 transition text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-emerald-50">
                          <Check className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{templateName}</p>
                          <p className="text-xs text-muted-foreground">
                            {w.completed_at ? new Date(w.completed_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" }) : "--"}
                            {w.week_number != null && ` / Week ${w.week_number}`}
                            {` / ${exerciseList.length} oef / ${setCount} sets`}
                            {totalVolume > 0 && ` / ${Math.round(totalVolume).toLocaleString("nl-NL")} kg vol`}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                    </button>

                    {isExpanded && (
                      <div className="p-5 space-y-5 bg-card border-t border-border">
                        {exerciseList.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-2">Geen sets gelogd</p>
                        ) : (
                          exerciseList.map(([exId, group]) => (
                            <div key={exId} className="space-y-2">
                              <div className="flex items-center gap-2.5">
                                {group.thumbnailUrl ? (
                                  <img src={group.thumbnailUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
                                ) : (
                                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                                    <Dumbbell className="w-4 h-4 text-muted-foreground" />
                                  </div>
                                )}
                                <div>
                                  <p className="text-sm font-medium text-foreground">{group.name}</p>
                                  {group.category && <p className="text-xs text-muted-foreground">{group.category}</p>}
                                </div>
                              </div>

                              {/* Responsive set cards for mobile, table for desktop */}
                              <div className="ml-10">
                                {/* Desktop table */}
                                <div className="hidden sm:block">
                                  <div className="grid grid-cols-[40px_1fr_1fr_1fr_1fr] gap-1 text-xs font-medium text-muted-foreground uppercase mb-1">
                                    <span>Set</span><span>Reps</span><span>Gewicht</span><span>RPE</span><span>RIR</span>
                                  </div>
                                  {group.sets.map((s: any) => (
                                    <div key={s.id} className="grid grid-cols-[40px_1fr_1fr_1fr_1fr] gap-1 text-sm py-1.5 border-t border-border/50">
                                      <span className="text-muted-foreground font-medium">{s.set_number}</span>
                                      <span className="text-foreground">{s.reps_completed}{s.prescribed_reps && <span className="text-muted-foreground text-xs ml-1">/ {s.prescribed_reps}</span>}</span>
                                      <span className="text-foreground">{s.weight_kg != null ? `${s.weight_kg} kg` : "--"}{s.prescribed_weight_kg != null && <span className="text-muted-foreground text-xs ml-1">/ {s.prescribed_weight_kg}</span>}</span>
                                      <span className="text-foreground">{s.actual_rpe != null ? s.actual_rpe : "--"}{s.prescribed_rpe != null && <span className="text-muted-foreground text-xs ml-1">/ {s.prescribed_rpe}</span>}</span>
                                      <span className="text-foreground">{s.actual_rir != null ? s.actual_rir : "--"}{s.prescribed_rir != null && <span className="text-muted-foreground text-xs ml-1">/ {s.prescribed_rir}</span>}</span>
                                    </div>
                                  ))}
                                </div>

                                {/* Mobile cards */}
                                <div className="sm:hidden space-y-2">
                                  {group.sets.map((s: any) => (
                                    <div key={s.id} className="bg-secondary/50 rounded-lg p-3 grid grid-cols-2 gap-2 text-xs">
                                      <div>
                                        <span className="text-muted-foreground">Set </span>
                                        <span className="font-medium text-foreground">{s.set_number}</span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Reps </span>
                                        <span className="font-medium text-foreground">{s.reps_completed}</span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Gewicht </span>
                                        <span className="font-medium text-foreground">{s.weight_kg != null ? `${s.weight_kg} kg` : "--"}</span>
                                      </div>
                                      {s.actual_rpe != null && (
                                        <div>
                                          <span className="text-muted-foreground">RPE </span>
                                          <span className="font-medium text-foreground">{s.actual_rpe}</span>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>

                                {group.sets.some((s: any) => s.notes) && (
                                  <div className="mt-2 space-y-1">
                                    {group.sets.filter((s: any) => s.notes).map((s: any) => (
                                      <p key={s.id} className="text-xs text-muted-foreground italic">Set {s.set_number}: {s.notes}</p>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ANALYTICS SUB-TAB */}
      {trainingSubTab === "analytics" && (
        <div className="space-y-6">
          {/* Overall weekly summary */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Wekelijks Overzicht</h3>
            {sortedWeeks.length === 0 ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-3">
                  <BarChart3 className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Geen data beschikbaar</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-5">
                <table className="w-full text-sm min-w-[600px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2.5 px-5 text-xs font-medium text-muted-foreground uppercase">Week</th>
                      <th className="text-right py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase">Trainingen</th>
                      <th className="text-right py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase">Sets</th>
                      <th className="text-right py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase">Reps</th>
                      <th className="text-right py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase">Volume</th>
                      <th className="text-right py-2.5 px-5 text-xs font-medium text-muted-foreground uppercase w-24">Delta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedWeeks.map((wk, idx) => {
                      const d = weeklyTotals[wk]
                      const prevWk = idx > 0 ? weeklyTotals[sortedWeeks[idx - 1]] : null
                      const volDelta = prevWk && prevWk.totalVolume > 0 ? ((d.totalVolume - prevWk.totalVolume) / prevWk.totalVolume * 100) : null
                      return (
                        <tr key={wk} className="border-b border-border/50 hover:bg-secondary/30 transition">
                          <td className="py-3 px-5 font-medium text-foreground">Week {wk || "--"}</td>
                          <td className="py-3 px-3 text-right text-foreground/80">{d.workoutCount}</td>
                          <td className="py-3 px-3 text-right text-foreground/80">{d.totalSets}</td>
                          <td className="py-3 px-3 text-right text-foreground/80">{d.totalReps}</td>
                          <td className="py-3 px-3 text-right text-foreground font-medium">{Math.round(d.totalVolume).toLocaleString("nl-NL")} kg</td>
                          <td className="py-3 px-5 text-right">
                            {volDelta != null ? (
                              <span className={`text-xs font-medium ${volDelta >= 0 ? "text-emerald-600" : "text-destructive"}`}>
                                {volDelta >= 0 ? "+" : ""}{volDelta.toFixed(1)}%
                              </span>
                            ) : <span className="text-xs text-muted-foreground/30">--</span>}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Volume trend chart */}
          {sortedWeeks.length >= 2 && (
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Volume Trend</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={sortedWeeks.map(wk => ({ week: `Wk ${wk}`, volume: Math.round(weeklyTotals[wk].totalVolume), sets: weeklyTotals[wk].totalSets, reps: weeklyTotals[wk].totalReps }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                  <Tooltip formatter={(value: any) => [`${Number(value).toLocaleString("nl-NL")} kg`, "Volume"]} />
                  <Line type="monotone" dataKey="volume" stroke="var(--evotion-primary)" strokeWidth={2} dot={{ r: 4, fill: "var(--evotion-primary)" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Per-exercise comparison */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Oefening Analyse</h3>
            {exerciseEntries.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">Geen oefening data</p>
              </div>
            ) : (
              <>
                <select
                  value={analyticsExercise || ""}
                  onChange={e => setAnalyticsExercise(e.target.value || null)}
                  className="w-full p-2.5 border border-border rounded-lg text-sm bg-background text-foreground mb-4 focus:outline-none focus:ring-2 focus:ring-evotion-primary/20"
                >
                  <option value="">Selecteer een oefening...</option>
                  {exerciseEntries.map(([exId, ex]) => (
                    <option key={exId} value={exId}>{ex.name}{ex.category ? ` (${ex.category})` : ""}</option>
                  ))}
                </select>

                {analyticsExercise && selectedExerciseData && selectedExerciseWeeks.length > 0 && (
                  <div className="space-y-4">
                    <div className="overflow-x-auto -mx-5">
                      <table className="w-full text-sm min-w-[700px]">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2.5 px-5 text-xs font-medium text-muted-foreground uppercase">Week</th>
                            <th className="text-right py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase">Sets</th>
                            <th className="text-right py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase">Reps</th>
                            <th className="text-right py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase">Max Gew.</th>
                            <th className="text-right py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase">Volume</th>
                            <th className="text-right py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase">Gem. RPE</th>
                            <th className="text-right py-2.5 px-5 text-xs font-medium text-muted-foreground uppercase w-24">Delta</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedExerciseWeeks.map((wk, idx) => {
                            const d = selectedExerciseData[wk]
                            const prevD = idx > 0 ? selectedExerciseData[selectedExerciseWeeks[idx - 1]] : null
                            const volDelta = prevD && prevD.totalVolume > 0 ? ((d.totalVolume - prevD.totalVolume) / prevD.totalVolume * 100) : null
                            return (
                              <tr key={wk} className="border-b border-border/50 hover:bg-secondary/30 transition">
                                <td className="py-3 px-5 font-medium text-foreground">Week {wk || "--"}</td>
                                <td className="py-3 px-3 text-right text-foreground/80">{d.totalSets}</td>
                                <td className="py-3 px-3 text-right text-foreground/80">{d.totalReps}</td>
                                <td className="py-3 px-3 text-right text-foreground/80">{d.maxWeight > 0 ? `${d.maxWeight} kg` : "--"}</td>
                                <td className="py-3 px-3 text-right text-foreground font-medium">{Math.round(d.totalVolume).toLocaleString("nl-NL")} kg</td>
                                <td className="py-3 px-3 text-right text-foreground/80">{d.rpeCount > 0 ? (d.avgRpe / d.rpeCount).toFixed(1) : "--"}</td>
                                <td className="py-3 px-5 text-right">
                                  {volDelta != null ? (
                                    <span className={`text-xs font-medium ${volDelta >= 0 ? "text-emerald-600" : "text-destructive"}`}>
                                      {volDelta >= 0 ? "+" : ""}{volDelta.toFixed(1)}%
                                    </span>
                                  ) : <span className="text-xs text-muted-foreground/30">--</span>}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>

                    {selectedExerciseWeeks.length >= 2 && (
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={selectedExerciseWeeks.map(wk => ({ week: `Wk ${wk}`, volume: Math.round(selectedExerciseData[wk].totalVolume), maxWeight: selectedExerciseData[wk].maxWeight }))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                          <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                          <YAxis yAxisId="vol" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                          <YAxis yAxisId="wt" orientation="right" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                          <Tooltip />
                          <Legend />
                          <Line yAxisId="vol" type="monotone" dataKey="volume" name="Volume (kg)" stroke="var(--evotion-primary)" strokeWidth={2} dot={{ r: 4, fill: "var(--evotion-primary)" }} />
                          <Line yAxisId="wt" type="monotone" dataKey="maxWeight" name="Max Gewicht (kg)" stroke="var(--chart-2)" strokeWidth={2} dot={{ r: 4, fill: "var(--chart-2)" }} />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                )}

                {analyticsExercise && (!selectedExerciseData || selectedExerciseWeeks.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">Geen data voor deze oefening</p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
