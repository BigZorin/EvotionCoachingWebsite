"use client"

import { useState, useEffect } from "react"
import {
  Activity, Heart, Moon, Flame, Footprints, Brain,
  Wifi, WifiOff, Scale, TrendingDown, TrendingUp, Minus,
  Smile, Zap, AlertTriangle,
} from "lucide-react"
import { getClientHealthData, type HealthDataRecord } from "@/app/actions/health-data"
import type { CheckIn, DailyCheckIn } from "@/app/actions/admin-clients"

interface HealthTabProps {
  clientId: string
  healthData: {
    todayData: HealthDataRecord[]
    historyData: HealthDataRecord[]
    isConnected: boolean
    lastSync: string | null
  } | null
  weeklyCheckIns: CheckIn[]
  dailyCheckIns: DailyCheckIn[]
}

export default function HealthTab({ clientId, healthData, weeklyCheckIns, dailyCheckIns }: HealthTabProps) {
  const [extendedData, setExtendedData] = useState<HealthDataRecord[]>([])
  const [loadingExtended, setLoadingExtended] = useState(false)
  const [period, setPeriod] = useState<"14" | "30">("30")

  useEffect(() => {
    loadExtendedData()
  }, [clientId, period])

  async function loadExtendedData() {
    setLoadingExtended(true)
    const result = await getClientHealthData(clientId, parseInt(period))
    if (result.success && result.data) setExtendedData(result.data)
    setLoadingExtended(false)
  }

  const weightPoints = getWeightHistory(weeklyCheckIns, dailyCheckIns)
  const latestWeight = weightPoints.length > 0 ? weightPoints[weightPoints.length - 1].weight : null
  const firstWeight = weightPoints.length > 0 ? weightPoints[0].weight : null
  const weightChange = latestWeight && firstWeight ? latestWeight - firstWeight : null

  const sleepHistory = getCheckInMetric(weeklyCheckIns, dailyCheckIns, "sleep_quality")
  const moodHistory = getCheckInMetric(weeklyCheckIns, dailyCheckIns, "mood")
  const stressHistory = getCheckInMetric(weeklyCheckIns, dailyCheckIns, "stress_level")
  const energyHistory = getCheckInMetric(weeklyCheckIns, dailyCheckIns, "energy_level")
  const feelingHistory = getCheckInMetric(weeklyCheckIns, dailyCheckIns, "feeling")

  const todaySteps = healthData?.todayData?.find(d => d.data_type === "steps")?.value || 0
  const todaySleep = healthData?.todayData?.find(d => d.data_type === "sleep_hours")?.value || 0
  const todayHR = healthData?.todayData?.find(d => d.data_type === "heart_rate_avg")?.value || 0
  const todayCalories = healthData?.todayData?.find(d => d.data_type === "active_calories")?.value || 0

  const stepData = extendedData.filter(d => d.data_type === "steps")
  const wearableSleepData = extendedData.filter(d => d.data_type === "sleep_hours")
  const heartData = extendedData.filter(d => d.data_type === "heart_rate_avg")
  const calorieData = extendedData.filter(d => d.data_type === "active_calories")

  const hasCheckInMetrics = sleepHistory.length > 0 || moodHistory.length > 0 || stressHistory.length > 0 || energyHistory.length > 0

  return (
    <div className="space-y-5">

      {/* ── Weight Section ── */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-secondary">
              <Scale className="h-4 w-4 text-muted-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">Gewicht</span>
          </div>
          {weightChange !== null && (
            <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
              weightChange < 0 ? "text-emerald-700 bg-emerald-50" : weightChange > 0 ? "text-red-600 bg-red-50" : "text-muted-foreground bg-muted"
            }`}>
              {weightChange < 0 ? <TrendingDown className="h-3 w-3" /> : weightChange > 0 ? <TrendingUp className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
              {weightChange > 0 ? "+" : ""}{weightChange.toFixed(1)} kg
            </span>
          )}
        </div>

        {weightPoints.length < 2 ? (
          <div className="text-center py-10">
            <Scale className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Onvoldoende data voor gewichtsgrafiek</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Minimaal 2 metingen nodig</p>
          </div>
        ) : (
          <div>
            {/* Big stats */}
            <div className="flex items-baseline gap-6 mb-4">
              <div>
                <p className="text-3xl font-bold text-foreground tabular-nums">{latestWeight?.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">kg huidig</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-medium text-muted-foreground tabular-nums">{firstWeight?.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">kg start</p>
              </div>
            </div>
            {/* Area chart */}
            <AreaChart data={weightPoints.map(p => ({ date: p.date, value: p.weight }))} height={160} color="var(--evotion-primary, #1e1839)" unit="kg" />
          </div>
        )}
      </div>

      {/* ── Last Check-in Snapshot ── */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
        <p className="text-sm font-semibold text-foreground mb-4">Laatste check-in snapshot</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MetricGauge icon={<Moon className="h-4 w-4 text-violet-500" />} label="Slaap" value={sleepHistory[sleepHistory.length - 1]?.value ?? null} max={10} color="#8b5cf6" />
          <MetricGauge icon={<Smile className="h-4 w-4 text-amber-500" />} label="Stemming" value={(moodHistory[moodHistory.length - 1] || feelingHistory[feelingHistory.length - 1])?.value ?? null} max={10} color="#f59e0b" />
          <MetricGauge icon={<AlertTriangle className="h-4 w-4 text-red-400" />} label="Stress" value={stressHistory[stressHistory.length - 1]?.value ?? null} max={10} color="#ef4444" inverted />
          <MetricGauge icon={<Zap className="h-4 w-4 text-amber-400" />} label="Energie" value={energyHistory[energyHistory.length - 1]?.value ?? null} max={10} color="#f59e0b" />
        </div>
      </div>

      {/* ── Wellbeing Trends ── */}
      {hasCheckInMetrics && (
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-2 rounded-lg bg-violet-50">
              <Brain className="h-4 w-4 text-violet-600" />
            </div>
            <span className="text-sm font-semibold text-foreground">Welzijnstrends</span>
            <span className="text-xs text-muted-foreground">(check-ins)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {sleepHistory.length > 1 && (
              <TrendCard title="Slaap" icon={<Moon className="h-3.5 w-3.5 text-violet-500" />} data={sleepHistory} color="#8b5cf6" max={10} />
            )}
            {(moodHistory.length > 1 || feelingHistory.length > 1) && (
              <TrendCard title="Stemming" icon={<Smile className="h-3.5 w-3.5 text-amber-500" />} data={moodHistory.length > 1 ? moodHistory : feelingHistory} color="#f59e0b" max={10} />
            )}
            {stressHistory.length > 1 && (
              <TrendCard title="Stress" icon={<AlertTriangle className="h-3.5 w-3.5 text-red-400" />} data={stressHistory} color="#ef4444" max={10} />
            )}
            {energyHistory.length > 1 && (
              <TrendCard title="Energie" icon={<Zap className="h-3.5 w-3.5 text-amber-400" />} data={energyHistory} color="#f59e0b" max={10} />
            )}
          </div>
        </div>
      )}

      {/* ── Wearable ── */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50">
              <Activity className="h-4 w-4 text-emerald-600" />
            </div>
            <span className="text-sm font-semibold text-foreground">Wearable</span>
            {healthData?.isConnected ? (
              <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full"><Wifi className="h-3 w-3" /> Verbonden</span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full"><WifiOff className="h-3 w-3" /> Niet verbonden</span>
            )}
          </div>
          <div className="flex gap-1 bg-muted p-1 rounded-lg">
            {(["14", "30"] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)} className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${period === p ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{p}d</button>
            ))}
          </div>
        </div>

        {/* Today stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <WearableStat icon={<Footprints className="h-4 w-4 text-blue-600" />} label="Stappen" value={todaySteps > 0 ? todaySteps.toLocaleString("nl-NL") : "\u2014"} bgColor="bg-blue-50" />
          <WearableStat icon={<Moon className="h-4 w-4 text-violet-600" />} label="Slaap" value={todaySleep > 0 ? `${todaySleep.toFixed(1)}u` : "\u2014"} bgColor="bg-violet-50" />
          <WearableStat icon={<Heart className="h-4 w-4 text-red-500" />} label="Hartslag" value={todayHR > 0 ? `${Math.round(todayHR)} bpm` : "\u2014"} bgColor="bg-red-50" />
          <WearableStat icon={<Flame className="h-4 w-4 text-orange-500" />} label="Calorieën" value={todayCalories > 0 ? `${Math.round(todayCalories)} kcal` : "\u2014"} bgColor="bg-orange-50" />
        </div>

        {/* Trends */}
        {loadingExtended ? (
          <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-6 w-6 border-2 border-foreground/20 border-t-foreground" /></div>
        ) : extendedData.length === 0 ? (
          <div className="text-center py-10">
            <Activity className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Geen wearable data beschikbaar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {stepData.length > 0 && <BarChart title="Stappen" data={stepData} color="#3b82f6" fmt={v => v.toLocaleString("nl-NL")} />}
            {wearableSleepData.length > 0 && <BarChart title="Slaap" data={wearableSleepData} color="#8b5cf6" fmt={v => v.toFixed(1) + "u"} />}
            {heartData.length > 0 && <BarChart title="Hartslag" data={heartData} color="#ef4444" fmt={v => Math.round(v) + " bpm"} />}
            {calorieData.length > 0 && <BarChart title="Calorieën" data={calorieData} color="#f97316" fmt={v => Math.round(v) + " kcal"} />}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Helpers ────────────────────────────────────────────────

function getWeightHistory(weekly: CheckIn[], daily: DailyCheckIn[]) {
  const map = new Map<string, number>()
  for (const ci of weekly) { if (ci.weight) map.set((ci as any).check_in_date || new Date(ci.created_at).toISOString().split("T")[0], ci.weight) }
  for (const ci of daily) { if (ci.weight) map.set(ci.check_in_date, ci.weight) }
  return Array.from(map.entries()).map(([date, weight]) => ({ date, weight })).sort((a, b) => a.date.localeCompare(b.date))
}

function getCheckInMetric(weekly: CheckIn[], daily: DailyCheckIn[], field: string) {
  const map = new Map<string, number>()
  for (const ci of weekly) { const v = (ci as any)[field]; if (v != null) map.set((ci as any).check_in_date || new Date(ci.created_at).toISOString().split("T")[0], v) }
  for (const ci of daily) { const v = (ci as any)[field]; if (v != null) map.set(ci.check_in_date, v) }
  return Array.from(map.entries()).map(([date, value]) => ({ date, value })).sort((a, b) => a.date.localeCompare(b.date))
}

function fmtDate(d: string) { return new Date(d + "T00:00:00").toLocaleDateString("nl-NL", { day: "numeric", month: "short" }) }

// ─── Visual Components ──────────────────────────────────────

/* Circular gauge for snapshot values */
function MetricGauge({ icon, label, value, max, color, inverted }: {
  icon: React.ReactNode; label: string; value: number | null; max: number; color: string; inverted?: boolean
}) {
  const pct = value != null ? (value / max) * 100 : 0
  const size = 64
  const sw = 6
  const r = (size - sw) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  const isGood = inverted ? (value != null && value <= 3) : (value != null && value >= 7)
  const isBad = inverted ? (value != null && value >= 7) : (value != null && value <= 3)

  return (
    <div className="flex flex-col items-center gap-2 p-3 bg-muted/30 rounded-xl">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={sw} className="text-border" />
          {value != null && (
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-500" />
          )}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-bold tabular-nums ${value == null ? "text-muted-foreground/30" : isBad ? "text-red-500" : isGood ? "text-emerald-600" : "text-foreground"}`}>
            {value ?? "--"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
      </div>
    </div>
  )
}

/* Trend card with sparkline for wellbeing data */
function TrendCard({ title, icon, data, color, max }: {
  title: string; icon: React.ReactNode; data: { date: string; value: number }[]; color: string; max: number
}) {
  const avg = data.reduce((s, d) => s + d.value, 0) / data.length
  const latest = data[data.length - 1]?.value
  const prev = data.length > 1 ? data[data.length - 2]?.value : null
  const trend = latest != null && prev != null ? latest - prev : null

  return (
    <div className="bg-muted/30 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-semibold text-foreground">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-foreground tabular-nums">{latest}</span>
          <span className="text-xs text-muted-foreground">/{max}</span>
          {trend !== null && trend !== 0 && (
            <span className={`text-xs font-medium ${trend > 0 ? "text-emerald-600" : "text-red-500"}`}>
              {trend > 0 ? "+" : ""}{trend}
            </span>
          )}
        </div>
      </div>
      <AreaChart data={data.map(d => ({ date: d.date, value: d.value }))} height={64} color={color} unit="" maxVal={max} />
      <p className="text-xs text-muted-foreground mt-2">Gemiddeld: {avg.toFixed(1)}</p>
    </div>
  )
}

/* Wearable today stat */
function WearableStat({ icon, label, value, bgColor }: { icon: React.ReactNode; label: string; value: string; bgColor: string }) {
  return (
    <div className={`${bgColor} rounded-xl px-4 py-3`}>
      <div className="flex items-center gap-2 mb-1.5">{icon}<span className="text-xs text-muted-foreground font-medium">{label}</span></div>
      <p className="text-lg font-bold text-foreground tabular-nums">{value}</p>
    </div>
  )
}

/* Bar chart for wearable trends */
function BarChart({ title, data, color, fmt }: { title: string; data: HealthDataRecord[]; color: string; fmt: (v: number) => string }) {
  const maxV = Math.max(...data.map(d => d.value), 1)
  const avg = data.reduce((s, d) => s + d.value, 0) / data.length

  const w = 400
  const h = 80
  const pad = { top: 4, bottom: 4, left: 0, right: 0 }
  const barW = Math.max(2, (w - pad.left - pad.right) / data.length - 2)
  const innerH = h - pad.top - pad.bottom

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <span className="text-xs text-muted-foreground font-medium">gem. {fmt(avg)}</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 80 }}>
        {/* Average line */}
        <line
          x1={0} x2={w}
          y1={pad.top + innerH - (avg / maxV) * innerH}
          y2={pad.top + innerH - (avg / maxV) * innerH}
          stroke={color} strokeWidth={0.5} strokeDasharray="4 4" opacity={0.4}
        />
        {data.map((d, i) => {
          const barH = Math.max(2, (d.value / maxV) * innerH)
          const x = pad.left + i * ((w - pad.left - pad.right) / data.length) + 1
          const y = pad.top + innerH - barH
          const opacity = d.value / maxV > 0.5 ? 1 : 0.6
          return (
            <rect
              key={d.id || i}
              x={x} y={y}
              width={barW} height={barH}
              rx={2}
              fill={color} opacity={opacity}
              className="cursor-default hover:opacity-100 transition-opacity"
            >
              <title>{fmtDate(d.date)}: {fmt(d.value)}</title>
            </rect>
          )
        })}
      </svg>
    </div>
  )
}

