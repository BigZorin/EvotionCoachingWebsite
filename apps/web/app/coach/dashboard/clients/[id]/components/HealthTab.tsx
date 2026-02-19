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
    <div className="space-y-3">
      {/* Row 1: Weight compact + Last check-in snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
        {/* Weight - takes 3 cols */}
        <div className="lg:col-span-3 bg-white rounded-xl border shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Scale className="h-4 w-4 text-[#1e1839]" />
              <span className="text-xs font-semibold text-gray-900">Gewicht</span>
            </div>
            {weightChange !== null && (
              <span className={`flex items-center gap-0.5 text-[11px] font-medium ${weightChange < 0 ? "text-green-600" : weightChange > 0 ? "text-red-500" : "text-gray-500"}`}>
                {weightChange < 0 ? <TrendingDown className="h-3 w-3" /> : weightChange > 0 ? <TrendingUp className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                {weightChange > 0 ? "+" : ""}{weightChange.toFixed(1)} kg
              </span>
            )}
          </div>
          {weightPoints.length < 2 ? (
            <p className="text-xs text-gray-400 py-2">Onvoldoende data</p>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 text-center">
                <p className="text-lg font-bold text-gray-900">{latestWeight?.toFixed(1)}</p>
                <p className="text-[9px] text-gray-400">kg nu</p>
              </div>
              <div className="flex-1 min-w-0">
                <MiniSVGLine data={weightPoints.map(d => d.weight)} height={48} color="#1e1839" labels={[fmtDate(weightPoints[0].date), fmtDate(weightPoints[weightPoints.length-1].date)]} />
              </div>
              <div className="flex-shrink-0 text-center">
                <p className="text-sm font-medium text-gray-600">{firstWeight?.toFixed(1)}</p>
                <p className="text-[9px] text-gray-400">kg start</p>
              </div>
            </div>
          )}
        </div>

        {/* Snapshot - takes 2 cols */}
        <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm p-4">
          <p className="text-xs font-semibold text-gray-900 mb-2">Laatste check-in</p>
          <div className="space-y-2">
            <BarRow icon={<Moon className="h-3 w-3 text-purple-500" />} label="Slaap" value={sleepHistory[sleepHistory.length-1]?.value ?? null} color="#8b5cf6" />
            <BarRow icon={<Smile className="h-3 w-3 text-amber-500" />} label="Stemming" value={(moodHistory[moodHistory.length-1] || feelingHistory[feelingHistory.length-1])?.value ?? null} color="#f59e0b" />
            <BarRow icon={<AlertTriangle className="h-3 w-3 text-red-400" />} label="Stress" value={stressHistory[stressHistory.length-1]?.value ?? null} color="#ef4444" inverted />
            <BarRow icon={<Zap className="h-3 w-3 text-yellow-500" />} label="Energie" value={energyHistory[energyHistory.length-1]?.value ?? null} color="#eab308" />
          </div>
        </div>
      </div>

      {/* Row 2: Welzijnstrends - compact 4-col sparklines */}
      {hasCheckInMetrics && (
        <div className="bg-white rounded-xl border shadow-sm p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <Brain className="h-4 w-4 text-[#1e1839]" />
            <span className="text-xs font-semibold text-gray-900">Welzijnstrends</span>
            <span className="text-[10px] text-gray-400">(check-ins)</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {sleepHistory.length > 1 && <SparkCard title="Slaap" icon={<Moon className="h-3 w-3 text-purple-500" />} data={sleepHistory} color="#8b5cf6" max={10} />}
            {(moodHistory.length > 1 || feelingHistory.length > 1) && <SparkCard title="Stemming" icon={<Smile className="h-3 w-3 text-amber-500" />} data={moodHistory.length > 1 ? moodHistory : feelingHistory} color="#f59e0b" max={10} />}
            {stressHistory.length > 1 && <SparkCard title="Stress" icon={<AlertTriangle className="h-3 w-3 text-red-400" />} data={stressHistory} color="#ef4444" max={10} />}
            {energyHistory.length > 1 && <SparkCard title="Energie" icon={<Zap className="h-3 w-3 text-yellow-500" />} data={energyHistory} color="#eab308" max={10} />}
          </div>
        </div>
      )}

      {/* Row 3: Wearable - compact */}
      <div className="bg-white rounded-xl border shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-[#1e1839]" />
            <span className="text-xs font-semibold text-gray-900">Wearable</span>
            {healthData?.isConnected ? (
              <span className="flex items-center gap-0.5 text-[10px] text-green-600"><Wifi className="h-2.5 w-2.5" /> Verbonden</span>
            ) : (
              <span className="flex items-center gap-0.5 text-[10px] text-gray-400"><WifiOff className="h-2.5 w-2.5" /> Niet verbonden</span>
            )}
          </div>
          <div className="flex gap-0.5 bg-gray-100 p-0.5 rounded">
            {(["14", "30"] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)} className={`px-2 py-0.5 text-[10px] font-medium rounded transition ${period === p ? "bg-white text-gray-900 shadow-sm" : "text-gray-400"}`}>{p}d</button>
            ))}
          </div>
        </div>

        {/* Today row */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          <Stat icon={<Footprints className="h-3 w-3 text-blue-600" />} label="Stappen" value={todaySteps > 0 ? todaySteps.toLocaleString("nl-NL") : "—"} />
          <Stat icon={<Moon className="h-3 w-3 text-purple-600" />} label="Slaap" value={todaySleep > 0 ? `${todaySleep.toFixed(1)}u` : "—"} />
          <Stat icon={<Heart className="h-3 w-3 text-red-500" />} label="Hartslag" value={todayHR > 0 ? `${Math.round(todayHR)}` : "—"} />
          <Stat icon={<Flame className="h-3 w-3 text-orange-500" />} label="Calorieën" value={todayCalories > 0 ? `${Math.round(todayCalories)}` : "—"} />
        </div>

        {/* Trends */}
        {loadingExtended ? (
          <div className="flex justify-center py-4"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1e1839]" /></div>
        ) : extendedData.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-3">Geen wearable data beschikbaar</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stepData.length > 0 && <MiniBar title="Stappen" data={stepData} high="#3b82f6" low="#bfdbfe" fmt={v => v.toLocaleString("nl-NL")} />}
            {wearableSleepData.length > 0 && <MiniBar title="Slaap" data={wearableSleepData} high="#8b5cf6" low="#ddd6fe" fmt={v => v.toFixed(1) + "u"} />}
            {heartData.length > 0 && <MiniBar title="Hartslag" data={heartData} high="#ef4444" low="#fecaca" fmt={v => Math.round(v) + " bpm"} />}
            {calorieData.length > 0 && <MiniBar title="Calorieën" data={calorieData} high="#f97316" low="#fed7aa" fmt={v => Math.round(v) + ""} />}
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

// ─── Tiny Components ────────────────────────────────────────

function BarRow({ icon, label, value, color, inverted }: { icon: React.ReactNode; label: string; value: number | null; color: string; inverted?: boolean }) {
  const pct = value != null ? (value / 10) * 100 : 0
  const bad = inverted ? (value != null && value >= 7) : (value != null && value <= 3)
  const good = inverted ? (value != null && value <= 3) : (value != null && value >= 7)
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-[11px] text-gray-600 w-16">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-1.5"><div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} /></div>
      <span className={`text-[11px] font-medium w-5 text-right ${value == null ? "text-gray-300" : bad ? "text-red-500" : good ? "text-green-600" : "text-gray-700"}`}>{value ?? "—"}</span>
    </div>
  )
}

