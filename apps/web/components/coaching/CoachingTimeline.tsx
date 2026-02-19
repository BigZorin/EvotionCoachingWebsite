"use client"

import { useState, useEffect } from "react"
import {
  Dumbbell, UtensilsCrossed, Heart, Lightbulb, Pill,
  ChevronDown, ChevronRight, Clock, Sparkles, User, Cpu, Filter,
  Trash2, Loader2
} from "lucide-react"
import { getCoachingTimeline, deleteCoachingEvent, type CoachingEvent, type CoachingArea } from "@/app/actions/coaching-events"

interface CoachingTimelineProps {
  clientId: string
  maxItems?: number
}

const AREA_CONFIG: Record<string, { icon: any; color: string; dot: string; label: string }> = {
  training: { icon: Dumbbell, color: "text-indigo-600", dot: "bg-indigo-500", label: "Training" },
  nutrition: { icon: UtensilsCrossed, color: "text-orange-600", dot: "bg-orange-500", label: "Voeding" },
  supplements: { icon: Pill, color: "text-emerald-600", dot: "bg-emerald-500", label: "Supplementen" },
  recovery: { icon: Heart, color: "text-blue-600", dot: "bg-blue-500", label: "Herstel" },
  general: { icon: Lightbulb, color: "text-purple-600", dot: "bg-purple-500", label: "Algemeen" },
}

const SOURCE_BADGES: Record<string, { label: string; bg: string; text: string }> = {
  manual: { label: "Handmatig", bg: "bg-gray-100", text: "text-gray-600" },
  ai: { label: "AI", bg: "bg-violet-100", text: "text-violet-700" },
  ai_applied: { label: "AI Toegepast", bg: "bg-amber-100", text: "text-amber-700" },
  system: { label: "Systeem", bg: "bg-blue-100", text: "text-blue-700" },
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffDays === 0) return "Vandaag"
  if (diffDays === 1) return "Gisteren"
  if (diffDays < 7) return `${diffDays} dagen geleden`

  return d.toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined })
}

function EventCard({ event, onDelete }: { event: CoachingEvent; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const areaConf = AREA_CONFIG[event.area] || AREA_CONFIG.general
  const sourceBadge = SOURCE_BADGES[event.source] || SOURCE_BADGES.manual
  const Icon = areaConf.icon
  const hasDetails = event.description || (event.event_data && Object.keys(event.event_data).length > 0)

  return (
    <div className="relative flex gap-3 group">
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full ${areaConf.dot} ring-2 ring-white shrink-0 mt-1.5`} />
        <div className="w-px flex-1 bg-gray-200 min-h-4" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-4 min-w-0">
        <div
          className={`rounded-lg border p-3 transition ${hasDetails ? "cursor-pointer hover:border-gray-300" : ""}`}
          onClick={() => hasDetails && setExpanded(!expanded)}
        >
          {/* Top row: date + source badge + delete */}
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-3 h-3 text-gray-300" />
            <span className="text-[10px] text-gray-400">{formatDate(event.created_at)}</span>
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${sourceBadge.bg} ${sourceBadge.text}`}>
              {sourceBadge.label}
            </span>
            <span className={`text-[10px] font-medium ${areaConf.color} uppercase`}>
              {areaConf.label}
            </span>
            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (deleting) return
                setDeleting(true)
                deleteCoachingEvent(event.id).then(() => onDelete(event.id)).finally(() => setDeleting(false))
              }}
              className="ml-auto opacity-0 group-hover:opacity-100 transition text-gray-300 hover:text-red-400"
            >
              {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
            </button>
          </div>

          {/* Title */}
          <div className="flex items-start gap-2">
            <Icon className={`w-4 h-4 mt-0.5 ${areaConf.color} shrink-0`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{event.title}</p>
              {hasDetails && (
                <div className="flex items-center gap-1 mt-0.5">
                  {expanded ? <ChevronDown className="w-3 h-3 text-gray-400" /> : <ChevronRight className="w-3 h-3 text-gray-400" />}
                  <span className="text-[10px] text-gray-400">{expanded ? "Verberg details" : "Toon details"}</span>
                </div>
              )}
            </div>
          </div>

          {/* Expanded details */}
          {expanded && (
            <div className="mt-2 pt-2 border-t border-gray-100 space-y-1.5">
              {event.description && (
                <p className="text-xs text-gray-600">{event.description}</p>
              )}
              {event.event_data && Object.keys(event.event_data).length > 0 && (
                <div className="text-xs text-gray-500 bg-gray-50 rounded p-2 space-y-0.5">
                  {Object.entries(event.event_data).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <span className="font-medium text-gray-600 capitalize">{key.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}:</span>
                      <span>{typeof value === "object" ? JSON.stringify(value) : String(value)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CoachingTimeline({ clientId, maxItems = 20 }: CoachingTimelineProps) {
  const [events, setEvents] = useState<CoachingEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [limit, setLimit] = useState(maxItems)

  useEffect(() => {
    loadEvents()
  }, [clientId, activeFilter])

  async function loadEvents() {
    setLoading(true)
    const res = await getCoachingTimeline(clientId, {
      limit,
      area: activeFilter === "all" ? undefined : activeFilter,
    })
    if (res.success && res.events) {
      setEvents(res.events)
    }
    setLoading(false)
  }

  function handleDelete(eventId: string) {
    setEvents((prev) => prev.filter((e) => e.id !== eventId))
  }

  const filters: Array<{ key: string; label: string }> = [
    { key: "all", label: "Alle" },
    { key: "training", label: "Training" },
    { key: "nutrition", label: "Voeding" },
    { key: "supplements", label: "Supplementen" },
    { key: "recovery", label: "Herstel" },
  ]

  return (
    <div className="bg-white rounded-xl border">
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#1e1839]" />
          <h3 className="text-sm font-semibold text-gray-900">Coaching Timeline</h3>
          {events.length > 0 && (
            <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{events.length}</span>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-2 border-b flex items-center gap-1.5 overflow-x-auto">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap transition ${
              activeFilter === f.key
                ? "bg-[#1e1839] text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-gray-300" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-8 h-8 text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Nog geen coaching events</p>
            <p className="text-xs text-gray-300 mt-1">Events verschijnen hier wanneer je AI-voorstellen toepast of handmatige aanpassingen maakt</p>
          </div>
        ) : (
          <>
            {events.map((event) => (
              <EventCard key={event.id} event={event} onDelete={handleDelete} />
            ))}
            {events.length >= limit && (
              <button
                onClick={() => {
                  setLimit((prev) => prev + 20)
                  loadEvents()
                }}
                className="w-full text-center py-2 text-xs font-medium text-gray-400 hover:text-gray-600 transition"
              >
                Meer laden...
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
