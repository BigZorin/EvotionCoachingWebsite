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

const SUB_TABS = [
  { id: "targets", label: "Targets & Logs", icon: Flame },
  { id: "supplements", label: "Supplementen", icon: Pill },
  { id: "history", label: "Geschiedenis", icon: Clock },
]

export default function NutritionTab({
  clientId,
  nutritionTargets: initialTargets,
  foodLogs,
  clientAssignments,
  supplements: initialSupplements,
  targetHistory: initialHistory,
  onDataRefresh,
}: NutritionTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<"targets" | "supplements" | "history">("targets")

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

  const [aiNutritionResult, setAiNutritionResult] = useState<AINutritionResult | null>(null)
  const [aiNutritionLoading, setAiNutritionLoading] = useState(false)
  const [aiNutritionError, setAiNutritionError] = useState<string | null>(null)
  const [showAINutritionPreview, setShowAINutritionPreview] = useState(false)
  const [aiNutritionSaving, setAiNutritionSaving] = useState(false)

  const [supplements, setSupplements] = useState<any[]>(initialSupplements)
  const [showAddSupplement, setShowAddSupplement] = useState(false)
  const [newSupplement, setNewSupplement] = useState({ name: "", dosage: "", timing: "", frequency: "dagelijks" })
  const [supplementSaving, setSupplementSaving] = useState(false)

  const [aiSupplementResult, setAiSupplementResult] = useState<AISupplementResult | null>(null)
  const [aiSupplementLoading, setAiSupplementLoading] = useState(false)
  const [aiSupplementError, setAiSupplementError] = useState<string | null>(null)
  const [showAISupplementPreview, setShowAISupplementPreview] = useState(false)
  const [aiSupplementSaving, setAiSupplementSaving] = useState(false)

  const [targetHistory, setTargetHistory] = useState<any[]>(initialHistory)

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

  // Group food logs by date
  const groupedFoodLogs: Record<string, any[]> = {}
  ;(foodLogs?.foodLogs || []).slice(0, 30).forEach((log: any) => {
    const date = log.date || "Onbekend"
    if (!groupedFoodLogs[date]) groupedFoodLogs[date] = []
    groupedFoodLogs[date].push(log)
  })

  return (
    <div className="space-y-6">
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

      {/* TARGETS & LOGS SUB-TAB */}
      {activeSubTab === "targets" && (
        <div className="space-y-6">
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
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4" /> Voedingsdoelen
              </h3>
              <div className="flex items-center gap-2">
                {targetSaved && (
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
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
                      className="px-3 py-1.5 text-xs text-muted-foreground border border-border rounded-lg hover:bg-secondary transition"
                    >
                      Annuleren
                    </button>
                    <button
                      onClick={handleSaveTargets}
                      disabled={targetSaving}
                      className="px-3 py-1.5 text-xs bg-evotion-primary text-white rounded-lg disabled:opacity-50 flex items-center gap-1 hover:bg-evotion-primary/90 transition"
                    >
                      <Save className="w-3 h-3" /> Opslaan
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditingTargets(true)}
                    className="px-3 py-1.5 text-xs text-muted-foreground border border-border rounded-lg hover:bg-secondary flex items-center gap-1 transition"
                  >
                    <Pencil className="w-3 h-3" /> Bewerken
                  </button>
                )}
              </div>
            </div>

            {editingTargets ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {([
                  { label: "Calorieen", key: "daily_calories" as const, unit: "kcal", color: "border-amber-300 focus:ring-amber-200" },
                  { label: "Eiwit", key: "daily_protein_grams" as const, unit: "g", color: "border-evotion-primary/30 focus:ring-evotion-primary/20" },
                  { label: "Koolhydraten", key: "daily_carbs_grams" as const, unit: "g", color: "border-evotion-primary/30 focus:ring-evotion-primary/20" },
                  { label: "Vet", key: "daily_fat_grams" as const, unit: "g", color: "border-amber-300 focus:ring-amber-200" },
                ] as const).map((field) => (
                  <div key={field.key} className="text-center">
                    <p className="text-xs text-muted-foreground uppercase mb-1.5">{field.label}</p>
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        value={targetForm[field.key] || ""}
                        onChange={(e) => setTargetForm({ ...targetForm, [field.key]: parseInt(e.target.value) || 0 })}
                        className={`w-full px-3 py-2.5 text-center text-lg font-bold border rounded-lg bg-background text-foreground outline-none focus:ring-2 ${field.color}`}
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{field.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Calorieen", value: nutritionTargets?.daily_calories || foodLogs?.targets?.daily_calories, unit: "kcal", color: "text-amber-600" },
                  { label: "Eiwit", value: nutritionTargets?.daily_protein_grams || foodLogs?.targets?.daily_protein_grams, unit: "g", color: "text-evotion-primary" },
                  { label: "Koolhydraten", value: nutritionTargets?.daily_carbs_grams || foodLogs?.targets?.daily_carbs_grams, unit: "g", color: "text-evotion-primary" },
                  { label: "Vet", value: nutritionTargets?.daily_fat_grams || foodLogs?.targets?.daily_fat_grams, unit: "g", color: "text-amber-600" },
                ].map((t) => (
                  <div key={t.label} className="bg-secondary/50 rounded-xl p-4 text-center">
                    <p className="text-xs text-muted-foreground uppercase mb-1">{t.label} doel</p>
                    <p className={`text-lg font-bold ${t.color}`}>
                      {t.value || "\u2014"}{t.value ? ` ${t.unit}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {!nutritionTargets && !foodLogs?.targets && !editingTargets && (
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Nog geen voedingsdoelen ingesteld. Klik op Bewerken om targets in te stellen.
              </p>
            )}
          </div>

          {/* Assigned Meal Plans */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4" /> Toegewezen Meal Plans
              </h3>
              <Link href="/coach/dashboard/nutrition/meal-plans" className="text-xs text-evotion-primary font-medium hover:underline">
                Beheren
              </Link>
            </div>
            {clientAssignments.filter((a: any) => a.is_active).length === 0 ? (
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-secondary mb-2">
                  <UtensilsCrossed className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Geen actief meal plan toegewezen</p>
                <Link href="/coach/dashboard/nutrition/meal-plans" className="text-xs text-evotion-primary font-medium hover:underline mt-1 inline-block">
                  Wijs een meal plan toe
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {clientAssignments.filter((a: any) => a.is_active).map((assignment: any) => (
                  <div key={assignment.id} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <UtensilsCrossed className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {assignment.meal_plans?.name || "Onbekend plan"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {assignment.meal_plans?.daily_calories && `${assignment.meal_plans.daily_calories} kcal`}
                          {assignment.start_date && ` / Sinds ${new Date(assignment.start_date).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}`}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                      Actief
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Food Logs - grouped by date */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Recente Food Logs</h3>
            {Object.keys(groupedFoodLogs).length === 0 ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-3">
                  <UtensilsCrossed className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Nog geen food logs</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupedFoodLogs).map(([date, logs]) => (
                  <div key={date}>
                    <p className="text-xs font-medium text-muted-foreground mb-2 sticky top-0 bg-card">
                      {date}
                    </p>
                    <div className="space-y-1.5">
                      {logs.map((log: any) => (
                        <div key={log.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-foreground">{log.food_name}</p>
                            <p className="text-xs text-muted-foreground">{log.meal_type}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-foreground">{log.calories} kcal</p>
                            <p className="text-xs text-muted-foreground">
                              E{log.protein_grams}g K{log.carbs_grams}g V{log.fat_grams}g
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUPPLEMENTS SUB-TAB */}
      {activeSubTab === "supplements" && (
        <div className="space-y-6">
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

          {/* Supplement list */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Pill className="w-4 h-4" /> Supplementen
              </h3>
              <button
                onClick={() => setShowAddSupplement(!showAddSupplement)}
                className="px-3 py-1.5 text-xs text-muted-foreground border border-border rounded-lg hover:bg-secondary flex items-center gap-1 transition"
              >
                <Plus className="w-3 h-3" /> Toevoegen
              </button>
            </div>

            {showAddSupplement && (
              <div className="border border-border rounded-xl p-4 mb-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Supplement naam *"
                    value={newSupplement.name}
                    onChange={(e) => setNewSupplement({ ...newSupplement, name: e.target.value })}
                    className="px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-evotion-primary/20 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Dosering * (bijv. 5g)"
                    value={newSupplement.dosage}
                    onChange={(e) => setNewSupplement({ ...newSupplement, dosage: e.target.value })}
                    className="px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-evotion-primary/20 outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Timing (bijv. Bij ontbijt)"
                    value={newSupplement.timing}
                    onChange={(e) => setNewSupplement({ ...newSupplement, timing: e.target.value })}
                    className="px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-evotion-primary/20 outline-none"
                  />
                  <select
                    value={newSupplement.frequency}
                    onChange={(e) => setNewSupplement({ ...newSupplement, frequency: e.target.value })}
                    className="px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-evotion-primary/20 outline-none"
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
                    className="px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition"
                  >
                    Annuleren
                  </button>
                  <button
                    onClick={handleAddSupplement}
                    disabled={supplementSaving || !newSupplement.name.trim() || !newSupplement.dosage.trim()}
                    className="px-4 py-2 text-xs bg-evotion-primary text-white rounded-lg disabled:opacity-50 hover:bg-evotion-primary/90 transition"
                  >
                    {supplementSaving ? "Opslaan..." : "Toevoegen"}
                  </button>
                </div>
              </div>
            )}

            {supplements.length === 0 && !showAddSupplement ? (
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-secondary mb-2">
                  <Pill className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Nog geen supplementen ingesteld
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Voeg handmatig toe of gebruik de AI analyse
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {supplements.map((s: any) => (
                  <div
                    key={s.id}
                    className={`flex items-center justify-between p-4 rounded-xl border transition ${
                      s.is_active ? "bg-emerald-50/50 border-emerald-200/50" : "bg-secondary/30 border-border opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Pill className={`w-4 h-4 flex-shrink-0 ${s.is_active ? "text-emerald-600" : "text-muted-foreground"}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">{s.name}</p>
                          {s.source === "ai" && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-evotion-primary/10 text-evotion-primary">
                              AI
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {s.dosage}
                          {s.timing ? ` / ${s.timing}` : ""}
                          {s.frequency && s.frequency !== "dagelijks" ? ` / ${s.frequency}` : ""}
                        </p>
                        {s.ai_rationale && (
                          <p className="text-xs text-muted-foreground/70 mt-0.5 line-clamp-1">{s.ai_rationale}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          await toggleSupplementActive(s.id, !s.is_active)
                          const res = await getClientSupplements(clientId)
                          if (res.success && res.supplements) setSupplements(res.supplements)
                        }}
                        className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${
                          s.is_active
                            ? "text-amber-700 bg-amber-50 hover:bg-amber-100"
                            : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                        }`}
                      >
                        {s.is_active ? "Pauze" : "Activeer"}
                      </button>
                      <button
                        onClick={async () => {
                          await removeClientSupplement(s.id)
                          const res = await getClientSupplements(clientId)
                          if (res.success && res.supplements) setSupplements(res.supplements)
                        }}
                        className="p-1.5 text-muted-foreground hover:text-destructive rounded-md hover:bg-destructive/5 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Medical disclaimer */}
            <div className="mt-5 bg-amber-50/50 border border-amber-200/50 rounded-lg p-3 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700 leading-relaxed">
                Supplementatie is geen vervanging voor medisch advies. Overleg altijd met je arts
                voordat je supplementen gebruikt of wijzigt, vooral bij medicijngebruik.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* HISTORY SUB-TAB */}
      {activeSubTab === "history" && (
        <div className="space-y-6">
          {targetHistory.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-3">
                <Clock className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-foreground font-medium">Nog geen target wijzigingen</p>
              <p className="text-xs text-muted-foreground mt-1">
                Wijzigingen in voedingsdoelen verschijnen hier automatisch
              </p>
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
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
                    <div key={entry.id} className="border border-border rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
                              isAI ? "bg-evotion-primary/10 text-evotion-primary" : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            {isAI ? "AI" : "Handmatig"}
                          </span>
                          {isAI && entry.rag_used && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700">
                              RAG
                            </span>
                          )}
                          {isAI && entry.ai_model && (
                            <span className="text-xs text-muted-foreground">{entry.ai_model}</span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">{date}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                        {[
                          { label: "Kcal", val: entry.daily_calories, prev: entry.previous_calories, color: "text-amber-600" },
                          { label: "Eiwit", val: entry.daily_protein_grams, prev: entry.previous_protein_grams, unit: "g", color: "text-evotion-primary" },
                          { label: "Koolh", val: entry.daily_carbs_grams, prev: entry.previous_carbs_grams, unit: "g", color: "text-evotion-primary" },
                          { label: "Vet", val: entry.daily_fat_grams, prev: entry.previous_fat_grams, unit: "g", color: "text-amber-600" },
                        ].map((m) => {
                          const diff = hasPrevious && m.prev != null ? m.val - m.prev : null
                          return (
                            <div key={m.label} className="bg-secondary/30 rounded-lg p-2.5">
                              <p className="text-xs text-muted-foreground uppercase">{m.label}</p>
                              <p className={`text-sm font-bold ${m.color}`}>
                                {m.val || "\u2014"}{m.unit || ""}
                              </p>
                              {diff != null && diff !== 0 && (
                                <p className={`text-xs ${diff > 0 ? "text-emerald-600" : "text-destructive"}`}>
                                  {diff > 0 ? "+" : ""}{diff}{m.unit || ""}
                                </p>
                              )}
                            </div>
                          )
                        })}
                      </div>
                      {entry.rationale && (
                        <p className="text-xs text-muted-foreground mt-3 bg-secondary/30 rounded-lg p-3 leading-relaxed">
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
