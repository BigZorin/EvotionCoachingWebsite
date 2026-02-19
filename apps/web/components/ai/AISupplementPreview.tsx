"use client"

import { useState } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog"
import {
  Sparkles, Pill, AlertTriangle, Shield, Clock, Beaker, Check
} from "lucide-react"
import type { AISupplementResult, AISupplementRecommendation } from "@/app/actions/ai-coaching"

interface AISupplementPreviewProps {
  open: boolean
  onClose: () => void
  result: AISupplementResult
  onSave: (recommendations: AISupplementRecommendation[]) => Promise<void>
  saving: boolean
}

const evidenceConfig: Record<string, { label: string; color: string }> = {
  strong: { label: "Sterk bewijs", color: "bg-green-100 text-green-700" },
  moderate: { label: "Matig bewijs", color: "bg-amber-100 text-amber-700" },
  limited: { label: "Beperkt bewijs", color: "bg-gray-100 text-gray-600" },
}

function SupplementCard({ rec, index, selected, onToggle }: {
  rec: AISupplementRecommendation
  index: number
  selected: boolean
  onToggle: () => void
}) {
  const evidence = evidenceConfig[rec.evidenceLevel] || evidenceConfig.limited
  return (
    <div
      className={`rounded-xl border p-4 transition cursor-pointer ${
        selected ? "border-[#1e1839] bg-[#1e1839]/[0.02]" : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={onToggle}
    >
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
          selected ? "bg-[#1e1839] text-white" : "bg-gray-100 text-gray-400"
        }`}>
          {selected ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{index + 1}</span>}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-gray-900">{rec.name}</span>
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${evidence.color}`}>
              {evidence.label}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
            <span className="flex items-center gap-1"><Beaker className="w-3 h-3" /> {rec.dosage}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {rec.timing}</span>
            <span>{rec.frequency}</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">{rec.rationale}</p>
          {rec.interactions && (
            <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-2 flex items-start gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
              <p className="text-xs text-red-700">{rec.interactions}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AISupplementPreview({
  open, onClose, result, onSave, saving,
}: AISupplementPreviewProps) {
  const [selected, setSelected] = useState<Set<number>>(
    new Set(result.recommendations.map((_, i) => i))
  )

  const toggleSelection = (index: number) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  const handleSave = async () => {
    const selectedRecs = result.recommendations.filter((_, i) => selected.has(i))
    await onSave(selectedRecs)
  }

  const hasInteractions = result.recommendations.some(r => r.interactions)

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1e1839] flex items-center justify-center shrink-0">
              <Pill className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg">AI Supplementen Analyse</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-400">{result.model} — {result.tokensUsed} tokens</span>
                {result.ragUsed && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-700">RAG</span>
                )}
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-700">AI Generated</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Medical Disclaimer — always prominent */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-amber-700 mb-0.5">Medische disclaimer</p>
              <p className="text-xs text-amber-600 leading-relaxed">{result.medicalDisclaimer}</p>
            </div>
          </div>
        </div>

        {/* Interaction warning */}
        {hasInteractions && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-red-700 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4" />
              Let op: er zijn mogelijke medicatie-interacties gevonden
            </div>
          </div>
        )}

        {/* Supplement recommendations */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Aanbevelingen ({result.recommendations.length})
            </h4>
            <button
              onClick={() => {
                if (selected.size === result.recommendations.length) {
                  setSelected(new Set())
                } else {
                  setSelected(new Set(result.recommendations.map((_, i) => i)))
                }
              }}
              className="text-xs text-[#1e1839] hover:underline"
            >
              {selected.size === result.recommendations.length ? "Deselecteer alles" : "Selecteer alles"}
            </button>
          </div>
          {result.recommendations.map((rec, i) => (
            <SupplementCard
              key={i}
              rec={rec}
              index={i}
              selected={selected.has(i)}
              onToggle={() => toggleSelection(i)}
            />
          ))}
        </div>

        {/* General notes */}
        {result.generalNotes && (
          <div className="bg-[#1e1839]/[0.03] rounded-lg p-3">
            <h4 className="text-xs font-semibold text-[#1e1839] uppercase tracking-wider mb-1">Algemene opmerkingen</h4>
            <p className="text-sm text-gray-700">{result.generalNotes}</p>
          </div>
        )}

        <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
          >
            Annuleren
          </button>
          <button
            onClick={handleSave}
            disabled={saving || selected.size === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-[#1e1839] rounded-lg hover:bg-[#2a2050] transition disabled:opacity-50"
          >
            {saving ? "Opslaan..." : `${selected.size} Supplement${selected.size !== 1 ? "en" : ""} Opslaan`}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
