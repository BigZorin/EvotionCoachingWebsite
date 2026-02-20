"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  LayoutDashboard, MessageSquareText, HeartPulse, UserCircle, Loader2,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import CoachingTab from "./components/CoachingTab"
import HealthTab from "./components/HealthTab"
import ProfileTab from "./components/ProfileTab"

/*
 * 4 logical tabs instead of 7 flat ones:
 * 1. Overzicht  = dashboard / alerts / timeline
 * 2. Coaching   = check-ins + training + voeding (sub-tabs)
 * 3. Gezondheid = weight, wellbeing, wearable
 * 4. Profiel    = intake + photos + notes + goals
 */
type TabId = "overzicht" | "coaching" | "gezondheid" | "profiel"

const TABS: { id: TabId; label: string; icon: any }[] = [
  { id: "overzicht", label: "Overzicht", icon: LayoutDashboard },
  { id: "coaching", label: "Coaching", icon: MessageSquareText },
  { id: "gezondheid", label: "Gezondheid", icon: HeartPulse },
  { id: "profiel", label: "Profiel", icon: UserCircle },
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
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Client laden...</span>
        </div>
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

  // Count pending check-ins for coaching badge
  const pendingCheckIns = weeklyCheckIns.filter(ci => !ci.coach_feedback).length

  return (
    <div className="space-y-5">
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

      {/* Tab navigation */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabId)}>
        <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b rounded-none">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2.5 text-sm font-medium gap-2"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {tab.id === "coaching" && pendingCheckIns > 0 && (
                <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold bg-primary text-primary-foreground rounded-full min-w-[18px]">
                  {pendingCheckIns}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Tab content */}
      {activeTab === "overzicht" && (
        <OverviewTab
          clientId={clientId}
          clientPrograms={clientPrograms}
          nutritionTargets={nutritionTargets}
          supplements={supplements}
          activeGoals={activeGoals.map(g => ({ id: g.id, title: g.title, target_date: g.target_date || undefined }))}
          pinnedNotes={notes.filter(n => n.is_pinned).map(n => ({ id: n.id, content: n.content }))}
          weeklyCheckIns={weeklyCheckIns}
          dailyCheckIns={dailyCheckIns}
          workouts={workouts}
          onNavigateToTab={(tab) => setActiveTab(tab as TabId)}
        />
      )}

      {activeTab === "coaching" && (
        <CoachingTab
          clientId={clientId}
          clientName={clientName}
          intake={intake}
          weeklyCheckIns={weeklyCheckIns}
          dailyCheckIns={dailyCheckIns}
          weeklyCheckInDay={weeklyCheckInDay}
          clientTemplateAssignments={clientTemplateAssignments}
          coachTemplates={coachTemplates}
          workouts={workouts}
          clientPrograms={clientPrograms}
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
          clientName={clientName}
          intake={intake}
          photos={photos}
          notes={notes}
          goals={goals}
          onDataRefresh={() => loadData()}
          onIntakeReset={() => { setIntake(null) }}
          onPlanComplete={() => loadData()}
        />
      )}
    </div>
  )
}
