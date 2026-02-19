"use client"

import { useState } from "react"
import {
  Sparkles, Dumbbell, UtensilsCrossed, Pill, FileText,
  Check, X, Loader2, ChevronRight, AlertCircle, Zap
} from "lucide-react"
import {
  generateInitialCoachingPlan,
  saveAITrainingProgram,
  saveAIGenerationLog,
  type InitialPlanOptions,
  type InitialPlanStepResult,
  type AITrainingProgramResult,
  type AINutritionResult,
  type AISupplementResult,
} from "@/app/actions/ai-coaching"
import { setNutritionTargets, addClientSupplement } from "@/app/actions/nutrition"
import { logCoachingEvent } from "@/app/actions/coaching-events"

interface AIInitialPlanWizardProps {
  clientId: string
  onClose: () => void
  onComplete: () => void
}

type WizardStep = "options" | "generating" | "review" | "applying"

const STEP_CONFIG = {
  intake_analysis: { label: "Intake Analyse", icon: FileText, color: "text-purple-600" },
  training: { label: "Training Programma", icon: Dumbbell, color: "text-indigo-600" },
  nutrition: { label: "Voedingsplan", icon: UtensilsCrossed, color: "text-orange-600" },
  supplements: { label: "Supplementen", icon: Pill, color: "text-emerald-600" },
}

