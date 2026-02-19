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
  const isCompact = variant === "compact"

  return (
    <>
      <div className={`bg-evotion-primary rounded-xl ${isCompact ? "p-3" : "p-5"} flex items-center justify-between`}>
        <div className={`flex items-center ${isCompact ? "gap-2" : "gap-3"}`}>
          {!isCompact && (
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              {icon || <Sparkles className="w-5 h-5 text-white" />}
            </div>
          )}
          {isCompact && (icon || <Sparkles className="w-4 h-4 text-white flex-shrink-0" />)}
          <div>
            <h3 className={`${isCompact ? "text-xs" : "text-sm"} font-semibold text-white`}>{title}</h3>
            <p className={`${isCompact ? "text-xs" : "text-xs"} text-white/60 mt-0.5`}>{description}</p>
          </div>
        </div>
        <button
          onClick={onGenerate}
          disabled={loading}
          className={`flex items-center ${isCompact ? "gap-1.5 px-3 py-1.5 text-xs" : "gap-2 px-4 py-2.5 text-sm"} font-medium text-evotion-primary bg-white rounded-lg hover:bg-white/90 transition disabled:opacity-50 flex-shrink-0`}
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
        <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3 text-sm text-destructive flex items-center justify-between">
          <span>{error}</span>
          <button onClick={onDismissError} className="text-destructive/60 hover:text-destructive">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {loading && (
        <div className="bg-card rounded-xl border border-border p-6 animate-pulse">
          <div className="h-4 bg-secondary rounded w-2/5 mb-4" />
          <div className="space-y-3">
            <div className="h-3 bg-secondary rounded w-full" />
            <div className="h-3 bg-secondary rounded w-4/5" />
            <div className="h-3 bg-secondary rounded w-3/5" />
          </div>
          <div className="mt-4 text-xs text-muted-foreground text-center">AI analyseert data...</div>
        </div>
      )}
    </>
  )
}