function SparkCard({ title, icon, data, color, max }: { title: string; icon: React.ReactNode; data: { date: string; value: number }[]; color: string; max: number }) {
  const avg = data.reduce((s, d) => s + d.value, 0) / data.length
  const latest = data[data.length - 1]?.value
  return (
    <div className="bg-gray-50 rounded-lg p-2.5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1">{icon}<span className="text-[11px] font-medium text-gray-700">{title}</span></div>
        <span className="text-[10px] text-gray-400">{latest}/{max}</span>
      </div>
      <MiniSVGLine data={data.map(d => d.value)} height={28} color={color} maxVal={max} />
      <p className="text-[9px] text-gray-400 mt-0.5">Gem: {avg.toFixed(1)}</p>
    </div>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg px-2.5 py-2">
      <div className="flex items-center gap-1 mb-0.5">{icon}<span className="text-[10px] text-gray-500">{label}</span></div>
      <p className="text-sm font-bold text-gray-900">{value}</p>
    </div>
  )
}

function MiniBar({ title, data, high, low, fmt }: { title: string; data: HealthDataRecord[]; high: string; low: string; fmt: (v: number) => string }) {
  const maxV = Math.max(...data.map(d => d.value), 1)
  const avg = data.reduce((s, d) => s + d.value, 0) / data.length
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-medium text-gray-700">{title}</span>
        <span className="text-[9px] text-gray-400">~{fmt(avg)}</span>
      </div>
      <div className="flex items-end gap-px h-8">
        {data.map((d, i) => (
          <div key={d.id || i} className="flex-1 rounded-t-[1px]" style={{ height: `${Math.max((d.value / maxV) * 100, 5)}%`, background: d.value / maxV > 0.6 ? high : low }} title={`${fmtDate(d.date)}: ${fmt(d.value)}`} />
        ))}
      </div>
    </div>
  )
}

// Pure SVG sparkline — no axis labels, just the line
function MiniSVGLine({ data, height, color, maxVal, labels }: { data: number[]; height: number; color: string; maxVal?: number; labels?: [string, string] }) {
  if (data.length < 2) return null
  const w = 200
  const h = height
  const pad = 2
  const min = maxVal ? 0 : Math.min(...data) - 0.5
  const max = maxVal || Math.max(...data) + 0.5
  const range = max - min || 1
  const pts = data.map((v, i) => ({ x: pad + (i / (data.length - 1)) * (w - pad * 2), y: pad + (h - pad * 2) - ((v - min) / range) * (h - pad * 2) }))
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join("")
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
        <path d={`${line}L${pts[pts.length-1].x},${h-pad}L${pts[0].x},${h-pad}Z`} fill={color} fillOpacity={0.08} />
        <path d={line} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        {pts.length <= 15 && pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={1.5} fill={color} />)}
      </svg>
      {labels && (
        <div className="flex justify-between"><span className="text-[8px] text-gray-400">{labels[0]}</span><span className="text-[8px] text-gray-400">{labels[1]}</span></div>
      )}
    </div>
  )
}
