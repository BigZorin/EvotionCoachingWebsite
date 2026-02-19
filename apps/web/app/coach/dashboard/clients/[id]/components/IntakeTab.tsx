"use client"

import { useState } from "react"
import { analyzeClientIntake, type IntakeAnalysis } from "@/app/actions/ai-intake"
import { resetClientIntake } from "@/app/actions/admin-clients"
import AIInitialPlanWizard from "@/components/ai/AIInitialPlanWizard"
import {
  Sparkles, Download, RotateCcw, X, Check, FileText,
  Target, Heart, Moon, Calendar, Zap,
} from "lucide-react"

interface IntakeTabProps {
  clientId: string
  clientName: string
  intake: any | null
  onIntakeReset: () => void
  onPlanComplete: () => void
}

/** Convert LLM markdown/plain-text output to styled HTML, line by line */
function formatAnalysisMarkdown(raw: string): string {
  const knownHeadingWords = [
    "clientprofiel", "client profiel", "cliëntprofiel", "profiel",
    "rode vlaggen", "waarschuwingen", "risico",
    "trainingsadvies", "trainings advies", "training",
    "voedingsadvies", "voedings advies", "voeding", "nutritie",
    "aandachtspunten", "aanbevelingen", "overige",
    "samenvatting", "conclusie", "periodisering",
  ]

  function isHeadingLine(line: string): string | null {
    const stripped = line.replace(/^#{1,4}\s+/, "").replace(/^\*\*/, "").replace(/\*\*$/, "").replace(/:$/, "").trim()
    if (!stripped || stripped.length > 60) return null
    const lower = stripped.toLowerCase()
    if (knownHeadingWords.some(kw => lower.includes(kw))) return stripped
    if (/^#{1,4}\s+/.test(line)) return stripped
    if (/^\*\*[^*]+\*\*:?\s*$/.test(line.trim()) && stripped.split(" ").length <= 6) return stripped
    return null
  }

  const lines = raw.split("\n")
  const htmlParts: string[] = []
  let inList = false

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      if (inList) { htmlParts.push("</ul>"); inList = false }
      continue
    }
    const heading = isHeadingLine(trimmed)
    if (heading) {
      if (inList) { htmlParts.push("</ul>"); inList = false }
      htmlParts.push(`<h2>${heading}</h2>`)
      continue
    }
    const bulletMatch = trimmed.match(/^[-*]\s+(.+)$/)
    if (bulletMatch) {
      if (!inList) { htmlParts.push("<ul>"); inList = true }
      htmlParts.push(`<li>${bulletMatch[1]}</li>`)
      continue
    }
    const numMatch = trimmed.match(/^\d+[.)]\s+(.+)$/)
    if (numMatch) {
      if (!inList) { htmlParts.push("<ul>"); inList = true }
      htmlParts.push(`<li>${numMatch[1]}</li>`)
      continue
    }
    if (inList) { htmlParts.push("</ul>"); inList = false }
    htmlParts.push(`<p>${trimmed}</p>`)
  }
  if (inList) htmlParts.push("</ul>")

  return htmlParts.join("\n")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
}

