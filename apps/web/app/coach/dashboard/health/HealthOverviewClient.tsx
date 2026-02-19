"use client"

import { useState, useEffect } from "react"
import {
  Activity,
  Heart,
  Moon,
  Flame,
  Footprints,
  Wifi,
  WifiOff,
} from "lucide-react"
import {
  getClientsHealthOverview,
  getClientHealthData,
  type ClientHealthSummary,
  type HealthDataRecord,
} from "@/app/actions/health-data"

export default function HealthOverviewClient() {
  const [clients, setClients] = useState<ClientHealthSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedClient, setSelectedClient] = useState<string | null>(null)
  const [clientData, setClientData] = useState<HealthDataRecord[]>([])
  const [dataLoading, setDataLoading] = useState(false)

  useEffect(() => {
    loadOverview()
  }, [])

  async function loadOverview() {
    setLoading(true)
    const result = await getClientsHealthOverview()
    if (result.success && result.clients) {
      setClients(result.clients)
    }
    setLoading(false)
  }

  async function openClientDetail(clientId: string) {
    setSelectedClient(clientId)
    setDataLoading(true)
    const result = await getClientHealthData(clientId, 30)
    if (result.success && result.data) {
      setClientData(result.data)
    }
    setDataLoading(false)
  }

  const connectedClients = clients.filter((c) => c.has_wearable)
  const selectedClientInfo = clients.find((c) => c.client_id === selectedClient)

  // Group client data by type for charts
  const stepData = clientData.filter((d) => d.data_type === "steps")
  const sleepData = clientData.filter((d) => d.data_type === "sleep_hours")
  const heartData = clientData.filter((d) => d.data_type === "heart_rate_avg")
  const calorieData = clientData.filter((d) => d.data_type === "active_calories")

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e1839]" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gezondheidsdata</h1>
        <p className="text-sm text-gray-500 mt-1">
          Wearable data van je clients (stappen, slaap, hartslag, calorieën)
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
          <p className="text-xs text-gray-500">Totaal clients</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{connectedClients.length}</p>
          <p className="text-xs text-gray-500">Met wearable</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {connectedClients.length > 0
              ? Math.round(
                  connectedClients.reduce((s, c) => s + c.today_steps, 0) /
                    connectedClients.length
                ).toLocaleString("nl-NL")
              : "—"}
          </p>
          <p className="text-xs text-gray-500">Gem. stappen vandaag</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">
            {connectedClients.length > 0
              ? (
                  connectedClients.reduce((s, c) => s + c.today_sleep, 0) /
                  connectedClients.length
                ).toFixed(1) + "u"
              : "—"}
          </p>
          <p className="text-xs text-gray-500">Gem. slaap vandaag</p>
        </div>
      </div>

      {/* Client detail panel */}
      {selectedClient && selectedClientInfo && (
        <div className="bg-white rounded-xl border shadow-sm mb-6 overflow-hidden">
          <div className="px-5 py-4 border-b bg-gray-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1e1839] flex items-center justify-center text-white font-bold">
                {selectedClientInfo.client_name[0]?.toUpperCase() || "C"}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {selectedClientInfo.client_name}
                </p>
                <p className="text-xs text-gray-500">Laatste 30 dagen</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedClient(null)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Sluiten
            </button>
          </div>

          {dataLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1e1839]" />
            </div>
          ) : clientData.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Nog geen gezondheidsdata beschikbaar
            </div>
          ) : (
            <div className="p-5 space-y-6">
              {/* Steps */}
              {stepData.length > 0 && (
                <DataSection
                  title="Stappen"
                  icon={<Footprints className="h-4 w-4 text-blue-600" />}
                  data={stepData}
                  color="blue"
                  unit=""
                  formatter={(v) => v.toLocaleString("nl-NL")}
                />
              )}

              {/* Sleep */}
              {sleepData.length > 0 && (
                <DataSection
                  title="Slaap"
                  icon={<Moon className="h-4 w-4 text-purple-600" />}
                  data={sleepData}
                  color="purple"
                  unit="u"
                  formatter={(v) => v.toFixed(1)}
                />
              )}

              {/* Heart Rate */}
              {heartData.length > 0 && (
                <DataSection
                  title="Gemiddelde hartslag"
                  icon={<Heart className="h-4 w-4 text-red-500" />}
                  data={heartData}
                  color="red"
                  unit=" bpm"
                  formatter={(v) => Math.round(v).toString()}
                />
              )}

              {/* Active Calories */}
              {calorieData.length > 0 && (
                <DataSection
                  title="Actieve calorieën"
                  icon={<Flame className="h-4 w-4 text-orange-500" />}
                  data={calorieData}
                  color="orange"
                  unit=" kcal"
                  formatter={(v) => Math.round(v).toString()}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* Client list */}
      {connectedClients.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Geen wearable data
          </h3>
          <p className="text-sm text-gray-500">
            Zodra clients een wearable koppelen verschijnt hun gezondheidsdata hier.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {clients.map((client) => (
            <div
              key={client.client_id}
              onClick={() =>
                client.has_wearable && openClientDetail(client.client_id)
              }
              className={`bg-white rounded-xl border shadow-sm overflow-hidden transition ${
                client.has_wearable
                  ? "hover:shadow-md cursor-pointer"
                  : "opacity-60"
              } ${
                selectedClient === client.client_id
                  ? "ring-2 ring-[#1e1839]"
                  : ""
              }`}
            >
              <div className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1e1839] flex items-center justify-center text-white text-sm font-bold">
                    {client.client_name[0]?.toUpperCase() || "C"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">
                        {client.client_name}
                      </p>
                      {client.has_wearable ? (
                        <Wifi className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <WifiOff className="h-3.5 w-3.5 text-gray-300" />
                      )}
                    </div>
                    {client.has_wearable && client.last_sync && (
                      <p className="text-xs text-gray-400">
                        Laatst gesynchroniseerd:{" "}
                        {new Date(client.last_sync).toLocaleDateString("nl-NL", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                </div>

                {client.has_wearable && (
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">
                        {client.today_steps > 0
                          ? client.today_steps.toLocaleString("nl-NL")
                          : "—"}
                      </p>
                      <p className="text-[10px] text-gray-400">Stappen</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">
                        {client.today_sleep > 0
                          ? `${client.today_sleep.toFixed(1)}u`
                          : "—"}
                      </p>
                      <p className="text-[10px] text-gray-400">Slaap</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">
                        {client.today_heart_rate > 0
                          ? `${Math.round(client.today_heart_rate)}`
                          : "—"}
                      </p>
                      <p className="text-[10px] text-gray-400">BPM</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">
                        {client.today_calories > 0
                          ? `${Math.round(client.today_calories)}`
                          : "—"}
                      </p>
                      <p className="text-[10px] text-gray-400">kcal</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Simple data section with sparkline-like bar chart
function DataSection({
  title,
  icon,
  data,
  color,
  unit,
  formatter,
}: {
  title: string
  icon: React.ReactNode
  data: HealthDataRecord[]
  color: string
  unit: string
  formatter: (v: number) => string
}) {
  const maxVal = Math.max(...data.map((d) => d.value), 1)
  const avg =
    data.length > 0
      ? data.reduce((sum, d) => sum + d.value, 0) / data.length
      : 0

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
        </div>
        <span className="text-sm text-gray-500">
          Gem: {formatter(avg)}{unit}
        </span>
      </div>
      <div className="flex items-end gap-1 h-16">
        {data.slice(-14).map((d, i) => (
          <div
            key={d.id || i}
            className="flex-1 rounded-t-sm transition-all"
            style={{
              height: `${Math.max((d.value / maxVal) * 100, 4)}%`,
              backgroundColor: `var(--color-${color}-${
                d.value / maxVal > 0.7 ? 500 : 300
              }, #93c5fd)`,
              background:
                color === "blue"
                  ? d.value / maxVal > 0.7 ? "#3b82f6" : "#93c5fd"
                  : color === "purple"
                  ? d.value / maxVal > 0.7 ? "#8b5cf6" : "#c4b5fd"
                  : color === "red"
                  ? d.value / maxVal > 0.7 ? "#ef4444" : "#fca5a5"
                  : d.value / maxVal > 0.7 ? "#f97316" : "#fdba74",
            }}
            title={`${d.date}: ${formatter(d.value)}${unit}`}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-gray-400">
          {data.length > 0 ? data[Math.max(data.length - 14, 0)]?.date : ""}
        </span>
        <span className="text-[10px] text-gray-400">
          {data.length > 0 ? data[data.length - 1]?.date : ""}
        </span>
      </div>
    </div>
  )
}
