"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Clock, X, Mail, Calendar } from "lucide-react"

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
  weeksSinceJoined,
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

  // Activity color
  const activityColor = daysSinceActive !== null && daysSinceActive < 1
    ? "bg-emerald-500"
    : daysSinceActive !== null && daysSinceActive < 7
    ? "bg-amber-500"
    : "bg-muted-foreground/30"

  const activityLabel = daysSinceActive !== null && daysSinceActive < 1
    ? "Actief vandaag"
    : daysSinceActive !== null
    ? `${daysSinceActive}d geleden actief`
    : "Onbekend"

  return (
    <div className="flex flex-col gap-3">
      {/* Back */}
      <Link
        href="/coach/dashboard/clients"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Clients
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
                <button onClick={handleReject} disabled={approvalLoading} className="px-3 py-1.5 text-xs bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 disabled:opacity-50 transition font-medium">
                  Bevestig
                </button>
                <button onClick={() => { setShowRejectInput(false); setRejectReason("") }} className="p-1 text-muted-foreground hover:text-foreground transition">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                <button onClick={() => setShowRejectInput(true)} disabled={approvalLoading} className="px-3 py-1.5 text-xs border border-destructive/30 text-destructive rounded-md hover:bg-destructive/5 disabled:opacity-50 transition font-medium">
                  Afwijzen
                </button>
                <button onClick={onApprove} disabled={approvalLoading} className="px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 transition font-medium">
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
          <button onClick={onApprove} disabled={approvalLoading} className="px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 transition font-medium flex-shrink-0">
            Alsnog goedkeuren
          </button>
        </div>
      )}

      {/* Client Identity */}
      <div className="flex items-center gap-4">
        {/* Avatar with activity dot */}
        <div className="relative flex-shrink-0">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt=""
              className="w-14 h-14 rounded-full object-cover ring-2 ring-border ring-offset-2 ring-offset-background"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-evotion-primary flex items-center justify-center text-xl font-bold text-white ring-2 ring-border ring-offset-2 ring-offset-background">
              {(clientName[0] || "C").toUpperCase()}
            </div>
          )}
          <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-[2.5px] border-background ${activityColor}`} />
        </div>

        {/* Name + meta */}
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold text-foreground tracking-tight truncate">{clientName}</h1>
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
    </div>
  )
}
