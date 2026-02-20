"use client"

import { useState, useEffect } from "react"
import {
  Sparkles, Dumbbell, UtensilsCrossed, Pill, BarChart3, History,
  ChevronDown, Eye, X, ArrowRight,
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
import AIGeneratorBanner from "./AIGeneratorBanner"

const AI_TYPE_LABELS: Record<AIGenerationType, string> = {
  training_program: "Training Programma",
  nutrition_plan: "Voedingsplan",
  weekly_review: "Wekelijkse Review",
  supplement_analysis: "Supplementen Analyse",
  client_summary: "Client Samenvatting",
}

interface AiCoachTabProps {
  clientId: string
  clientName: string
  onNavigateToTab: (tab: string) => void
}

export default function AiCoachTab({
  clientId,
  clientName,
  onNavigateToTab,
}: AiCoachTabProps) {
  const [aiCockpitResult, setAiCockpitResult] = useState<AIClientSummaryResult | null>(null)
  const [aiCockpitLoading, setAiCockpitLoading] = useState(false)
  const [aiCockpitError, setAiCockpitError] = useState<string | null>(null)

  const [aiReviewResult, setAiReviewResult] = useState<AIWeeklyReviewResult | null>(null)
  const [aiReviewLoading, setAiReviewLoading] = useState(false)
  const [aiReviewError, setAiReviewError] = useState<string | null>(null)
  const [aiReviewLogId, setAiReviewLogId] = useState<string | undefined>(undefined)

  const [aiLogs, setAiLogs] = useState<AIGenerationLog[]>([])
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

  const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
    training_program: { icon: Dumbbell, color: "text-primary", bg: "bg-primary/10" },
    nutrition_plan: { icon: UtensilsCrossed, color: "text-amber-600", bg: "bg-amber-50" },
    weekly_review: { icon: BarChart3, color: "text-primary", bg: "bg-primary/10" },
    supplement_analysis: { icon: Pill, color: "text-emerald-600", bg: "bg-emerald-50" },
    client_summary: { icon: Sparkles, color: "text-primary", bg: "bg-primary/10" },
  }

  return (
    <div className="space-y-6">
      {/* Quick action links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button onClick={() => onNavigateToTab("training")} className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border hover:shadow-sm transition-all group text-left">
          <div className="p-2 rounded-lg bg-primary/5">
            <Dumbbell className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">Training</p>
            <p className="text-xs text-muted-foreground">AI programma genereren</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground/0 group-hover:text-muted-foreground/50 transition-all" />
        </button>
        <button onClick={() => onNavigateToTab("voeding")} className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border hover:shadow-sm transition-all group text-left">
          <div className="p-2 rounded-lg bg-amber-50">
            <UtensilsCrossed className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">Voeding</p>
            <p className="text-xs text-muted-foreground">Voedingsplan &amp; supplementen</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground/0 group-hover:text-muted-foreground/50 transition-all" />
        </button>
        <button onClick={() => onNavigateToTab("intake")} className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border hover:shadow-sm transition-all group text-left">
          <div className="p-2 rounded-lg bg-secondary">
            <Sparkles className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">Intake</p>
            <p className="text-xs text-muted-foreground">AI intake analyse</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground/0 group-hover:text-muted-foreground/50 transition-all" />
        </button>
      </div>

      {/* AI Generators */}
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

      {/* AI History */}
      <div className="bg-card rounded-xl border border-border">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Historie</span>
            <span className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded font-medium">{aiLogs.length}</span>
          </div>
        </div>
        {aiLogs.length === 0 ? (
          <div className="text-center py-10">
            <Sparkles className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Nog geen AI generaties</p>
            <p className="text-xs text-muted-foreground mt-1">Gebruik de knoppen hierboven om te starten</p>
          </div>
        ) : (
          <div className="px-4 pb-4 pt-2 space-y-1">
            {aiLogs.map((log) => {
              const cfg = typeConfig[log.generation_type] || typeConfig.client_summary
              const LogIcon = cfg.icon
              const isSelected = selectedLog?.id === log.id
              return (
                <div key={log.id}>
                  <button
                    onClick={() => setSelectedLog(isSelected ? null : log)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition ${
                      isSelected ? "bg-primary/5 border border-primary/10" : "hover:bg-secondary/50"
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
                    <Eye className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground/30"}`} />
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
    </div>
  )
}

/* AI Log Detail */
function AILogDetail({ log, onDelete }: { log: AIGenerationLog; onDelete: () => void }) {
  return (
    <div className="ml-10 mt-1 mb-2 p-3 bg-secondary/50 rounded-lg border border-border text-xs text-foreground/80 space-y-2.5 max-h-[400px] overflow-y-auto">
      {log.generation_type === "weekly_review" && (
        <>
          {log.result?.summary && <p className="font-medium text-foreground">{log.result.summary}</p>}
          {log.result?.complianceAnalysis && (
            <div className="space-y-1">
              {log.result.complianceAnalysis.training && <p><span className="text-primary font-medium">Training:</span> {log.result.complianceAnalysis.training}</p>}
              {log.result.complianceAnalysis.nutrition && <p><span className="text-amber-600 font-medium">Voeding:</span> {log.result.complianceAnalysis.nutrition}</p>}
              {log.result.complianceAnalysis.checkIns && <p><span className="text-primary font-medium">Check-ins:</span> {log.result.complianceAnalysis.checkIns}</p>}
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
          {log.result?.trainingStatus?.keyInsight && <p><span className="text-primary font-medium">Training:</span> {log.result.trainingStatus.keyInsight}</p>}
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