export default function IntakeTab({ clientId, clientName, intake, onIntakeReset, onPlanComplete }: IntakeTabProps) {
  const [aiAnalysis, setAiAnalysis] = useState<IntakeAnalysis | null>(null)
  const [aiAnalyzing, setAiAnalyzing] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [showPlanWizard, setShowPlanWizard] = useState(false)
  const [intakeResetting, setIntakeResetting] = useState(false)

  const handleAiAnalysis = async () => {
    setAiAnalyzing(true)
    setAiError(null)
    const result = await analyzeClientIntake(clientId)
    if (result.success && result.data) {
      setAiAnalysis(result.data)
    } else {
      setAiError(result.error || "AI analyse mislukt")
    }
    setAiAnalyzing(false)
  }

  const handleResetIntake = async () => {
    if (!confirm("Weet je zeker dat je de intake wilt resetten? De client moet het formulier opnieuw invullen.")) return
    setIntakeResetting(true)
    const result = await resetClientIntake(clientId)
    if (result.success) {
      setAiAnalysis(null)
      onIntakeReset()
    }
    setIntakeResetting(false)
  }

  const handleDownloadIntake = () => {
    if (!intake) return
    const fields: { label: string; key: string }[] = [
      { label: "Doelen", key: "goals" },
      { label: "Fitnesservaring", key: "fitness_experience" },
      { label: "Trainingsgeschiedenis", key: "training_history" },
      { label: "Blessures", key: "injuries" },
      { label: "Medische aandoeningen", key: "medical_conditions" },
      { label: "Medicijnen", key: "medications" },
      { label: "Voedingsrestricties", key: "dietary_restrictions" },
      { label: "Allergieën", key: "allergies" },
      { label: "Slaap (uur/nacht)", key: "sleep_hours" },
      { label: "Stressniveau", key: "stress_level" },
      { label: "Beroep", key: "occupation" },
      { label: "Beschikbare dagen", key: "available_days" },
      { label: "Voorkeurstijd", key: "preferred_training_time" },
      { label: "Uitrusting", key: "equipment_access" },
      { label: "Opmerkingen", key: "additional_notes" },
    ]
    const lines = [`Intake Formulier — ${clientName}`, `Ingevuld op: ${intake.completed_at ? new Date(intake.completed_at).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" }) : "Niet voltooid"}`, ""]
    fields.forEach(({ label, key }) => {
      const val = intake[key]
      if (val != null && val !== "" && !(Array.isArray(val) && val.length === 0)) {
        lines.push(`${label}: ${Array.isArray(val) ? val.join(", ") : val}`)
      }
    })
    const blob = new Blob([lines.join("\n")], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `intake-${clientName.replace(/\s+/g, "-").toLowerCase()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Intake Formulier</h3>
        {intake && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleAiAnalysis}
              disabled={aiAnalyzing}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-white bg-[#1e1839] rounded-lg hover:bg-[#2a2050] disabled:opacity-50 transition"
            >
              <Sparkles className="w-4 h-4" />
              {aiAnalyzing ? "Analyseren..." : "AI Analyse"}
            </button>
            <button
              onClick={handleDownloadIntake}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border rounded-lg hover:bg-gray-50 transition"
            >
              <Download className="w-4 h-4" /> Download
            </button>
            <button
              onClick={handleResetIntake}
              disabled={intakeResetting}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 transition"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>
        )}
      </div>

      {/* AI Analysis Error */}
      {aiError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-2">
          <X className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{aiError}</p>
        </div>
      )}

      {/* AI Analysis Results */}
      {aiAnalysis && (
        <div className="bg-gradient-to-br from-[#1e1839]/[0.03] to-purple-50/50 border border-[#1e1839]/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1e1839] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">AI Intake Analyse</h4>
                <p className="text-xs text-gray-400">
                  {aiAnalysis.model} — {aiAnalysis.tokensUsed} tokens
                  {aiAnalysis.ragUsed && <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-700">RAG</span>}
                </p>
              </div>
            </div>
            <button
              onClick={() => setAiAnalysis(null)}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="prose prose-sm max-w-none prose-headings:text-[#1e1839] prose-headings:font-semibold prose-h2:text-base prose-h2:mt-5 prose-h2:mb-2 prose-h2:border-b prose-h2:border-[#1e1839]/10 prose-h2:pb-1 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900 prose-ul:my-1">
            <div dangerouslySetInnerHTML={{ __html: formatAnalysisMarkdown(aiAnalysis.analysis) }} />
          </div>
        </div>
      )}

      {/* AI Analyzing Skeleton */}
      {aiAnalyzing && (
        <div className="bg-gradient-to-br from-[#1e1839]/[0.03] to-purple-50/50 border border-[#1e1839]/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#1e1839] flex items-center justify-center animate-pulse">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">AI analyseert intake...</h4>
              <p className="text-xs text-gray-400">Dit duurt een paar seconden</p>
            </div>
          </div>
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      )}

      {/* Initial Plan Wizard trigger */}
      {intake && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Initieel Coaching Plan</h3>
              <p className="text-xs text-gray-500">Genereer automatisch training, voeding en supplementen op basis van de intake</p>
            </div>
          </div>
          <button
            onClick={() => setShowPlanWizard(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1e1839] rounded-lg hover:bg-[#2a2050] transition"
          >
            <Sparkles className="w-4 h-4" />
            Genereer Plan
          </button>
        </div>
      )}

      {/* Plan Wizard Dialog */}
      {showPlanWizard && (
        <AIInitialPlanWizard
          clientId={clientId}
          onClose={() => setShowPlanWizard(false)}
          onComplete={() => { setShowPlanWizard(false); onPlanComplete() }}
        />
      )}

      {/* Empty state or Intake content */}
      {!intake ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nog geen intake formulier ingevuld</p>
          <p className="text-xs text-gray-400 mt-1">De client moet het intake formulier invullen bij het eerste gebruik van de app.</p>
        </div>
      ) : (
        <>
          {/* Meta info */}
          <div className="bg-white rounded-xl border p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Intake voltooid</p>
                  <p className="text-xs text-gray-500">
                    {intake.completed_at
                      ? new Date(intake.completed_at).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })
                      : "Niet voltooid"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Doelen & Ervaring */}
          <div className="bg-white rounded-xl border p-5">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Target className="w-4 h-4" /> Doelen & Ervaring
            </h4>
            <div className="space-y-4">
              {intake.goals && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Doelen</p>
                  <div className="flex flex-wrap gap-2">
                    {intake.goals.split(", ").map((goal: string) => (
                      <span key={goal} className="px-3 py-1 bg-[#1e1839]/10 text-[#1e1839] rounded-full text-sm font-medium">{goal}</span>
                    ))}
                  </div>
                </div>
              )}
              {intake.fitness_experience && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Fitnesservaring</p>
                  <p className="text-sm text-gray-900 font-medium">{intake.fitness_experience}</p>
                </div>
              )}
              {intake.training_history && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Trainingsgeschiedenis</p>
                  <p className="text-sm text-gray-700">{intake.training_history}</p>
                </div>
              )}
            </div>
          </div>

          {/* Gezondheid */}
          <div className="bg-white rounded-xl border p-5">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4" /> Gezondheid
            </h4>
            <div className="space-y-4">
              {intake.injuries && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Blessures</p>
                  <p className="text-sm text-gray-700">{intake.injuries}</p>
                </div>
              )}
              {intake.medical_conditions && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Medische aandoeningen</p>
                  <p className="text-sm text-gray-700">{intake.medical_conditions}</p>
                </div>
              )}
              {intake.medications && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Medicijnen</p>
                  <p className="text-sm text-gray-700">{intake.medications}</p>
                </div>
              )}
              {!intake.injuries && !intake.medical_conditions && !intake.medications && (
                <p className="text-sm text-gray-400 italic">Geen gezondheidsgegevens ingevuld</p>
              )}
            </div>
          </div>

          {/* Leefstijl */}
          <div className="bg-white rounded-xl border p-5">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Moon className="w-4 h-4" /> Leefstijl
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {intake.dietary_restrictions && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Voedingsrestricties</p>
                  <p className="text-sm text-gray-900">{intake.dietary_restrictions}</p>
                </div>
              )}
              {intake.allergies && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Allergieen</p>
                  <p className="text-sm text-gray-900">{intake.allergies}</p>
                </div>
              )}
              {intake.sleep_hours != null && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Slaap</p>
                  <p className="text-sm text-gray-900 font-medium">{intake.sleep_hours} uur/nacht</p>
                </div>
              )}
              {intake.stress_level != null && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Stressniveau</p>
                  <p className="text-sm text-gray-900 font-medium">{["", "Zeer laag", "Laag", "Gemiddeld", "Hoog", "Zeer hoog"][intake.stress_level] || intake.stress_level}</p>
                </div>
              )}
              {intake.occupation && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Beroep</p>
                  <p className="text-sm text-gray-900">{intake.occupation}</p>
                </div>
              )}
            </div>
          </div>

          {/* Schema & Uitrusting */}
          <div className="bg-white rounded-xl border p-5">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Schema & Uitrusting
            </h4>
            <div className="space-y-4">
              {intake.available_days && intake.available_days.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-2">Beschikbare trainingsdagen</p>
                  <div className="flex flex-wrap gap-2">
                    {intake.available_days.map((day: string) => (
                      <span key={day} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">{day}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                {intake.preferred_training_time && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Voorkeurstijd</p>
                    <p className="text-sm text-gray-900 font-medium">{intake.preferred_training_time}</p>
                  </div>
                )}
                {intake.equipment_access && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Beschikbare uitrusting</p>
                    <p className="text-sm text-gray-900 font-medium">{intake.equipment_access}</p>
                  </div>
                )}
              </div>
              {intake.additional_notes && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Overige opmerkingen</p>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">{intake.additional_notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
