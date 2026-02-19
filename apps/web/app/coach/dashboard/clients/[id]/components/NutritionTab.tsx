"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Flame, Pencil, Save, Check, X, UtensilsCrossed, Pill,
  Plus, Trash2, Sparkles, Clock, Info,
} from "lucide-react"
import {
  getNutritionTargets, setNutritionTargets,
  getClientSupplements, addClientSupplement,
  removeClientSupplement, toggleSupplementActive,
} from "@/app/actions/nutrition"
import {
  generateNutritionPlan,
  generateSupplementAnalysis,
  saveAIGenerationLog,
  getAIGenerationLogs,
  type AINutritionResult,
  type AISupplementResult,
  type AISupplementRecommendation,
} from "@/app/actions/ai-coaching"
import AINutritionPreview from "@/components/ai/AINutritionPreview"
import AISupplementPreview from "@/components/ai/AISupplementPreview"
import AIGeneratorBanner from "./AIGeneratorBanner"
import SubTabNavigation from "./SubTabNavigation"

// ─── Props ────────────────────────────────────────────────

interface NutritionTabProps {
  clientId: string
  nutritionTargets: {
    daily_calories: number
    daily_protein_grams: number
    daily_carbs_grams: number
    daily_fat_grams: number
  } | null
  foodLogs: any
  clientAssignments: any[]
  supplements: any[]
  targetHistory: any[]
  onDataRefresh: () => void
}

// ─── Sub-tab config ───────────────────────────────────────

const SUB_TABS = [
  { id: "targets", label: "Targets & Logs", icon: Flame },
  { id: "supplements", label: "Supplementen", icon: Pill },
  { id: "history", label: "Geschiedenis", icon: Clock },
]

// ─── Component ────────────────────────────────────────────

