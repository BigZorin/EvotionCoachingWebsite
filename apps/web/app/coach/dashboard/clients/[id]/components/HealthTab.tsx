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
    <div className="space-y-4">
      {/* Row 1: Weight + Last check-in snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Weight */}
        <div className="lg:col-span-3 bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-foreground/5 flex items-center justify-center">
                <Scale className="h-3.5 w-3.5 text-foreground" />
              </div>
              <span className="text-sm font-semibold text-foreground">Gewicht</span>
            </div>
            {weightChange !== null && (
              <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${weightChange < 0 ? "text-emerald-700 bg-emerald-50" : weightChange > 0 ? "text-red-600 bg-red-50" : "text-muted-foreground bg-muted"}`}>
                {weightChange < 0 ? <TrendingDown className="h-3 w-3" /> : weightChange > 0 ? <TrendingUp className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                {weightChange > 0 ? "+" : ""}{weightChange.toFixed(1)} kg
              </span>
            )}
          </div>
          {weightPoints.length < 2 ? (
            <div className="text-center py-6">
              <Scale className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Onvoldoende data voor gewichtsgrafiek</p>
            </div>
          ) : (
            <div className="flex items-center gap-5">
              <div className="flex-shrink-0 text-center">
                <p className="text-2xl font-bold text-foreground">{latestWeight?.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">kg nu</p>
              </div>
              <div className="flex-1 min-w-0">
                <MiniSVGLine data={weightPoints.map(d => d.weight)} height={52} color="var(--foreground)" labels={[fmtDate(weightPoints[0].date), fmtDate(weightPoints[weightPoints.length-1].date)]} tooltips={weightPoints.map(d => `${fmtDate(d.date)}: ${d.weight.toFixed(1)} kg`)} />
              </div>
              <div className="flex-shrink-0 text-center">
                <p className="text-base font-medium text-muted-foreground">{firstWeight?.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">kg start</p>
              </div>
            </div>
          )}
        </div>

        {/* Snapshot */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
          <p className="text-sm font-semibold text-foreground mb-3">Laatste check-in</p>
          <div className="space-y-2.5">
            <BarRow icon={<Moon className="h-3.5 w-3.5 text-violet-500" />} label="Slaap" value={sleepHistory[sleepHistory.length-1]?.value ?? null} color="#8b5cf6" />
            <BarRow icon={<Smile className="h-3.5 w-3.5 text-amber-500" />} label="Stemming" value={(moodHistory[moodHistory.length-1] || feelingHistory[feelingHistory.length-1])?.value ?? null} color="#f59e0b" />
            <BarRow icon={<AlertTriangle className="h-3.5 w-3.5 text-red-400" />} label="Stress" value={stressHistory[stressHistory.length-1]?.value ?? null} color="#ef4444" inverted />
            <BarRow icon={<Zap className="h-3.5 w-3.5 text-amber-400" />} label="Energie" value={energyHistory[energyHistory.length-1]?.value ?? null} color="#f59e0b" />
          </div>
        </div>
      </div>

      {/* Row 2: Welzijnstrends */}
      {hasCheckInMetrics && (
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-foreground/5 flex items-center justify-center">
              <Brain className="h-3.5 w-3.5 text-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">Welzijnstrends</span>
            <span className="text-xs text-muted-foreground ml-1">(check-ins)</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {sleepHistory.length > 1 && <SparkCard title="Slaap" icon={<Moon className="h-3.5 w-3.5 text-violet-500" />} data={sleepHistory} color="#8b5cf6" max={10} />}
            {(moodHistory.length > 1 || feelingHistory.length > 1) && <SparkCard title="Stemming" icon={<Smile className="h-3.5 w-3.5 text-amber-500" />} data={moodHistory.length > 1 ? moodHistory : feelingHistory} color="#f59e0b" max={10} />}
            {stressHistory.length > 1 && <SparkCard title="Stress" icon={<AlertTriangle className="h-3.5 w-3.5 text-red-400" />} data={stressHistory} color="#ef4444" max={10} />}
            {energyHistory.length > 1 && <SparkCard title="Energie" icon={<Zap className="h-3.5 w-3.5 text-amber-400" />} data={energyHistory} color="#f59e0b" max={10} />}
          </div>
        </div>
      )}

      {/* Row 3: Wearable */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-foreground/5 flex items-center justify-center">
              <Activity className="h-3.5 w-3.5 text-foreground" />
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <WearableStat icon={<Footprints className="h-3.5 w-3.5 text-blue-600" />} label="Stappen" value={todaySteps > 0 ? todaySteps.toLocaleString("nl-NL") : "\u2014"} />
          <WearableStat icon={<Moon className="h-3.5 w-3.5 text-violet-600" />} label="Slaap" value={todaySleep > 0 ? `${todaySleep.toFixed(1)}u` : "\u2014"} />
          <WearableStat icon={<Heart className="h-3.5 w-3.5 text-red-500" />} label="Hartslag" value={todayHR > 0 ? `${Math.round(todayHR)} bpm` : "\u2014"} />
          <WearableStat icon={<Flame className="h-3.5 w-3.5 text-orange-500" />} label="Calorieën" value={todayCalories > 0 ? `${Math.round(todayCalories)} kcal` : "\u2014"} />
        </div>

        {/* Trends */}
        {loadingExtended ? (
          <div className="flex justify-center py-6"><div className="animate-spin rounded-full h-5 w-5 border-2 border-foreground/20 border-t-foreground" /></div>
        ) : extendedData.length === 0 ? (
          <div className="text-center py-6">
            <Activity className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Geen wearable data beschikbaar</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stepData.length > 0 && <MiniBar title="Stappen" data={stepData} high="#3b82f6" low="#bfdbfe" fmt={v => v.toLocaleString("nl-NL")} />}
            {wearableSleepData.length > 0 && <MiniBar title="Slaap" data={wearableSleepData} high="#8b5cf6" low="#ddd6fe" fmt={v => v.toFixed(1) + "u"} />}
            {heartData.length > 0 && <MiniBar title="Hartslag" data={heartData} high="#ef4444" low="#fecaca" fmt={v => Math.round(v) + " bpm"} />}
            {calorieData.length > 0 && <MiniBar title="Calorieën" data={calorieData} high="#f97316" low="#fed7aa" fmt={v => Math.round(v) + " kcal"} />}
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
    <div className="flex items-center gap-2.5">
      {icon}
      <span className="text-xs text-muted-foreground w-16">{label}</span>
      <div className="flex-1 bg-muted rounded-full h-2">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className={`text-xs font-semibold w-6 text-right ${value == null ? "text-muted-foreground/40" : bad ? "text-red-500" : good ? "text-emerald-600" : "text-foreground"}`}>{value ?? "\u2014"}</span>
    </div>
  )
}

function SparkCard({ title, icon, data, color, max }: { title: string; icon: React.ReactNode; data: { date: string; value: number }[]; color: string; max: number }) {
  const avg = data.reduce((s, d) => s + d.value, 0) / data.length
  const latest = data[data.length - 1]?.value
  return (
    <div className="bg-muted/50 rounded-lg p-3">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">{icon}<span className="text-xs font-medium text-foreground">{title}</span></div>
        <span className="text-xs text-muted-foreground font-medium">{latest}/{max}</span>
      </div>
      <MiniSVGLine data={data.map(d => d.value)} height={32} color={color} maxVal={max} tooltips={data.map(d => `${fmtDate(d.date)}: ${d.value}`)} />
      <p className="text-xs text-muted-foreground mt-1">Gem: {avg.toFixed(1)}</p>
    </div>
  )
}

function WearableStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-muted/50 rounded-lg px-3 py-2.5">
      <div className="flex items-center gap-1.5 mb-1">{icon}<span className="text-xs text-muted-foreground">{label}</span></div>
      <p className="text-sm font-bold text-foreground">{value}</p>
    </div>
  )
}

function MiniBar({ title, data, high, low, fmt }: { title: string; data: HealthDataRecord[]; high: string; low: string; fmt: (v: number) => string }) {
  const maxV = Math.max(...data.map(d => d.value), 1)
  const avg = data.reduce((s, d) => s + d.value, 0) / data.length
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-foreground">{title}</span>
        <span className="text-xs text-muted-foreground">~{fmt(avg)}</span>
      </div>
      <div className="flex items-end gap-px h-10">
        {data.map((d, i) => (
          <div
            key={d.id || i}
            className="flex-1 rounded-t transition-all hover:opacity-80 cursor-default"
            style={{ height: `${Math.max((d.value / maxV) * 100, 5)}%`, background: d.value / maxV > 0.6 ? high : low }}
            title={`${fmtDate(d.date)}: ${fmt(d.value)}`}
          />
        ))}
      </div>
    </div>
  )
}

function MiniSVGLine({ data, height, color, maxVal, labels, tooltips }: { data: number[]; height: number; color: string; maxVal?: number; labels?: [string, string]; tooltips?: string[] }) {
  if (data.length < 2) return null
  const w = 200
  const h = height
  const pad = 4
  const min = maxVal ? 0 : Math.min(...data) - 0.5
  const max = maxVal || Math.max(...data) + 0.5
  const range = max - min || 1
  const pts = data.map((v, i) => ({ x: pad + (i / (data.length - 1)) * (w - pad * 2), y: pad + (h - pad * 2) - ((v - min) / range) * (h - pad * 2) }))
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join("")
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
        <path d={`${line}L${pts[pts.length-1].x},${h-pad}L${pts[0].x},${h-pad}Z`} fill={color} fillOpacity={0.06} />
        <path d={line} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        {pts.length <= 20 && pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2} fill={color} className="cursor-default">
            {tooltips?.[i] && <title>{tooltips[i]}</title>}
          </circle>
        ))}
      </svg>
      {labels && (
        <div className="flex justify-between mt-0.5"><span className="text-xs text-muted-foreground">{labels[0]}</span><span className="text-xs text-muted-foreground">{labels[1]}</span></div>
      )}
    </div>
  )
}
