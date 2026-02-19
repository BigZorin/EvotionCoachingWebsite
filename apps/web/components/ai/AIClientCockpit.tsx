"use client"

import {
  Sparkles, Dumbbell, UtensilsCrossed, Pill, TrendingUp,
  AlertCircle, CheckCircle, X
} from "lucide-react"
import type { AIClientSummaryResult, AIPriorityAction } from "@/app/actions/ai-coaching"

interface AIClientCockpitProps {
  result: AIClientSummaryResult
  onClose: () => void
}

const areaIcons: Record<string, any> = {
  training: Dumbbell,
  nutrition: UtensilsCrossed,
  recovery: TrendingUp,
  supplements: Pill,
  general: Sparkles,
}

const areaLabels: Record<string, string> = {
  training: "Training",
  nutrition: "Voeding",
  recovery: "Herstel",
  supplements: "Supplementen",
  general: "Algemeen",
}

const urgencyConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  high: { label: "Urgent", bg: "bg-red-50 border-red-200", text: "text-red-700", dot: "bg-red-500" },
  medium: { label: "Belangrijk", bg: "bg-amber-50 border-amber-200", text: "text-amber-700", dot: "bg-amber-500" },
  low: { label: "Nice-to-have", bg: "bg-blue-50 border-blue-200", text: "text-blue-700", dot: "bg-blue-500" },
}

function StatusCard({ icon: Icon, title, content, insight, color }: {
  icon: any; title: string; content: string | null; insight: string; color: string
}) {
  return (
    <div className={`rounded-xl border p-4 ${color}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-semibold uppercase tracking-wider">{title}</span>
      </div>
      {content && <p className="text-sm font-medium mb-1">{content}</p>}
      <p className="text-xs opacity-75 leading-relaxed">{insight}</p>
    </div>
  )
}

function PriorityActionCard({ action }: { action: AIPriorityAction }) {
  const config = urgencyConfig[action.urgency] || urgencyConfig.medium
  const Icon = areaIcons[action.area] || Sparkles
  return (
    <div className={`${config.bg} border rounded-lg p-3 flex items-start gap-3`}>
      <div className={`w-2 h-2 rounded-full ${config.dot} mt-1.5 shrink-0`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <Icon className={`w-3.5 h-3.5 ${config.text}`} />
          <span className={`text-[10px] font-semibold uppercase ${config.text}`}>
            {areaLabels[action.area] || action.area}
          </span>
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${config.text} bg-white/50`}>
            {config.label}
          </span>
        </div>
        <p className={`text-sm ${config.text}`}>{action.action}</p>
      </div>
    </div>
  )
}

export default function AIClientCockpit({ result, onClose }: AIClientCockpitProps) {
  // Sort priority actions: high first
  const sortedActions = [...result.priorityActions].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 }
    return (order[a.urgency] ?? 2) - (order[b.urgency] ?? 2)
  })

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
              <h3 className="text-sm font-semibold text-white">AI Client Samenvatting</h3>
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
        {/* Overall Assessment */}
        <div>
          <p className="text-sm text-gray-700 leading-relaxed">{result.overallAssessment}</p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <StatusCard
            icon={Dumbbell}
            title="Training"
            content={result.trainingStatus.currentProgram}
            insight={result.trainingStatus.keyInsight || result.trainingStatus.adherence}
            color="bg-indigo-50 border-indigo-200 text-indigo-900"
          />
          <StatusCard
            icon={UtensilsCrossed}
            title="Voeding"
            content={result.nutritionStatus.currentTargets}
            insight={result.nutritionStatus.keyInsight || result.nutritionStatus.adherence}
            color="bg-orange-50 border-orange-200 text-orange-900"
          />
          <StatusCard
            icon={Pill}
            title="Supplementen"
            content={null}
            insight={result.supplementStatus || "Geen actieve supplementen"}
            color="bg-emerald-50 border-emerald-200 text-emerald-900"
          />
        </div>

        {/* Progress Highlights */}
        {result.progressHighlights.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Voortgang Highlights
            </h4>
            <div className="space-y-1.5">
              {result.progressHighlights.map((highlight, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-700">{highlight}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Priority Actions */}
        {sortedActions.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> Prioriteiten ({sortedActions.length})
            </h4>
            <div className="space-y-2">
              {sortedActions.map((action, i) => (
                <PriorityActionCard key={i} action={action} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
