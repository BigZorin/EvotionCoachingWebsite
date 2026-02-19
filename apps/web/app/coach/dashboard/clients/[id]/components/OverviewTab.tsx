"use client"

import { useState, useEffect } from "react"
import {
  Dumbbell, UtensilsCrossed, Pill, Sparkles, History, ChevronRight,
  ChevronDown, Eye, Target, Pin, BarChart3, X,
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
  // Status card data
  clientPrograms: any[]
  nutritionTargets: {
    daily_calories: number
    daily_protein_grams: number
    daily_carbs_grams: number
    daily_fat_grams: number
  } | null
  supplements: any[]
  // Goals & notes (read-only summaries)
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
  // AI Client Summary (Cockpit) state
  const [aiCockpitResult, setAiCockpitResult] = useState<AIClientSummaryResult | null>(null)
  const [aiCockpitLoading, setAiCockpitLoading] = useState(false)
  const [aiCockpitError, setAiCockpitError] = useState<string | null>(null)

  // AI Weekly Review state
  const [aiReviewResult, setAiReviewResult] = useState<AIWeeklyReviewResult | null>(null)
  const [aiReviewLoading, setAiReviewLoading] = useState(false)
  const [aiReviewError, setAiReviewError] = useState<string | null>(null)
  const [aiReviewLogId, setAiReviewLogId] = useState<string | undefined>(undefined)

  // AI Generation Logs state
  const [aiLogs, setAiLogs] = useState<AIGenerationLog[]>([])
  const [aiLogsExpanded, setAiLogsExpanded] = useState(false)
  const [selectedLog, setSelectedLog] = useState<AIGenerationLog | null>(null)

  // Load AI generation logs on mount
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

  // --- AI Cockpit handler ---
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

  // --- AI Weekly Review handler ---
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

  // --- Type config for log icons ---
  const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
    training_program: { icon: Dumbbell, color: "text-indigo-600", bg: "bg-indigo-50" },
    nutrition_plan: { icon: UtensilsCrossed, color: "text-orange-600", bg: "bg-orange-50" },
    weekly_review: { icon: BarChart3, color: "text-blue-600", bg: "bg-blue-50" },
    supplement_analysis: { icon: Pill, color: "text-emerald-600", bg: "bg-emerald-50" },
    client_summary: { icon: Sparkles, color: "text-purple-600", bg: "bg-purple-50" },
  }

  return (
    <div className="space-y-6">
      {/* ========== 1. AI Client Summary (Cockpit) ========== */}
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

      {/* ========== 2. Status Summary Cards ========== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Active Training Program */}
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Dumbbell className="w-4 h-4 text-[#1e1839]" />
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Actief Programma</span>
          </div>
          {clientPrograms.filter((p: any) => p.status?.toLowerCase() === "active").length > 0 ? (
            clientPrograms
              .filter((p: any) => p.status?.toLowerCase() === "active")
              .slice(0, 1)
              .map((p: any) => (
                <div key={p.id}>
                  <p className="text-sm font-medium text-gray-900">
                    {p.training_programs?.name || "Programma"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Sinds{" "}
                    {new Date(p.start_date).toLocaleDateString("nl-NL", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              ))
          ) : (
            <p className="text-xs text-gray-400">Geen actief programma</p>
          )}
        </div>

        {/* Nutrition Targets */}
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-2 mb-2">
            <UtensilsCrossed className="w-4 h-4 text-[#1e1839]" />
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Voedingsdoelen</span>
          </div>
          {nutritionTargets ? (
            <div>
              <p className="text-sm font-medium text-gray-900">{nutritionTargets.daily_calories} kcal</p>
              <p className="text-xs text-gray-500 mt-0.5">
                E{nutritionTargets.daily_protein_grams}g · K{nutritionTargets.daily_carbs_grams}g · V{nutritionTargets.daily_fat_grams}g
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-400">Niet ingesteld</p>
          )}
        </div>

        {/* Active Supplements */}
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Pill className="w-4 h-4 text-[#1e1839]" />
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Supplementen</span>
          </div>
          {supplements.filter((s: any) => s.is_active).length > 0 ? (
            <div>
              <p className="text-sm font-medium text-gray-900">
                {supplements.filter((s: any) => s.is_active).length} actief
              </p>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                {supplements
                  .filter((s: any) => s.is_active)
                  .map((s: any) => s.name)
                  .join(", ")}
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-400">Geen supplementen</p>
          )}
        </div>
      </div>

      {/* ========== 3. AI Weekly Review ========== */}
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
          onRecommendationApplied={() => {
            // Parent can pass a reload callback if needed; for now refresh logs
            refreshLogs()
          }}
        />
      )}

      {/* ========== 4. Coaching Timeline ========== */}
      <CoachingTimeline clientId={clientId} />

      {/* ========== 5. AI Generation History ========== */}
      {aiLogs.length > 0 && (
        <div className="bg-white rounded-xl border">
          <button
            onClick={() => setAiLogsExpanded(!aiLogsExpanded)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition rounded-xl"
          >
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                AI Generatie Historie
              </span>
              <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                {aiLogs.length}
              </span>
            </div>
            {aiLogsExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </button>
          {aiLogsExpanded && (
            <div className="border-t px-4 pb-4 space-y-1.5">
              {aiLogs.map((log) => {
                const cfg = typeConfig[log.generation_type] || typeConfig.client_summary
                const LogIcon = cfg.icon
                const isSelected = selectedLog?.id === log.id
                return (
                  <div key={log.id}>
                    <button
                      onClick={() => setSelectedLog(isSelected ? null : log)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition ${
                        isSelected
                          ? "bg-[#1e1839]/[0.04] border border-[#1e1839]/10"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-md ${cfg.bg} flex items-center justify-center shrink-0`}
                      >
                        <LogIcon className={`w-3.5 h-3.5 ${cfg.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-900">
                            {AI_TYPE_LABELS[log.generation_type as AIGenerationType] || log.generation_type}
                          </span>
                          {log.title && (
                            <span className="text-[10px] text-gray-400 truncate">
                              — {log.title}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400">
                          <span>
                            {new Date(log.created_at).toLocaleDateString("nl-NL", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {log.model && <span>· {log.model}</span>}
                          {log.tokens_used && <span>· {log.tokens_used} tokens</span>}
                          {log.rag_used && (
                            <span className="text-emerald-500 font-medium">RAG</span>
                          )}
                        </div>
                      </div>
                      <Eye
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isSelected ? "text-[#1e1839]" : "text-gray-300"
                        }`}
                      />
                    </button>
                    {isSelected && (
                      <div className="ml-10 mt-1 mb-2 p-3 bg-gray-50 rounded-lg border text-xs text-gray-700 space-y-3 max-h-[400px] overflow-y-auto">
                        {/* === WEEKLY REVIEW === */}
                        {log.generation_type === "weekly_review" && (
                          <>
                            {log.result?.summary && (
                              <p className="font-medium">{log.result.summary}</p>
                            )}
                            {log.result?.complianceAnalysis && (
                              <div className="space-y-1">
                                <strong>Naleving:</strong>
                                {log.result.complianceAnalysis.training && (
                                  <p>
                                    <span className="text-indigo-600 font-medium">Training:</span>{" "}
                                    {log.result.complianceAnalysis.training}
                                  </p>
                                )}
                                {log.result.complianceAnalysis.nutrition && (
                                  <p>
                                    <span className="text-orange-600 font-medium">Voeding:</span>{" "}
                                    {log.result.complianceAnalysis.nutrition}
                                  </p>
                                )}
                                {log.result.complianceAnalysis.checkIns && (
                                  <p>
                                    <span className="text-blue-600 font-medium">Check-ins:</span>{" "}
                                    {log.result.complianceAnalysis.checkIns}
                                  </p>
                                )}
                              </div>
                            )}
                            {log.result?.progressAnalysis && (
                              <div>
                                <strong>Voortgang:</strong>
                                <p className="mt-0.5">{log.result.progressAnalysis}</p>
                              </div>
                            )}
                            {log.result?.flaggedConcerns?.length > 0 && (
                              <div>
                                <strong>Aandachtspunten:</strong>
                                <ul className="list-disc pl-4 mt-1 space-y-0.5">
                                  {log.result.flaggedConcerns.map((c: any, i: number) => (
                                    <li
                                      key={i}
                                      className={
                                        c.severity === "critical"
                                          ? "text-red-600"
                                          : c.severity === "warning"
                                          ? "text-amber-600"
                                          : "text-blue-600"
                                      }
                                    >
                                      [{c.area}] {c.description}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {log.result?.recommendations?.length > 0 && (
                              <div>
                                <strong>Aanbevelingen:</strong>
                                <ul className="list-disc pl-4 mt-1 space-y-1">
                                  {log.result.recommendations.map((r: any, i: number) => (
                                    <li key={i}>
                                      <span className="font-medium">[{r.area}]</span> {r.action}
                                      {r.rationale && (
                                        <span className="text-gray-400 block ml-0">
                                          {" "}
                                          {r.rationale}
                                        </span>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </>
                        )}

                        {/* === CLIENT SUMMARY === */}
                        {log.generation_type === "client_summary" && (
                          <>
                            {log.result?.overallAssessment && (
                              <p className="font-medium">{log.result.overallAssessment}</p>
                            )}
                            {log.result?.trainingStatus?.keyInsight && (
                              <p>
                                <span className="text-indigo-600 font-medium">Training:</span>{" "}
                                {log.result.trainingStatus.currentProgram &&
                                  `${log.result.trainingStatus.currentProgram} — `}
                                {log.result.trainingStatus.keyInsight}
                              </p>
                            )}
                            {log.result?.nutritionStatus?.keyInsight && (
                              <p>
                                <span className="text-orange-600 font-medium">Voeding:</span>{" "}
                                {log.result.nutritionStatus.currentTargets &&
                                  `${log.result.nutritionStatus.currentTargets} — `}
                                {log.result.nutritionStatus.keyInsight}
                              </p>
                            )}
                            {log.result?.supplementStatus && (
                              <p>
                                <span className="text-emerald-600 font-medium">Supplementen:</span>{" "}
                                {log.result.supplementStatus}
                              </p>
                            )}
                            {log.result?.progressHighlights?.length > 0 && (
                              <div>
                                <strong>Highlights:</strong>
                                <ul className="list-disc pl-4 mt-1 space-y-0.5">
                                  {log.result.progressHighlights.map((h: string, i: number) => (
                                    <li key={i}>{h}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {log.result?.priorityActions?.length > 0 && (
                              <div>
                                <strong>Prioriteiten:</strong>
                                <ul className="list-disc pl-4 mt-1 space-y-0.5">
                                  {log.result.priorityActions.map((a: any, i: number) => (
                                    <li
                                      key={i}
                                      className={
                                        a.urgency === "high"
                                          ? "text-red-600 font-medium"
                                          : a.urgency === "medium"
                                          ? "text-amber-600"
                                          : ""
                                      }
                                    >
                                      [{a.area}] {a.action}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </>
                        )}

                        {/* === NUTRITION PLAN === */}
                        {log.generation_type === "nutrition_plan" && (
                          <>
                            {log.result?.targets && (
                              <p className="font-medium">
                                Targets: {log.result.targets.calories} kcal ·{" "}
                                {log.result.targets.proteinGrams}g eiwit ·{" "}
                                {log.result.targets.carbsGrams}g koolh ·{" "}
                                {log.result.targets.fatGrams}g vet
                              </p>
                            )}
                            {log.result?.rationale && <p>{log.result.rationale}</p>}
                            {log.result?.supplementAdvice && (
                              <p>
                                <span className="text-emerald-600 font-medium">Supplementen:</span>{" "}
                                {log.result.supplementAdvice}
                              </p>
                            )}
                          </>
                        )}

                        {/* === TRAINING PROGRAM === */}
                        {log.generation_type === "training_program" && (
                          <>
                            {log.result?.program?.name && (
                              <p className="font-medium">{log.result.program.name}</p>
                            )}
                            {log.result?.program?.description && (
                              <p>{log.result.program.description}</p>
                            )}
                            {log.result?.program?.blocks?.length > 0 && (
                              <div>
                                <strong>Blokken:</strong>
                                <ul className="list-disc pl-4 mt-1 space-y-0.5">
                                  {log.result.program.blocks.map((b: any, i: number) => (
                                    <li key={i}>
                                      {b.name} — {b.days?.length || 0} dagen
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </>
                        )}

                        {/* === SUPPLEMENT ANALYSIS === */}
                        {log.generation_type === "supplement_analysis" && (
                          <>
                            {log.result?.recommendations?.length > 0 && (
                              <div>
                                <strong>Supplementen:</strong>
                                <ul className="list-disc pl-4 mt-1 space-y-1">
                                  {log.result.recommendations.map((s: any, i: number) => (
                                    <li key={i}>
                                      <span className="font-medium">{s.name}</span> — {s.dosage} ·{" "}
                                      {s.timing} · {s.frequency}
                                      {s.rationale && (
                                        <span className="text-gray-400 block">{s.rationale}</span>
                                      )}
                                      {s.interactions && (
                                        <span className="text-red-500 block">
                                          Warning: {s.interactions}
                                        </span>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {log.result?.generalNotes && (
                              <p>
                                <strong>Opmerkingen:</strong> {log.result.generalNotes}
                              </p>
                            )}
                          </>
                        )}

                        {/* Delete button */}
                        <div className="flex items-center justify-end gap-2 pt-1 border-t">
                          <button
                            onClick={async (e) => {
                              e.stopPropagation()
                              if (confirm("Verwijder dit log?")) {
                                await deleteAIGenerationLog(log.id)
                                setAiLogs((prev) => prev.filter((l) => l.id !== log.id))
                                setSelectedLog(null)
                              }
                            }}
                            className="text-[10px] text-red-400 hover:text-red-600 transition"
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

      {/* ========== 6. Active Goals Summary ========== */}
      {activeGoals.length > 0 && (
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
              Actieve Doelen
            </h3>
            <button
              onClick={() => onNavigateToTab("profiel")}
              className="text-xs text-[#1e1839] hover:underline"
            >
              Beheren →
            </button>
          </div>
          <div className="space-y-2">
            {activeGoals.map((goal) => (
              <div
                key={goal.id}
                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">{goal.title}</span>
                </div>
                {goal.target_date && (
                  <span className="text-xs text-gray-500">
                    {Math.max(
                      0,
                      Math.ceil(
                        (new Date(goal.target_date).getTime() - Date.now()) / 86400000
                      )
                    )}{" "}
                    dagen
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========== 7. Pinned Notes Summary ========== */}
      {pinnedNotes.length > 0 && (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-amber-700 flex items-center gap-1.5">
              <Pin className="w-4 h-4" /> Vastgepinde Notities
            </h3>
            <button
              onClick={() => onNavigateToTab("profiel")}
              className="text-xs text-[#1e1839] hover:underline"
            >
              Beheren →
            </button>
          </div>
          {pinnedNotes.map((note) => (
            <p key={note.id} className="text-sm text-amber-900 mb-2">
              {note.content}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
