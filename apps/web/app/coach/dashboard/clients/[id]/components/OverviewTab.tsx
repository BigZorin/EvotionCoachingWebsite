"use client"

import { useState, useEffect } from "react"
import {
  Dumbbell, UtensilsCrossed, Pill, Sparkles, History, ChevronDown,
  Eye, Target, Pin, BarChart3, ArrowRight, AlertTriangle,
  MessageSquare, Calendar, X, Scale, Flame, TrendingDown, TrendingUp,
} from "lucide-react"
import {
  generateClientSummary,
  generateWeeklyReview,
  saveAIGenerationLog,
  getAIGenerationLogs,
  deleteAIGenerationLog,
  type AIClientSummaryResult,
  type AIWeeklyReviewResult,
  type AIGenerationLog,
  type AIGenerationType,
} from "@/app/actions/ai-coaching"
import AIClientCockpit from "@/components/ai/AIClientCockpit"
import AIWeeklyReview from "@/components/ai/AIWeeklyReview"
import CoachingTimeline from "@/components/coaching/CoachingTimeline"
import AIGeneratorBanner from "./AIGeneratorBanner"

const AI_TYPE_LABELS: Record<AIGenerationType, string> = {
  training_program: "Training Programma",
  nutrition_plan: "Voedingsplan",
  weekly_review: "Wekelijkse Review",
  supplement_analysis: "Supplementen Analyse",
  client_summary: "Client Samenvatting",
}

interface OverviewTabProps {
  clientId: string
  clientPrograms: any[]
  nutritionTargets: {
    daily_calories: number
    daily_protein_grams: number
    daily_carbs_grams: number
    daily_fat_grams: number
  } | null
  supplements: any[]
  activeGoals: Array<{ id: string; title: string; target_date?: string }>
  pinnedNotes: Array<{ id: string; content: string }>
  weeklyCheckIns: any[]
  dailyCheckIns: any[]
  workouts: any[]
  onNavigateToTab: (tab: string) => void
}