export default function NutritionTab({
  clientId,
  nutritionTargets: initialTargets,
  foodLogs,
  clientAssignments,
  supplements: initialSupplements,
  targetHistory: initialHistory,
  onDataRefresh,
}: NutritionTabProps) {
  // Sub-tab state
  const [activeSubTab, setActiveSubTab] = useState<"targets" | "supplements" | "history">("targets")

  // Nutrition targets
  const [nutritionTargets, setNutritionTargetsLocal] = useState(initialTargets)
  const [editingTargets, setEditingTargets] = useState(false)
  const [targetForm, setTargetForm] = useState({
    daily_calories: initialTargets?.daily_calories || 0,
    daily_protein_grams: initialTargets?.daily_protein_grams || 0,
    daily_carbs_grams: initialTargets?.daily_carbs_grams || 0,
    daily_fat_grams: initialTargets?.daily_fat_grams || 0,
  })
  const [targetSaving, setTargetSaving] = useState(false)
  const [targetSaved, setTargetSaved] = useState(false)

  // AI Nutrition
  const [aiNutritionResult, setAiNutritionResult] = useState<AINutritionResult | null>(null)
  const [aiNutritionLoading, setAiNutritionLoading] = useState(false)
  const [aiNutritionError, setAiNutritionError] = useState<string | null>(null)
  const [showAINutritionPreview, setShowAINutritionPreview] = useState(false)
  const [aiNutritionSaving, setAiNutritionSaving] = useState(false)

  // Supplements
  const [supplements, setSupplements] = useState<any[]>(initialSupplements)
  const [showAddSupplement, setShowAddSupplement] = useState(false)
  const [newSupplement, setNewSupplement] = useState({ name: "", dosage: "", timing: "", frequency: "dagelijks" })
  const [supplementSaving, setSupplementSaving] = useState(false)

  // AI Supplement
  const [aiSupplementResult, setAiSupplementResult] = useState<AISupplementResult | null>(null)
  const [aiSupplementLoading, setAiSupplementLoading] = useState(false)
  const [aiSupplementError, setAiSupplementError] = useState<string | null>(null)
  const [showAISupplementPreview, setShowAISupplementPreview] = useState(false)
  const [aiSupplementSaving, setAiSupplementSaving] = useState(false)

  // History
  const [targetHistory, setTargetHistory] = useState<any[]>(initialHistory)

  // ── Handlers ──────────────────────────────────────────────

  const handleSaveTargets = async () => {
    setTargetSaving(true)
    setTargetSaved(false)
    const result = await setNutritionTargets(clientId, targetForm, { source: "manual" })
    if (result.success) {
      setNutritionTargetsLocal(targetForm)
      setEditingTargets(false)
      setTargetSaved(true)
      setTimeout(() => setTargetSaved(false), 2000)
      onDataRefresh()
    }
    setTargetSaving(false)
  }

  const handleGenerateNutrition = async () => {
    setAiNutritionLoading(true)
    setAiNutritionError(null)
    try {
      const res = await generateNutritionPlan(clientId)
      if (res.success && res.data) {
        setAiNutritionResult(res.data)
        setShowAINutritionPreview(true)
        saveAIGenerationLog(clientId, "nutrition_plan", res.data, {
          model: res.data.model,
          tokensUsed: res.data.tokensUsed,
          ragUsed: res.data.ragUsed,
        })
      } else {
        setAiNutritionError(res.error || "Generatie mislukt")
      }
    } catch (err: any) {
      console.error("[AI Nutrition] Client-side error:", err)
      setAiNutritionError(err?.message || "Verbinding met server mislukt. Probeer opnieuw.")
    } finally {
      setAiNutritionLoading(false)
    }
  }

  const handleSaveAINutrition = async () => {
    if (!aiNutritionResult) return
    setAiNutritionSaving(true)
    try {
      const res = await setNutritionTargets(clientId, {
        daily_calories: aiNutritionResult.targets.dailyCalories,
        daily_protein_grams: aiNutritionResult.targets.dailyProteinGrams,
        daily_carbs_grams: aiNutritionResult.targets.dailyCarbsGrams,
        daily_fat_grams: aiNutritionResult.targets.dailyFatGrams,
      }, {
        source: "ai",
        rationale: [
          aiNutritionResult.targets.rationale,
          aiNutritionResult.generalAdvice,
        ].filter(Boolean).join(" | "),
        aiModel: aiNutritionResult.model,
        ragUsed: aiNutritionResult.ragUsed,
      })
      if (res.success) {
        setShowAINutritionPreview(false)
        setAiNutritionResult(null)
        setNutritionTargetsLocal({
          daily_calories: aiNutritionResult.targets.dailyCalories,
          daily_protein_grams: aiNutritionResult.targets.dailyProteinGrams,
          daily_carbs_grams: aiNutritionResult.targets.dailyCarbsGrams,
          daily_fat_grams: aiNutritionResult.targets.dailyFatGrams,
        })
        onDataRefresh()
      } else {
        setAiNutritionError(res.error || "Opslaan mislukt")
      }
    } catch (err: any) {
      setAiNutritionError(err?.message || "Opslaan mislukt")
    } finally {
      setAiNutritionSaving(false)
    }
  }

  const handleGenerateSupplement = async () => {
    setAiSupplementLoading(true)
    setAiSupplementError(null)
    try {
      const res = await generateSupplementAnalysis(clientId)
      if (res.success && res.data) {
        setAiSupplementResult(res.data)
        setShowAISupplementPreview(true)
        saveAIGenerationLog(clientId, "supplement_analysis", res.data, {
          model: res.data.model,
          tokensUsed: res.data.tokensUsed,
          ragUsed: res.data.ragUsed,
        })
      } else {
        setAiSupplementError(res.error || "Analyse mislukt")
      }
    } catch (err: any) {
      setAiSupplementError(err?.message || "Verbinding mislukt")
    } finally {
      setAiSupplementLoading(false)
    }
  }

  const handleSaveAISupplements = async (recs: AISupplementRecommendation[]) => {
    setAiSupplementSaving(true)
    try {
      for (const rec of recs) {
        await addClientSupplement(clientId, {
          name: rec.name,
          dosage: rec.dosage,
          timing: rec.timing,
          frequency: rec.frequency,
          source: "ai",
          aiRationale: rec.rationale,
        })
      }
      setShowAISupplementPreview(false)
      setAiSupplementResult(null)
      const res = await getClientSupplements(clientId)
      if (res.success && res.supplements) setSupplements(res.supplements)
    } catch (err: any) {
      setAiSupplementError(err?.message || "Opslaan mislukt")
    } finally {
      setAiSupplementSaving(false)
    }
  }

  const handleAddSupplement = async () => {
    if (!newSupplement.name.trim() || !newSupplement.dosage.trim()) return
    setSupplementSaving(true)
    await addClientSupplement(clientId, {
      name: newSupplement.name.trim(),
      dosage: newSupplement.dosage.trim(),
      timing: newSupplement.timing.trim() || undefined,
      frequency: newSupplement.frequency,
    })
    setNewSupplement({ name: "", dosage: "", timing: "", frequency: "dagelijks" })
    setShowAddSupplement(false)
    const res = await getClientSupplements(clientId)
    if (res.success && res.supplements) setSupplements(res.supplements)
    setSupplementSaving(false)
  }

  // ── Render ────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Sub-tab navigation */}
      <SubTabNavigation
        tabs={SUB_TABS}
        active={activeSubTab}
        onChange={(id) => setActiveSubTab(id as "targets" | "supplements" | "history")}
      />

      {/* AI Nutrition Preview Dialog */}
      {aiNutritionResult && (
        <AINutritionPreview
          open={showAINutritionPreview}
          onClose={() => setShowAINutritionPreview(false)}
          result={aiNutritionResult}
          currentTargets={nutritionTargets}
          saving={aiNutritionSaving}
          onSave={handleSaveAINutrition}
        />
      )}

      {/* AI Supplement Preview Dialog */}
      {aiSupplementResult && (
        <AISupplementPreview
          open={showAISupplementPreview}
          onClose={() => setShowAISupplementPreview(false)}
          result={aiSupplementResult}
          saving={aiSupplementSaving}
          onSave={handleSaveAISupplements}
        />
      )}

      {/* ═══════════════════════════════════════════════
          SUB-TAB: Targets & Logs
          ═══════════════════════════════════════════════ */}
      {activeSubTab === "targets" && (
        <div className="space-y-4">
          {/* AI Nutrition Generator Banner */}
          <AIGeneratorBanner
            title="AI Voedingsadvies"
            description="Bereken optimale macro-targets op basis van alle clientdata"
            buttonLabel="AI Bereken Targets"
            loadingLabel="Berekenen..."
            loading={aiNutritionLoading}
            error={aiNutritionError}
            onGenerate={handleGenerateNutrition}
            onDismissError={() => setAiNutritionError(null)}
            variant="primary"
          />

          {/* Nutrition Targets */}
          <div className="bg-white rounded-xl border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                <Flame className="w-4 h-4" /> Voedingsdoelen
              </h3>
              <div className="flex items-center gap-2">
                {targetSaved && (
                  <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> Opgeslagen
                  </span>
                )}
                {editingTargets ? (
                  <>
                    <button
                      onClick={() => {
                        setEditingTargets(false)
                        if (nutritionTargets) {
                          setTargetForm({
                            daily_calories: nutritionTargets.daily_calories || 0,
                            daily_protein_grams: nutritionTargets.daily_protein_grams || 0,
                            daily_carbs_grams: nutritionTargets.daily_carbs_grams || 0,
                            daily_fat_grams: nutritionTargets.daily_fat_grams || 0,
                          })
                        }
                      }}
                      className="px-3 py-1.5 text-xs text-gray-600 border rounded-lg hover:bg-gray-50"
                    >
                      Annuleren
                    </button>
                    <button
                      onClick={handleSaveTargets}
                      disabled={targetSaving}
                      className="px-3 py-1.5 text-xs bg-[#1e1839] text-white rounded-lg disabled:opacity-50 flex items-center gap-1"
                    >
                      <Save className="w-3 h-3" /> Opslaan
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditingTargets(true)}
                    className="px-3 py-1.5 text-xs text-gray-600 border rounded-lg hover:bg-gray-50 flex items-center gap-1"
                  >
                    <Pencil className="w-3 h-3" /> Bewerken
                  </button>
                )}
              </div>
            </div>

            {editingTargets ? (
              <div className="grid grid-cols-4 gap-3">
                {([
                  { label: "Calorieen", key: "daily_calories" as const, unit: "kcal", color: "border-orange-300 focus:ring-orange-200" },
                  { label: "Eiwit", key: "daily_protein_grams" as const, unit: "g", color: "border-red-300 focus:ring-red-200" },
                  { label: "Koolhydraten", key: "daily_carbs_grams" as const, unit: "g", color: "border-blue-300 focus:ring-blue-200" },
                  { label: "Vet", key: "daily_fat_grams" as const, unit: "g", color: "border-yellow-300 focus:ring-yellow-200" },
                ] as const).map((field) => (
                  <div key={field.key} className="text-center">
                    <p className="text-[10px] text-gray-400 uppercase mb-1">{field.label}</p>
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        value={targetForm[field.key] || ""}
                        onChange={(e) => setTargetForm({ ...targetForm, [field.key]: parseInt(e.target.value) || 0 })}
                        className={`w-full px-3 py-2 text-center text-lg font-bold border rounded-lg outline-none focus:ring-2 ${field.color}`}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">{field.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Calorieen", value: nutritionTargets?.daily_calories || foodLogs?.targets?.daily_calories, unit: "kcal", color: "text-orange-600" },
                  { label: "Eiwit", value: nutritionTargets?.daily_protein_grams || foodLogs?.targets?.daily_protein_grams, unit: "g", color: "text-red-600" },
                  { label: "Koolhydraten", value: nutritionTargets?.daily_carbs_grams || foodLogs?.targets?.daily_carbs_grams, unit: "g", color: "text-blue-600" },
                  { label: "Vet", value: nutritionTargets?.daily_fat_grams || foodLogs?.targets?.daily_fat_grams, unit: "g", color: "text-yellow-600" },
                ].map((t) => (
                  <div key={t.label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-gray-400 uppercase">{t.label} doel</p>
                    <p className={`text-lg font-bold ${t.color}`}>
                      {t.value || "\u2014"}{t.value ? ` ${t.unit}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {!nutritionTargets && !foodLogs?.targets && !editingTargets && (
              <p className="text-xs text-gray-400 mt-3 text-center">
                Nog geen voedingsdoelen ingesteld. Klik op Bewerken om targets in te stellen.
              </p>
            )}
          </div>

          {/* Assigned Meal Plans */}
          <div className="bg-white rounded-xl border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4" /> Toegewezen Meal Plans
              </h3>
              <Link href="/coach/dashboard/nutrition/meal-plans" className="text-xs text-[#1e1839] hover:underline">
                Beheren &rarr;
              </Link>
            </div>
            {clientAssignments.filter((a: any) => a.is_active).length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-400">Geen actief meal plan toegewezen</p>
                <Link href="/coach/dashboard/nutrition/meal-plans" className="text-xs text-[#1e1839] hover:underline mt-1 inline-block">
                  Wijs een meal plan toe &rarr;
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {clientAssignments.filter((a: any) => a.is_active).map((assignment: any) => (
                  <div key={assignment.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <UtensilsCrossed className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {assignment.meal_plans?.name || "Onbekend plan"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {assignment.meal_plans?.daily_calories && `${assignment.meal_plans.daily_calories} kcal`}
                          {assignment.start_date && ` \u00B7 Sinds ${new Date(assignment.start_date).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}`}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                      Actief
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Food Logs */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Recente Food Logs</h3>
            {foodLogs?.foodLogs?.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">Nog geen food logs</p>
            ) : (
              <div className="space-y-2">
                {(foodLogs?.foodLogs || []).slice(0, 20).map((log: any) => (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{log.food_name}</p>
                      <p className="text-xs text-gray-500">{log.date} &middot; {log.meal_type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{log.calories} kcal</p>
                      <p className="text-[10px] text-gray-400">
                        E{log.protein_grams}g K{log.carbs_grams}g V{log.fat_grams}g
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          SUB-TAB: Supplementen
          ═══════════════════════════════════════════════ */}
      {activeSubTab === "supplements" && (
        <div className="space-y-4">
          {/* AI Supplement Analyzer Banner (compact) */}
          <AIGeneratorBanner
            title="AI Supplementen Analyse"
            description="Evidence-based aanbevelingen op basis van clientdata + RAG"
            buttonLabel="AI Analyse"
            loadingLabel="Analyseren..."
            loading={aiSupplementLoading}
            error={aiSupplementError}
            onGenerate={handleGenerateSupplement}
            onDismissError={() => setAiSupplementError(null)}
            variant="compact"
          />

          {/* Manual add form */}
          <div className="bg-white rounded-xl border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                <Pill className="w-4 h-4" /> Supplementen
              </h3>
              <button
                onClick={() => setShowAddSupplement(!showAddSupplement)}
                className="px-3 py-1.5 text-xs text-gray-600 border rounded-lg hover:bg-gray-50 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Toevoegen
              </button>
            </div>

            {showAddSupplement && (
              <div className="border rounded-lg p-3 mb-3 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Supplement naam *"
                    value={newSupplement.name}
                    onChange={(e) => setNewSupplement({ ...newSupplement, name: e.target.value })}
                    className="px-2 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-[#1e1839]/20 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Dosering * (bijv. 5g)"
                    value={newSupplement.dosage}
                    onChange={(e) => setNewSupplement({ ...newSupplement, dosage: e.target.value })}
                    className="px-2 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-[#1e1839]/20 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Timing (bijv. Bij ontbijt)"
                    value={newSupplement.timing}
                    onChange={(e) => setNewSupplement({ ...newSupplement, timing: e.target.value })}
                    className="px-2 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-[#1e1839]/20 outline-none"
                  />
                  <select
                    value={newSupplement.frequency}
                    onChange={(e) => setNewSupplement({ ...newSupplement, frequency: e.target.value })}
                    className="px-2 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-[#1e1839]/20 outline-none"
                  >
                    <option value="dagelijks">Dagelijks</option>
                    <option value="3x per week">3x per week</option>
                    <option value="op trainingsdagen">Op trainingsdagen</option>
                    <option value="wekelijks">Wekelijks</option>
                  </select>
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowAddSupplement(false)}
                    className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700"
                  >
                    Annuleren
                  </button>
                  <button
                    onClick={handleAddSupplement}
                    disabled={supplementSaving || !newSupplement.name.trim() || !newSupplement.dosage.trim()}
                    className="px-3 py-1.5 text-xs bg-[#1e1839] text-white rounded-lg disabled:opacity-50"
                  >
                    {supplementSaving ? "Opslaan..." : "Toevoegen"}
                  </button>
                </div>
              </div>
            )}

            {/* Supplement list */}
            {supplements.length === 0 && !showAddSupplement ? (
              <p className="text-xs text-gray-400 text-center py-4">
                Nog geen supplementen ingesteld. Voeg handmatig toe of gebruik de AI analyse.
              </p>
            ) : (
              <div className="space-y-2">
                {supplements.map((s: any) => (
                  <div
                    key={s.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      s.is_active ? "bg-emerald-50" : "bg-gray-50 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Pill className={`w-4 h-4 ${s.is_active ? "text-emerald-600" : "text-gray-400"}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">{s.name}</p>
                          {s.source === "ai" && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-700">
                              AI
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {s.dosage}
                          {s.timing ? ` \u00B7 ${s.timing}` : ""}
                          {s.frequency && s.frequency !== "dagelijks" ? ` \u00B7 ${s.frequency}` : ""}
                        </p>
                        {s.ai_rationale && (
                          <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{s.ai_rationale}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={async () => {
                          await toggleSupplementActive(s.id, !s.is_active)
                          const res = await getClientSupplements(clientId)
                          if (res.success && res.supplements) setSupplements(res.supplements)
                        }}
                        className={`px-2 py-1 text-[10px] rounded ${
                          s.is_active ? "text-gray-500 hover:text-amber-600" : "text-emerald-600 hover:text-emerald-700"
                        }`}
                        title={s.is_active ? "Deactiveren" : "Activeren"}
                      >
                        {s.is_active ? "Pauze" : "Activeer"}
                      </button>
                      <button
                        onClick={async () => {
                          await removeClientSupplement(s.id)
                          const res = await getClientSupplements(clientId)
                          if (res.success && res.supplements) setSupplements(res.supplements)
                        }}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Medical disclaimer */}
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-[10px] text-amber-700 leading-relaxed">
                Supplementatie is geen vervanging voor medisch advies. Overleg altijd met je arts
                voordat je supplementen gebruikt of wijzigt, vooral bij medicijngebruik.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          SUB-TAB: Geschiedenis
          ═══════════════════════════════════════════════ */}
      {activeSubTab === "history" && (
        <div className="space-y-4">
          {targetHistory.length === 0 ? (
            <div className="bg-white rounded-xl border p-12 text-center">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Nog geen target wijzigingen</p>
              <p className="text-xs text-gray-400 mt-1">
                Wijzigingen in voedingsdoelen verschijnen hier automatisch
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Target Wijzigingen
              </h3>
              <div className="space-y-3">
                {targetHistory.map((entry: any) => {
                  const isAI = entry.source === "ai"
                  const date = new Date(entry.created_at).toLocaleDateString("nl-NL", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  const hasPrevious = entry.previous_calories != null

                  return (
                    <div key={entry.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                              isAI ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {isAI ? "AI" : "Handmatig"}
                          </span>
                          {isAI && entry.rag_used && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-700">
                              RAG
                            </span>
                          )}
                          {isAI && entry.ai_model && (
                            <span className="text-[10px] text-gray-400">{entry.ai_model}</span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">{date}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-center">
                        {[
                          { label: "Kcal", val: entry.daily_calories, prev: entry.previous_calories, color: "text-orange-600" },
                          { label: "Eiwit", val: entry.daily_protein_grams, prev: entry.previous_protein_grams, unit: "g", color: "text-red-600" },
                          { label: "Koolh", val: entry.daily_carbs_grams, prev: entry.previous_carbs_grams, unit: "g", color: "text-amber-600" },
                          { label: "Vet", val: entry.daily_fat_grams, prev: entry.previous_fat_grams, unit: "g", color: "text-blue-600" },
                        ].map((m) => {
                          const diff = hasPrevious && m.prev != null ? m.val - m.prev : null
                          return (
                            <div key={m.label}>
                              <p className="text-[10px] text-gray-400 uppercase">{m.label}</p>
                              <p className={`text-sm font-bold ${m.color}`}>
                                {m.val || "\u2014"}{m.unit || ""}
                              </p>
                              {diff != null && diff !== 0 && (
                                <p className={`text-[10px] ${diff > 0 ? "text-green-600" : "text-red-500"}`}>
                                  {diff > 0 ? "+" : ""}{diff}{m.unit || ""}
                                </p>
                              )}
                            </div>
                          )
                        })}
                      </div>
                      {entry.rationale && (
                        <p className="text-xs text-gray-500 mt-2 bg-gray-50 rounded p-2 leading-relaxed">
                          {entry.rationale}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
