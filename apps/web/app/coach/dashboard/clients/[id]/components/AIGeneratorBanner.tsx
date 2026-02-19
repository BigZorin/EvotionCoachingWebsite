"use client"

import { Sparkles, X, Loader2 } from "lucide-react"
import type { ReactNode } from "react"

interface AIGeneratorBannerProps {
  title: string
  description: string
  buttonLabel: string
  loadingLabel?: string
  loading: boolean
  error: string | null
  onGenerate: () => void
  onDismissError: () => void
  variant?: "primary" | "secondary" | "compact"
  icon?: ReactNode
}

export default function AIGeneratorBanner({
  title,
  description,
  buttonLabel,
  loadingLabel,
  loading,
  error,
  onGenerate,
  onDismissError,
  variant = "primary",
  icon,
}: AIGeneratorBannerProps) {
  const bgClass =
    variant === "primary"
      ? "bg-gradient-to-r from-[#1e1839] to-[#2a2050]"
      : variant === "secondary"
      ? "bg-gradient-to-r from-[#1e1839]/80 to-[#2a2050]/80"
      : "bg-gradient-to-r from-[#1e1839] to-[#2a2050]"

  const isCompact = variant === "compact"

  return (
    <>
      <div className={`${bgClass} rounded-xl ${isCompact ? "p-3" : "p-4"} flex items-center justify-between`}>
        <div className="flex items-center gap-${isCompact ? '2' : '3'}">
          {!isCompact && (
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              {icon || <Sparkles className="w-5 h-5 text-white" />}
            </div>
          )}
          {isCompact && (icon || <Sparkles className="w-4 h-4 text-white" />)}
          <div>
            <h3 className={`${isCompact ? "text-xs" : "text-sm"} font-semibold text-white`}>{title}</h3>
            <p className={`${isCompact ? "text-[10px]" : "text-xs"} text-white/60`}>{description}</p>
          </div>
        </div>
        <button
          onClick={onGenerate}
          disabled={loading}
          className={`flex items-center gap-${isCompact ? '1.5' : '2'} ${isCompact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"} font-medium text-[#1e1839] bg-white rounded-lg hover:bg-gray-100 transition disabled:opacity-50`}
        >
          {loading ? (
            <Loader2 className={`${isCompact ? "w-3 h-3" : "w-4 h-4"} animate-spin`} />
          ) : (
            <Sparkles className={`${isCompact ? "w-3 h-3" : "w-4 h-4"}`} />
          )}
          {loading ? (loadingLabel || "Laden...") : buttonLabel}
        </button>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={onDismissError} className="text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {loading && (
        <div className="bg-white rounded-xl border p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-2/5 mb-4" />
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-4/5" />
            <div className="h-3 bg-gray-200 rounded w-3/5" />
          </div>
          <div className="mt-4 text-xs text-gray-400 text-center">AI analyseert data...</div>
        </div>
      )}
    </>
  )
}