/* Reusable area chart */
function AreaChart({ data, height, color, unit, maxVal }: {
  data: { date: string; value: number }[]; height: number; color: string; unit?: string; maxVal?: number
}) {
  if (data.length < 2) return null

  const w = 600
  const h = height
  const pad = { top: 8, right: 8, bottom: 20, left: unit ? 36 : 8 }
  const innerW = w - pad.left - pad.right
  const innerH = h - pad.top - pad.bottom

  const values = data.map(d => d.value)
  const minV = maxVal != null ? 0 : Math.min(...values) - 0.3
  const maxV = maxVal != null ? maxVal : Math.max(...values) + 0.3
  const rangeV = maxV - minV || 1

  const pts = data.map((d, i) => ({
    x: pad.left + (i / (data.length - 1)) * innerW,
    y: pad.top + innerH - ((d.value - minV) / rangeV) * innerH,
  }))

  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join("")
  const area = `${line}L${pts[pts.length - 1].x.toFixed(1)},${h - pad.bottom}L${pts[0].x.toFixed(1)},${h - pad.bottom}Z`

  const gradId = `grad-${Math.random().toString(36).slice(2, 8)}`

  // X labels
  const xIdxs = data.length > 4
    ? [0, Math.floor(data.length / 2), data.length - 1]
    : data.map((_, i) => i)

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid */}
      {unit && [minV, (minV + maxV) / 2, maxV].map((v, i) => {
        const y = pad.top + innerH - ((v - minV) / rangeV) * innerH
        return (
          <g key={i}>
            <line x1={pad.left} x2={w - pad.right} y1={y} y2={y} stroke="currentColor" strokeWidth={0.5} className="text-border" />
            <text x={pad.left - 4} y={y + 3} textAnchor="end" className="fill-muted-foreground" fontSize={9}>{v.toFixed(unit === "kg" ? 1 : 0)}</text>
          </g>
        )
      })}
      <path d={area} fill={`url(#${gradId})`} />
      <path d={line} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={pts.length <= 30 ? 3 : 0} fill={color} stroke="var(--background)" strokeWidth={2} className="cursor-default">
          <title>{fmtDate(data[i].date)}: {data[i].value.toFixed(1)}{unit ? ` ${unit}` : ""}</title>
        </circle>
      ))}
      {xIdxs.map(idx => (
        <text key={idx} x={pts[idx]?.x} y={h - 2} textAnchor="middle" className="fill-muted-foreground" fontSize={9}>
          {fmtDate(data[idx].date)}
        </text>
      ))}
    </svg>
  )
}
