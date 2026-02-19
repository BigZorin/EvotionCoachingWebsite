"use client"

import Link from "next/link"
import { useState } from "react"
import {
  ArrowLeft,
  Clock,
  X,
  Scale,
  Flame,
  CalendarCheck,
  Target,
  Timer,
  TrendingDown,
  TrendingUp,
} from "lucide-react"

interface ClientHeaderProps {
  client: any
  profile: any
  clientName: string
  latestWeight: number | null
  weightDiff: string | null
  weeksSinceJoined: number
  streak: number
  dailyCompliance: number
  activeGoalsCount: number
  clientApprovalStatus: string | null
  approvalLoading: boolean
  onApprove: () => void
  onReject: (reason?: string) => void
}

function complianceColor(value: number, total: number) {
  const pct = total > 0 ? (value / total) * 100 : 0
  if (pct >= 75) return "text-emerald-600"
  if (pct >= 50) return "text-amber-600"
  return "text-destructive"
}

export default function ClientHeader({
  client,
  profile,
  clientName,
  latestWeight,
  weightDiff,
  weeksSinceJoined,
  streak,
  dailyCompliance,
  activeGoalsCount,
  clientApprovalStatus,
  approvalLoading,
  onApprove,
  onReject,
}: ClientHeaderProps) {
  const [showRejectInput, setShowRejectInput] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  const lastActive = client.last_sign_in_at ? new Date(client.last_sign_in_at) : null
  const daysSinceActive = lastActive ? Math.floor((Date.now() - lastActive.getTime()) / 86400000) : null

  const handleReject = () => {
    onReject(rejectReason || undefined)
    setShowRejectInput(false)
    setRejectReason("")
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Back link */}
      <Link
        href="/coach/dashboard/clients"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Terug naar clients
      </Link>

      {/* Approval Banner */}
      {clientApprovalStatus === "pending" && (
        <div className="bg-evotion-primary/[0.03] border border-evotion-primary/15 rounded-xl p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-evotion-primary/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-evotion-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Wacht op goedkeuring</h3>
                <p className="text-xs text-muted-foreground">Deze client heeft de intake ingevuld en wacht op toegang tot de app.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {showRejectInput ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Reden (optioneel)..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="px-3 py-2 text-sm border border-destructive/30 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-destructive/20 outline-none w-48"
                  />
                  <button
                    onClick={handleReject}
                    disabled={approvalLoading}
                    className="px-4 py-2 text-sm bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 disabled:opacity-50 transition"
                  >
                    Bevestig
                  </button>
                  <button
                    onClick={() => { setShowRejectInput(false); setRejectReason("") }}
                    className="p-2 text-muted-foreground hover:text-foreground transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setShowRejectInput(true)}
                    disabled={approvalLoading}
                    className="px-4 py-2 text-sm border border-destructive/30 text-destructive rounded-lg hover:bg-destructive/5 disabled:opacity-50 transition"
                  >
                    Afwijzen
                  </button>
                  <button
                    onClick={onApprove}
                    disabled={approvalLoading}
                    className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition"
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
        <div className="bg-destructive/5 border border-destructive/15 rounded-xl p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
                <X className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Client afgewezen</h3>
                <p className="text-xs text-muted-foreground">Deze client heeft geen toegang tot de app.</p>
              </div>
            </div>
            <button
              onClick={onApprove}
              disabled={approvalLoading}
              className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition flex-shrink-0"
            >
              Alsnog goedkeuren
            </button>
          </div>
        </div>
      )}

      {/* Client Header Card */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {/* Top section: avatar, name, activity badge */}
        <div className="p-6 pb-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Avatar with gradient ring */}
              <div className="relative flex-shrink-0">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt=""
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-[3px] ring-evotion-secondary/40 ring-offset-2 ring-offset-card"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-evotion-primary flex items-center justify-center text-2xl sm:text-3xl font-bold text-white ring-[3px] ring-evotion-secondary/40 ring-offset-2 ring-offset-card">
                    {(clientName[0] || "C").toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">{clientName}</h1>
                  {lastActive && (
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                      daysSinceActive !== null && daysSinceActive < 1
                        ? "bg-emerald-50 text-emerald-700"
                        : daysSinceActive !== null && daysSinceActive < 7
                        ? "bg-amber-50 text-amber-700"
                        : "bg-destructive/10 text-destructive"
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        daysSinceActive !== null && daysSinceActive < 1
                          ? "bg-emerald-500"
                          : daysSinceActive !== null && daysSinceActive < 7
                          ? "bg-amber-500"
                          : "bg-destructive"
                      }`} />
                      {daysSinceActive !== null && daysSinceActive < 1
                        ? "Vandaag actief"
                        : `${daysSinceActive}d geleden`}
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{client.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-border bg-muted/30">
          <div className="grid grid-cols-2 sm:grid-cols-5">
            {/* Weken */}
            <div className="px-4 py-4 flex items-center gap-3 border-b sm:border-b-0 sm:border-r border-border">
              <div className="p-2 rounded-lg bg-secondary flex-shrink-0">
                <Timer className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground leading-none">{weeksSinceJoined}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Weken</p>
              </div>
            </div>

            {/* Gewicht */}
            <div className="px-4 py-4 flex items-center gap-3 border-b sm:border-b-0 sm:border-r border-border">
              <div className="p-2 rounded-lg bg-secondary flex-shrink-0">
                <Scale className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-lg font-bold text-foreground leading-none">
                    {latestWeight ? `${latestWeight}` : "\u2014"}
                  </p>
                  {latestWeight && <span className="text-xs text-muted-foreground">kg</span>}
                  {weightDiff && Number(weightDiff) !== 0 && (
                    Number(weightDiff) < 0 ? (
                      <TrendingDown className="h-3.5 w-3.5 text-emerald-500 ml-0.5" />
                    ) : (
                      <TrendingUp className="h-3.5 w-3.5 text-amber-500 ml-0.5" />
                    )
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Gewicht</p>
                  {weightDiff && Number(weightDiff) !== 0 && (
                    <span className={`text-[10px] font-medium mt-0.5 ${Number(weightDiff) < 0 ? "text-emerald-600" : "text-amber-600"}`}>
                      ({Number(weightDiff) > 0 ? "+" : ""}{weightDiff})
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Streak */}
            <div className="px-4 py-4 flex items-center gap-3 sm:border-r border-border">
              <div className="p-2 rounded-lg bg-secondary flex-shrink-0">
                <Flame className={`h-4 w-4 ${streak > 0 ? "text-orange-500" : "text-muted-foreground"}`} />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground leading-none">{streak}<span className="text-xs text-muted-foreground font-normal ml-0.5">d</span></p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Streak</p>
              </div>
            </div>

            {/* Compliance */}
            <div className="px-4 py-4 flex items-center gap-3 sm:border-r border-border">
              <div className="p-2 rounded-lg bg-secondary flex-shrink-0">
                <CalendarCheck className={`h-4 w-4 ${complianceColor(dailyCompliance, 30)}`} />
              </div>
              <div>
                <p className={`text-lg font-bold leading-none ${complianceColor(dailyCompliance, 30)}`}>
                  {dailyCompliance}<span className="text-xs text-muted-foreground font-normal">/30</span>
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Compliance</p>
              </div>
            </div>

            {/* Doelen */}
            <div className="px-4 py-4 flex items-center gap-3 col-span-2 sm:col-span-1 border-t sm:border-t-0 border-border">
              <div className="p-2 rounded-lg bg-secondary flex-shrink-0">
                <Target className={`h-4 w-4 ${activeGoalsCount > 0 ? "text-evotion-primary" : "text-muted-foreground"}`} />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground leading-none">{activeGoalsCount}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Doelen actief</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
