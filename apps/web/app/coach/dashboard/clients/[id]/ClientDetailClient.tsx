"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Activity, FileText, ClipboardList, Dumbbell,
  UtensilsCrossed, User, HeartPulse,
} from "lucide-react"
import {
  getClientProfile, getClientCheckIns, getClientDailyCheckIns,
  getClientWorkouts, getClientFoodLogs, getClientHealthSummary,
  getCoachNotes, getClientGoals, getClientHabits, getClientProgressPhotos,
  getClientCheckInSettings,
  type Client, type CheckIn, type DailyCheckIn, type CoachNote, type ClientGoal,
} from "@/app/actions/admin-clients"
import {
  getNutritionTargets, getClientAssignments, getNutritionTargetHistory,
  getClientSupplements,
} from "@/app/actions/nutrition"
import { getClientPrograms } from "@/app/actions/training-programs"
import {
  getClientTemplateAssignments, getCoachTemplates,
  type CheckInTemplate,
} from "@/app/actions/check-in-templates"

import ClientHeader from "./components/ClientHeader"
import OverviewTab from "./components/OverviewTab"
import IntakeTab from "./components/IntakeTab"
import CheckInsTab from "./components/CheckInsTab"
import TrainingTab from "./components/TrainingTab"
import NutritionTab from "./components/NutritionTab"
import ProfileTab from "./components/ProfileTab"
import HealthTab from "./components/HealthTab"

type TabId = "overzicht" | "intake" | "checkins" | "training" | "voeding" | "gezondheid" | "profiel"

const TABS: { id: TabId; label: string; icon: any }[] = [
  { id: "overzicht", label: "Overzicht", icon: Activity },
  { id: "intake", label: "Intake", icon: FileText },
  { id: "checkins", label: "Check-ins", icon: ClipboardList },
  { id: "training", label: "Training", icon: Dumbbell },
  { id: "voeding", label: "Voeding", icon: UtensilsCrossed },
  { id: "gezondheid", label: "Gezondheid", icon: HeartPulse },
  { id: "profiel", label: "Profiel", icon: User },
]

