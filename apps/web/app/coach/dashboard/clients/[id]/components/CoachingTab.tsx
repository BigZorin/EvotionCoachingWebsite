"use client"

import { useState } from "react"
import { ClipboardList, Dumbbell, UtensilsCrossed } from "lucide-react"
import type { CheckIn, DailyCheckIn } from "@/app/actions/admin-clients"
import type { CheckInTemplate } from "@/app/actions/check-in-templates"

import CheckInsTab from "./CheckInsTab"
import TrainingTab from "./TrainingTab"
import NutritionTab from "./NutritionTab"

type SubTab = "checkins" | "training" | "voeding"

interface CoachingTabProps {
  clientId: string
  clientName: string
  intake: any
  weeklyCheckIns: CheckIn[]
  dailyCheckIns: DailyCheckIn[]
  weeklyCheckInDay: number
  clientTemplateAssignments: any[]
  coachTemplates: CheckInTemplate[]
  workouts: any[]
  clientPrograms: any[]
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

export default function CoachingTab({
  clientId,
  clientName,
  intake,
  weeklyCheckIns,
  dailyCheckIns,
  weeklyCheckInDay,
  clientTemplateAssignments,
  coachTemplates,
  workouts,
  clientPrograms,
  nutritionTargets,
  foodLogs,
  clientAssignments,
  supplements,
  targetHistory,
  onDataRefresh,
}: CoachingTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("checkins")

  const pendingFeedback = weeklyCheckIns.filter(ci => !ci.coach_feedback).length

  const subTabs: { id: SubTab; label: string; icon: any; badge?: number }[] = [
    {
      id: "checkins",
      label: "Check-ins",
      icon: ClipboardList,
      badge: pendingFeedback > 0 ? pendingFeedback : undefined,
    },
    { id: "training", label: "Training", icon: Dumbbell },
    { id: "voeding", label: "Voeding", icon: UtensilsCrossed },
  ]

  return (
    <div className="space-y-4">
      {/* Sub-tab navigation */}
      <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
              activeSubTab === tab.id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
            {tab.badge && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold bg-evotion-primary text-white rounded-full min-w-[18px]">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Sub-tab content */}
      {activeSubTab === "checkins" && (
        <CheckInsTab
          clientId={clientId}
          weeklyCheckIns={weeklyCheckIns}
          dailyCheckIns={dailyCheckIns}
          weeklyCheckInDay={weeklyCheckInDay}
          clientTemplateAssignments={clientTemplateAssignments}
          coachTemplates={coachTemplates}
          onDataRefresh={onDataRefresh}
        />
      )}

      {activeSubTab === "training" && (
        <TrainingTab
          clientId={clientId}
          workouts={workouts}
          clientPrograms={clientPrograms}
          onDataRefresh={onDataRefresh}
        />
      )}

      {activeSubTab === "voeding" && (
        <NutritionTab
          clientId={clientId}
          nutritionTargets={nutritionTargets}
          foodLogs={foodLogs}
          clientAssignments={clientAssignments}
          supplements={supplements}
          targetHistory={targetHistory}
          onDataRefresh={onDataRefresh}
        />
      )}
    </div>
  )
}
