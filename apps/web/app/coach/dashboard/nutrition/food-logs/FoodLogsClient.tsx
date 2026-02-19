"use client"

import { useState, useEffect } from "react"
import {
  UtensilsCrossed,
  ChevronLeft,
  ChevronRight,
  Search,
  User,
} from "lucide-react"
import { getFoodLogs } from "@/app/actions/nutrition"

interface FoodLog {
  id: string
  user_id: string
  date: string
  meal_type: string
  food_name: string
  calories: number | null
  protein_grams: number | null
  carbs_grams: number | null
  fat_grams: number | null
  serving_size: number | null
  serving_unit: string | null
  number_of_servings: number | null
  source: string | null
  client_name?: string
}

const MEAL_LABELS: Record<string, string> = {
  BREAKFAST: "Ontbijt",
  LUNCH: "Lunch",
  DINNER: "Avondeten",
  SNACK: "Snack",
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function getToday() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
}

export default function FoodLogsClient() {
  const [logs, setLogs] = useState<FoodLog[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(getToday())
  const [search, setSearch] = useState("")

  useEffect(() => {
    loadLogs()
  }, [selectedDate])

  async function loadLogs() {
    setLoading(true)
    const result = await getFoodLogs(selectedDate)
    if (result.success && result.logs) {
      setLogs(result.logs)
    }
    setLoading(false)
  }

  const changeDate = (offset: number) => {
    const d = new Date(selectedDate + "T00:00:00")
    d.setDate(d.getDate() + offset)
    const newDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
    setSelectedDate(newDate)
  }

  // Group logs by client
  const clientGroups = logs.reduce<Record<string, FoodLog[]>>((acc, log) => {
    const name = log.client_name || "Onbekend"
    if (!acc[name]) acc[name] = []
    acc[name].push(log)
    return acc
  }, {})

  const filteredClients = search
    ? Object.entries(clientGroups).filter(([name]) =>
        name.toLowerCase().includes(search.toLowerCase())
      )
    : Object.entries(clientGroups)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Food Logs</h1>
        <p className="text-sm text-gray-500 mt-1">
          Voedingsregistraties van je clients
        </p>
      </div>

      {/* Date selector + search */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => changeDate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <span className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
            {formatDate(selectedDate)}
          </span>
          <button
            onClick={() => changeDate(1)}
            disabled={selectedDate === getToday()}
            className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Zoek client..."
            className="pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#1e1839]/20 focus:border-[#1e1839] outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e1839]"></div>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <UtensilsCrossed className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Geen logs gevonden
          </h3>
          <p className="text-sm text-gray-500">
            Er zijn geen voedingsregistraties voor deze datum
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredClients.map(([clientName, clientLogs]) => {
            const totalCals = clientLogs.reduce(
              (sum, l) =>
                sum + (l.calories || 0) * (l.number_of_servings || 1),
              0
            )
            const totalProtein = clientLogs.reduce(
              (sum, l) =>
                sum + (l.protein_grams || 0) * (l.number_of_servings || 1),
              0
            )
            const totalCarbs = clientLogs.reduce(
              (sum, l) =>
                sum + (l.carbs_grams || 0) * (l.number_of_servings || 1),
              0
            )
            const totalFat = clientLogs.reduce(
              (sum, l) =>
                sum + (l.fat_grams || 0) * (l.number_of_servings || 1),
              0
            )

            return (
              <div
                key={clientName}
                className="bg-white rounded-xl border shadow-sm overflow-hidden"
              >
                {/* Client header */}
                <div className="px-5 py-4 border-b bg-gray-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#1e1839] flex items-center justify-center text-white text-sm font-bold">
                      {clientName[0]?.toUpperCase() || "C"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{clientName}</p>
                      <p className="text-xs text-gray-500">
                        {clientLogs.length} items gelogd
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {Math.round(totalCals)} kcal
                    </p>
                    <p className="text-xs text-gray-500">
                      E{Math.round(totalProtein)}g | K{Math.round(totalCarbs)}g | V
                      {Math.round(totalFat)}g
                    </p>
                  </div>
                </div>

                {/* Food items grouped by meal type */}
                <div className="divide-y">
                  {["BREAKFAST", "LUNCH", "DINNER", "SNACK"].map((mealType) => {
                    const mealLogs = clientLogs.filter(
                      (l) => l.meal_type === mealType
                    )
                    if (mealLogs.length === 0) return null

                    return (
                      <div key={mealType} className="px-5 py-3">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                          {MEAL_LABELS[mealType]}
                        </p>
                        {mealLogs.map((log) => (
                          <div
                            key={log.id}
                            className="flex items-center justify-between py-1.5"
                          >
                            <div>
                              <p className="text-sm text-gray-900">
                                {log.food_name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {log.number_of_servings &&
                                log.number_of_servings !== 1
                                  ? `${log.number_of_servings}x `
                                  : ""}
                                {log.serving_size
                                  ? `${log.serving_size}${log.serving_unit || "g"}`
                                  : ""}
                                {log.source === "barcode" && " (barcode)"}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-700">
                                {Math.round(
                                  (log.calories || 0) *
                                    (log.number_of_servings || 1)
                                )}{" "}
                                kcal
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
