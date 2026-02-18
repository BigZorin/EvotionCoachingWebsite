"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts"
import {
  getClientProfile, getClientCheckIns, getClientDailyCheckIns, submitCoachFeedback,
  getClientWorkouts, getClientFoodLogs, getClientHealthSummary,
  getCoachNotes, addCoachNote, deleteCoachNote, togglePinNote,
  getClientGoals, addClientGoal, updateGoalStatus, deleteClientGoal,
  getClientHabits, getClientProgressPhotos,
  getClientCheckInSettings, updateClientCheckInDay,
  approveClient, rejectClient, resetClientIntake,
  type Client, type CheckIn, type DailyCheckIn, type CoachNote, type ClientGoal,
} from "@/app/actions/admin-clients"
import {
  ArrowLeft, Weight, Calendar, TrendingUp, Activity, Send, MessageSquare,
  Moon, Smile, Camera, ClipboardList, Leaf, ChevronRight, ChevronDown, Dumbbell,
  UtensilsCrossed, Heart, StickyNote, Target, Pin, Trash2, Plus,
  Check, X, Footprints, Flame, Clock, Wifi, WifiOff, FileText,
  Download, RotateCcw, Save, Pencil, Info, BarChart3, Sparkles,
} from "lucide-react"
import {
  getNutritionTargets, setNutritionTargets, getClientAssignments,
} from "@/app/actions/nutrition"
import {
  getClientPrograms, removeClientProgram, updateClientProgramStatus,
} from "@/app/actions/training-programs"
import { analyzeClientIntake, type IntakeAnalysis } from "@/app/actions/ai-intake"

const MOOD_LABELS: Record<number, string> = { 1: "Slecht", 2: "Matig", 3: "Oké", 4: "Goed", 5: "Top" }
const SLEEP_LABELS: Record<number, string> = { 1: "Slecht", 2: "Matig", 3: "Oké", 4: "Goed", 5: "Diep" }

type TabId = "overzicht" | "intake" | "checkins" | "training" | "voeding" | "gezondheid" | "fotos" | "notities" | "doelen"

const TABS: { id: TabId; label: string; icon: any }[] = [
  { id: "overzicht", label: "Overzicht", icon: Activity },
  { id: "intake", label: "Intake", icon: FileText },
  { id: "checkins", label: "Check-ins", icon: ClipboardList },
  { id: "training", label: "Training", icon: Dumbbell },
  { id: "voeding", label: "Voeding", icon: UtensilsCrossed },
  { id: "gezondheid", label: "Gezondheid", icon: Heart },
  { id: "fotos", label: "Foto's", icon: Camera },
  { id: "notities", label: "Notities", icon: StickyNote },
  { id: "doelen", label: "Doelen", icon: Target },
]

/** Simple Markdown → HTML for AI analysis (headings, bold, lists, paragraphs) */
function formatAnalysisMarkdown(md: string): string {
  return md
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/^(?!<[hul])/gm, (line) => line ? `<p>${line}</p>` : '')
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<h[23]>)/g, '$1')
    .replace(/(<\/h[23]>)<\/p>/g, '$1')
    .replace(/<p>(<ul>)/g, '$1')
    .replace(/(<\/ul>)<\/p>/g, '$1')
}

