"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Clock, X, Mail, Calendar, MessageCircle, Sparkles, Scale, Flame, TrendingDown, TrendingUp, Target } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

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

  const activityColor = daysSinceActive !== null && daysSinceActive < 1
    ? "bg-emerald-500"
    : daysSinceActive !== null && daysSinceActive < 7
    ? "bg-amber-500"
    : "bg-muted-foreground/30"

  const activityLabel = daysSinceActive !== null && daysSinceActive < 1
    ? "Actief vandaag"
    : daysSinceActive !== null
    ? `${daysSinceActive}d geleden`
    : "Onbekend"

  const initials = clientName
    ? clientName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "C"

  return (
    <div className="flex flex-col gap-4">
      {/* Back */}
      <Link
        href="/coach/dashboard/clients"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Terug naar cliënten
      </Link>

      {/* Approval Banner */}
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
                <Button size="sm" variant="destructive" onClick={handleReject} disabled={approvalLoading} className="h-7 text-xs">
                  Bevestig
                </Button>
                <button onClick={() => { setShowRejectInput(false); setRejectReason("") }} className="p-1 text-muted-foreground hover:text-foreground transition">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                <Button size="sm" variant="outline" onClick={() => setShowRejectInput(true)} disabled={approvalLoading} className="h-7 text-xs border-destructive/30 text-destructive hover:bg-destructive/5">
                  Afwijzen
                </Button>
                <Button size="sm" onClick={onApprove} disabled={approvalLoading} className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
                  Goedkeuren
                </Button>
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
          <Button size="sm" onClick={onApprove} disabled={approvalLoading} className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
            Alsnog goedkeuren
          </Button>
        </div>
      )}

      {/* Client Identity + Actions */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative flex-shrink-0">
            <Avatar className="size-14 ring-2 ring-border ring-offset-2 ring-offset-background">
              {profile?.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt={clientName} />
              ) : null}
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-[2.5px] border-background ${activityColor}`} />
          </div>

          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight truncate">{clientName}</h1>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 truncate">
                <Mail className="w-3 h-3 flex-shrink-0" />
                {client.email}
              </span>
              <span className="flex items-center gap-1 flex-shrink-0">
                <Calendar className="w-3 h-3" />
                {weeksSinceJoined}w lid
              </span>
              <span className="flex items-center gap-1 flex-shrink-0">
                <div className={`w-1.5 h-1.5 rounded-full ${activityColor}`} />
                {activityLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          <Button variant="outline" size="sm" asChild>
            <Link href="/coach/dashboard/messages">
              <MessageCircle className="size-4 mr-1.5" />
              Bericht
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick-stats strip */}
      <div className="flex flex-wrap items-center gap-4 rounded-lg bg-secondary/50 border px-4 py-3">
        {/* Weight */}
        <div className="flex items-center gap-2">
          <Scale className="size-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-semibold">
              {latestWeight ? `${latestWeight} kg` : "--"}
            </p>
            {weightDiff && (
              <div className="flex items-center gap-0.5 text-[10px]">
                {parseFloat(weightDiff) < 0 ? (
                  <TrendingDown className="size-3 text-emerald-500" />
                ) : parseFloat(weightDiff) > 0 ? (
                  <TrendingUp className="size-3 text-destructive" />
                ) : null}
                <span className="text-muted-foreground">{weightDiff} kg</span>
              </div>
            )}
          </div>
        </div>

        <div className="w-px h-8 bg-border" />

        {/* Compliance */}
        <div className="flex items-center gap-2">
          <div className="min-w-[80px]">
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-muted-foreground">Compliance (30d)</span>
              <span className="font-semibold">{dailyCompliance}</span>
            </div>
            <Progress value={Math.min(dailyCompliance * 3.3, 100)} className="h-1.5" />
          </div>
        </div>

        <div className="w-px h-8 bg-border" />

        {/* Streak */}
        <div className="flex items-center gap-1.5">
          <Flame className={`size-4 ${streak > 0 ? "text-orange-500" : "text-muted-foreground/30"}`} />
          <div>
            <p className="text-sm font-semibold">{streak}d</p>
            <p className="text-[10px] text-muted-foreground">Streak</p>
          </div>
        </div>

        <div className="w-px h-8 bg-border" />

        {/* Goals */}
        <div className="flex items-center gap-1.5">
          <Target className={`size-4 ${activeGoalsCount > 0 ? "text-primary" : "text-muted-foreground/30"}`} />
          <div>
            <p className="text-sm font-semibold">{activeGoalsCount}</p>
            <p className="text-[10px] text-muted-foreground">Doelen</p>
          </div>
        </div>
      </div>
    </div>
  )
}
