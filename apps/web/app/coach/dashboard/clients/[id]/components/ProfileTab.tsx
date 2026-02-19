"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Camera, StickyNote, Target, Pin, Trash2, Plus, Check, X, Calendar, ArrowRight,
  FileText, ChevronDown, Sparkles, Download, RotateCcw, Zap,
  Heart, Moon,
} from "lucide-react"
import {
  getCoachNotes, addCoachNote, deleteCoachNote, togglePinNote,
  getClientGoals, addClientGoal, updateGoalStatus, deleteClientGoal,
  resetClientIntake,
  type CoachNote, type ClientGoal,
} from "@/app/actions/admin-clients"
import { analyzeClientIntake, type IntakeAnalysis } from "@/app/actions/ai-intake"
import AIInitialPlanWizard from "@/components/ai/AIInitialPlanWizard"

interface ProfileTabProps {
  clientId: string
  clientName: string
  intake: any | null
  photos: any[]
  notes: any[]
  goals: any[]
  onDataRefresh: () => void
  onIntakeReset: () => void
  onPlanComplete: () => void
}

/** Convert LLM markdown/plain-text output to styled HTML */
function formatAnalysisMarkdown(raw: string): string {
  const knownHeadingWords = [
    "clientprofiel", "client profiel", "profiel", "rode vlaggen", "waarschuwingen",
    "trainingsadvies", "training", "voedingsadvies", "voeding",
    "aandachtspunten", "aanbevelingen", "samenvatting", "conclusie",
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
    if (!trimmed) { if (inList) { htmlParts.push("</ul>"); inList = false }; continue }
    const heading = isHeadingLine(trimmed)
    if (heading) { if (inList) { htmlParts.push("</ul>"); inList = false }; htmlParts.push(`<h2>${heading}</h2>`); continue }
    const bulletMatch = trimmed.match(/^[-*]\s+(.+)$/)
    if (bulletMatch) { if (!inList) { htmlParts.push("<ul>"); inList = true }; htmlParts.push(`<li>${bulletMatch[1]}</li>`); continue }
    const numMatch = trimmed.match(/^\d+[.)]\s+(.+)$/)
    if (numMatch) { if (!inList) { htmlParts.push("<ul>"); inList = true }; htmlParts.push(`<li>${numMatch[1]}</li>`); continue }
    if (inList) { htmlParts.push("</ul>"); inList = false }
    htmlParts.push(`<p>${trimmed}</p>`)
  }
  if (inList) htmlParts.push("</ul>")
  return htmlParts.join("\n").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>")
}