export default function ClientDetailClient({ clientId }: { clientId: string }) {
  const [activeTab, setActiveTab] = useState<TabId>("overzicht")
  const [client, setClient] = useState<Client | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [weeklyCheckIns, setWeeklyCheckIns] = useState<CheckIn[]>([])
  const [dailyCheckIns, setDailyCheckIns] = useState<DailyCheckIn[]>([])
  const [workouts, setWorkouts] = useState<any[]>([])
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null)
  const [trainingSubTab, setTrainingSubTab] = useState<"logs" | "analytics">("logs")
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null)
  const [analyticsExercise, setAnalyticsExercise] = useState<string | null>(null)
  const [foodLogs, setFoodLogs] = useState<any>({ foodLogs: [], targets: null })
  const [healthData, setHealthData] = useState<any>(null)
  const [notes, setNotes] = useState<CoachNote[]>([])
  const [goals, setGoals] = useState<ClientGoal[]>([])
  const [habits, setHabits] = useState<any>({ habits: [], logs: [] })
  const [photos, setPhotos] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [feedbackText, setFeedbackText] = useState<Record<string, string>>({})
  const [feedbackSending, setFeedbackSending] = useState<string | null>(null)
  const [newNote, setNewNote] = useState("")
  const [newGoal, setNewGoal] = useState({ title: "", description: "", target_date: "" })
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [weeklyCheckInDay, setWeeklyCheckInDay] = useState(0)
  const [daySaving, setDaySaving] = useState(false)
  const [daySaved, setDaySaved] = useState(false)
  const [clientApprovalStatus, setClientApprovalStatus] = useState<string | null>(null)
  const [approvalLoading, setApprovalLoading] = useState(false)
  const [showRejectInput, setShowRejectInput] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [intake, setIntake] = useState<any>(null)
  const [intakeResetting, setIntakeResetting] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<IntakeAnalysis | null>(null)
  const [aiAnalyzing, setAiAnalyzing] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [nutritionTargets, setNutritionTargetsState] = useState<{ daily_calories: number; daily_protein_grams: number; daily_carbs_grams: number; daily_fat_grams: number } | null>(null)
  const [editingTargets, setEditingTargets] = useState(false)
  const [targetForm, setTargetForm] = useState({ daily_calories: 0, daily_protein_grams: 0, daily_carbs_grams: 0, daily_fat_grams: 0 })
  const [targetSaving, setTargetSaving] = useState(false)
  const [targetSaved, setTargetSaved] = useState(false)
  const [clientAssignments, setClientAssignments] = useState<any[]>([])
  const [clientPrograms, setClientPrograms] = useState<any[]>([])
  const [removingProgram, setRemovingProgram] = useState<string | null>(null)

  useEffect(() => { loadData() }, [clientId])

  const loadData = async () => {
    setIsLoading(true)
    const [profileRes, weeklyRes, dailyRes, workoutRes, foodRes, healthRes, notesRes, goalsRes, habitsRes, photosRes, settingsRes, targetsRes, assignmentsRes, programsRes] = await Promise.all([
      getClientProfile(clientId),
      getClientCheckIns(clientId),
      getClientDailyCheckIns(clientId),
      getClientWorkouts(clientId).catch(() => ({ success: false })),
      getClientFoodLogs(clientId).catch(() => ({ success: false })),
      getClientHealthSummary(clientId).catch(() => ({ success: false })),
      getCoachNotes(clientId).catch(() => ({ success: false })),
      getClientGoals(clientId).catch(() => ({ success: false })),
      getClientHabits(clientId).catch(() => ({ success: false })),
      getClientProgressPhotos(clientId).catch(() => ({ success: false })),
      getClientCheckInSettings(clientId).catch(() => ({ success: false })),
      getNutritionTargets(clientId).catch(() => ({ success: false })),
      getClientAssignments(clientId).catch(() => ({ success: false })),
      getClientPrograms(clientId).catch(() => ({ success: false })),
    ])

    if (profileRes.success && profileRes.client) setClient(profileRes.client)
    if (profileRes.success) {
      setProfile(profileRes.profile)
      setClientApprovalStatus(profileRes.profile?.client_status || null)
      setIntake(profileRes.intake || null)
    }
    if (weeklyRes.success && weeklyRes.checkIns) setWeeklyCheckIns(weeklyRes.checkIns)
    if (dailyRes.success && dailyRes.checkIns) setDailyCheckIns(dailyRes.checkIns)
    if ((workoutRes as any).success) setWorkouts((workoutRes as any).workouts || [])
    if ((foodRes as any).success) setFoodLogs(foodRes)
    if ((healthRes as any).success) setHealthData(healthRes)
    if ((notesRes as any).success) setNotes((notesRes as any).notes || [])
    if ((goalsRes as any).success) setGoals((goalsRes as any).goals || [])
    if ((habitsRes as any).success) setHabits(habitsRes)
    if ((photosRes as any).success) setPhotos((photosRes as any).photos || [])
    if ((settingsRes as any).success && (settingsRes as any).weeklyCheckInDay !== undefined) {
      setWeeklyCheckInDay((settingsRes as any).weeklyCheckInDay)
    }
    if ((targetsRes as any).success && (targetsRes as any).targets) {
      const t = (targetsRes as any).targets
      setNutritionTargetsState(t)
      setTargetForm({ daily_calories: t.daily_calories || 0, daily_protein_grams: t.daily_protein_grams || 0, daily_carbs_grams: t.daily_carbs_grams || 0, daily_fat_grams: t.daily_fat_grams || 0 })
    }
    if ((assignmentsRes as any).success && (assignmentsRes as any).assignments) {
      setClientAssignments((assignmentsRes as any).assignments)
    }
    if ((programsRes as any).success && (programsRes as any).assignments) {
      setClientPrograms((programsRes as any).assignments)
    }
    setIsLoading(false)
  }

  const handleFeedback = async (checkInId: string, type: "daily" | "weekly") => {
    const text = feedbackText[checkInId]
    if (!text?.trim()) return
    setFeedbackSending(checkInId)
    const result = await submitCoachFeedback(checkInId, type, text.trim())
    if (result.success) {
      setFeedbackText((prev) => ({ ...prev, [checkInId]: "" }))
      loadData()
    }
    setFeedbackSending(null)
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return
    await addCoachNote(clientId, newNote.trim())
    setNewNote("")
    const res = await getCoachNotes(clientId)
    if (res.success) setNotes(res.notes || [])
  }

  const handleCheckInDayChange = async (day: number) => {
    setDaySaving(true)
    setDaySaved(false)
    const result = await updateClientCheckInDay(clientId, day)
    if (result.success) {
      setWeeklyCheckInDay(day)
      setDaySaved(true)
      setTimeout(() => setDaySaved(false), 2000)
    }
    setDaySaving(false)
  }

  const handleAddGoal = async () => {
    if (!newGoal.title.trim()) return
    await addClientGoal(clientId, newGoal)
    setNewGoal({ title: "", description: "", target_date: "" })
    setShowGoalForm(false)
    const res = await getClientGoals(clientId)
    if (res.success) setGoals(res.goals || [])
  }

  const handleApprove = async () => {
    setApprovalLoading(true)
    const result = await approveClient(clientId)
    if (result.success) setClientApprovalStatus("approved")
    setApprovalLoading(false)
  }

  const handleReject = async () => {
    setApprovalLoading(true)
    const result = await rejectClient(clientId, rejectReason || undefined)
    if (result.success) {
      setClientApprovalStatus("rejected")
      setShowRejectInput(false)
      setRejectReason("")
    }
    setApprovalLoading(false)
  }

  const handleResetIntake = async () => {
    if (!confirm("Weet je zeker dat je de intake wilt resetten? De client moet het formulier opnieuw invullen.")) return
    setIntakeResetting(true)
    const result = await resetClientIntake(clientId)
    if (result.success) { setIntake(null); setAiAnalysis(null) }
    setIntakeResetting(false)
  }

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

  const handleSaveTargets = async () => {
    setTargetSaving(true)
    setTargetSaved(false)
    const result = await setNutritionTargets(clientId, targetForm)
    if (result.success) {
      setNutritionTargetsState(targetForm)
      setEditingTargets(false)
      setTargetSaved(true)
      setTimeout(() => setTargetSaved(false), 2000)
    }
    setTargetSaving(false)
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e1839]" />
      </div>
    )
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Client niet gevonden</p>
        <Link href="/coach/dashboard/clients" className="text-[#1e1839] hover:underline mt-2 inline-block">← Terug naar clients</Link>
      </div>
    )
  }

  // Stats computation
  const profileName = profile ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() : ""
  const metaName = [client.raw_user_meta_data?.first_name, client.raw_user_meta_data?.last_name].filter(Boolean).join(" ") || client.raw_user_meta_data?.full_name || ""
  const clientName = profileName || metaName || client.email
  const latestWeight = dailyCheckIns.find((ci) => ci.weight)?.weight || weeklyCheckIns.find((ci) => ci.weight)?.weight
  const firstWeight = [...dailyCheckIns].reverse().find((ci) => ci.weight)?.weight || [...weeklyCheckIns].reverse().find((ci) => ci.weight)?.weight
  const weightDiff = latestWeight && firstWeight ? (latestWeight - firstWeight).toFixed(1) : null
  const daysSinceJoined = Math.floor((Date.now() - new Date(client.created_at).getTime()) / 86400000)
  const weeksSinceJoined = Math.floor(daysSinceJoined / 7)
  const lastActive = client.last_sign_in_at ? new Date(client.last_sign_in_at) : null

  const last30Days = dailyCheckIns.filter((ci) => (Date.now() - new Date(ci.check_in_date).getTime()) / 86400000 <= 30)
  const dailyCompliance = last30Days.length

  let streak = 0
  const sortedDaily = [...dailyCheckIns].sort((a, b) => b.check_in_date.localeCompare(a.check_in_date))
  for (let i = 0; i < sortedDaily.length; i++) {
    const d = new Date(); d.setDate(d.getDate() - i)
    if (sortedDaily[i]?.check_in_date === d.toISOString().split("T")[0]) streak++; else break
  }

  const activeGoals = goals.filter((g) => g.status === "active")
  const completedGoals = goals.filter((g) => g.status === "completed")

  const weightChartData = [...dailyCheckIns].reverse().filter((ci) => ci.weight).map((ci) => ({
    date: new Date(ci.check_in_date).toLocaleDateString("nl-NL", { day: "numeric", month: "short" }), gewicht: ci.weight,
  }))

  const moodSleepChartData = [...dailyCheckIns].reverse().filter((ci) => ci.mood || ci.sleep_quality).map((ci) => ({
    date: new Date(ci.check_in_date).toLocaleDateString("nl-NL", { day: "numeric", month: "short" }), stemming: ci.mood, slaap: ci.sleep_quality,
  }))

  return (
    <div className="space-y-6">
      <Link href="/coach/dashboard/clients" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Terug naar clients
      </Link>

      {/* Approval Banner */}
      {clientApprovalStatus === "pending" && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-purple-900">Wacht op goedkeuring</h3>
                <p className="text-xs text-purple-600">Deze client heeft de intake ingevuld en wacht op toegang tot de app.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {showRejectInput ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Reden (optioneel)..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="px-3 py-2 text-sm border border-red-200 rounded-lg focus:ring-2 focus:ring-red-200 outline-none w-48"
                  />
                  <button
                    onClick={handleReject}
                    disabled={approvalLoading}
                    className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition"
                  >
                    Bevestig
                  </button>
                  <button
                    onClick={() => { setShowRejectInput(false); setRejectReason("") }}
                    className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setShowRejectInput(true)}
                    disabled={approvalLoading}
                    className="px-4 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 transition"
                  >
                    Afwijzen
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={approvalLoading}
                    className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition"
                  >
                    Goedkeuren
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {clientApprovalStatus === "rejected" && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <X className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-red-900">Client afgewezen</h3>
                <p className="text-xs text-red-600">Deze client heeft geen toegang tot de app.</p>
              </div>
            </div>
            <button
              onClick={handleApprove}
              disabled={approvalLoading}
              className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition"
            >
              Alsnog goedkeuren
            </button>
          </div>
        </div>
      )}

      {/* Client Header */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 flex items-start justify-between">
          <div className="flex items-center gap-4">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#1e1839] flex items-center justify-center text-2xl font-bold text-white">
                {(clientName[0] || "C").toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{clientName}</h1>
              <p className="text-sm text-gray-500">{client.email}</p>
            </div>
          </div>
          {lastActive && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
              (Date.now() - lastActive.getTime()) < 86400000 ? "bg-green-50 text-green-700" :
              (Date.now() - lastActive.getTime()) < 7 * 86400000 ? "bg-yellow-50 text-yellow-700" : "bg-red-50 text-red-700"
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                (Date.now() - lastActive.getTime()) < 86400000 ? "bg-green-500" :
                (Date.now() - lastActive.getTime()) < 7 * 86400000 ? "bg-yellow-500" : "bg-red-500"
              }`} />
              {(Date.now() - lastActive.getTime()) < 86400000 ? "Vandaag actief" : `${Math.floor((Date.now() - lastActive.getTime()) / 86400000)}d geleden`}
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 border-t divide-x bg-gray-50/50">
          <div className="px-4 py-3 text-center"><p className="text-[10px] text-gray-400 uppercase tracking-wider">Weken</p><p className="text-lg font-bold text-gray-900">{weeksSinceJoined}</p></div>
          <div className="px-4 py-3 text-center"><p className="text-[10px] text-gray-400 uppercase tracking-wider">Gewicht</p><p className="text-lg font-bold text-gray-900">{latestWeight ? `${latestWeight} kg` : "—"}</p>{weightDiff && <p className={`text-[10px] ${Number(weightDiff) < 0 ? "text-green-600" : "text-orange-500"}`}>{Number(weightDiff) > 0 ? "+" : ""}{weightDiff} kg</p>}</div>
          <div className="px-4 py-3 text-center"><p className="text-[10px] text-gray-400 uppercase tracking-wider">Streak</p><p className="text-lg font-bold text-gray-900">{streak}d</p></div>
          <div className="px-4 py-3 text-center"><p className="text-[10px] text-gray-400 uppercase tracking-wider">Compliance</p><p className="text-lg font-bold text-gray-900">{dailyCompliance}/30</p></div>
          <div className="px-4 py-3 text-center"><p className="text-[10px] text-gray-400 uppercase tracking-wider">Doelen</p><p className="text-lg font-bold text-gray-900">{activeGoals.length} actief</p></div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition ${activeTab === tab.id ? "bg-[#1e1839] text-white" : "text-gray-600 hover:bg-gray-100"}`}>
            <tab.icon className="h-4 w-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* === OVERZICHT TAB === */}
      {activeTab === "overzicht" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Foto's", icon: Camera, color: "text-purple-600", bg: "bg-purple-50", tab: "fotos" as TabId },
              { label: "Gewoontes", icon: Leaf, color: "text-green-600", bg: "bg-green-50", tab: "doelen" as TabId },
              { label: "Notities", icon: StickyNote, color: "text-amber-600", bg: "bg-amber-50", tab: "notities" as TabId },
              { label: "Doelen", icon: Target, color: "text-blue-600", bg: "bg-blue-50", tab: "doelen" as TabId },
            ].map((item) => (
              <button key={item.label} onClick={() => setActiveTab(item.tab)} className="flex items-center gap-3 p-4 bg-white border rounded-xl hover:border-[#1e1839]/30 transition">
                <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center`}><item.icon className={`w-5 h-5 ${item.color}`} /></div>
                <span className="text-sm font-medium text-gray-900">{item.label}</span>
              </button>
            ))}
          </div>
          {activeGoals.length > 0 && (
            <div className="bg-white rounded-xl border p-5">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Actieve Doelen</h3>
              <div className="space-y-2">{activeGoals.map((goal) => (
                <div key={goal.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2"><Target className="w-4 h-4 text-blue-600" /><span className="text-sm font-medium text-gray-900">{goal.title}</span></div>
                  {goal.target_date && <span className="text-xs text-gray-500">{Math.max(0, Math.ceil((new Date(goal.target_date).getTime() - Date.now()) / 86400000))} dagen</span>}
                </div>
              ))}</div>
            </div>
          )}
          {weightChartData.length >= 2 && (
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Gewichtsverloop</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={weightChartData}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="date" fontSize={11} tick={{ fill: "#8E8E93" }} /><YAxis fontSize={11} tick={{ fill: "#8E8E93" }} domain={["auto", "auto"]} /><Tooltip /><Line type="monotone" dataKey="gewicht" stroke="#1e1839" strokeWidth={2} dot={{ fill: "#1e1839", r: 3 }} /></LineChart>
              </ResponsiveContainer>
            </div>
          )}
          {moodSleepChartData.length >= 2 && (
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Stemming & Slaap</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={moodSleepChartData}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="date" fontSize={11} tick={{ fill: "#8E8E93" }} /><YAxis fontSize={11} tick={{ fill: "#8E8E93" }} domain={[1, 5]} /><Tooltip /><Legend /><Line type="monotone" dataKey="stemming" stroke="#007AFF" strokeWidth={2} dot={{ r: 2 }} /><Line type="monotone" dataKey="slaap" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 2 }} /></LineChart>
              </ResponsiveContainer>
            </div>
          )}
          {notes.filter((n) => n.is_pinned).length > 0 && (
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
              <h3 className="text-sm font-semibold text-amber-700 flex items-center gap-1.5 mb-3"><Pin className="w-4 h-4" /> Vastgepinde Notities</h3>
              {notes.filter((n) => n.is_pinned).map((note) => <p key={note.id} className="text-sm text-amber-900 mb-2">{note.content}</p>)}
            </div>
          )}
        </div>
      )}

      {/* === INTAKE TAB === */}
      {activeTab === "intake" && (
        <div className="space-y-4">
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
                    <p className="text-xs text-gray-400">{aiAnalysis.model} — {aiAnalysis.tokensUsed} tokens</p>
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
                      <p className="text-xs text-gray-400 mb-1">Allergieën</p>
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
      )}

      {/* === CHECK-INS TAB === */}
      {activeTab === "checkins" && (
        <div className="space-y-6">
          {/* Check-in Day Picker */}
          <div className="bg-white rounded-xl border p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Wekelijkse check-in dag
              </h3>
              {daySaved && <span className="text-xs text-green-600 font-medium flex items-center gap-1"><Check className="w-3 h-3" /> Opgeslagen</span>}
            </div>
            <p className="text-xs text-gray-500 mb-3">Op deze dag verschijnt de wekelijkse check-in in de app. Op andere dagen ziet de client alleen de dagelijkse check-in.</p>
            <div className="flex gap-2">
              {[
                { day: 1, label: "Ma" },
                { day: 2, label: "Di" },
                { day: 3, label: "Wo" },
                { day: 4, label: "Do" },
                { day: 5, label: "Vr" },
                { day: 6, label: "Za" },
                { day: 0, label: "Zo" },
              ].map(({ day, label }) => (
                <button
                  key={day}
                  onClick={() => handleCheckInDayChange(day)}
                  disabled={daySaving}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    weeklyCheckInDay === day
                      ? "bg-[#1e1839] text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  } ${daySaving ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Weekly Check-ins */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Wekelijkse Check-ins ({weeklyCheckIns.length})
            </h3>
            {weeklyCheckIns.length === 0 ? (
              <div className="bg-white rounded-xl border p-6 text-center">
                <p className="text-gray-400 text-sm">Nog geen wekelijkse check-ins</p>
              </div>
            ) : (
              <div className="space-y-3">
                {weeklyCheckIns.slice(0, 12).map((ci) => (
                  <div key={ci.id} className="bg-white rounded-xl border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-[#1e1839] bg-[#1e1839]/10 px-2.5 py-1 rounded-full">
                          Week {ci.week_number}, {ci.year}
                        </span>
                        {ci.weight && (
                          <span className="text-sm text-gray-700 flex items-center gap-1">
                            <Weight className="w-3.5 h-3.5" /> {ci.weight} kg
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(ci.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {[
                        { label: "Gevoel", value: ci.feeling },
                        { label: "Energie", value: ci.energy_level },
                        { label: "Slaap", value: ci.sleep_quality },
                        { label: "Stress", value: ci.stress_level },
                        { label: "Voeding", value: ci.nutrition_adherence },
                      ].filter(m => m.value != null).map(m => (
                        <div key={m.label} className="bg-gray-50 rounded-lg p-2 text-center">
                          <p className="text-[10px] text-gray-400">{m.label}</p>
                          <p className="text-sm font-semibold text-gray-900">{m.value}/10</p>
                        </div>
                      ))}
                    </div>
                    {ci.notes && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Notities</p>
                        <p className="text-sm text-gray-700">{ci.notes}</p>
                      </div>
                    )}
                    {ci.coach_feedback && (
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-xs text-blue-600 mb-1 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" /> Jouw feedback
                        </p>
                        <p className="text-sm text-blue-800">{ci.coach_feedback}</p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Feedback op deze check-in..."
                        value={feedbackText[ci.id] || ""}
                        onChange={(e) => setFeedbackText((prev) => ({ ...prev, [ci.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === "Enter" && handleFeedback(ci.id, "weekly")}
                        className="flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#1e1839]/20 outline-none"
                      />
                      <button
                        onClick={() => handleFeedback(ci.id, "weekly")}
                        disabled={!feedbackText[ci.id]?.trim() || feedbackSending === ci.id}
                        className="px-3 py-2 bg-[#1e1839] text-white rounded-lg disabled:opacity-40"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Daily Check-ins */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
              <ClipboardList className="w-4 h-4" /> Dagelijkse Check-ins ({dailyCheckIns.length})
            </h3>
            {dailyCheckIns.length === 0 ? (
              <div className="bg-white rounded-xl border p-6 text-center">
                <p className="text-gray-400 text-sm">Nog geen dagelijkse check-ins</p>
              </div>
            ) : (
              <div className="space-y-2">
                {dailyCheckIns.slice(0, 14).map((ci) => (
                  <div key={ci.id} className="bg-white rounded-xl border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {new Date(ci.check_in_date).toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" })}
                        </span>
                        {ci.weight && (
                          <span className="text-sm text-gray-700 flex items-center gap-1">
                            <Weight className="w-3.5 h-3.5" /> {ci.weight} kg
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        {ci.mood && <span className="flex items-center gap-1"><Smile className="w-3 h-3" /> {MOOD_LABELS[ci.mood]}</span>}
                        {ci.sleep_quality && <span className="flex items-center gap-1"><Moon className="w-3 h-3" /> {SLEEP_LABELS[ci.sleep_quality]}</span>}
                      </div>
                    </div>
                    {ci.notes && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-700">{ci.notes}</p>
                      </div>
                    )}
                    {ci.coach_feedback && (
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-xs text-blue-600 mb-1 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" /> Jouw feedback
                        </p>
                        <p className="text-sm text-blue-800">{ci.coach_feedback}</p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Feedback..."
                        value={feedbackText[ci.id] || ""}
                        onChange={(e) => setFeedbackText((prev) => ({ ...prev, [ci.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === "Enter" && handleFeedback(ci.id, "daily")}
                        className="flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#1e1839]/20 outline-none"
                      />
                      <button
                        onClick={() => handleFeedback(ci.id, "daily")}
                        disabled={!feedbackText[ci.id]?.trim() || feedbackSending === ci.id}
                        className="px-3 py-2 bg-[#1e1839] text-white rounded-lg disabled:opacity-40"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* === TRAINING TAB === */}
      {activeTab === "training" && (() => {
        // ── Compute analytics data from workouts ──
        const allExercises: Record<string, { name: string; category: string }> = {}
        const exerciseWeeklyData: Record<string, Record<number, { totalVolume: number; totalSets: number; totalReps: number; maxWeight: number; avgRpe: number; rpeCount: number; date: string }>> = {}

        workouts.forEach((w: any) => {
          const wk = w.week_number ?? 0
          const logs: any[] = w.workout_logs || []
          logs.forEach((log: any) => {
            const exId = log.exercise_id
            if (!allExercises[exId]) {
              allExercises[exId] = { name: log.exercises?.name || "Oefening", category: log.exercises?.category || "" }
            }
            if (!exerciseWeeklyData[exId]) exerciseWeeklyData[exId] = {}
            if (!exerciseWeeklyData[exId][wk]) {
              exerciseWeeklyData[exId][wk] = { totalVolume: 0, totalSets: 0, totalReps: 0, maxWeight: 0, avgRpe: 0, rpeCount: 0, date: w.completed_at || w.scheduled_date }
            }
            const d = exerciseWeeklyData[exId][wk]
            const vol = (log.weight_kg || 0) * (log.reps_completed || 0)
            d.totalVolume += vol
            d.totalSets += 1
            d.totalReps += log.reps_completed || 0
            if ((log.weight_kg || 0) > d.maxWeight) d.maxWeight = log.weight_kg || 0
            if (log.actual_rpe != null) { d.avgRpe += log.actual_rpe; d.rpeCount += 1 }
          })
        })

        // Overall weekly totals
        const weeklyTotals: Record<number, { totalVolume: number; totalSets: number; totalReps: number; workoutCount: number; date: string }> = {}
        workouts.forEach((w: any) => {
          const wk = w.week_number ?? 0
          const logs: any[] = w.workout_logs || []
          if (!weeklyTotals[wk]) weeklyTotals[wk] = { totalVolume: 0, totalSets: 0, totalReps: 0, workoutCount: 0, date: w.completed_at || w.scheduled_date }
          weeklyTotals[wk].workoutCount += 1
          logs.forEach((log: any) => {
            weeklyTotals[wk].totalVolume += (log.weight_kg || 0) * (log.reps_completed || 0)
            weeklyTotals[wk].totalSets += 1
            weeklyTotals[wk].totalReps += log.reps_completed || 0
          })
        })
        const sortedWeeks = Object.keys(weeklyTotals).map(Number).sort((a, b) => a - b)

        const exerciseEntries = Object.entries(allExercises).sort((a, b) => a[1].name.localeCompare(b[1].name))
        const selectedExerciseData = analyticsExercise ? exerciseWeeklyData[analyticsExercise] : null
        const selectedExerciseWeeks = selectedExerciseData ? Object.keys(selectedExerciseData).map(Number).sort((a, b) => a - b) : []

        return (
        <div className="space-y-4">
          {/* Assigned Programs */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Toegewezen Programma&apos;s</h3>
            {clientPrograms.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">Geen programma&apos;s toegewezen</p>
            ) : (
              <div className="space-y-3">
                {clientPrograms.map((cp: any) => {
                  const program = cp.training_programs
                  const blocks = (program?.program_blocks || []).sort((a: any, b: any) => a.order_index - b.order_index)
                  const blockCount = blocks.length
                  const isExpProg = expandedProgram === cp.id
                  const statusColors: Record<string, string> = {
                    active: "bg-green-100 text-green-700",
                    paused: "bg-yellow-100 text-yellow-700",
                    completed: "bg-gray-100 text-gray-500",
                  }
                  return (
                    <div key={cp.id} className="border rounded-lg overflow-hidden">
                      <div className="flex items-center gap-4 p-4 bg-gray-50">
                        <div className="w-10 h-10 rounded-lg bg-[#1e1839] flex items-center justify-center flex-shrink-0">
                          <Dumbbell className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{program?.name || "Onbekend programma"}</p>
                          <p className="text-xs text-gray-500">
                            {blockCount} {blockCount === 1 ? "blok" : "blokken"}
                            {cp.start_date && ` · Gestart ${new Date(cp.start_date).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })}`}
                          </p>
                          {program?.description && <p className="text-xs text-gray-400 mt-0.5 truncate">{program.description}</p>}
                        </div>
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[cp.status] || "bg-gray-100 text-gray-500"}`}>
                          {cp.status === "active" ? "Actief" : cp.status === "paused" ? "Gepauzeerd" : "Afgerond"}
                        </span>
                        {blockCount > 0 && (
                          <button onClick={() => setExpandedProgram(isExpProg ? null : cp.id)} className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors" title="Blokken tonen">
                            {isExpProg ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </button>
                        )}
                        <div className="flex items-center gap-1">
                          {cp.status === "active" && (
                            <button onClick={async () => { await updateClientProgramStatus(cp.id, "paused"); loadData() }} className="p-1.5 text-gray-400 hover:text-yellow-600 transition-colors" title="Pauzeren">
                              <Clock className="w-4 h-4" />
                            </button>
                          )}
                          {cp.status === "paused" && (
                            <button onClick={async () => { await updateClientProgramStatus(cp.id, "active"); loadData() }} className="p-1.5 text-gray-400 hover:text-green-600 transition-colors" title="Hervatten">
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={async () => { if (!confirm("Weet je zeker dat je dit programma wilt verwijderen van deze client?")) return; setRemovingProgram(cp.id); await removeClientProgram(cp.id); setRemovingProgram(null); loadData() }}
                            disabled={removingProgram === cp.id}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50" title="Verwijderen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {/* Expanded blocks with descriptions */}
                      {isExpProg && blocks.length > 0 && (
                        <div className="border-t bg-white p-4 space-y-2">
                          {blocks.map((block: any, idx: number) => (
                            <div key={block.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                              <div className="w-7 h-7 rounded-md bg-[#1e1839]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-bold text-[#1e1839]">{idx + 1}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">{block.name}</p>
                                <p className="text-xs text-gray-500">{block.duration_weeks} {block.duration_weeks === 1 ? "week" : "weken"}</p>
                              </div>
                              {block.description && (
                                <div className="group relative">
                                  <Info className="w-4 h-4 text-gray-400 hover:text-[#1e1839] cursor-help transition-colors" />
                                  <div className="absolute right-0 top-6 z-10 w-64 p-3 bg-white rounded-lg shadow-lg border text-xs text-gray-600 hidden group-hover:block">
                                    {block.description}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Sub-tabs: Logs vs Analytics */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setTrainingSubTab("logs")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${trainingSubTab === "logs" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              <Dumbbell className="w-4 h-4 inline mr-1.5 -mt-0.5" />Training Logs
            </button>
            <button
              onClick={() => setTrainingSubTab("analytics")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${trainingSubTab === "analytics" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              <BarChart3 className="w-4 h-4 inline mr-1.5 -mt-0.5" />Analyse
            </button>
          </div>

          {/* ── TRAINING LOGS SUB-TAB ── */}
          {trainingSubTab === "logs" && (
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Voltooide Trainingen</h3>
              {workouts.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-6">Nog geen trainingen voltooid</p>
              ) : (
                <div className="space-y-2">
                  {workouts.map((w: any) => {
                    const templateName = w.workout_templates?.name || "Training"
                    const isExpanded = expandedWorkout === w.id
                    const logs: any[] = w.workout_logs || []
                    const setCount = logs.length
                    const totalVolume = logs.reduce((sum: number, l: any) => sum + (l.weight_kg || 0) * (l.reps_completed || 0), 0)
                    // Group logs by exercise
                    const exerciseGroups: Record<string, { name: string; category: string; thumbnailUrl: string | null; sets: any[] }> = {}
                    logs.forEach((log: any) => {
                      const exId = log.exercise_id
                      if (!exerciseGroups[exId]) {
                        exerciseGroups[exId] = { name: log.exercises?.name || "Oefening", category: log.exercises?.category || "", thumbnailUrl: log.exercises?.thumbnail_url || null, sets: [] }
                      }
                      exerciseGroups[exId].sets.push(log)
                    })
                    Object.values(exerciseGroups).forEach((g) => g.sets.sort((a: any, b: any) => a.set_number - b.set_number))
                    const exerciseList = Object.entries(exerciseGroups)

                    return (
                      <div key={w.id} className="border rounded-lg overflow-hidden">
                        <button
                          onClick={() => setExpandedWorkout(isExpanded ? null : w.id)}
                          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-green-100">
                              <Check className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{templateName}</p>
                              <p className="text-xs text-gray-500">
                                {w.completed_at ? new Date(w.completed_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" }) : "–"}
                                {w.week_number != null && ` · Week ${w.week_number}`}
                                {` · ${exerciseList.length} oef · ${setCount} sets`}
                                {totalVolume > 0 && ` · ${Math.round(totalVolume).toLocaleString("nl-NL")} kg vol`}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                        </button>

                        {isExpanded && (
                          <div className="p-4 space-y-4 bg-white">
                            {exerciseList.length === 0 ? (
                              <p className="text-sm text-gray-400 text-center py-2">Geen sets gelogd</p>
                            ) : (
                              exerciseList.map(([exId, group]) => (
                                <div key={exId} className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    {group.thumbnailUrl ? (
                                      <img src={group.thumbnailUrl} alt="" className="w-8 h-8 rounded object-cover" />
                                    ) : (
                                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                                        <Dumbbell className="w-4 h-4 text-gray-400" />
                                      </div>
                                    )}
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">{group.name}</p>
                                      {group.category && <p className="text-xs text-gray-400">{group.category}</p>}
                                    </div>
                                  </div>
                                  <div className="ml-10">
                                    <div className="grid grid-cols-[40px_1fr_1fr_1fr_1fr] gap-1 text-xs font-medium text-gray-400 uppercase mb-1">
                                      <span>Set</span><span>Reps</span><span>Gewicht</span><span>RPE</span><span>RIR</span>
                                    </div>
                                    {group.sets.map((s: any) => (
                                      <div key={s.id} className="grid grid-cols-[40px_1fr_1fr_1fr_1fr] gap-1 text-sm py-1 border-t border-gray-50">
                                        <span className="text-gray-500 font-medium">{s.set_number}</span>
                                        <span className="text-gray-900">{s.reps_completed}{s.prescribed_reps && <span className="text-gray-400 text-xs ml-1">/ {s.prescribed_reps}</span>}</span>
                                        <span className="text-gray-900">{s.weight_kg != null ? `${s.weight_kg} kg` : "–"}{s.prescribed_weight_kg != null && <span className="text-gray-400 text-xs ml-1">/ {s.prescribed_weight_kg}</span>}</span>
                                        <span className="text-gray-900">{s.actual_rpe != null ? s.actual_rpe : "–"}{s.prescribed_rpe != null && <span className="text-gray-400 text-xs ml-1">/ {s.prescribed_rpe}</span>}</span>
                                        <span className="text-gray-900">{s.actual_rir != null ? s.actual_rir : "–"}{s.prescribed_rir != null && <span className="text-gray-400 text-xs ml-1">/ {s.prescribed_rir}</span>}</span>
                                      </div>
                                    ))}
                                    {group.sets.some((s: any) => s.notes) && (
                                      <div className="mt-1">
                                        {group.sets.filter((s: any) => s.notes).map((s: any) => (
                                          <p key={s.id} className="text-xs text-gray-500 italic">Set {s.set_number}: {s.notes}</p>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── ANALYTICS SUB-TAB ── */}
          {trainingSubTab === "analytics" && (
            <div className="space-y-4">
              {/* Overall weekly summary */}
              <div className="bg-white rounded-xl border p-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Wekelijks Overzicht</h3>
                {sortedWeeks.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-6">Geen data beschikbaar</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 text-xs font-medium text-gray-400 uppercase">Week</th>
                          <th className="text-right py-2 text-xs font-medium text-gray-400 uppercase">Trainingen</th>
                          <th className="text-right py-2 text-xs font-medium text-gray-400 uppercase">Totaal Sets</th>
                          <th className="text-right py-2 text-xs font-medium text-gray-400 uppercase">Totaal Reps</th>
                          <th className="text-right py-2 text-xs font-medium text-gray-400 uppercase">Totaal Volume</th>
                          <th className="text-right py-2 text-xs font-medium text-gray-400 uppercase w-24">Volume &Delta;</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedWeeks.map((wk, idx) => {
                          const d = weeklyTotals[wk]
                          const prevWk = idx > 0 ? weeklyTotals[sortedWeeks[idx - 1]] : null
                          const volDelta = prevWk && prevWk.totalVolume > 0 ? ((d.totalVolume - prevWk.totalVolume) / prevWk.totalVolume * 100) : null
                          return (
                            <tr key={wk} className="border-b border-gray-50 hover:bg-gray-50">
                              <td className="py-2.5 font-medium text-gray-900">Week {wk || "–"}</td>
                              <td className="py-2.5 text-right text-gray-700">{d.workoutCount}</td>
                              <td className="py-2.5 text-right text-gray-700">{d.totalSets}</td>
                              <td className="py-2.5 text-right text-gray-700">{d.totalReps}</td>
                              <td className="py-2.5 text-right text-gray-900 font-medium">{Math.round(d.totalVolume).toLocaleString("nl-NL")} kg</td>
                              <td className="py-2.5 text-right">
                                {volDelta != null ? (
                                  <span className={`text-xs font-medium ${volDelta >= 0 ? "text-green-600" : "text-red-500"}`}>
                                    {volDelta >= 0 ? "+" : ""}{volDelta.toFixed(1)}%
                                  </span>
                                ) : <span className="text-xs text-gray-300">–</span>}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Volume trend chart */}
              {sortedWeeks.length >= 2 && (
                <div className="bg-white rounded-xl border p-6">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Volume Trend</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={sortedWeeks.map(wk => ({ week: `Wk ${wk}`, volume: Math.round(weeklyTotals[wk].totalVolume), sets: weeklyTotals[wk].totalSets, reps: weeklyTotals[wk].totalReps }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value: any) => [`${Number(value).toLocaleString("nl-NL")} kg`, "Volume"]} />
                      <Line type="monotone" dataKey="volume" stroke="#1e1839" strokeWidth={2} dot={{ r: 4, fill: "#1e1839" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Per-exercise comparison */}
              <div className="bg-white rounded-xl border p-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Oefening Analyse</h3>
                {exerciseEntries.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-6">Geen oefening data</p>
                ) : (
                  <>
                    <select
                      value={analyticsExercise || ""}
                      onChange={e => setAnalyticsExercise(e.target.value || null)}
                      className="w-full p-2.5 border rounded-lg text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#1e1839]/20"
                    >
                      <option value="">Selecteer een oefening...</option>
                      {exerciseEntries.map(([exId, ex]) => (
                        <option key={exId} value={exId}>{ex.name}{ex.category ? ` (${ex.category})` : ""}</option>
                      ))}
                    </select>

                    {analyticsExercise && selectedExerciseData && selectedExerciseWeeks.length > 0 && (
                      <div className="space-y-4">
                        {/* Exercise weekly table */}
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2 text-xs font-medium text-gray-400 uppercase">Week</th>
                                <th className="text-right py-2 text-xs font-medium text-gray-400 uppercase">Sets</th>
                                <th className="text-right py-2 text-xs font-medium text-gray-400 uppercase">Reps</th>
                                <th className="text-right py-2 text-xs font-medium text-gray-400 uppercase">Max Gewicht</th>
                                <th className="text-right py-2 text-xs font-medium text-gray-400 uppercase">Volume</th>
                                <th className="text-right py-2 text-xs font-medium text-gray-400 uppercase">Gem. RPE</th>
                                <th className="text-right py-2 text-xs font-medium text-gray-400 uppercase w-24">&Delta;</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedExerciseWeeks.map((wk, idx) => {
                                const d = selectedExerciseData[wk]
                                const prevD = idx > 0 ? selectedExerciseData[selectedExerciseWeeks[idx - 1]] : null
                                const volDelta = prevD && prevD.totalVolume > 0 ? ((d.totalVolume - prevD.totalVolume) / prevD.totalVolume * 100) : null
                                return (
                                  <tr key={wk} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="py-2.5 font-medium text-gray-900">Week {wk || "–"}</td>
                                    <td className="py-2.5 text-right text-gray-700">{d.totalSets}</td>
                                    <td className="py-2.5 text-right text-gray-700">{d.totalReps}</td>
                                    <td className="py-2.5 text-right text-gray-700">{d.maxWeight > 0 ? `${d.maxWeight} kg` : "–"}</td>
                                    <td className="py-2.5 text-right text-gray-900 font-medium">{Math.round(d.totalVolume).toLocaleString("nl-NL")} kg</td>
                                    <td className="py-2.5 text-right text-gray-700">{d.rpeCount > 0 ? (d.avgRpe / d.rpeCount).toFixed(1) : "–"}</td>
                                    <td className="py-2.5 text-right">
                                      {volDelta != null ? (
                                        <span className={`text-xs font-medium ${volDelta >= 0 ? "text-green-600" : "text-red-500"}`}>
                                          {volDelta >= 0 ? "+" : ""}{volDelta.toFixed(1)}%
                                        </span>
                                      ) : <span className="text-xs text-gray-300">–</span>}
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Exercise volume trend */}
                        {selectedExerciseWeeks.length >= 2 && (
                          <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={selectedExerciseWeeks.map(wk => ({ week: `Wk ${wk}`, volume: Math.round(selectedExerciseData[wk].totalVolume), maxWeight: selectedExerciseData[wk].maxWeight }))}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                              <YAxis yAxisId="vol" tick={{ fontSize: 12 }} />
                              <YAxis yAxisId="wt" orientation="right" tick={{ fontSize: 12 }} />
                              <Tooltip />
                              <Legend />
                              <Line yAxisId="vol" type="monotone" dataKey="volume" name="Volume (kg)" stroke="#1e1839" strokeWidth={2} dot={{ r: 4, fill: "#1e1839" }} />
                              <Line yAxisId="wt" type="monotone" dataKey="maxWeight" name="Max Gewicht (kg)" stroke="#6366f1" strokeWidth={2} dot={{ r: 4, fill: "#6366f1" }} />
                            </LineChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    )}

                    {analyticsExercise && (!selectedExerciseData || selectedExerciseWeeks.length === 0) && (
                      <p className="text-gray-400 text-sm text-center py-4">Geen data voor deze oefening</p>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        )
      })()}

      {/* === VOEDING TAB === */}
      {activeTab === "voeding" && (
        <div className="space-y-4">
          {/* Nutrition Targets */}
          <div className="bg-white rounded-xl border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                <Flame className="w-4 h-4" /> Voedingsdoelen
              </h3>
              <div className="flex items-center gap-2">
                {targetSaved && <span className="text-xs text-green-600 font-medium flex items-center gap-1"><Check className="w-3 h-3" /> Opgeslagen</span>}
                {editingTargets ? (
                  <>
                    <button onClick={() => { setEditingTargets(false); if (nutritionTargets) setTargetForm({ daily_calories: nutritionTargets.daily_calories || 0, daily_protein_grams: nutritionTargets.daily_protein_grams || 0, daily_carbs_grams: nutritionTargets.daily_carbs_grams || 0, daily_fat_grams: nutritionTargets.daily_fat_grams || 0 }) }} className="px-3 py-1.5 text-xs text-gray-600 border rounded-lg hover:bg-gray-50">Annuleren</button>
                    <button onClick={handleSaveTargets} disabled={targetSaving} className="px-3 py-1.5 text-xs bg-[#1e1839] text-white rounded-lg disabled:opacity-50 flex items-center gap-1"><Save className="w-3 h-3" /> Opslaan</button>
                  </>
                ) : (
                  <button onClick={() => setEditingTargets(true)} className="px-3 py-1.5 text-xs text-gray-600 border rounded-lg hover:bg-gray-50 flex items-center gap-1"><Pencil className="w-3 h-3" /> Bewerken</button>
                )}
              </div>
            </div>
            {editingTargets ? (
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Calorieën", key: "daily_calories" as const, unit: "kcal", color: "border-orange-300 focus:ring-orange-200" },
                  { label: "Eiwit", key: "daily_protein_grams" as const, unit: "g", color: "border-red-300 focus:ring-red-200" },
                  { label: "Koolhydraten", key: "daily_carbs_grams" as const, unit: "g", color: "border-blue-300 focus:ring-blue-200" },
                  { label: "Vet", key: "daily_fat_grams" as const, unit: "g", color: "border-yellow-300 focus:ring-yellow-200" },
                ].map((field) => (
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
                  { label: "Calorieën", value: nutritionTargets?.daily_calories || foodLogs.targets?.daily_calories, unit: "kcal", color: "text-orange-600" },
                  { label: "Eiwit", value: nutritionTargets?.daily_protein_grams || foodLogs.targets?.daily_protein_grams, unit: "g", color: "text-red-600" },
                  { label: "Koolhydraten", value: nutritionTargets?.daily_carbs_grams || foodLogs.targets?.daily_carbs_grams, unit: "g", color: "text-blue-600" },
                  { label: "Vet", value: nutritionTargets?.daily_fat_grams || foodLogs.targets?.daily_fat_grams, unit: "g", color: "text-yellow-600" },
                ].map((t) => (
                  <div key={t.label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-gray-400 uppercase">{t.label} doel</p>
                    <p className={`text-lg font-bold ${t.color}`}>{t.value || "—"}{t.value ? ` ${t.unit}` : ""}</p>
                  </div>
                ))}
              </div>
            )}
            {!nutritionTargets && !foodLogs.targets && !editingTargets && (
              <p className="text-xs text-gray-400 mt-3 text-center">Nog geen voedingsdoelen ingesteld. Klik op Bewerken om targets in te stellen.</p>
            )}
          </div>

          {/* Assigned Meal Plans */}
          <div className="bg-white rounded-xl border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4" /> Toegewezen Meal Plans
              </h3>
              <Link href="/coach/dashboard/nutrition/meal-plans" className="text-xs text-[#1e1839] hover:underline">Beheren →</Link>
            </div>
            {clientAssignments.filter((a: any) => a.is_active).length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-400">Geen actief meal plan toegewezen</p>
                <Link href="/coach/dashboard/nutrition/meal-plans" className="text-xs text-[#1e1839] hover:underline mt-1 inline-block">Wijs een meal plan toe →</Link>
              </div>
            ) : (
              <div className="space-y-2">
                {clientAssignments.filter((a: any) => a.is_active).map((assignment: any) => (
                  <div key={assignment.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <UtensilsCrossed className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{assignment.meal_plans?.name || "Onbekend plan"}</p>
                        <p className="text-xs text-gray-500">
                          {assignment.meal_plans?.daily_calories && `${assignment.meal_plans.daily_calories} kcal`}
                          {assignment.start_date && ` · Sinds ${new Date(assignment.start_date).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}`}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">Actief</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Food Logs */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Recente Food Logs</h3>
            {foodLogs.foodLogs?.length === 0 ? <p className="text-gray-400 text-sm text-center py-6">Nog geen food logs</p> : (
              <div className="space-y-2">{(foodLogs.foodLogs || []).slice(0, 20).map((log: any) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div><p className="text-sm font-medium text-gray-900">{log.food_name}</p><p className="text-xs text-gray-500">{log.date} · {log.meal_type}</p></div>
                  <div className="text-right"><p className="text-sm font-semibold text-gray-900">{log.calories} kcal</p><p className="text-[10px] text-gray-400">E{log.protein_grams}g K{log.carbs_grams}g V{log.fat_grams}g</p></div>
                </div>
              ))}</div>
            )}
          </div>
        </div>
      )}

      {/* === GEZONDHEID TAB === */}
      {activeTab === "gezondheid" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            {healthData?.isConnected ? <><Wifi className="w-4 h-4 text-green-500" /> Wearable gekoppeld</> : <><WifiOff className="w-4 h-4 text-gray-300" /> Geen wearable gekoppeld</>}
            {healthData?.lastSync && <span className="text-xs text-gray-400">· Laatste sync: {new Date(healthData.lastSync).toLocaleDateString("nl-NL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[{ label: "Stappen", type: "steps", icon: Footprints, color: "text-blue-600", bg: "bg-blue-50" }, { label: "Slaap", type: "sleep_hours", icon: Moon, color: "text-purple-600", bg: "bg-purple-50" }, { label: "Hartslag", type: "heart_rate_avg", icon: Heart, color: "text-red-500", bg: "bg-red-50" }, { label: "Actieve kcal", type: "active_calories", icon: Flame, color: "text-orange-500", bg: "bg-orange-50" }].map((metric) => {
              const todayVal = healthData?.todayData?.find((d: any) => d.data_type === metric.type)?.value
              return (
                <div key={metric.type} className="bg-white rounded-xl border p-4 text-center">
                  <div className={`w-10 h-10 mx-auto rounded-lg ${metric.bg} flex items-center justify-center mb-2`}><metric.icon className={`w-5 h-5 ${metric.color}`} /></div>
                  <p className="text-xl font-bold text-gray-900">{todayVal ? (metric.type === "sleep_hours" ? `${todayVal.toFixed(1)}u` : todayVal.toLocaleString("nl-NL")) : "—"}</p>
                  <p className="text-xs text-gray-400">{metric.label}</p>
                </div>
              )
            })}
          </div>
          {healthData?.historyData?.length > 0 && (
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Stappen (14 dagen)</h3>
              <div className="flex items-end gap-1 h-24">
                {healthData.historyData.filter((d: any) => d.data_type === "steps").map((d: any, i: number) => {
                  const maxSteps = Math.max(...healthData.historyData.filter((x: any) => x.data_type === "steps").map((x: any) => x.value), 1)
                  return <div key={i} className="flex-1 bg-blue-400 rounded-t-sm" style={{ height: `${Math.max((d.value / maxSteps) * 100, 4)}%` }} title={`${d.date}: ${d.value}`} />
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* === FOTO'S TAB === */}
      {activeTab === "fotos" && (
        <div className="space-y-4">
          {photos.length === 0 ? (
            <div className="bg-white rounded-xl border p-12 text-center"><Camera className="h-12 w-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">Nog geen voortgangsfoto&apos;s</p></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {photos.map((photo: any) => (
                <div key={photo.id} className="bg-white rounded-xl border overflow-hidden">
                  <img src={photo.photo_url} alt="Progress" className="w-full h-48 object-cover" />
                  <div className="p-3"><p className="text-xs text-gray-500">{new Date(photo.taken_at).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}</p>{photo.category && <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{photo.category}</span>}</div>
                </div>
              ))}
            </div>
          )}
          <Link href={`/coach/dashboard/clients/${clientId}/photos`} className="block text-center text-sm text-[#1e1839] hover:underline">Naar foto vergelijking →</Link>
        </div>
      )}

      {/* === NOTITIES TAB === */}
      {activeTab === "notities" && (
        <div className="bg-white rounded-xl border p-5 space-y-4">
          <div className="flex gap-2">
            <input type="text" value={newNote} onChange={(e) => setNewNote(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddNote()} placeholder="Schrijf een privé notitie..." className="flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#1e1839]/20 outline-none" />
            <button onClick={handleAddNote} disabled={!newNote.trim()} className="px-4 py-2 bg-[#1e1839] text-white text-sm rounded-lg disabled:opacity-40"><Plus className="w-4 h-4" /></button>
          </div>
          <p className="text-[10px] text-gray-400">Notities zijn alleen zichtbaar voor jou als coach.</p>
          {notes.length === 0 ? <p className="text-gray-400 text-sm text-center py-6">Nog geen notities</p> : (
            <div className="space-y-2">{notes.map((note) => (
              <div key={note.id} className={`p-3 rounded-lg border ${note.is_pinned ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-100"}`}>
                <div className="flex items-start justify-between">
                  <p className="text-sm text-gray-800 flex-1">{note.content}</p>
                  <div className="flex items-center gap-1 ml-2">
                    <button onClick={async () => { await togglePinNote(note.id); const r = await getCoachNotes(clientId); if (r.success) setNotes(r.notes || []) }} className="p-1 text-gray-400 hover:text-amber-500" title="Vastpinnen"><Pin className="w-3.5 h-3.5" /></button>
                    <button onClick={async () => { await deleteCoachNote(note.id); const r = await getCoachNotes(clientId); if (r.success) setNotes(r.notes || []) }} className="p-1 text-gray-400 hover:text-red-500" title="Verwijderen"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">{new Date(note.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
              </div>
            ))}</div>
          )}
        </div>
      )}

      {/* === DOELEN TAB === */}
      {activeTab === "doelen" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Client Doelen</h3>
            <button onClick={() => setShowGoalForm(!showGoalForm)} className="flex items-center gap-1.5 px-3 py-2 bg-[#1e1839] text-white text-sm rounded-lg"><Plus className="w-4 h-4" /> Nieuw Doel</button>
          </div>
          {showGoalForm && (
            <div className="bg-white rounded-xl border p-5 space-y-3">
              <input type="text" value={newGoal.title} onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })} placeholder="Doel titel *" className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-[#1e1839]/20" />
              <input type="text" value={newGoal.description} onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })} placeholder="Beschrijving (optioneel)" className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-[#1e1839]/20" />
              <input type="date" value={newGoal.target_date} onChange={(e) => setNewGoal({ ...newGoal, target_date: e.target.value })} className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-[#1e1839]/20" />
              <div className="flex gap-2">
                <button onClick={() => setShowGoalForm(false)} className="px-4 py-2 text-sm text-gray-600 border rounded-lg">Annuleren</button>
                <button onClick={handleAddGoal} disabled={!newGoal.title.trim()} className="px-4 py-2 text-sm bg-[#1e1839] text-white rounded-lg disabled:opacity-40">Toevoegen</button>
              </div>
            </div>
          )}
          {activeGoals.length > 0 && (
            <div className="bg-white rounded-xl border p-5">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Actief</h4>
              <div className="space-y-2">{activeGoals.map((goal) => {
                const daysLeft = goal.target_date ? Math.ceil((new Date(goal.target_date).getTime() - Date.now()) / 86400000) : null
                return (
                  <div key={goal.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div><p className="text-sm font-medium text-gray-900">{goal.title}</p>{goal.description && <p className="text-xs text-gray-500">{goal.description}</p>}{daysLeft !== null && <p className="text-xs text-blue-600 mt-0.5">{daysLeft > 0 ? `${daysLeft} dagen over` : "Deadline bereikt!"}</p>}</div>
                    <div className="flex items-center gap-1">
                      <button onClick={async () => { await updateGoalStatus(goal.id, "completed"); const r = await getClientGoals(clientId); if (r.success) setGoals(r.goals || []) }} className="p-1.5 text-green-600 hover:bg-green-100 rounded" title="Voltooid"><Check className="w-4 h-4" /></button>
                      <button onClick={async () => { await deleteClientGoal(goal.id); const r = await getClientGoals(clientId); if (r.success) setGoals(r.goals || []) }} className="p-1.5 text-gray-400 hover:text-red-500 rounded" title="Verwijderen"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                )
              })}</div>
            </div>
          )}
          {completedGoals.length > 0 && (
            <div className="bg-white rounded-xl border p-5">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Voltooid ({completedGoals.length})</h4>
              <div className="space-y-2">{completedGoals.map((goal) => (
                <div key={goal.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /><span className="text-sm text-gray-600 line-through">{goal.title}</span></div>
                  {goal.completed_at && <span className="text-xs text-gray-400">{new Date(goal.completed_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}</span>}
                </div>
              ))}</div>
            </div>
          )}
          {goals.length === 0 && !showGoalForm && (
            <div className="bg-white rounded-xl border p-12 text-center"><Target className="h-12 w-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">Nog geen doelen ingesteld</p><p className="text-xs text-gray-400 mt-1">Stel motiverende doelen in voor deze client</p></div>
          )}
        </div>
      )}
    </div>
  )
}