export default function ClientDetailClient({ clientId }: { clientId: string }) {
  const [activeTab, setActiveTab] = useState<TabId>("overzicht")
  const [isLoading, setIsLoading] = useState(true)

  // Core client data
  const [client, setClient] = useState<Client | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [intake, setIntake] = useState<any>(null)
  const [clientApprovalStatus, setClientApprovalStatus] = useState<string | null>(null)
  const [approvalLoading, setApprovalLoading] = useState(false)

  // Data shared across tabs or needed for header
  const [weeklyCheckIns, setWeeklyCheckIns] = useState<CheckIn[]>([])
  const [dailyCheckIns, setDailyCheckIns] = useState<DailyCheckIn[]>([])
  const [workouts, setWorkouts] = useState<any[]>([])
  const [foodLogs, setFoodLogs] = useState<any>({ foodLogs: [], targets: null })
  const [healthData, setHealthData] = useState<any>(null)
  const [notes, setNotes] = useState<CoachNote[]>([])
  const [goals, setGoals] = useState<ClientGoal[]>([])
  const [photos, setPhotos] = useState<any[]>([])
  const [nutritionTargets, setNutritionTargetsState] = useState<{ daily_calories: number; daily_protein_grams: number; daily_carbs_grams: number; daily_fat_grams: number } | null>(null)
  const [clientAssignments, setClientAssignments] = useState<any[]>([])
  const [clientPrograms, setClientPrograms] = useState<any[]>([])
  const [targetHistory, setTargetHistory] = useState<any[]>([])
  const [supplements, setSupplements] = useState<any[]>([])
  const [weeklyCheckInDay, setWeeklyCheckInDay] = useState(0)
  const [clientTemplateAssignments, setClientTemplateAssignments] = useState<any[]>([])
  const [coachTemplates, setCoachTemplates] = useState<CheckInTemplate[]>([])

  useEffect(() => { loadData() }, [clientId])

  const loadData = async () => {
    setIsLoading(true)
    const [profileRes, weeklyRes, dailyRes, workoutRes, foodRes, healthRes, notesRes, goalsRes, habitsRes, photosRes, settingsRes, targetsRes, assignmentsRes, programsRes, historyRes, templateAssignmentsRes, coachTemplatesRes, supplementsRes] = await Promise.all([
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
      getNutritionTargetHistory(clientId).catch(() => ({ success: false })),
      getClientTemplateAssignments(clientId).catch(() => ({ success: false })),
      getCoachTemplates().catch(() => ({ success: false })),
      getClientSupplements(clientId).catch(() => ({ success: false })),
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
    if ((photosRes as any).success) setPhotos((photosRes as any).photos || [])
    if ((settingsRes as any).success && (settingsRes as any).weeklyCheckInDay !== undefined) {
      setWeeklyCheckInDay((settingsRes as any).weeklyCheckInDay)
    }
    if ((targetsRes as any).success && (targetsRes as any).targets) {
      setNutritionTargetsState((targetsRes as any).targets)
    }
    if ((assignmentsRes as any).success && (assignmentsRes as any).assignments) {
      setClientAssignments((assignmentsRes as any).assignments)
    }
    if ((programsRes as any).success && (programsRes as any).assignments) {
      setClientPrograms((programsRes as any).assignments)
    }
    if ((historyRes as any).success && (historyRes as any).history) {
      setTargetHistory((historyRes as any).history)
    }
    if ((templateAssignmentsRes as any).success && (templateAssignmentsRes as any).assignments) {
      setClientTemplateAssignments((templateAssignmentsRes as any).assignments)
    }
    if ((coachTemplatesRes as any).success && (coachTemplatesRes as any).templates) {
      setCoachTemplates((coachTemplatesRes as any).templates)
    }
    if ((supplementsRes as any).success && (supplementsRes as any).supplements) {
      setSupplements((supplementsRes as any).supplements)
    }
    setIsLoading(false)
  }

  // Approval handlers
  const handleApprove = async () => {
    setApprovalLoading(true)
    const { approveClient } = await import("@/app/actions/admin-clients")
    const result = await approveClient(clientId)
    if (result.success) setClientApprovalStatus("approved")
    setApprovalLoading(false)
  }

  const handleReject = async (reason?: string) => {
    setApprovalLoading(true)
    const { rejectClient } = await import("@/app/actions/admin-clients")
    const result = await rejectClient(clientId, reason)
    if (result.success) {
      setClientApprovalStatus("rejected")
    }
    setApprovalLoading(false)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-evotion-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Client laden...</p>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Client niet gevonden</p>
        <Link href="/coach/dashboard/clients" className="text-evotion-primary hover:underline mt-3 inline-block text-sm">Terug naar clients</Link>
      </div>
    )
  }

  // Computed values for header
  const profileName = profile ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() : ""
  const metaName = [client.raw_user_meta_data?.first_name, client.raw_user_meta_data?.last_name].filter(Boolean).join(" ") || client.raw_user_meta_data?.full_name || ""
  const clientName = profileName || metaName || client.email
  const latestWeight = dailyCheckIns.find((ci) => ci.weight)?.weight || weeklyCheckIns.find((ci) => ci.weight)?.weight || null
  const firstWeight = [...dailyCheckIns].reverse().find((ci) => ci.weight)?.weight || [...weeklyCheckIns].reverse().find((ci) => ci.weight)?.weight
  const weightDiff = latestWeight && firstWeight ? (latestWeight - firstWeight).toFixed(1) : null
  const weeksSinceJoined = Math.floor((Date.now() - new Date(client.created_at).getTime()) / 86400000 / 7)

  const last30Days = dailyCheckIns.filter((ci) => (Date.now() - new Date(ci.check_in_date).getTime()) / 86400000 <= 30)
  const dailyCompliance = last30Days.length

  let streak = 0
  const sortedDaily = [...dailyCheckIns].sort((a, b) => b.check_in_date.localeCompare(a.check_in_date))
  for (let i = 0; i < sortedDaily.length; i++) {
    const d = new Date(); d.setDate(d.getDate() - i)
    if (sortedDaily[i]?.check_in_date === d.toISOString().split("T")[0]) streak++; else break
  }

  const activeGoals = goals.filter((g) => g.status === "active")

  return (
    <div className="space-y-6">
      <ClientHeader
        client={client}
        profile={profile}
        clientName={clientName}
        latestWeight={latestWeight}
        weightDiff={weightDiff}
        weeksSinceJoined={weeksSinceJoined}
        streak={streak}
        dailyCompliance={dailyCompliance}
        activeGoalsCount={activeGoals.length}
        clientApprovalStatus={clientApprovalStatus}
        approvalLoading={approvalLoading}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Tab navigation - sticky with underline style */}
      <div className="sticky top-0 z-20 bg-background -mx-4 px-4 sm:-mx-6 sm:px-6">
        <div className="relative">
          {/* Fade edges for mobile scroll */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none sm:hidden" />
          <div className="flex overflow-x-auto scrollbar-hide border-b border-border">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "text-evotion-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                {/* Active underline indicator */}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-evotion-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "overzicht" && (
        <OverviewTab
          clientId={clientId}
          clientPrograms={clientPrograms}
          nutritionTargets={nutritionTargets}
          supplements={supplements}
          activeGoals={activeGoals.map(g => ({ id: g.id, title: g.title, target_date: g.target_date || undefined }))}
          pinnedNotes={notes.filter(n => n.is_pinned).map(n => ({ id: n.id, content: n.content }))}
          onNavigateToTab={(tab) => setActiveTab(tab as TabId)}
        />
      )}

      {activeTab === "intake" && (
        <IntakeTab
          clientId={clientId}
          clientName={clientName}
          intake={intake}
          onIntakeReset={() => { setIntake(null) }}
          onPlanComplete={() => loadData()}
        />
      )}

      {activeTab === "checkins" && (
        <CheckInsTab
          clientId={clientId}
          weeklyCheckIns={weeklyCheckIns}
          dailyCheckIns={dailyCheckIns}
          weeklyCheckInDay={weeklyCheckInDay}
          clientTemplateAssignments={clientTemplateAssignments}
          coachTemplates={coachTemplates}
          onDataRefresh={() => loadData()}
        />
      )}

      {activeTab === "training" && (
        <TrainingTab
          clientId={clientId}
          workouts={workouts}
          clientPrograms={clientPrograms}
          onDataRefresh={() => loadData()}
        />
      )}

      {activeTab === "voeding" && (
        <NutritionTab
          clientId={clientId}
          nutritionTargets={nutritionTargets}
          foodLogs={foodLogs}
          clientAssignments={clientAssignments}
          supplements={supplements}
          targetHistory={targetHistory}
          onDataRefresh={() => loadData()}
        />
      )}

      {activeTab === "gezondheid" && (
        <HealthTab
          clientId={clientId}
          healthData={healthData}
          weeklyCheckIns={weeklyCheckIns}
          dailyCheckIns={dailyCheckIns}
        />
      )}

      {activeTab === "profiel" && (
        <ProfileTab
          clientId={clientId}
          photos={photos}
          notes={notes}
          goals={goals}
          onDataRefresh={() => loadData()}
        />
      )}
    </div>
  )
}
