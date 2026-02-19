"use client"

import { useState, useEffect } from "react"
import {
  Dumbbell, UtensilsCrossed, Pill, Sparkles, History, ChevronRight,
  ChevronDown, Eye, Target, Pin, BarChart3, X, ArrowRight,
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
  onNavigateToTab: (tab: string) => void
}

export default function OverviewTab({
  clientId,
  clientPrograms,
  nutritionTargets,
  supplements,
  activeGoals,
  pinnedNotes,
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
          model: res.data.model,
          tokensUsed: res.data.tokensUsed,
          ragUsed: res.data.ragUsed,
        }).then((logRes) => {
          if (logRes.success) refreshLogs()
        })
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
          model: res.data.model,
          tokensUsed: res.data.tokensUsed,
          ragUsed: res.data.ragUsed,
        }).then((logRes) => {
          if (logRes.success) {
            setAiReviewLogId(logRes.id)
            refreshLogs()
          }
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

  const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
    training_program: { icon: Dumbbell, color: "text-evotion-primary", bg: "bg-evotion-primary/10" },
    nutrition_plan: { icon: UtensilsCrossed, color: "text-amber-600", bg: "bg-amber-50" },
    weekly_review: { icon: BarChart3, color: "text-evotion-primary", bg: "bg-evotion-primary/10" },
    supplement_analysis: { icon: Pill, color: "text-emerald-600", bg: "bg-emerald-50" },
    client_summary: { icon: Sparkles, color: "text-evotion-primary", bg: "bg-evotion-primary/10" },
  }

  return (
    <div className="space-y-6">
      {/* AI Client Summary */}
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

      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Active Training Program */}
        <button
          onClick={() => onNavigateToTab("training")}
          className="bg-card rounded-xl border border-border p-5 text-left hover:border-evotion-primary/30 hover:shadow-md transition-all group hover:-translate-y-px"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-evotion-primary/5 group-hover:bg-evotion-primary/10 transition-colors">
                <Dumbbell className="w-5 h-5 text-evotion-primary" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actief Programma</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-evotion-primary group-hover:translate-x-0.5 transition-all" />
          </div>
          {clientPrograms.filter((p: any) => p.status?.toLowerCase() === "active").length > 0 ? (
            clientPrograms
              .filter((p: any) => p.status?.toLowerCase() === "active")
              .slice(0, 1)
              .map((p: any) => (
                <div key={p.id}>
                  <p className="text-sm font-semibold text-foreground">
                    {p.training_programs?.name || "Programma"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Sinds{" "}
                    {new Date(p.start_date).toLocaleDateString("nl-NL", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              ))
          ) : (
            <div>
              <p className="text-sm text-muted-foreground">Geen actief programma</p>
              <p className="text-xs text-evotion-primary font-medium mt-1.5 group-hover:underline">Programma toewijzen</p>
            </div>
          )}
        </button>

        {/* Nutrition Targets */}
        <button
          onClick={() => onNavigateToTab("voeding")}
          className="bg-card rounded-xl border border-border p-5 text-left hover:border-amber-300/50 hover:shadow-md transition-all group hover:-translate-y-px"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-amber-50 group-hover:bg-amber-100/70 transition-colors">
                <UtensilsCrossed className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Voedingsdoelen</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
          </div>
          {nutritionTargets ? (
            <div>
              <p className="text-sm font-semibold text-foreground">{nutritionTargets.daily_calories} kcal</p>
              <p className="text-xs text-muted-foreground mt-1.5">
                E{nutritionTargets.daily_protein_grams}g / K{nutritionTargets.daily_carbs_grams}g / V{nutritionTargets.daily_fat_grams}g
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground">Niet ingesteld</p>
              <p className="text-xs text-amber-600 font-medium mt-1.5 group-hover:underline">Targets instellen</p>
            </div>
          )}
        </button>

        {/* Active Supplements */}
        <button
          onClick={() => onNavigateToTab("voeding")}
          className="bg-card rounded-xl border border-border p-5 text-left hover:border-emerald-300/50 hover:shadow-md transition-all group hover:-translate-y-px"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-emerald-50 group-hover:bg-emerald-100/70 transition-colors">
                <Pill className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Supplementen</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
          </div>
          {supplements.filter((s: any) => s.is_active).length > 0 ? (
            <div>
              <p className="text-sm font-semibold text-foreground">
                {supplements.filter((s: any) => s.is_active).length} actief
              </p>
              <p className="text-xs text-muted-foreground mt-1.5 line-clamp-1">
                {supplements
                  .filter((s: any) => s.is_active)
                  .map((s: any) => s.name)
                  .join(", ")}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground">Geen supplementen</p>
              <p className="text-xs text-emerald-600 font-medium mt-1.5 group-hover:underline">Supplement toevoegen</p>
            </div>
          )}
        </button>
      </div>

      {/* AI Weekly Review */}
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
          onClose={() => {
            setAiReviewResult(null)
            setAiReviewLogId(undefined)
          }}
          clientId={clientId}
          reviewLogId={aiReviewLogId}
          onRecommendationApplied={() => refreshLogs()}
        />
      )}

      {/* Coaching Timeline */}
      <CoachingTimeline clientId={clientId} />

      {/* AI Generation History */}
      {aiLogs.length > 0 && (
        <div className="bg-card rounded-xl border border-border shadow-sm">
          <button
            onClick={() => setAiLogsExpanded(!aiLogsExpanded)}
            className="w-full flex items-center justify-between p-5 hover:bg-muted/30 transition rounded-xl"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-secondary">
                <History className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                AI Generatie Historie
              </span>
              <span className="text-xs bg-evotion-primary/10 text-evotion-primary px-2 py-0.5 rounded-md font-semibold">
                {aiLogs.length}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${aiLogsExpanded ? "rotate-0" : "-rotate-90"}`} />
          </button>
          {aiLogsExpanded && (
            <div className="border-t border-border px-5 pb-5 space-y-1.5">
              {aiLogs.map((log) => {
                const cfg = typeConfig[log.generation_type] || typeConfig.client_summary
                const LogIcon = cfg.icon
                const isSelected = selectedLog?.id === log.id
                return (
                  <div key={log.id}>
                    <button
                      onClick={() => setSelectedLog(isSelected ? null : log)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition ${
                        isSelected
                          ? "bg-evotion-primary/5 border border-evotion-primary/10"
                          : "hover:bg-secondary/50"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}>
                        <LogIcon className={`w-4 h-4 ${cfg.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-foreground">
                            {AI_TYPE_LABELS[log.generation_type as AIGenerationType] || log.generation_type}
                          </span>
                          {log.title && (
                            <span className="text-xs text-muted-foreground truncate">
                              -- {log.title}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          <span>
                            {new Date(log.created_at).toLocaleDateString("nl-NL", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {log.model && <span>/ {log.model}</span>}
                          {log.tokens_used && <span>/ {log.tokens_used} tokens</span>}
                          {log.rag_used && (
                            <span className="text-emerald-600 font-medium">RAG</span>
                          )}
                        </div>
                      </div>
                      <Eye className={`w-4 h-4 shrink-0 ${isSelected ? "text-evotion-primary" : "text-muted-foreground/30"}`} />
                    </button>
                    {isSelected && (
                      <div className="ml-11 mt-1 mb-2 p-4 bg-secondary/50 rounded-lg border border-border text-xs text-foreground/80 space-y-3 max-h-[400px] overflow-y-auto">
                        {/* WEEKLY REVIEW */}
                        {log.generation_type === "weekly_review" && (
                          <>
                            {log.result?.summary && (
                              <p className="font-medium text-foreground">{log.result.summary}</p>
                            )}
                            {log.result?.complianceAnalysis && (
                              <div className="space-y-1.5">
                                <strong className="text-foreground">Naleving:</strong>
                                {log.result.complianceAnalysis.training && (
                                  <p><span className="text-evotion-primary font-medium">Training:</span> {log.result.complianceAnalysis.training}</p>
                                )}
                                {log.result.complianceAnalysis.nutrition && (
                                  <p><span className="text-amber-600 font-medium">Voeding:</span> {log.result.complianceAnalysis.nutrition}</p>
                                )}
                                {log.result.complianceAnalysis.checkIns && (
                                  <p><span className="text-evotion-primary font-medium">Check-ins:</span> {log.result.complianceAnalysis.checkIns}</p>
                                )}
                              </div>
                            )}
                            {log.result?.progressAnalysis && (
                              <div>
                                <strong className="text-foreground">Voortgang:</strong>
                                <p className="mt-0.5">{log.result.progressAnalysis}</p>
                              </div>
                            )}
                            {log.result?.flaggedConcerns?.length > 0 && (
                              <div>
                                <strong className="text-foreground">Aandachtspunten:</strong>
                                <ul className="list-disc pl-4 mt-1.5 space-y-1">
                                  {log.result.flaggedConcerns.map((c: any, i: number) => (
                                    <li key={i} className={c.severity === "critical" ? "text-destructive" : c.severity === "warning" ? "text-amber-600" : "text-evotion-primary"}>
                                      [{c.area}] {c.description}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {log.result?.recommendations?.length > 0 && (
                              <div>
                                <strong className="text-foreground">Aanbevelingen:</strong>
                                <ul className="list-disc pl-4 mt-1.5 space-y-1">
                                  {log.result.recommendations.map((r: any, i: number) => (
                                    <li key={i}>
                                      <span className="font-medium">[{r.area}]</span> {r.action}
                                      {r.rationale && <span className="text-muted-foreground block">{r.rationale}</span>}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </>
                        )}

                        {/* CLIENT SUMMARY */}
                        {log.generation_type === "client_summary" && (
                          <>
                            {log.result?.overallAssessment && (
                              <p className="font-medium text-foreground">{log.result.overallAssessment}</p>
                            )}
                            {log.result?.trainingStatus?.keyInsight && (
                              <p><span className="text-evotion-primary font-medium">Training:</span> {log.result.trainingStatus.currentProgram && `${log.result.trainingStatus.currentProgram} -- `}{log.result.trainingStatus.keyInsight}</p>
                            )}
                            {log.result?.nutritionStatus?.keyInsight && (
                              <p><span className="text-amber-600 font-medium">Voeding:</span> {log.result.nutritionStatus.currentTargets && `${log.result.nutritionStatus.currentTargets} -- `}{log.result.nutritionStatus.keyInsight}</p>
                            )}
                            {log.result?.supplementStatus && (
                              <p><span className="text-emerald-600 font-medium">Supplementen:</span> {log.result.supplementStatus}</p>
                            )}
                            {log.result?.progressHighlights?.length > 0 && (
                              <div>
                                <strong className="text-foreground">Highlights:</strong>
                                <ul className="list-disc pl-4 mt-1.5 space-y-0.5">
                                  {log.result.progressHighlights.map((h: string, i: number) => (
                                    <li key={i}>{h}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {log.result?.priorityActions?.length > 0 && (
                              <div>
                                <strong className="text-foreground">Prioriteiten:</strong>
                                <ul className="list-disc pl-4 mt-1.5 space-y-0.5">
                                  {log.result.priorityActions.map((a: any, i: number) => (
                                    <li key={i} className={a.urgency === "high" ? "text-destructive font-medium" : a.urgency === "medium" ? "text-amber-600" : ""}>
                                      [{a.area}] {a.action}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </>
                        )}

                        {/* NUTRITION PLAN */}
                        {log.generation_type === "nutrition_plan" && (
                          <>
                            {log.result?.targets && (
                              <p className="font-medium text-foreground">
                                Targets: {log.result.targets.calories} kcal / {log.result.targets.proteinGrams}g eiwit / {log.result.targets.carbsGrams}g koolh / {log.result.targets.fatGrams}g vet
                              </p>
                            )}
                            {log.result?.rationale && <p>{log.result.rationale}</p>}
                            {log.result?.supplementAdvice && (
                              <p><span className="text-emerald-600 font-medium">Supplementen:</span> {log.result.supplementAdvice}</p>
                            )}
                          </>
                        )}

                        {/* TRAINING PROGRAM */}
                        {log.generation_type === "training_program" && (
                          <>
                            {log.result?.program?.name && (
                              <p className="font-medium text-foreground">{log.result.program.name}</p>
                            )}
                            {log.result?.program?.description && <p>{log.result.program.description}</p>}
                            {log.result?.program?.blocks?.length > 0 && (
                              <div>
                                <strong className="text-foreground">Blokken:</strong>
                                <ul className="list-disc pl-4 mt-1.5 space-y-0.5">
                                  {log.result.program.blocks.map((b: any, i: number) => (
                                    <li key={i}>{b.name} -- {b.days?.length || 0} dagen</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </>
                        )}

                        {/* SUPPLEMENT ANALYSIS */}
                        {log.generation_type === "supplement_analysis" && (
                          <>
                            {log.result?.recommendations?.length > 0 && (
                              <div>
                                <strong className="text-foreground">Supplementen:</strong>
                                <ul className="list-disc pl-4 mt-1.5 space-y-1.5">
                                  {log.result.recommendations.map((s: any, i: number) => (
                                    <li key={i}>
                                      <span className="font-medium">{s.name}</span> -- {s.dosage} / {s.timing} / {s.frequency}
                                      {s.rationale && <span className="text-muted-foreground block">{s.rationale}</span>}
                                      {s.interactions && <span className="text-destructive block">Let op: {s.interactions}</span>}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {log.result?.generalNotes && (
                              <p><strong className="text-foreground">Opmerkingen:</strong> {log.result.generalNotes}</p>
                            )}
                          </>
                        )}

                        {/* Delete button */}
                        <div className="flex items-center justify-end pt-2 border-t border-border">
                          <button
                            onClick={async (e) => {
                              e.stopPropagation()
                              if (confirm("Verwijder dit log?")) {
                                await deleteAIGenerationLog(log.id)
                                setAiLogs((prev) => prev.filter((l) => l.id !== log.id))
                                setSelectedLog(null)
                              }
                            }}
                            className="text-xs text-destructive/60 hover:text-destructive transition"
                          >
                            Verwijderen
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Active Goals Summary */}
      {activeGoals.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-evotion-primary/5">
                <Target className="w-4 h-4 text-evotion-primary" />
              </div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Actieve Doelen
              </h3>
              <span className="text-xs bg-evotion-primary/10 text-evotion-primary px-2 py-0.5 rounded-md font-semibold">
                {activeGoals.length}
              </span>
            </div>
            <button
              onClick={() => onNavigateToTab("profiel")}
              className="text-xs text-evotion-primary font-medium hover:underline transition"
            >
              Beheren
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {activeGoals.map((goal) => {
              const daysLeft = goal.target_date
                ? Math.max(0, Math.ceil((new Date(goal.target_date).getTime() - Date.now()) / 86400000))
                : null
              return (
                <div
                  key={goal.id}
                  className="flex items-center justify-between p-3.5 bg-muted/50 rounded-lg border border-border/50"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      daysLeft !== null && daysLeft <= 7 ? "bg-amber-400" : "bg-evotion-primary"
                    }`} />
                    <span className="text-sm font-medium text-foreground">{goal.title}</span>
                  </div>
                  {daysLeft !== null && (
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${
                      daysLeft <= 7
                        ? "bg-amber-50 text-amber-700"
                        : "bg-secondary text-muted-foreground"
                    }`}>
                      {daysLeft}d
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Pinned Notes Summary */}
      {pinnedNotes.length > 0 && (
        <div className="bg-amber-50/30 rounded-xl border border-amber-200/40 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-100/60">
                <Pin className="w-4 h-4 text-amber-600" />
              </div>
              <h3 className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                Vastgepinde Notities
              </h3>
            </div>
            <button
              onClick={() => onNavigateToTab("profiel")}
              className="text-xs text-evotion-primary font-medium hover:underline transition"
            >
              Beheren
            </button>
          </div>
          <div className="flex flex-col gap-2.5">
            {pinnedNotes.map((note) => (
              <div key={note.id} className="p-3.5 bg-card/60 rounded-lg border border-amber-200/30">
                <p className="text-sm text-foreground leading-relaxed">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