export default function AIInitialPlanWizard({ clientId, onClose, onComplete }: AIInitialPlanWizardProps) {
  const [step, setStep] = useState<WizardStep>("options")
  const [options, setOptions] = useState<InitialPlanOptions>({
    training: true,
    nutrition: true,
    supplements: true,
  })

  const [results, setResults] = useState<InitialPlanStepResult[]>([])
  const [currentGenerating, setCurrentGenerating] = useState<string | null>(null)
  const [totalTokens, setTotalTokens] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const [activeReviewTab, setActiveReviewTab] = useState<string>("intake_analysis")
  const [applying, setApplying] = useState(false)
  const [applyResults, setApplyResults] = useState<Record<string, { success: boolean; error?: string }>>({})

  async function handleGenerate() {
    setStep("generating")
    setError(null)
    setResults([])

    // Generate sequentially so user sees progress
    const steps: InitialPlanStepResult[] = []
    let tokens = 0

    try {
      // Step 1: Intake analysis
      setCurrentGenerating("intake_analysis")
      const { analyzeClientIntake } = await import("@/app/actions/ai-intake")
      const intakeRes = await analyzeClientIntake(clientId)
      const intakeStep: InitialPlanStepResult = {
        step: "intake_analysis",
        success: !!intakeRes.success,
        data: intakeRes.success ? intakeRes.data : undefined,
        error: !intakeRes.success ? intakeRes.error : undefined,
      }
      steps.push(intakeStep)
      if (intakeRes.data?.tokensUsed) tokens += intakeRes.data.tokensUsed
      setResults([...steps])

      // Step 2: Training
      if (options.training) {
        setCurrentGenerating("training")
        const { generateTrainingProgram } = await import("@/app/actions/ai-coaching")
        const res = await generateTrainingProgram(clientId)
        steps.push({ step: "training", success: !!res.success, data: res.data, error: res.error })
        if (res.data?.tokensUsed) tokens += res.data.tokensUsed
        setResults([...steps])
      }

      // Step 3: Nutrition
      if (options.nutrition) {
        setCurrentGenerating("nutrition")
        const { generateNutritionPlan } = await import("@/app/actions/ai-coaching")
        const res = await generateNutritionPlan(clientId)
        steps.push({ step: "nutrition", success: !!res.success, data: res.data, error: res.error })
        if (res.data?.tokensUsed) tokens += res.data.tokensUsed
        setResults([...steps])
      }

      // Step 4: Supplements
      if (options.supplements) {
        setCurrentGenerating("supplements")
        const { generateSupplementAnalysis } = await import("@/app/actions/ai-coaching")
        const res = await generateSupplementAnalysis(clientId)
        steps.push({ step: "supplements", success: !!res.success, data: res.data, error: res.error })
        if (res.data?.tokensUsed) tokens += res.data.tokensUsed
        setResults([...steps])
      }

      setTotalTokens(tokens)
      setCurrentGenerating(null)
      setStep("review")

      // Set active review tab to first successful step
      const firstSuccess = steps.find(s => s.success)
      if (firstSuccess) setActiveReviewTab(firstSuccess.step)
    } catch (e: any) {
      setError(e.message || "Generatie mislukt")
      setCurrentGenerating(null)
      if (steps.length > 0) {
        setStep("review")
      }
    }
  }

  async function handleApplyAll() {
    setApplying(true)
    const applyRes: Record<string, { success: boolean; error?: string }> = {}

    for (const result of results) {
      if (!result.success || !result.data) continue

      try {
        if (result.step === "intake_analysis") {
          // Save generation log
          await saveAIGenerationLog(clientId, "client_summary", result.data, {
            title: "Intake Analyse (Initieel Plan)",
            model: result.data.model,
            tokensUsed: result.data.tokensUsed,
            ragUsed: result.data.ragUsed,
          })
          await logCoachingEvent({
            clientId,
            eventType: "intake_analyzed",
            area: "general",
            title: "Intake geanalyseerd (Initieel Plan)",
            source: "ai",
          })
          applyRes.intake_analysis = { success: true }
        }

        if (result.step === "training") {
          const trainingData = result.data as AITrainingProgramResult
          const saveRes = await saveAITrainingProgram(clientId, trainingData.program, false)
          if (saveRes.success) {
            await saveAIGenerationLog(clientId, "training_program", trainingData, {
              title: trainingData.program.name,
              model: trainingData.model,
              tokensUsed: trainingData.tokensUsed,
              ragUsed: trainingData.ragUsed,
            })
            await logCoachingEvent({
              clientId,
              eventType: "training_program_generated",
              area: "training",
              title: `Programma "${trainingData.program.name}" gegenereerd (Initieel Plan)`,
              source: "ai",
              relatedEntityType: "training_program",
              relatedEntityId: saveRes.programId,
            })
            applyRes.training = { success: true }
          } else {
            applyRes.training = { success: false, error: saveRes.error }
          }
        }

        if (result.step === "nutrition") {
          const nutritionData = result.data as AINutritionResult
          const saveRes = await setNutritionTargets(clientId, {
            daily_calories: nutritionData.targets.dailyCalories,
            daily_protein_grams: nutritionData.targets.dailyProteinGrams,
            daily_carbs_grams: nutritionData.targets.dailyCarbsGrams,
            daily_fat_grams: nutritionData.targets.dailyFatGrams,
          }, { source: "ai", rationale: nutritionData.targets.rationale })
          if (saveRes.success) {
            await saveAIGenerationLog(clientId, "nutrition_plan", nutritionData, {
              title: `${nutritionData.targets.dailyCalories}kcal / ${nutritionData.targets.dailyProteinGrams}g eiwit`,
              model: nutritionData.model,
              tokensUsed: nutritionData.tokensUsed,
              ragUsed: nutritionData.ragUsed,
            })
            applyRes.nutrition = { success: true }
          } else {
            applyRes.nutrition = { success: false, error: saveRes.error }
          }
        }

        if (result.step === "supplements") {
          const suppData = result.data as AISupplementResult
          let allOk = true
          for (const rec of suppData.recommendations) {
            const res = await addClientSupplement(clientId, {
              name: rec.name,
              dosage: rec.dosage,
              timing: rec.timing,
              frequency: rec.frequency,
              source: "ai",
              aiRationale: rec.rationale,
            })
            if (!res.success) allOk = false
          }
          await saveAIGenerationLog(clientId, "supplement_analysis", suppData, {
            title: `${suppData.recommendations.length} supplementen`,
            model: suppData.model,
            tokensUsed: suppData.tokensUsed,
            ragUsed: suppData.ragUsed,
          })
          applyRes.supplements = { success: allOk }
        }
      } catch (e: any) {
        applyRes[result.step] = { success: false, error: e.message }
      }
    }

    setApplyResults(applyRes)
    setApplying(false)

    // If all successful, close after a moment
    const allSuccess = Object.values(applyRes).every(r => r.success)
    if (allSuccess) {
      setTimeout(() => onComplete(), 1500)
    }
  }

  const allApplied = Object.keys(applyResults).length > 0 && Object.values(applyResults).every(r => r.success)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1e1839] to-[#2a2050] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Initieel Coaching Plan</h2>
              <p className="text-xs text-white/60">Genereer een compleet plan op basis van de intake</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Options */}
          {step === "options" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Selecteer welke plannen je wilt genereren op basis van de intake van de client.
                De intake analyse wordt altijd uitgevoerd.
              </p>

              <div className="space-y-2">
                {/* Intake analysis - always on */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 border border-purple-100">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Intake Analyse</p>
                    <p className="text-xs text-gray-500">AI analysert de intake en geeft aanbevelingen</p>
                  </div>
                  <Check className="w-4 h-4 text-purple-600" />
                </div>

                {[
                  { key: "training" as const, label: "Training Programma", desc: "Genereer een gepersonaliseerd trainingsschema", icon: Dumbbell, color: "indigo" },
                  { key: "nutrition" as const, label: "Voedingsplan", desc: "Bereken macro-targets en voedingsadvies", icon: UtensilsCrossed, color: "orange" },
                  { key: "supplements" as const, label: "Supplementen Analyse", desc: "Evidence-based supplementaanbevelingen", icon: Pill, color: "emerald" },
                ].map(({ key, label, desc, icon: Icon, color }) => (
                  <button
                    key={key}
                    onClick={() => setOptions(prev => ({ ...prev, [key]: !prev[key] }))}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition text-left ${
                      options[key]
                        ? `bg-${color}-50 border-${color}-200`
                        : "bg-gray-50 border-gray-200 opacity-60"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${options[key] ? `bg-${color}-100` : "bg-gray-200"}`}>
                      <Icon className={`w-4 h-4 ${options[key] ? `text-${color}-600` : "text-gray-400"}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{label}</p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      options[key] ? "bg-[#1e1839] border-[#1e1839]" : "border-gray-300"
                    }`}>
                      {options[key] && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Generating */}
          {step === "generating" && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">
                AI genereert het coaching plan. Dit kan even duren...
              </p>
              {["intake_analysis", ...(options.training ? ["training"] : []), ...(options.nutrition ? ["nutrition"] : []), ...(options.supplements ? ["supplements"] : [])].map((stepKey) => {
                const conf = STEP_CONFIG[stepKey as keyof typeof STEP_CONFIG]
                const result = results.find(r => r.step === stepKey)
                const isActive = currentGenerating === stepKey
                const Icon = conf.icon
                return (
                  <div key={stepKey} className={`flex items-center gap-3 p-3 rounded-lg border ${
                    result?.success ? "bg-emerald-50 border-emerald-200" :
                    result && !result.success ? "bg-red-50 border-red-200" :
                    isActive ? "bg-blue-50 border-blue-200" :
                    "bg-gray-50 border-gray-200"
                  }`}>
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                      {isActive ? <Loader2 className="w-4 h-4 animate-spin text-blue-600" /> :
                       result?.success ? <Check className="w-4 h-4 text-emerald-600" /> :
                       result && !result.success ? <AlertCircle className="w-4 h-4 text-red-500" /> :
                       <Icon className={`w-4 h-4 text-gray-400`} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{conf.label}</p>
                      {isActive && <p className="text-xs text-blue-600">Genereren...</p>}
                      {result?.success && <p className="text-xs text-emerald-600">Voltooid</p>}
                      {result && !result.success && <p className="text-xs text-red-600">{result.error}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Step 3: Review */}
          {step === "review" && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Sparkles className="w-4 h-4 text-[#1e1839]" />
                <span>{results.filter(r => r.success).length} van {results.length} stappen voltooid — {totalTokens} tokens</span>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>
              )}

              {/* Tabs */}
              <div className="flex gap-1 border-b">
                {results.map((r) => {
                  const conf = STEP_CONFIG[r.step as keyof typeof STEP_CONFIG]
                  const Icon = conf.icon
                  return (
                    <button
                      key={r.step}
                      onClick={() => setActiveReviewTab(r.step)}
                      className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition ${
                        activeReviewTab === r.step
                          ? "border-[#1e1839] text-[#1e1839]"
                          : "border-transparent text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {conf.label}
                      {r.success ? <Check className="w-3 h-3 text-emerald-500" /> : <AlertCircle className="w-3 h-3 text-red-400" />}
                    </button>
                  )
                })}
              </div>

              {/* Tab content */}
              {results.map((r) => {
                if (r.step !== activeReviewTab) return null
                if (!r.success) {
                  return (
                    <div key={r.step} className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                      {r.error || "Generatie mislukt"}
                    </div>
                  )
                }

                if (r.step === "intake_analysis") {
                  return (
                    <div key={r.step} className="prose prose-sm max-w-none max-h-80 overflow-y-auto rounded-lg border p-4">
                      <div dangerouslySetInnerHTML={{ __html: formatSimpleMarkdown(r.data?.analysis || "") }} />
                    </div>
                  )
                }

                if (r.step === "training") {
                  const td = r.data as AITrainingProgramResult
                  return (
                    <div key={r.step} className="space-y-2 max-h-80 overflow-y-auto">
                      <div className="border rounded-lg p-3">
                        <p className="font-medium text-sm">{td.program.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{td.program.description}</p>
                        <div className="mt-2 space-y-1">
                          {td.program.blocks.map((b, i) => (
                            <div key={i} className="text-xs text-gray-600">
                              <span className="font-medium">{b.name}</span> — {b.durationWeeks} weken, {b.days.filter(d => !d.isRestDay).length} trainingsdagen
                            </div>
                          ))}
                        </div>
                        {td.warnings.length > 0 && (
                          <div className="mt-2 text-xs text-amber-600">{td.warnings.join("; ")}</div>
                        )}
                      </div>
                    </div>
                  )
                }

                if (r.step === "nutrition") {
                  const nd = r.data as AINutritionResult
                  return (
                    <div key={r.step} className="space-y-2">
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { label: "Calorieën", value: nd.targets.dailyCalories, unit: "kcal" },
                          { label: "Eiwit", value: nd.targets.dailyProteinGrams, unit: "g" },
                          { label: "Koolhydraten", value: nd.targets.dailyCarbsGrams, unit: "g" },
                          { label: "Vet", value: nd.targets.dailyFatGrams, unit: "g" },
                        ].map((m) => (
                          <div key={m.label} className="border rounded-lg p-3 text-center">
                            <div className="text-[10px] text-gray-400 uppercase">{m.label}</div>
                            <div className="text-lg font-bold text-gray-900">{m.value}</div>
                            <div className="text-[10px] text-gray-400">{m.unit}</div>
                          </div>
                        ))}
                      </div>
                      <div className="border rounded-lg p-3 text-xs text-gray-600">
                        <p className="font-medium text-gray-900 mb-1">Rationale</p>
                        {nd.targets.rationale}
                      </div>
                    </div>
                  )
                }

                if (r.step === "supplements") {
                  const sd = r.data as AISupplementResult
                  return (
                    <div key={r.step} className="space-y-2 max-h-80 overflow-y-auto">
                      {sd.recommendations.map((rec, i) => (
                        <div key={i} className="border rounded-lg p-3 flex items-start gap-3">
                          <Pill className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-medium">{rec.name}</p>
                            <p className="text-xs text-gray-500">{rec.dosage} — {rec.timing}</p>
                            <p className="text-xs text-gray-400 mt-1">{rec.rationale}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                }

                return null
              })}

              {/* Apply results */}
              {Object.keys(applyResults).length > 0 && (
                <div className="space-y-1">
                  {Object.entries(applyResults).map(([key, res]) => {
                    const conf = STEP_CONFIG[key as keyof typeof STEP_CONFIG]
                    return (
                      <div key={key} className={`text-xs flex items-center gap-2 ${res.success ? "text-emerald-600" : "text-red-600"}`}>
                        {res.success ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {conf?.label}: {res.success ? "Opgeslagen" : res.error}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition"
          >
            Annuleren
          </button>

          {step === "options" && (
            <button
              onClick={handleGenerate}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1e1839] rounded-lg hover:bg-[#2a2050] transition"
            >
              <Sparkles className="w-4 h-4" />
              Genereer Plan
            </button>
          )}

          {step === "review" && !allApplied && (
            <button
              onClick={handleApplyAll}
              disabled={applying || results.filter(r => r.success).length === 0}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1e1839] rounded-lg hover:bg-[#2a2050] transition disabled:opacity-50"
            >
              {applying ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Opslaan...</>
              ) : (
                <><Check className="w-4 h-4" /> Alles Opslaan</>
              )}
            </button>
          )}

          {allApplied && (
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
              <Check className="w-5 h-5" /> Alles opgeslagen!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/** Simple markdown to HTML for intake analysis */
function formatSimpleMarkdown(text: string): string {
  return text
    .replace(/^### (.+)$/gm, "<h3 class='font-semibold text-base mt-3 mb-1'>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2 class='font-semibold text-lg mt-4 mb-1'>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1 class='font-bold text-xl mt-4 mb-2'>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^- (.+)$/gm, "<li class='ml-4 list-disc'>$1</li>")
    .replace(/\n/g, "<br>")
}
