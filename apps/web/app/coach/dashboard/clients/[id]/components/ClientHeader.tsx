"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Clock, X, Check } from "lucide-react"

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
                    onClick={onApprove}
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
              onClick={onApprove}
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
          <div className="px-4 py-3 text-center"><p className="text-[10px] text-gray-400 uppercase tracking-wider">Gewicht</p><p className="text-lg font-bold text-gray-900">{latestWeight ? `${latestWeight} kg` : "\u2014"}</p>{weightDiff && <p className={`text-[10px] ${Number(weightDiff) < 0 ? "text-green-600" : "text-orange-500"}`}>{Number(weightDiff) > 0 ? "+" : ""}{weightDiff} kg</p>}</div>
          <div className="px-4 py-3 text-center"><p className="text-[10px] text-gray-400 uppercase tracking-wider">Streak</p><p className="text-lg font-bold text-gray-900">{streak}d</p></div>
          <div className="px-4 py-3 text-center"><p className="text-[10px] text-gray-400 uppercase tracking-wider">Compliance</p><p className="text-lg font-bold text-gray-900">{dailyCompliance}/30</p></div>
          <div className="px-4 py-3 text-center"><p className="text-[10px] text-gray-400 uppercase tracking-wider">Doelen</p><p className="text-lg font-bold text-gray-900">{activeGoalsCount} actief</p></div>
        </div>
      </div>
    </>
  )
}
