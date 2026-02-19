"use client"

import { useState } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog"
import {
  Sparkles, Flame, Beef, Wheat, Droplets, Clock, Pill, AlertTriangle
} from "lucide-react"
import type { AINutritionResult } from "@/app/actions/ai-coaching"

interface AINutritionPreviewProps {
  open: boolean
  onClose: () => void
  result: AINutritionResult
  currentTargets: {
    daily_calories: number
    daily_protein_grams: number
    daily_carbs_grams: number
    daily_fat_grams: number
  } | null
  onSave: () => Promise<void>
  saving: boolean
}

function MacroCard({
  icon: Icon,
  label,
  value,
  unit,
  current,
  color,
}: {
  icon: any
  label: string
  value: number
  unit: string
  current: number | null
  color: string
}) {
  const diff = current != null ? value - current : null
  return (
    <div className={`rounded-xl border p-4 ${color}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}<span className="text-sm font-normal ml-1">{unit}</span></div>
      {diff != null && diff !== 0 && (
        <div className={`text-xs mt-1 ${diff > 0 ? "text-green-600" : "text-red-600"}`}>
          {diff > 0 ? "+" : ""}{diff}{unit} vs huidig
        </div>
      )}
      {current != null && diff === 0 && (
        <div className="text-xs mt-1 text-gray-400">Zelfde als huidig</div>
      )}
      {current == null && (
        <div className="text-xs mt-1 text-gray-400">Nog niet ingesteld</div>
      )}
    </div>
  )
}

export default function AINutritionPreview({
  open, onClose, result, currentTargets, onSave, saving,
}: AINutritionPreviewProps) {
  const { targets, generalAdvice, timingRecommendations, supplementAdvice } = result

  // Calculate macro percentages
  const totalCals = (targets.dailyProteinGrams * 4) + (targets.dailyCarbsGrams * 4) + (targets.dailyFatGrams * 9)
  const proteinPct = totalCals > 0 ? Math.round((targets.dailyProteinGrams * 4 / totalCals) * 100) : 0
  const carbsPct = totalCals > 0 ? Math.round((targets.dailyCarbsGrams * 4 / totalCals) * 100) : 0
  const fatPct = totalCals > 0 ? Math.round((targets.dailyFatGrams * 9 / totalCals) * 100) : 0

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1e1839] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg">AI Voedingsadvies</DialogTitle>
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

        {/* Warnings (corrected values) */}
        {result.warnings && result.warnings.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-amber-700 text-sm font-medium mb-1">
              <AlertTriangle className="w-4 h-4" />
              {result.warnings.length} correctie{result.warnings.length > 1 ? "s" : ""} toegepast
            </div>
            <ul className="text-xs text-amber-600 space-y-0.5">
              {result.warnings.map((w, i) => <li key={i}>• {w}</li>)}
            </ul>
          </div>
        )}

        {/* Macro Targets */}
        <div className="grid grid-cols-2 gap-3">
          <MacroCard
            icon={Flame}
            label="Calorieën"
            value={targets.dailyCalories}
            unit="kcal"
            current={currentTargets?.daily_calories ?? null}
            color="bg-orange-50 border-orange-200 text-orange-900"
          />
          <MacroCard
            icon={Beef}
            label="Eiwit"
            value={targets.dailyProteinGrams}
            unit="g"
            current={currentTargets?.daily_protein_grams ?? null}
            color="bg-red-50 border-red-200 text-red-900"
          />
          <MacroCard
            icon={Wheat}
            label="Koolhydraten"
            value={targets.dailyCarbsGrams}
            unit="g"
            current={currentTargets?.daily_carbs_grams ?? null}
            color="bg-amber-50 border-amber-200 text-amber-900"
          />
          <MacroCard
            icon={Droplets}
            label="Vet"
            value={targets.dailyFatGrams}
            unit="g"
            current={currentTargets?.daily_fat_grams ?? null}
            color="bg-blue-50 border-blue-200 text-blue-900"
          />
        </div>

        {/* Macro distribution bar */}
        <div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <span>Macro-verdeling</span>
            <span>{targets.dailyCalories} kcal</span>
          </div>
          <div className="flex h-3 rounded-full overflow-hidden">
            <div className="bg-red-400" style={{ width: `${proteinPct}%` }} title={`Eiwit ${proteinPct}%`} />
            <div className="bg-amber-400" style={{ width: `${carbsPct}%` }} title={`Koolhydraten ${carbsPct}%`} />
            <div className="bg-blue-400" style={{ width: `${fatPct}%` }} title={`Vet ${fatPct}%`} />
          </div>
          <div className="flex gap-4 mt-1.5">
            <span className="text-xs text-gray-500 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" /> Eiwit {proteinPct}%</span>
            <span className="text-xs text-gray-500 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Koolhydraten {carbsPct}%</span>
            <span className="text-xs text-gray-500 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400" /> Vet {fatPct}%</span>
          </div>
        </div>

        {/* Rationale */}
        {targets.rationale && (
          <div className="bg-[#1e1839]/[0.03] rounded-lg p-3">
            <h4 className="text-xs font-semibold text-[#1e1839] uppercase tracking-wider mb-1">Onderbouwing</h4>
            <p className="text-sm text-gray-700">{targets.rationale}</p>
          </div>
        )}

        {/* General Advice */}
        {generalAdvice && (
          <div className="bg-[#1e1839]/[0.03] rounded-lg p-3">
            <h4 className="text-xs font-semibold text-[#1e1839] uppercase tracking-wider mb-1">Voedingsadvies</h4>
            <p className="text-sm text-gray-700">{generalAdvice}</p>
          </div>
        )}

        {/* Timing */}
        {timingRecommendations && (
          <div className="bg-[#1e1839]/[0.03] rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-[#1e1839]" />
              <h4 className="text-xs font-semibold text-[#1e1839] uppercase tracking-wider">Maaltijdtiming</h4>
            </div>
            <p className="text-sm text-gray-700">{timingRecommendations}</p>
          </div>
        )}

        {/* Supplements */}
        {supplementAdvice && (
          <div className="bg-[#1e1839]/[0.03] rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Pill className="w-3.5 h-3.5 text-[#1e1839]" />
              <h4 className="text-xs font-semibold text-[#1e1839] uppercase tracking-wider">Supplementen</h4>
            </div>
            <p className="text-sm text-gray-700">{supplementAdvice}</p>
          </div>
        )}

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
            className="px-4 py-2 text-sm font-medium text-white bg-[#1e1839] rounded-lg hover:bg-[#2a2050] transition disabled:opacity-50"
          >
            {saving ? "Opslaan..." : "Targets Opslaan"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
