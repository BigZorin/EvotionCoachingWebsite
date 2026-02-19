"use client"

import { useState } from "react"
import {
  Sparkles, Dumbbell, UtensilsCrossed, ClipboardList, TrendingUp,
  AlertTriangle, Info, AlertCircle, Lightbulb, Heart, X, Check, Loader2,
  ArrowRight, Pill, Zap
} from "lucide-react"
import type {
  AIWeeklyReviewResult, AIFlaggedConcern, AIRecommendation, AIActionableRecommendation,
} from "@/app/actions/ai-coaching"

interface AIWeeklyReviewProps {
  result: AIWeeklyReviewResult
  onClose: () => void
  clientId: string
  reviewLogId?: string
  onRecommendationApplied?: () => void
}

const severityConfig: Record<string, { icon: any; bg: string; border: string; text: string; badge: string }> = {
  info: { icon: Info, bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", badge: "bg-blue-100 text-blue-700" },
  warning: { icon: AlertTriangle, bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", badge: "bg-amber-100 text-amber-700" },
  critical: { icon: AlertCircle, bg: "bg-red-50", border: "border-red-200", text: "text-red-700", badge: "bg-red-100 text-red-700" },
}

const areaIcons: Record<string, any> = {
  training: Dumbbell,
  nutrition: UtensilsCrossed,
  recovery: Heart,
  supplements: Pill,
  general: Lightbulb,
}

function ConcernCard({ concern }: { concern: AIFlaggedConcern }) {
  const config = severityConfig[concern.severity] || severityConfig.info
  const Icon = config.icon
  return (
    <div className={`${config.bg} ${config.border} border rounded-lg p-3`}>
      <div className="flex items-start gap-2">
        <Icon className={`w-4 h-4 mt-0.5 ${config.text}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${config.badge}`}>
              {concern.severity === "critical" ? "Urgent" : concern.severity === "warning" ? "Let op" : "Info"}
            </span>
            <span className="text-xs font-medium text-gray-600">{concern.area}</span>
          </div>
          <p className={`text-sm ${config.text}`}>{concern.description}</p>
        </div>
      </div>
    </div>
  )
}

function RecommendationCard({ rec, index }: { rec: AIRecommendation; index: number }) {
  const Icon = areaIcons[rec.area] || Lightbulb
  const areaLabels: Record<string, string> = {
    training: "Training", nutrition: "Voeding", recovery: "Herstel", general: "Algemeen",
  }
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#1e1839]/10 flex items-center justify-center shrink-0 mt-0.5">
          <Icon className="w-4 h-4 text-[#1e1839]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-semibold text-[#1e1839]">{index + 1}.</span>
            <span className="text-xs font-medium text-gray-400 uppercase">{areaLabels[rec.area] || rec.area}</span>
          </div>
          <p className="text-sm font-medium text-gray-900">{rec.action}</p>
          {rec.rationale && <p className="text-xs text-gray-500 mt-1">{rec.rationale}</p>}
        </div>
      </div>
    </div>
  )
}

function ActionableCard({
  rec,
  onApply,
  applied,
  applying,
  error,
}: {
  rec: AIActionableRecommendation
  onApply: () => void
  applied: boolean
  applying: boolean
  error: string | null
}) {
  const Icon = areaIcons[rec.area] || Lightbulb
  const areaLabels: Record<string, string> = {
    training: "Training", nutrition: "Voeding", recovery: "Herstel", supplements: "Supplementen", general: "Algemeen",
  }

  return (
    <div className={`border rounded-xl overflow-hidden ${applied ? "border-emerald-300 bg-emerald-50/30" : "border-orange-200 bg-orange-50/30"}`}>
      {/* Header */}
      <div className="px-4 py-3 flex items-start gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${applied ? "bg-emerald-100" : "bg-orange-100"}`}>
          <Icon className={`w-4.5 h-4.5 ${applied ? "text-emerald-700" : "text-orange-700"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${applied ? "text-emerald-600" : "text-orange-600"}`}>
              {areaLabels[rec.area] || rec.area}
            </span>
            {applied && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">
                <Check className="w-3 h-3" /> Toegepast
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-gray-900">{rec.action}</p>
          {rec.rationale && <p className="text-xs text-gray-500 mt-1">{rec.rationale}</p>}
        </div>
      </div>

      {/* Proposal box */}
      {rec.proposalType === "nutrition_adjust" && rec.proposal.newCalories && (
        <div className="mx-4 mb-3 bg-white rounded-lg border border-orange-200/60 p-3">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Voorstel</div>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: "Calorieën", value: `${rec.proposal.newCalories}`, unit: "kcal", delta: rec.proposal.calorieChange },
              { label: "Eiwit", value: `${rec.proposal.newProtein}`, unit: "g" },
              { label: "Koolhydraten", value: `${rec.proposal.newCarbs}`, unit: "g" },
              { label: "Vet", value: `${rec.proposal.newFat}`, unit: "g" },
            ].map((item) => (
              <div key={item.label}>
                <div className="text-[10px] text-gray-400 mb-0.5">{item.label}</div>
                <div className="text-sm font-bold text-gray-900">
                  {item.value}<span className="text-[10px] font-normal text-gray-400 ml-0.5">{item.unit}</span>
                </div>
                {item.delta != null && (
                  <div className={`text-[10px] font-semibold ${item.delta > 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {item.delta > 0 ? "+" : ""}{item.delta} kcal
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {rec.proposalType === "supplement_add" && rec.proposal.supplementName && (
        <div className="mx-4 mb-3 bg-white rounded-lg border border-orange-200/60 p-3">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Voorstel</div>
          <div className="flex items-center gap-3">
            <Pill className="w-4 h-4 text-orange-500 shrink-0" />
            <div>
              <div className="text-sm font-semibold text-gray-900">{rec.proposal.supplementName}</div>
              <div className="text-xs text-gray-500">
                {rec.proposal.supplementDosage}
                {rec.proposal.supplementTiming && ` — ${rec.proposal.supplementTiming}`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Apply button */}
      {rec.canApply && !applied && (
        <div className="px-4 pb-3">
          {error && (
            <div className="text-xs text-red-600 mb-2 bg-red-50 rounded px-2 py-1">{error}</div>
          )}
          <button
            onClick={onApply}
            disabled={applying}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-[#1e1839] rounded-lg hover:bg-[#2a2050] transition disabled:opacity-50"
          >
            {applying ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Toepassen...</>
            ) : (
              <><Zap className="w-4 h-4" /> Toepassen</>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default function AIWeeklyReview({ result, onClose, clientId, reviewLogId, onRecommendationApplied }: AIWeeklyReviewProps) {
  const { summary, complianceAnalysis, progressAnalysis, flaggedConcerns, recommendations, actionableRecommendations } = result

  const [appliedSet, setAppliedSet] = useState<Set<number>>(new Set())
  const [applyingIdx, setApplyingIdx] = useState<number | null>(null)
  const [applyErrors, setApplyErrors] = useState<Record<number, string>>({})

  // Sort concerns: critical first, then warning, then info
  const sortedConcerns = [...flaggedConcerns].sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 }
    return (order[a.severity] ?? 2) - (order[b.severity] ?? 2)
  })

  async function handleApply(rec: AIActionableRecommendation, idx: number) {
    setApplyingIdx(idx)
    setApplyErrors((prev) => { const n = { ...prev }; delete n[idx]; return n })
    try {
      const { applyReviewRecommendation } = await import("@/app/actions/ai-coaching")
      const res = await applyReviewRecommendation(clientId, rec, reviewLogId)
      if (res.success) {
        setAppliedSet((prev) => new Set(prev).add(idx))
        onRecommendationApplied?.()
      } else {
        setApplyErrors((prev) => ({ ...prev, [idx]: res.error || "Toepassen mislukt" }))
      }
    } catch (e: any) {
      setApplyErrors((prev) => ({ ...prev, [idx]: e.message || "Verbinding mislukt" }))
    } finally {
      setApplyingIdx(null)
    }
  }

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e1839] to-[#2a2050] px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">AI Wekelijkse Review</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-white/50">{result.model} — {result.tokensUsed} tokens</span>
                {result.ragUsed && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-300">RAG</span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Summary */}
        <div>
          <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
        </div>

        {/* Compliance Analysis */}
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Naleving</h4>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Dumbbell, label: "Training", text: complianceAnalysis.training },
              { icon: UtensilsCrossed, label: "Voeding", text: complianceAnalysis.nutrition },
              { icon: ClipboardList, label: "Check-ins", text: complianceAnalysis.checkIns },
            ].filter(c => c.text).map((card) => (
              <div key={card.label} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <card.icon className="w-3.5 h-3.5 text-[#1e1839]" />
                  <span className="text-[10px] font-semibold text-[#1e1839] uppercase">{card.label}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{card.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Progress */}
        {progressAnalysis && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-[#1e1839]" />
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Voortgang</h4>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{progressAnalysis}</p>
          </div>
        )}

        {/* Flagged Concerns */}
        {sortedConcerns.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Aandachtspunten ({sortedConcerns.length})
            </h4>
            <div className="space-y-2">
              {sortedConcerns.map((concern, i) => (
                <ConcernCard key={i} concern={concern} />
              ))}
            </div>
          </div>
        )}

        {/* Actionable Recommendations */}
        {actionableRecommendations && actionableRecommendations.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-3.5 h-3.5 text-orange-500" />
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Toepasbare Voorstellen ({actionableRecommendations.length})
              </h4>
            </div>
            <div className="space-y-3">
              {actionableRecommendations.map((rec, i) => (
                <ActionableCard
                  key={i}
                  rec={rec}
                  onApply={() => handleApply(rec, i)}
                  applied={appliedSet.has(i)}
                  applying={applyingIdx === i}
                  error={applyErrors[i] || null}
                />
              ))}
            </div>
          </div>
        )}

        {/* Regular Recommendations */}
        {recommendations.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Aanbevelingen ({recommendations.length})
            </h4>
            <div className="space-y-2">
              {recommendations.map((rec, i) => (
                <RecommendationCard key={i} rec={rec} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
