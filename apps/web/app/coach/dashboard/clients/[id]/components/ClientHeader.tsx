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
    <div className="flex flex-col gap-3">
      {/* Back link */}
      <Link
        href="/coach/dashboard/clients"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Clients
      </Link>

      {/* Approval Banner - Compact top bar */}
      {clientApprovalStatus === "pending" && (
        <div className="flex items-center justify-between gap-3 bg-amber-50/80 border border-amber-200/50 rounded-lg px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span className="text-sm text-amber-800 font-medium">Wacht op goedkeuring</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {showRejectInput ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Reden..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="px-2.5 py-1.5 text-xs border border-destructive/30 rounded-md bg-background text-foreground focus:ring-1 focus:ring-destructive/20 outline-none w-32"
                />
                <button
                  onClick={handleReject}
                  disabled={approvalLoading}
                  className="px-3 py-1.5 text-xs bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 disabled:opacity-50 transition font-medium"
                >
                  Bevestig
                </button>
                <button
                  onClick={() => { setShowRejectInput(false); setRejectReason("") }}
                  className="p-1 text-muted-foreground hover:text-foreground transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowRejectInput(true)}
                  disabled={approvalLoading}
                  className="px-3 py-1.5 text-xs border border-destructive/30 text-destructive rounded-md hover:bg-destructive/5 disabled:opacity-50 transition font-medium"
                >
                  Afwijzen
                </button>
                <button
                  onClick={onApprove}
                  disabled={approvalLoading}
                  className="px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 transition font-medium"
                >
                  Goedkeuren
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {clientApprovalStatus === "rejected" && (
        <div className="flex items-center justify-between gap-3 bg-destructive/5 border border-destructive/15 rounded-lg px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <X className="w-4 h-4 text-destructive flex-shrink-0" />
            <span className="text-sm text-destructive font-medium">Client afgewezen</span>
          </div>
          <button
            onClick={onApprove}
            disabled={approvalLoading}
            className="px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 transition font-medium flex-shrink-0"
          >
            Alsnog goedkeuren
          </button>
        </div>
      )}

      {/* Compact Client Header - Avatar + Name + Stats on one row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        {/* Left: Avatar + Name + Badge */}
        <div className="flex items-center gap-3.5 flex-shrink-0">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt=""
              className="w-12 h-12 rounded-full object-cover ring-2 ring-evotion-secondary/40 ring-offset-1 ring-offset-background"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-evotion-primary flex items-center justify-center text-lg font-bold text-white ring-2 ring-evotion-secondary/40 ring-offset-1 ring-offset-background">
              {(clientName[0] || "C").toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg font-bold text-foreground tracking-tight truncate">{clientName}</h1>
              {lastActive && (
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium flex-shrink-0 ${
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
                    ? "Actief"
                    : `${daysSinceActive}d`}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">{client.email}</p>
          </div>
        </div>

        {/* Right: Inline stat pills */}
        <div className="flex items-center gap-1.5 flex-wrap sm:ml-auto">
          <StatPill icon={Timer} label="wk" value={weeksSinceJoined} />
          <StatPill
            icon={Scale}
            label="kg"
            value={latestWeight ?? "\u2014"}
            suffix={
              weightDiff && Number(weightDiff) !== 0 ? (
                <span className={`text-[10px] font-semibold ${Number(weightDiff) < 0 ? "text-emerald-600" : "text-amber-600"}`}>
                  {Number(weightDiff) > 0 ? "+" : ""}{weightDiff}
                </span>
              ) : undefined
            }
            trailing={
              weightDiff && Number(weightDiff) !== 0
                ? Number(weightDiff) < 0
                  ? <TrendingDown className="h-3 w-3 text-emerald-500" />
                  : <TrendingUp className="h-3 w-3 text-amber-500" />
                : undefined
            }
          />
          <StatPill
            icon={Flame}
            label="d"
            value={streak}
            iconClassName={streak > 0 ? "text-orange-500" : undefined}
          />
          <StatPill
            icon={CalendarCheck}
            label="/30"
            value={dailyCompliance}
            valueClassName={complianceColor(dailyCompliance, 30)}
            iconClassName={complianceColor(dailyCompliance, 30)}
          />
          <StatPill
            icon={Target}
            label=""
            value={activeGoalsCount}
            iconClassName={activeGoalsCount > 0 ? "text-evotion-primary" : undefined}
          />
        </div>
      </div>
    </div>
  )
}

/* Reusable inline stat pill */
function StatPill({
  icon: Icon,
  label,
  value,
  suffix,
  trailing,
  iconClassName,
  valueClassName,
}: {
  icon: any
  label: string
  value: string | number
  suffix?: React.ReactNode
  trailing?: React.ReactNode
  iconClassName?: string
  valueClassName?: string
}) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/60 border border-border/50">
      <Icon className={`h-3.5 w-3.5 ${iconClassName || "text-muted-foreground"}`} />
      <span className={`text-sm font-bold tabular-nums leading-none ${valueClassName || "text-foreground"}`}>
        {value}
      </span>
      {label && <span className="text-[10px] text-muted-foreground font-medium">{label}</span>}
      {suffix}
      {trailing}
    </div>
  )
}