export default function ProfileTab({
  clientId,
  clientName,
  intake,
  photos,
  notes: initialNotes,
  goals: initialGoals,
  onDataRefresh,
  onIntakeReset,
  onPlanComplete,
}: ProfileTabProps) {
  const [notes, setNotes] = useState<CoachNote[]>(initialNotes as CoachNote[])
  const [newNote, setNewNote] = useState("")
  const [goals, setGoals] = useState<ClientGoal[]>(initialGoals as ClientGoal[])
  const [newGoal, setNewGoal] = useState({ title: "", description: "", target_date: "" })
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null)

  // Intake state
  const [intakeExpanded, setIntakeExpanded] = useState(!intake)
  const [aiAnalysis, setAiAnalysis] = useState<IntakeAnalysis | null>(null)
  const [aiAnalyzing, setAiAnalyzing] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [showPlanWizard, setShowPlanWizard] = useState(false)
  const [intakeResetting, setIntakeResetting] = useState(false)

  const activeGoals = goals.filter((g) => g.status === "active")
  const completedGoals = goals.filter((g) => g.status === "completed")

  const handleAddNote = async () => {
    if (!newNote.trim()) return
    await addCoachNote(clientId, newNote.trim())
    setNewNote("")
    const res = await getCoachNotes(clientId)
    if (res.success) setNotes((res.notes || []) as CoachNote[])
  }

  const handleAddGoal = async () => {
    if (!newGoal.title.trim()) return
    await addClientGoal(clientId, newGoal)
    setNewGoal({ title: "", description: "", target_date: "" })
    setShowGoalForm(false)
    const res = await getClientGoals(clientId)
    if (res.success) setGoals((res.goals || []) as ClientGoal[])
  }

  const handleAiAnalysis = async () => {
    setAiAnalyzing(true); setAiError(null)
    const result = await analyzeClientIntake(clientId)
    if (result.success && result.data) setAiAnalysis(result.data)
    else setAiError(result.error || "AI analyse mislukt")
    setAiAnalyzing(false)
  }

  const handleResetIntake = async () => {
    if (!confirm("Weet je zeker dat je de intake wilt resetten?")) return
    setIntakeResetting(true)
    const result = await resetClientIntake(clientId)
    if (result.success) { setAiAnalysis(null); onIntakeReset() }
    setIntakeResetting(false)
  }

  const handleDownloadIntake = () => {
    if (!intake) return
    const fields = [
      { label: "Doelen", key: "goals" }, { label: "Fitnesservaring", key: "fitness_experience" },
      { label: "Trainingsgeschiedenis", key: "training_history" }, { label: "Blessures", key: "injuries" },
      { label: "Medische aandoeningen", key: "medical_conditions" }, { label: "Medicijnen", key: "medications" },
      { label: "Voedingsrestricties", key: "dietary_restrictions" }, { label: "Allergieen", key: "allergies" },
      { label: "Slaap (uur/nacht)", key: "sleep_hours" }, { label: "Stressniveau", key: "stress_level" },
      { label: "Beroep", key: "occupation" }, { label: "Beschikbare dagen", key: "available_days" },
      { label: "Voorkeurstijd", key: "preferred_training_time" }, { label: "Uitrusting", key: "equipment_access" },
      { label: "Opmerkingen", key: "additional_notes" },
    ]
    const lines = [`Intake Formulier - ${clientName}`, `Ingevuld op: ${intake.completed_at ? new Date(intake.completed_at).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" }) : "Niet voltooid"}`, ""]
    fields.forEach(({ label, key }) => { const val = intake[key]; if (val != null && val !== "" && !(Array.isArray(val) && val.length === 0)) lines.push(`${label}: ${Array.isArray(val) ? val.join(", ") : val}`) })
    const blob = new Blob([lines.join("\n")], { type: "text/plain" })
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `intake-${clientName.replace(/\s+/g, "-").toLowerCase()}.txt`; a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Lightbox */}
      {lightboxPhoto && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setLightboxPhoto(null)}>
          <button onClick={() => setLightboxPhoto(null)} className="absolute top-4 right-4 text-white/70 hover:text-white p-2" aria-label="Sluiten">
            <X className="w-6 h-6" />
          </button>
          <img src={lightboxPhoto} alt="Voortgangsfoto" className="max-w-full max-h-[90vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
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

      {/* ━━━ SECTION 0: Intake (collapsible) ━━━ */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <button
          onClick={() => setIntakeExpanded(!intakeExpanded)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/20 transition"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-secondary">
              <FileText className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">Intake Formulier</span>
            {intake && (
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium">Voltooid</span>
            )}
            {!intake && (
              <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-medium">Niet ingevuld</span>
            )}
          </div>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${intakeExpanded ? "rotate-0" : "-rotate-90"}`} />
        </button>

        {intakeExpanded && (
          <div className="border-t border-border px-5 pb-5 pt-4 space-y-4">
            {/* Intake actions */}
            {intake && (
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={handleAiAnalysis} disabled={aiAnalyzing} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-evotion-primary rounded-lg hover:bg-evotion-primary/90 disabled:opacity-50 transition font-medium">
                  <Sparkles className="w-3.5 h-3.5" /> {aiAnalyzing ? "Analyseren..." : "AI Analyse"}
                </button>
                <button onClick={() => setShowPlanWizard(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-evotion-primary border border-evotion-primary/20 rounded-lg hover:bg-evotion-primary/5 transition font-medium">
                  <Zap className="w-3.5 h-3.5" /> Genereer Plan
                </button>
                <button onClick={handleDownloadIntake} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground border border-border rounded-lg hover:bg-secondary transition font-medium">
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
                <button onClick={handleResetIntake} disabled={intakeResetting} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-destructive border border-destructive/20 rounded-lg hover:bg-destructive/5 disabled:opacity-50 transition font-medium">
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>
            )}

            {/* AI Analysis */}
            {aiError && (
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3 flex items-center gap-2">
                <X className="w-4 h-4 text-destructive flex-shrink-0" />
                <p className="text-xs text-destructive">{aiError}</p>
              </div>
            )}
            {aiAnalyzing && (
              <div className="bg-evotion-primary/[0.03] border border-evotion-primary/10 rounded-lg p-4 space-y-2 animate-pulse">
                <div className="h-3 bg-secondary rounded w-3/4" /><div className="h-3 bg-secondary rounded w-full" /><div className="h-3 bg-secondary rounded w-2/3" />
              </div>
            )}
            {aiAnalysis && (
              <div className="bg-evotion-primary/[0.03] border border-evotion-primary/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-evotion-primary" />
                    <span className="text-xs font-semibold text-foreground">AI Intake Analyse</span>
                    <span className="text-[10px] text-muted-foreground">{aiAnalysis.model} / {aiAnalysis.tokensUsed} tokens</span>
                  </div>
                  <button onClick={() => setAiAnalysis(null)} className="text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></button>
                </div>
                <div className="prose prose-sm max-w-none prose-headings:text-evotion-primary prose-headings:font-semibold prose-h2:text-sm prose-h2:mt-4 prose-h2:mb-1.5 prose-p:text-foreground/80 prose-li:text-foreground/80 prose-strong:text-foreground prose-ul:my-1">
                  <div dangerouslySetInnerHTML={{ __html: formatAnalysisMarkdown(aiAnalysis.analysis) }} />
                </div>
              </div>
            )}

            {/* Intake content */}
            {!intake ? (
              <div className="text-center py-8">
                <FileText className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Nog niet ingevuld</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Doelen */}
                {intake.goals && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5"><Target className="w-3 h-3" /> Doelen</p>
                    <div className="flex flex-wrap gap-1.5">
                      {intake.goals.split(", ").map((goal: string) => (
                        <span key={goal} className="px-2.5 py-1 bg-evotion-primary/10 text-evotion-primary rounded-full text-xs font-medium">{goal}</span>
                      ))}
                    </div>
                  </div>
                )}
                {/* Experience */}
                {(intake.fitness_experience || intake.training_history) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {intake.fitness_experience && (
                      <div className="bg-muted/40 rounded-lg p-3">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Ervaring</p>
                        <p className="text-sm text-foreground font-medium">{intake.fitness_experience}</p>
                      </div>
                    )}
                    {intake.training_history && (
                      <div className="bg-muted/40 rounded-lg p-3">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Geschiedenis</p>
                        <p className="text-sm text-foreground/80">{intake.training_history}</p>
                      </div>
                    )}
                  </div>
                )}
                {/* Health flags */}
                {(intake.injuries || intake.medical_conditions || intake.medications) && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5"><Heart className="w-3 h-3" /> Gezondheid</p>
                    <div className="flex flex-col gap-2">
                      {intake.injuries && <div className="bg-destructive/5 rounded-lg px-3 py-2"><p className="text-xs text-destructive font-medium">Blessures</p><p className="text-sm text-foreground/80">{intake.injuries}</p></div>}
                      {intake.medical_conditions && <div className="bg-amber-50/80 rounded-lg px-3 py-2"><p className="text-xs text-amber-700 font-medium">Aandoeningen</p><p className="text-sm text-foreground/80">{intake.medical_conditions}</p></div>}
                      {intake.medications && <div className="bg-muted/40 rounded-lg px-3 py-2"><p className="text-xs text-muted-foreground font-medium">Medicijnen</p><p className="text-sm text-foreground/80">{intake.medications}</p></div>}
                    </div>
                  </div>
                )}
                {/* Lifestyle row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {intake.sleep_hours != null && (
                    <div className="bg-muted/40 rounded-lg p-2.5 text-center"><p className="text-[10px] text-muted-foreground uppercase">Slaap</p><p className="text-sm font-bold text-foreground">{intake.sleep_hours}u</p></div>
                  )}
                  {intake.stress_level != null && (
                    <div className="bg-muted/40 rounded-lg p-2.5 text-center"><p className="text-[10px] text-muted-foreground uppercase">Stress</p><p className="text-sm font-bold text-foreground">{["", "Zeer laag", "Laag", "Gemiddeld", "Hoog", "Zeer hoog"][intake.stress_level] || intake.stress_level}</p></div>
                  )}
                  {intake.occupation && (
                    <div className="bg-muted/40 rounded-lg p-2.5 text-center"><p className="text-[10px] text-muted-foreground uppercase">Beroep</p><p className="text-xs text-foreground">{intake.occupation}</p></div>
                  )}
                  {intake.equipment_access && (
                    <div className="bg-muted/40 rounded-lg p-2.5 text-center"><p className="text-[10px] text-muted-foreground uppercase">Uitrusting</p><p className="text-xs text-foreground">{intake.equipment_access}</p></div>
                  )}
                </div>
                {/* Available days */}
                {intake.available_days?.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-muted-foreground">Dagen:</span>
                    {intake.available_days.map((day: string) => (
                      <span key={day} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">{day}</span>
                    ))}
                  </div>
                )}
                {intake.additional_notes && (
                  <div className="bg-muted/40 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Opmerkingen</p>
                    <p className="text-sm text-foreground/80 leading-relaxed">{intake.additional_notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ━━━ SECTION 1: Photos ━━━ */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50">
              <Camera className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm font-semibold text-foreground">{"Foto's"}</span>
            {photos.length > 0 && <span className="text-xs text-muted-foreground">({photos.length})</span>}
          </div>
          {photos.length > 0 && (
            <Link href={`/coach/dashboard/clients/${clientId}/photos`} className="flex items-center gap-1 text-xs font-medium text-foreground hover:text-foreground/70 transition-colors">
              Vergelijking <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
        {photos.length === 0 ? (
          <div className="text-center py-8">
            <Camera className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">{"Nog geen foto's"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {photos.map((photo: any) => (
              <button key={photo.id} onClick={() => setLightboxPhoto(photo.photo_url)} className="group bg-muted/30 rounded-lg overflow-hidden border border-border hover:border-foreground/20 transition-all text-left">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={photo.photo_url} alt="Voortgangsfoto" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-2.5">
                  <p className="text-xs text-muted-foreground">{new Date(photo.taken_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })}</p>
                  {photo.category && <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded mt-1 inline-block">{photo.category}</span>}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ━━━ SECTION 2: Coach Notes ━━━ */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-50">
            <StickyNote className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-sm font-semibold text-foreground">Notities</span>
          {notes.length > 0 && <span className="text-xs text-muted-foreground">({notes.length})</span>}
        </div>
        <div className="flex gap-2">
          <input type="text" value={newNote} onChange={(e) => setNewNote(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddNote()} placeholder="Schrijf een notitie..." className="flex-1 px-3 py-2.5 text-sm bg-muted/50 border border-border rounded-lg focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 outline-none transition-all placeholder:text-muted-foreground/60" />
          <button onClick={handleAddNote} disabled={!newNote.trim()} className="px-4 py-2.5 bg-foreground text-background text-sm rounded-lg disabled:opacity-30 hover:bg-foreground/90 transition-colors"><Plus className="w-4 h-4" /></button>
        </div>
        <p className="text-xs text-muted-foreground">Notities zijn alleen zichtbaar voor jou als coach.</p>
        {notes.length === 0 ? (
          <div className="text-center py-6"><StickyNote className="h-4 w-4 text-muted-foreground mx-auto mb-2" /><p className="text-sm text-muted-foreground">Nog geen notities</p></div>
        ) : (
          <div className="space-y-2">
            {notes.filter(n => n.is_pinned).map((note) => <NoteCard key={note.id} note={note} clientId={clientId} setNotes={setNotes} isPinned />)}
            {notes.filter(n => !n.is_pinned).map((note) => <NoteCard key={note.id} note={note} clientId={clientId} setNotes={setNotes} />)}
          </div>
        )}
      </div>

      {/* ━━━ SECTION 3: Goals ━━━ */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-evotion-primary/5"><Target className="w-4 h-4 text-evotion-primary" /></div>
            <span className="text-sm font-semibold text-foreground">Doelen</span>
            {goals.length > 0 && <span className="text-xs text-muted-foreground">({activeGoals.length} actief)</span>}
          </div>
          <button onClick={() => setShowGoalForm(!showGoalForm)} className="flex items-center gap-1.5 px-3 py-2 bg-foreground text-background text-xs font-medium rounded-lg hover:bg-foreground/90 transition-colors"><Plus className="w-3.5 h-3.5" /> Nieuw</button>
        </div>
        {showGoalForm && (
          <div className="border border-border rounded-lg p-4 space-y-3 bg-muted/30">
            <input type="text" value={newGoal.title} onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })} placeholder="Doel titel *" className="w-full px-3 py-2.5 text-sm bg-card border border-border rounded-lg outline-none focus:ring-2 focus:ring-foreground/10 transition-all" />
            <input type="text" value={newGoal.description} onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })} placeholder="Beschrijving (optioneel)" className="w-full px-3 py-2.5 text-sm bg-card border border-border rounded-lg outline-none focus:ring-2 focus:ring-foreground/10 transition-all" />
            <div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" /><input type="date" value={newGoal.target_date} onChange={(e) => setNewGoal({ ...newGoal, target_date: e.target.value })} className="w-full pl-9 pr-3 py-2.5 text-sm bg-card border border-border rounded-lg outline-none focus:ring-2 focus:ring-foreground/10 transition-all" /></div>
            <div className="flex gap-2">
              <button onClick={() => setShowGoalForm(false)} className="px-4 py-2 text-sm text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors">Annuleren</button>
              <button onClick={handleAddGoal} disabled={!newGoal.title.trim()} className="px-4 py-2 text-sm bg-foreground text-background rounded-lg disabled:opacity-30 hover:bg-foreground/90 transition-colors">Toevoegen</button>
            </div>
          </div>
        )}
        {activeGoals.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Actief</h4>
            <div className="space-y-2">
              {activeGoals.map((goal) => {
                const daysLeft = goal.target_date ? Math.ceil((new Date(goal.target_date).getTime() - Date.now()) / 86400000) : null
                const totalDays = goal.target_date && goal.created_at ? Math.ceil((new Date(goal.target_date).getTime() - new Date(goal.created_at).getTime()) / 86400000) : null
                const progressPct = totalDays && daysLeft !== null ? Math.min(Math.max(((totalDays - daysLeft) / totalDays) * 100, 0), 100) : 0
                return (
                  <div key={goal.id} className="p-3.5 bg-muted/30 rounded-lg border border-border">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{goal.title}</p>
                        {goal.description && <p className="text-xs text-muted-foreground mt-0.5">{goal.description}</p>}
                        {daysLeft !== null && totalDays && totalDays > 0 && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-xs font-medium ${daysLeft <= 0 ? "text-destructive" : daysLeft <= 7 ? "text-amber-600" : "text-muted-foreground"}`}>{daysLeft > 0 ? `${daysLeft}d over` : "Deadline"}</span>
                              <span className="text-xs text-muted-foreground">{Math.round(progressPct)}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5">
                              <div className={`h-full rounded-full transition-all duration-500 ${daysLeft <= 0 ? "bg-destructive" : daysLeft <= 7 ? "bg-amber-500" : "bg-foreground"}`} style={{ width: `${progressPct}%` }} />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 ml-3">
                        <button onClick={async () => { await updateGoalStatus(goal.id, "completed"); const r = await getClientGoals(clientId); if (r.success) setGoals((r.goals || []) as ClientGoal[]) }} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Voltooid"><Check className="w-4 h-4" /></button>
                        <button onClick={async () => { await deleteClientGoal(goal.id); const r = await getClientGoals(clientId); if (r.success) setGoals((r.goals || []) as ClientGoal[]) }} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg transition-colors" title="Verwijderen"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        {completedGoals.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Voltooid ({completedGoals.length})</h4>
            <div className="space-y-2">
              {completedGoals.map((goal) => (
                <div key={goal.id} className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center"><Check className="w-3 h-3 text-emerald-600" /></div>
                    <span className="text-sm text-muted-foreground line-through">{goal.title}</span>
                  </div>
                  {goal.completed_at && <span className="text-xs text-muted-foreground">{new Date(goal.completed_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
        {goals.length === 0 && !showGoalForm && (
          <div className="text-center py-8"><Target className="h-5 w-5 text-muted-foreground mx-auto mb-2" /><p className="text-sm text-muted-foreground">Nog geen doelen</p></div>
        )}
      </div>
    </div>
  )
}

function NoteCard({ note, clientId, setNotes, isPinned }: { note: CoachNote; clientId: string; setNotes: React.Dispatch<React.SetStateAction<CoachNote[]>>; isPinned?: boolean }) {
  return (
    <div className={`p-3.5 rounded-lg border transition-colors ${isPinned ? "bg-amber-50/50 border-amber-200/60" : "bg-muted/30 border-border"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {isPinned && <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-medium mb-1"><Pin className="w-3 h-3" /> Vastgepind</span>}
          <p className="text-sm text-foreground leading-relaxed">{note.content}</p>
          <p className="text-xs text-muted-foreground mt-1.5">{new Date(note.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
        </div>
        <div className="flex items-center gap-0.5">
          <button onClick={async () => { await togglePinNote(note.id); const r = await getCoachNotes(clientId); if (r.success) setNotes((r.notes || []) as CoachNote[]) }} className={`p-2 rounded-lg transition-colors ${isPinned ? "text-amber-500 hover:bg-amber-100" : "text-muted-foreground hover:text-amber-500 hover:bg-amber-50"}`} title="Vastpinnen"><Pin className="w-3.5 h-3.5" /></button>
          <button onClick={async () => { await deleteCoachNote(note.id); const r = await getCoachNotes(clientId); if (r.success) setNotes((r.notes || []) as CoachNote[]) }} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg transition-colors" title="Verwijderen"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      </div>
    </div>
  )
}
