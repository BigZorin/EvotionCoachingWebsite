"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Clock, X, Check, TrendingDown, TrendingUp } from "lucide-react"

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

  const handleReject = () => {
    onReject(rejectReason || undefined)
    setShowRejectInput(false)
    setRejectReason("")
  }

  return (
    <>
      <Link href="/coach/dashboard/clients" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
        <ArrowLeft className="w-4 h-4" /> Terug naar clients
      </Link>

      {/* Approval Banner */}
      {clientApprovalStatus === "pending" && (
        <div className="bg-evotion-primary/5 border border-evotion-primary/20 rounded-xl p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-evotion-primary/10 flex items-center justify-center flex-shrink-0">
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
                    className="p-2 text-muted-foreground hover:text-foreground"
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
        <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
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

      {/* Client Header */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover ring-2 ring-border" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-evotion-primary flex items-center justify-center text-2xl font-bold text-white ring-2 ring-evotion-primary/20">
                {(clientName[0] || "C").toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-foreground">{clientName}</h1>
              <p className="text-sm text-muted-foreground">{client.email}</p>
            </div>
          </div>
          {lastActive && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
              (Date.now() - lastActive.getTime()) < 86400000 ? "bg-emerald-50 text-emerald-700" :
              (Date.now() - lastActive.getTime()) < 7 * 86400000 ? "bg-amber-50 text-amber-700" : "bg-destructive/10 text-destructive"
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                (Date.now() - lastActive.getTime()) < 86400000 ? "bg-emerald-500" :
                (Date.now() - lastActive.getTime()) < 7 * 86400000 ? "bg-amber-500" : "bg-destructive"
              }`} />
              {(Date.now() - lastActive.getTime()) < 86400000 ? "Vandaag actief" : `${Math.floor((Date.now() - lastActive.getTime()) / 86400000)}d geleden`}
            </div>
          )}
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 border-t border-border">
          {[
            { label: "Weken", value: String(weeksSinceJoined), sub: null },
            { label: "Gewicht", value: latestWeight ? `${latestWeight} kg` : "\u2014", sub: weightDiff },
            { label: "Streak", value: `${streak}d`, sub: null },
            { label: "Compliance", value: `${dailyCompliance}/30`, sub: null },
            { label: "Doelen", value: `${activeGoalsCount} actief`, sub: null },
          ].map((stat, i) => (
            <div key={stat.label} className={`px-5 py-4 text-center ${i > 0 ? "border-l border-border" : ""} ${i >= 2 ? "hidden sm:block" : ""}`}>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
              {stat.sub && (
                <p className={`text-xs mt-0.5 ${Number(stat.sub) < 0 ? "text-emerald-600" : "text-amber-600"}`}>
                  {Number(stat.sub) > 0 ? "+" : ""}{stat.sub} kg
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
