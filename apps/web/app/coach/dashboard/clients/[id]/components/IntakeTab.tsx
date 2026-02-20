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
  onDataRefresh: () => void
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

export default function IntakeTab({ clientId, clientName, intake, onIntakeReset, onPlanComplete, onDataRefresh }: IntakeTabProps) {
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-secondary">
            <FileText className="w-4 h-4 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Intake Formulier</h3>
        </div>
        {intake && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleAiAnalysis}
              disabled={aiAnalyzing}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 transition"
            >
              <Sparkles className="w-4 h-4" />
              {aiAnalyzing ? "Analyseren..." : "AI Analyse"}
            </button>
            <button
              onClick={handleDownloadIntake}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground border border-border rounded-lg hover:bg-secondary transition"
            >
              <Download className="w-4 h-4" /> Download
            </button>
            <button
              onClick={handleResetIntake}
              disabled={intakeResetting}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-destructive border border-destructive/20 rounded-lg hover:bg-destructive/5 disabled:opacity-50 transition"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>
        )}
      </div>

      {/* AI Analysis Error */}
      {aiError && (
        <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 flex items-center gap-2">
          <X className="w-4 h-4 text-destructive flex-shrink-0" />
          <p className="text-sm text-destructive">{aiError}</p>
        </div>
      )}

      {/* AI Analysis Results */}
      {aiAnalysis && (
        <div className="bg-primary/[0.03] border border-primary/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Sparkles className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">AI Intake Analyse</h4>
                <p className="text-xs text-muted-foreground">
                  {aiAnalysis.model} — {aiAnalysis.tokensUsed} tokens
                  {aiAnalysis.ragUsed && <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700">RAG</span>}
                </p>
              </div>
            </div>
            <button
              onClick={() => setAiAnalysis(null)}
              className="text-muted-foreground hover:text-foreground transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="prose prose-sm max-w-none prose-headings:text-primary prose-headings:font-semibold prose-h2:text-base prose-h2:mt-5 prose-h2:mb-2 prose-h2:border-b prose-h2:border-primary/10 prose-h2:pb-1 prose-p:text-foreground/80 prose-li:text-foreground/80 prose-strong:text-foreground prose-ul:my-1">
            <div dangerouslySetInnerHTML={{ __html: formatAnalysisMarkdown(aiAnalysis.analysis) }} />
          </div>
        </div>
      )}

      {/* AI Analyzing Skeleton */}
      {aiAnalyzing && (
        <div className="bg-primary/[0.03] border border-primary/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center animate-pulse">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">AI analyseert intake...</h4>
              <p className="text-xs text-muted-foreground">Dit duurt een paar seconden</p>
            </div>
          </div>
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-secondary rounded w-3/4"></div>
            <div className="h-4 bg-secondary rounded w-full"></div>
            <div className="h-4 bg-secondary rounded w-5/6"></div>
            <div className="h-4 bg-secondary rounded w-2/3"></div>
          </div>
        </div>
      )}

      {/* Initial Plan Wizard trigger */}
      {intake && (
        <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Initieel Coaching Plan</h3>
              <p className="text-xs text-muted-foreground">Genereer automatisch training, voeding en supplementen op basis van de intake</p>
            </div>
          </div>
          <button
            onClick={() => setShowPlanWizard(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition flex-shrink-0"
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
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-3">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">Nog geen intake formulier ingevuld</p>
          <p className="text-xs text-muted-foreground mt-1">De client moet het intake formulier invullen bij het eerste gebruik van de app.</p>
        </div>
      ) : (
        <>
          {/* Meta info */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Intake voltooid</p>
                <p className="text-xs text-muted-foreground">
                  {intake.completed_at
                    ? new Date(intake.completed_at).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })
                    : "Niet voltooid"}
                </p>
              </div>
            </div>
          </div>

          {/* Doelen & Ervaring */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-primary/5">
                <Target className="w-3.5 h-3.5 text-primary" />
              </div>
              Doelen & Ervaring
            </h4>
            <div className="space-y-4">
              {intake.goals && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">Doelen</p>
                  <div className="flex flex-wrap gap-2">
                    {intake.goals.split(", ").map((goal: string) => (
                      <span key={goal} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">{goal}</span>
                    ))}
                  </div>
                </div>
              )}
              {intake.fitness_experience && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Fitnesservaring</p>
                  <p className="text-sm text-foreground font-medium">{intake.fitness_experience}</p>
                </div>
              )}
              {intake.training_history && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Trainingsgeschiedenis</p>
                  <p className="text-sm text-foreground/80">{intake.training_history}</p>
                </div>
              )}
            </div>
          </div>

          {/* Gezondheid */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-destructive/5">
                <Heart className="w-3.5 h-3.5 text-destructive" />
              </div>
              Gezondheid
            </h4>
            <div className="space-y-4">
              {intake.injuries && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Blessures</p>
                  <p className="text-sm text-foreground/80">{intake.injuries}</p>
                </div>
              )}
              {intake.medical_conditions && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Medische aandoeningen</p>
                  <p className="text-sm text-foreground/80">{intake.medical_conditions}</p>
                </div>
              )}
              {intake.medications && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Medicijnen</p>
                  <p className="text-sm text-foreground/80">{intake.medications}</p>
                </div>
              )}
              {!intake.injuries && !intake.medical_conditions && !intake.medications && (
                <p className="text-sm text-muted-foreground italic">Geen gezondheidsgegevens ingevuld</p>
              )}
            </div>
          </div>

          {/* Leefstijl */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-violet-50">
                <Moon className="w-3.5 h-3.5 text-violet-600" />
              </div>
              Leefstijl
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {intake.dietary_restrictions && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Voedingsrestricties</p>
                  <p className="text-sm text-foreground">{intake.dietary_restrictions}</p>
                </div>
              )}
              {intake.allergies && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Allergieen</p>
                  <p className="text-sm text-foreground">{intake.allergies}</p>
                </div>
              )}
              {intake.sleep_hours != null && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Slaap</p>
                  <p className="text-sm text-foreground font-medium">{intake.sleep_hours} uur/nacht</p>
                </div>
              )}
              {intake.stress_level != null && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Stressniveau</p>
                  <p className="text-sm text-foreground font-medium">{["", "Zeer laag", "Laag", "Gemiddeld", "Hoog", "Zeer hoog"][intake.stress_level] || intake.stress_level}</p>
                </div>
              )}
              {intake.occupation && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Beroep</p>
                  <p className="text-sm text-foreground">{intake.occupation}</p>
                </div>
              )}
            </div>
          </div>

          {/* Schema & Uitrusting */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-blue-50">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
              </div>
              Schema & Uitrusting
            </h4>
            <div className="space-y-4">
              {intake.available_days && intake.available_days.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Beschikbare trainingsdagen</p>
                  <div className="flex flex-wrap gap-2">
                    {intake.available_days.map((day: string) => (
                      <span key={day} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">{day}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                {intake.preferred_training_time && (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Voorkeurstijd</p>
                    <p className="text-sm text-foreground font-medium">{intake.preferred_training_time}</p>
                  </div>
                )}
                {intake.equipment_access && (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Beschikbare uitrusting</p>
                    <p className="text-sm text-foreground font-medium">{intake.equipment_access}</p>
                  </div>
                )}
              </div>
              {intake.additional_notes && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Overige opmerkingen</p>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm text-foreground/80">{intake.additional_notes}</p>
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
