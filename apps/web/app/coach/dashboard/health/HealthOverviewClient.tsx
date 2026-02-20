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
  Loader2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
          <Loader2 className="size-5 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">Gezondheidsdata</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Wearable data van je clients (stappen, slaap, hartslag, calorieën)
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{clients.length}</p>
            <p className="text-xs text-muted-foreground">Totaal clients</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{connectedClients.length}</p>
            <p className="text-xs text-muted-foreground">Met wearable</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {connectedClients.length > 0
                ? Math.round(
                    connectedClients.reduce((s, c) => s + c.today_steps, 0) /
                      connectedClients.length
                  ).toLocaleString("nl-NL")
                : "—"}
            </p>
            <p className="text-xs text-muted-foreground">Gem. stappen vandaag</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">
              {connectedClients.length > 0
                ? (
                    connectedClients.reduce((s, c) => s + c.today_sleep, 0) /
                    connectedClients.length
                  ).toFixed(1) + "u"
                : "—"}
            </p>
            <p className="text-xs text-muted-foreground">Gem. slaap vandaag</p>
          </CardContent>
        </Card>
      </div>

      {/* Client detail panel */}
      {selectedClient && selectedClientInfo && (
        <Card className="shadow-sm mb-6 overflow-hidden">
          <div className="px-5 py-4 border-b bg-secondary/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="size-10 border border-border">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
                  {selectedClientInfo.client_name[0]?.toUpperCase() || "C"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">
                  {selectedClientInfo.client_name}
                </p>
                <p className="text-xs text-muted-foreground">Laatste 30 dagen</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedClient(null)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Sluiten
            </button>
          </div>

          {dataLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-5 animate-spin" />
            </div>
          ) : clientData.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Nog geen gezondheidsdata beschikbaar
            </div>
          ) : (
            <CardContent className="p-5 space-y-6">
              {/* Steps */}
              {stepData.length > 0 && (
                <DataSection
                  title="Stappen"
                  icon={<Footprints className="size-4 text-blue-600" />}
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
                  icon={<Moon className="size-4 text-purple-600" />}
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
                  icon={<Heart className="size-4 text-red-500" />}
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
                  icon={<Flame className="size-4 text-orange-500" />}
                  data={calorieData}
                  color="orange"
                  unit=" kcal"
                  formatter={(v) => Math.round(v).toString()}
                />
              )}
            </CardContent>
          )}
        </Card>
      )}

      {/* Client list */}
      {connectedClients.length === 0 ? (
        <Card className="shadow-sm p-12 text-center">
          <Activity className="size-12 text-muted-foreground/40 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Geen wearable data
          </h3>
          <p className="text-sm text-muted-foreground">
            Zodra clients een wearable koppelen verschijnt hun gezondheidsdata hier.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {clients.map((client) => (
            <Card
              key={client.client_id}
              onClick={() =>
                client.has_wearable && openClientDetail(client.client_id)
              }
              className={`shadow-sm overflow-hidden transition ${
                client.has_wearable
                  ? "hover:border-primary/30 cursor-pointer"
                  : "opacity-60"
              } ${
                selectedClient === client.client_id
                  ? "ring-2 ring-primary"
                  : ""
              }`}
            >
              <CardContent className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10 border border-border">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
                      {client.client_name[0]?.toUpperCase() || "C"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">
                        {client.client_name}
                      </p>
                      {client.has_wearable ? (
                        <Wifi className="size-4 text-green-500" />
                      ) : (
                        <WifiOff className="size-4 text-muted-foreground/40" />
                      )}
                    </div>
                    {client.has_wearable && client.last_sync && (
                      <p className="text-xs text-muted-foreground">
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
                      <p className="font-semibold text-foreground">
                        {client.today_steps > 0
                          ? client.today_steps.toLocaleString("nl-NL")
                          : "—"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">Stappen</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground">
                        {client.today_sleep > 0
                          ? `${client.today_sleep.toFixed(1)}u`
                          : "—"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">Slaap</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground">
                        {client.today_heart_rate > 0
                          ? `${Math.round(client.today_heart_rate)}`
                          : "—"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">BPM</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground">
                        {client.today_calories > 0
                          ? `${Math.round(client.today_calories)}`
                          : "—"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">kcal</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
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
          <h4 className="text-sm font-semibold text-muted-foreground">{title}</h4>
        </div>
        <span className="text-sm text-muted-foreground">
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
        <span className="text-[10px] text-muted-foreground">
          {data.length > 0 ? data[Math.max(data.length - 14, 0)]?.date : ""}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {data.length > 0 ? data[data.length - 1]?.date : ""}
        </span>
      </div>
    </div>
  )
}