export default function OverviewTab({
  clientId,
  clientPrograms,
  nutritionTargets,
  supplements,
  activeGoals,
  pinnedNotes,
  weeklyCheckIns,
  dailyCheckIns,
  workouts,
  onNavigateToTab,
}: OverviewTabProps) {
  const [aiCockpitResult, setAiCockpitResult] = useState<AIClientSummaryResult | null>(null)
  const [aiCockpitLoading, setAiCockpitLoading] = useState(false)
  const [aiCockpitError, setAiCockpitError] = useState<string | null>(null)

  const [aiReviewResult, setAiReviewResult] = useState<AIWeeklyReviewResult | null>(null)
  const [aiReviewLoading, setAiReviewLoading] = useState(false)
  const [aiReviewError, setAiReviewError] = useState<string | null>(null)
  const [aiReviewLogId, setAiReviewLogId] = useState<string | undefined>(undefined)

  const [aiLogs, setAiLogs] = useState<AIGenerationLog[]>([])
  const [aiLogsExpanded, setAiLogsExpanded] = useState(false)
  const [selectedLog, setSelectedLog] = useState<AIGenerationLog | null>(null)

  useEffect(() => {
    getAIGenerationLogs(clientId, { limit: 30 })
      .then((res) => {
        if (res.success && res.logs) setAiLogs(res.logs)
      })
      .catch(() => {})
  }, [clientId])

  const refreshLogs = () => {
    getAIGenerationLogs(clientId, { limit: 30 }).then((r) => {
      if (r.success && r.logs) setAiLogs(r.logs)
    })
  }

  const handleGenerateCockpit = async () => {
    setAiCockpitLoading(true)
    setAiCockpitError(null)
    try {
      const res = await generateClientSummary(clientId)
      if (res.success && res.data) {
        setAiCockpitResult(res.data)
        saveAIGenerationLog(clientId, "client_summary", res.data, {
          model: res.data.model, tokensUsed: res.data.tokensUsed, ragUsed: res.data.ragUsed,
        }).then((logRes) => { if (logRes.success) refreshLogs() })
      } else {
        setAiCockpitError(res.error || "Samenvatting mislukt")
      }
    } catch (err: any) {
      setAiCockpitError(err?.message || "Verbinding met server mislukt.")
    } finally {
      setAiCockpitLoading(false)
    }
  }

  const handleGenerateReview = async () => {
    setAiReviewLoading(true)
    setAiReviewError(null)
    try {
      const res = await generateWeeklyReview(clientId)
      if (res.success && res.data) {
        setAiReviewResult(res.data)
        saveAIGenerationLog(clientId, "weekly_review", res.data, {
          model: res.data.model, tokensUsed: res.data.tokensUsed, ragUsed: res.data.ragUsed,
        }).then((logRes) => {
          if (logRes.success) { setAiReviewLogId(logRes.id); refreshLogs() }
        })
      } else {
        setAiReviewError(res.error || "Review generatie mislukt")
      }
    } catch (err: any) {
      setAiReviewError(err?.message || "Verbinding met server mislukt.")
    } finally {
      setAiReviewLoading(false)
    }
  }

  // ── Compute data ──
  const pendingFeedback = weeklyCheckIns.filter(ci => !ci.coach_feedback).length
  const last30 = dailyCheckIns.filter(ci => (Date.now() - new Date(ci.check_in_date).getTime()) / 86400000 <= 30)
  const compliancePct = Math.round((last30.length / 30) * 100)

  // Weight
  const weightMap = new Map<string, number>()
  for (const ci of weeklyCheckIns) { if (ci.weight) weightMap.set((ci as any).check_in_date || new Date(ci.created_at).toISOString().split("T")[0], ci.weight) }
  for (const ci of dailyCheckIns) { if (ci.weight) weightMap.set(ci.check_in_date, ci.weight) }
  const weightPts = Array.from(weightMap.entries()).map(([d, w]) => ({ date: d, weight: w })).sort((a, b) => a.date.localeCompare(b.date))
  const latestWeight = weightPts.length > 0 ? weightPts[weightPts.length - 1].weight : null
  const firstWeight = weightPts.length > 0 ? weightPts[0].weight : null
  const weightDelta = latestWeight && firstWeight ? latestWeight - firstWeight : null

  // Streak
  let streak = 0
  const sortedDaily = [...dailyCheckIns].sort((a, b) => b.check_in_date.localeCompare(a.check_in_date))
  for (let i = 0; i < sortedDaily.length; i++) {
    const d = new Date(); d.setDate(d.getDate() - i)
    if (sortedDaily[i]?.check_in_date === d.toISOString().split("T")[0]) streak++; else break
  }

  const hasActiveProgram = clientPrograms.some(p => p.status?.toLowerCase() === "active")

  // Build alerts
  const alerts: { type: "warning" | "info"; icon: any; message: string; action?: string; tab?: string }[] = []
  if (pendingFeedback > 0) {
    alerts.push({ type: "warning", icon: MessageSquare, message: `${pendingFeedback} check-in(s) zonder feedback`, action: "Bekijk", tab: "coaching" })
  }
  if (compliancePct < 50) {
    alerts.push({ type: "warning", icon: AlertTriangle, message: `Lage compliance: ${compliancePct}%`, action: "Bekijk", tab: "coaching" })
  }
  const expiringGoals = activeGoals.filter(g => {
    if (!g.target_date) return false
    const days = Math.ceil((new Date(g.target_date).getTime() - Date.now()) / 86400000)
    return days >= 0 && days <= 7
  })
  if (expiringGoals.length > 0) {
    alerts.push({ type: "warning", icon: Target, message: `${expiringGoals.length} doel(en) verlopen binnen 7 dagen`, action: "Bekijk", tab: "profiel" })
  }
  if (!hasActiveProgram) {
    alerts.push({ type: "info", icon: Dumbbell, message: "Geen actief trainingsprogramma", action: "Toewijzen", tab: "coaching" })
  }

  const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
    training_program: { icon: Dumbbell, color: "text-evotion-primary", bg: "bg-evotion-primary/10" },
    nutrition_plan: { icon: UtensilsCrossed, color: "text-amber-600", bg: "bg-amber-50" },
    weekly_review: { icon: BarChart3, color: "text-evotion-primary", bg: "bg-evotion-primary/10" },
    supplement_analysis: { icon: Pill, color: "text-emerald-600", bg: "bg-emerald-50" },
    client_summary: { icon: Sparkles, color: "text-evotion-primary", bg: "bg-evotion-primary/10" },
  }

  return (
    <div className="space-y-6">

      {/* ── Alerts ── */}
      {alerts.length > 0 && (
        <div className="flex flex-col gap-2">
          {alerts.map((alert, i) => {
            const Icon = alert.icon
            return (
              <button
                key={i}
                onClick={() => alert.tab && onNavigateToTab(alert.tab)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-colors group ${
                  alert.type === "warning"
                    ? "bg-amber-50/80 border border-amber-200/50 hover:bg-amber-50"
                    : "bg-muted/50 border border-border hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${
                    alert.type === "warning" ? "text-amber-600" : "text-muted-foreground"
                  }`} />
                  <span className={alert.type === "warning" ? "text-amber-800 font-medium" : "text-foreground"}>
                    {alert.message}
                  </span>
                </div>
                {alert.action && (
                  <span className="text-xs font-medium text-evotion-primary group-hover:underline flex-shrink-0">
                    {alert.action}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* ── Pinned notes ── */}
      {pinnedNotes.length > 0 && (
        <div className="flex items-start gap-3 px-4 py-3 bg-amber-50/40 border border-amber-200/30 rounded-lg">
          <Pin className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            {pinnedNotes.map((note, i) => (
              <p key={note.id} className={`text-sm text-foreground leading-relaxed ${i > 0 ? "mt-1.5 pt-1.5 border-t border-amber-200/30" : ""}`}>
                {note.content}
              </p>
            ))}
          </div>
          <button onClick={() => onNavigateToTab("profiel")} className="text-[11px] text-evotion-primary font-medium hover:underline flex-shrink-0">
            Bewerk
          </button>
        </div>
      )}

      {/* ── Hero Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Compliance Donut */}
        <button onClick={() => onNavigateToTab("coaching")} className="bg-card rounded-xl border border-border p-5 flex flex-col items-center justify-center text-center hover:shadow-md transition-all group">
          <ComplianceRing value={compliancePct} size={80} strokeWidth={8} />
          <p className="text-xs text-muted-foreground mt-2 font-medium uppercase tracking-wider">Compliance</p>
        </button>

        {/* Weight */}
        <button onClick={() => onNavigateToTab("gezondheid")} className="bg-card rounded-xl border border-border p-5 flex flex-col items-center justify-center text-center hover:shadow-md transition-all group">
          <div className="flex items-center gap-1.5 mb-1">
            <Scale className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground tabular-nums">
            {latestWeight ? `${latestWeight.toFixed(1)}` : "--"}
          </p>
          <p className="text-xs text-muted-foreground">kg</p>
          {weightDelta !== null && weightDelta !== 0 && (
            <span className={`flex items-center gap-0.5 text-xs font-semibold mt-1 ${weightDelta < 0 ? "text-emerald-600" : "text-amber-600"}`}>
              {weightDelta < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
              {weightDelta > 0 ? "+" : ""}{weightDelta.toFixed(1)}
            </span>
          )}
        </button>

        {/* Streak */}
        <button onClick={() => onNavigateToTab("coaching")} className="bg-card rounded-xl border border-border p-5 flex flex-col items-center justify-center text-center hover:shadow-md transition-all group">
          <Flame className={`w-7 h-7 mb-1 ${streak > 0 ? "text-orange-500" : "text-muted-foreground/25"}`} />
          <p className="text-2xl font-bold text-foreground tabular-nums">{streak}</p>
          <p className="text-xs text-muted-foreground">dagen streak</p>
        </button>

        {/* Workouts this month */}
        <button onClick={() => onNavigateToTab("coaching")} className="bg-card rounded-xl border border-border p-5 flex flex-col items-center justify-center text-center hover:shadow-md transition-all group">
          <Dumbbell className={`w-6 h-6 mb-1 ${workouts.length > 0 ? "text-evotion-primary" : "text-muted-foreground/25"}`} />
          <p className="text-2xl font-bold text-foreground tabular-nums">{workouts.length}</p>
          <p className="text-xs text-muted-foreground">workouts</p>
        </button>
      </div>

      {/* ── Weight Sparkline ── */}
      {weightPts.length >= 3 && (
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Gewichtsverloop</span>
            </div>
            <button onClick={() => onNavigateToTab("gezondheid")} className="text-xs text-evotion-primary font-medium hover:underline">
              Details
            </button>
          </div>
          <WeightChart data={weightPts} />
        </div>
      )}

      {/* ── Quick Status Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <QuickCard
          icon={Dumbbell} iconBg="bg-evotion-primary/5" iconColor="text-evotion-primary"
          label="Training" onClick={() => onNavigateToTab("coaching")}
        >
          {hasActiveProgram ? (
            <>
              <p className="text-sm font-semibold text-foreground truncate">
                {clientPrograms.find(p => p.status?.toLowerCase() === "active")?.training_programs?.name || "Programma"}
              </p>
              <p className="text-xs text-muted-foreground">{workouts.length} workouts gelogd</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Geen programma</p>
          )}
        </QuickCard>

        <QuickCard
          icon={UtensilsCrossed} iconBg="bg-amber-50" iconColor="text-amber-600"
          label="Voeding" onClick={() => onNavigateToTab("coaching")}
        >
          {nutritionTargets ? (
            <>
              <p className="text-sm font-semibold text-foreground">{nutritionTargets.daily_calories} kcal</p>
              <p className="text-xs text-muted-foreground">
                E{nutritionTargets.daily_protein_grams} / K{nutritionTargets.daily_carbs_grams} / V{nutritionTargets.daily_fat_grams}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Niet ingesteld</p>
          )}
        </QuickCard>

        <QuickCard
          icon={Pill} iconBg="bg-emerald-50" iconColor="text-emerald-600"
          label="Supplementen" onClick={() => onNavigateToTab("coaching")}
        >
          {supplements.filter(s => s.is_active).length > 0 ? (
            <>
              <p className="text-sm font-semibold text-foreground">{supplements.filter(s => s.is_active).length} actief</p>
              <p className="text-xs text-muted-foreground truncate">
                {supplements.filter(s => s.is_active).map(s => s.name).join(", ")}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Geen</p>
          )}
        </QuickCard>
      </div>

      {/* ── Active Goals ── */}
      {activeGoals.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-evotion-primary" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Doelen</span>
              <span className="text-[10px] bg-evotion-primary/10 text-evotion-primary px-1.5 py-0.5 rounded font-bold">{activeGoals.length}</span>
            </div>
            <button onClick={() => onNavigateToTab("profiel")} className="text-[11px] text-evotion-primary font-medium hover:underline">
              Beheren
            </button>
          </div>
          <div className="flex flex-col gap-1.5">
            {activeGoals.map((goal) => {
              const daysLeft = goal.target_date
                ? Math.max(0, Math.ceil((new Date(goal.target_date).getTime() - Date.now()) / 86400000))
                : null
              return (
                <div key={goal.id} className="flex items-center justify-between py-2 px-3 bg-muted/40 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${daysLeft !== null && daysLeft <= 7 ? "bg-amber-400" : "bg-evotion-primary"}`} />
                    <span className="text-sm text-foreground">{goal.title}</span>
                  </div>
                  {daysLeft !== null && (
                    <span className={`text-[11px] font-medium ${daysLeft <= 7 ? "text-amber-600" : "text-muted-foreground"}`}>
                      {daysLeft}d
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── AI Generators ── */}
      {!aiCockpitResult && (
        <AIGeneratorBanner
          title="AI Client Samenvatting"
          description="Totaaloverzicht van training, voeding, supplementen en voortgang"
          buttonLabel="Genereer Samenvatting"
          loadingLabel="Analyseren..."
          loading={aiCockpitLoading}
          error={aiCockpitError}
          onGenerate={handleGenerateCockpit}
          onDismissError={() => setAiCockpitError(null)}
          variant="primary"
        />
      )}
      {aiCockpitResult && (
        <AIClientCockpit result={aiCockpitResult} onClose={() => setAiCockpitResult(null)} />
      )}

      {!aiReviewResult && (
        <AIGeneratorBanner
          title="AI Wekelijkse Review"
          description="Analyseer voortgang, naleving en krijg aanbevelingen"
          buttonLabel="Genereer Review"
          loadingLabel="Analyseren..."
          loading={aiReviewLoading}
          error={aiReviewError}
          onGenerate={handleGenerateReview}
          onDismissError={() => setAiReviewError(null)}
          variant="secondary"
        />
      )}
      {aiReviewResult && (
        <AIWeeklyReview
          result={aiReviewResult}
          onClose={() => { setAiReviewResult(null); setAiReviewLogId(undefined) }}
          clientId={clientId}
          reviewLogId={aiReviewLogId}
          onRecommendationApplied={() => refreshLogs()}
        />
      )}

      {/* ── Coaching Timeline ── */}
      <CoachingTimeline clientId={clientId} />

      {/* ── AI History ── */}
      {aiLogs.length > 0 && (
        <div className="bg-card rounded-xl border border-border">
          <button
            onClick={() => setAiLogsExpanded(!aiLogsExpanded)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition rounded-xl"
          >
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Historie</span>
              <span className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded font-medium">{aiLogs.length}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${aiLogsExpanded ? "rotate-0" : "-rotate-90"}`} />
          </button>
          {aiLogsExpanded && (
            <div className="border-t border-border px-4 pb-4 space-y-1">
              {aiLogs.map((log) => {
                const cfg = typeConfig[log.generation_type] || typeConfig.client_summary
                const LogIcon = cfg.icon
                const isSelected = selectedLog?.id === log.id
                return (
                  <div key={log.id}>
                    <button
                      onClick={() => setSelectedLog(isSelected ? null : log)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition ${
                        isSelected ? "bg-evotion-primary/5 border border-evotion-primary/10" : "hover:bg-secondary/50"
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}>
                        <LogIcon className={`w-3.5 h-3.5 ${cfg.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-medium text-foreground">
                          {AI_TYPE_LABELS[log.generation_type as AIGenerationType] || log.generation_type}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5">
                          <span>{new Date(log.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                          {log.model && <span>/ {log.model}</span>}
                        </div>
                      </div>
                      <Eye className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-evotion-primary" : "text-muted-foreground/30"}`} />
                    </button>
                    {isSelected && (
                      <AILogDetail log={log} onDelete={async () => {
                        await deleteAIGenerationLog(log.id)
                        setAiLogs(prev => prev.filter(l => l.id !== log.id))
                        setSelectedLog(null)
                      }} />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Compliance Ring (SVG donut) ── */
function ComplianceRing({ value, size, strokeWidth }: { value: number; size: number; strokeWidth: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(Math.max(value, 0), 100)
  const offset = circumference - (progress / 100) * circumference
  const color = progress >= 75 ? "#10b981" : progress >= 50 ? "#f59e0b" : "#ef4444"

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="currentColor" strokeWidth={strokeWidth}
          className="text-muted/50"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-foreground tabular-nums">{value}</span>
        <span className="text-[9px] text-muted-foreground font-medium -mt-0.5">%</span>
      </div>
    </div>
  )
}

/* ── Weight Chart (SVG area chart) ── */
function WeightChart({ data }: { data: { date: string; weight: number }[] }) {
  const w = 600
  const h = 120
  const pad = { top: 12, right: 16, bottom: 24, left: 40 }
  const innerW = w - pad.left - pad.right
  const innerH = h - pad.top - pad.bottom

  const weights = data.map(d => d.weight)
  const minW = Math.min(...weights) - 0.5
  const maxW = Math.max(...weights) + 0.5
  const rangeW = maxW - minW || 1

  const pts = data.map((d, i) => ({
    x: pad.left + (i / (data.length - 1)) * innerW,
    y: pad.top + innerH - ((d.weight - minW) / rangeW) * innerH,
  }))

  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join("")
  const area = `${line}L${pts[pts.length - 1].x.toFixed(1)},${h - pad.bottom}L${pts[0].x.toFixed(1)},${h - pad.bottom}Z`

  // Y-axis labels (3 lines)
  const yLabels = [minW, (minW + maxW) / 2, maxW].map(v => ({
    label: v.toFixed(1),
    y: pad.top + innerH - ((v - minW) / rangeW) * innerH,
  }))

  // X-axis labels (first, middle, last)
  const xIdxs = data.length > 2 ? [0, Math.floor(data.length / 2), data.length - 1] : [0, data.length - 1]
  const fmtD = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("nl-NL", { day: "numeric", month: "short" })

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 120 }}>
      {/* Grid lines */}
      {yLabels.map((yl, i) => (
        <g key={i}>
          <line x1={pad.left} x2={w - pad.right} y1={yl.y} y2={yl.y} stroke="currentColor" strokeWidth={0.5} className="text-border" />
          <text x={pad.left - 6} y={yl.y + 3} textAnchor="end" className="fill-muted-foreground" fontSize={9}>{yl.label}</text>
        </g>
      ))}
      {/* Area + Line */}
      <path d={area} fill="url(#weightGrad)" />
      <path d={line} fill="none" stroke="var(--evotion-primary, #1e1839)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {/* Dots */}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill="var(--evotion-primary, #1e1839)" stroke="var(--background)" strokeWidth={2}>
          <title>{fmtD(data[i].date)}: {data[i].weight.toFixed(1)} kg</title>
        </circle>
      ))}
      {/* X labels */}
      {xIdxs.map(idx => (
        <text key={idx} x={pts[idx].x} y={h - 4} textAnchor="middle" className="fill-muted-foreground" fontSize={9}>
          {fmtD(data[idx].date)}
        </text>
      ))}
      {/* Gradient def */}
      <defs>
        <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--evotion-primary, #1e1839)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--evotion-primary, #1e1839)" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/* ── Quick Card ── */
function QuickCard({
  icon: Icon, iconBg, iconColor, label, children, onClick,
}: {
  icon: any; iconBg: string; iconColor: string; label: string; children: React.ReactNode; onClick: () => void
}) {
  return (
    <button onClick={onClick} className="bg-card rounded-xl border border-border p-4 text-left hover:shadow-sm transition-all group">
      <div className="flex items-center gap-2 mb-2.5">
        <div className={`p-1.5 rounded-lg ${iconBg}`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
        <ArrowRight className="w-3 h-3 text-muted-foreground/0 group-hover:text-muted-foreground/50 ml-auto transition-all" />
      </div>
      {children}
    </button>
  )
}

/* ── AI Log Detail ── */
function AILogDetail({ log, onDelete }: { log: AIGenerationLog; onDelete: () => void }) {
  return (
    <div className="ml-10 mt-1 mb-2 p-3 bg-secondary/50 rounded-lg border border-border text-xs text-foreground/80 space-y-2.5 max-h-[400px] overflow-y-auto">
      {log.generation_type === "weekly_review" && (
        <>
          {log.result?.summary && <p className="font-medium text-foreground">{log.result.summary}</p>}
          {log.result?.complianceAnalysis && (
            <div className="space-y-1">
              {log.result.complianceAnalysis.training && <p><span className="text-evotion-primary font-medium">Training:</span> {log.result.complianceAnalysis.training}</p>}
              {log.result.complianceAnalysis.nutrition && <p><span className="text-amber-600 font-medium">Voeding:</span> {log.result.complianceAnalysis.nutrition}</p>}
              {log.result.complianceAnalysis.checkIns && <p><span className="text-evotion-primary font-medium">Check-ins:</span> {log.result.complianceAnalysis.checkIns}</p>}
            </div>
          )}
          {log.result?.progressAnalysis && <p><strong className="text-foreground">Voortgang:</strong> {log.result.progressAnalysis}</p>}
          {log.result?.flaggedConcerns?.length > 0 && (
            <ul className="list-disc pl-4 space-y-0.5">
              {log.result.flaggedConcerns.map((c: any, i: number) => (
                <li key={i} className={c.severity === "critical" ? "text-destructive" : c.severity === "warning" ? "text-amber-600" : ""}>[{c.area}] {c.description}</li>
              ))}
            </ul>
          )}
          {log.result?.recommendations?.length > 0 && (
            <ul className="list-disc pl-4 space-y-0.5">
              {log.result.recommendations.map((r: any, i: number) => (
                <li key={i}><span className="font-medium">[{r.area}]</span> {r.action}</li>
              ))}
            </ul>
          )}
        </>
      )}
      {log.generation_type === "client_summary" && (
        <>
          {log.result?.overallAssessment && <p className="font-medium text-foreground">{log.result.overallAssessment}</p>}
          {log.result?.trainingStatus?.keyInsight && <p><span className="text-evotion-primary font-medium">Training:</span> {log.result.trainingStatus.keyInsight}</p>}
          {log.result?.nutritionStatus?.keyInsight && <p><span className="text-amber-600 font-medium">Voeding:</span> {log.result.nutritionStatus.keyInsight}</p>}
          {log.result?.supplementStatus && <p><span className="text-emerald-600 font-medium">Supplementen:</span> {log.result.supplementStatus}</p>}
          {log.result?.priorityActions?.length > 0 && (
            <ul className="list-disc pl-4 space-y-0.5">
              {log.result.priorityActions.map((a: any, i: number) => (
                <li key={i} className={a.urgency === "high" ? "text-destructive font-medium" : ""}>[{a.area}] {a.action}</li>
              ))}
            </ul>
          )}
        </>
      )}
      {log.generation_type === "nutrition_plan" && (
        <>
          {log.result?.targets && <p className="font-medium text-foreground">Targets: {log.result.targets.calories} kcal / {log.result.targets.proteinGrams}g E / {log.result.targets.carbsGrams}g K / {log.result.targets.fatGrams}g V</p>}
          {log.result?.rationale && <p>{log.result.rationale}</p>}
        </>
      )}
      {log.generation_type === "training_program" && (
        <>
          {log.result?.program?.name && <p className="font-medium text-foreground">{log.result.program.name}</p>}
          {log.result?.program?.description && <p>{log.result.program.description}</p>}
        </>
      )}
      {log.generation_type === "supplement_analysis" && log.result?.recommendations?.length > 0 && (
        <ul className="list-disc pl-4 space-y-1">
          {log.result.recommendations.map((s: any, i: number) => (
            <li key={i}><span className="font-medium">{s.name}</span> -- {s.dosage} / {s.timing}</li>
          ))}
        </ul>
      )}
      <div className="flex justify-end pt-2 border-t border-border">
        <button onClick={(e) => { e.stopPropagation(); if (confirm("Verwijder dit log?")) onDelete() }} className="text-[10px] text-destructive/60 hover:text-destructive transition">
          Verwijderen
        </button>
      </div>
    </div>
  )
}
