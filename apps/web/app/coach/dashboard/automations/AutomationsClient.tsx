"use client"

import { useState, useEffect } from "react"
import {
  Zap,
  Plus,
  Trash2,
  Bell,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  Calendar,
  UserPlus,
  Trophy,
  BarChart3,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react"
import {
  getAutomationRules,
  createAutomationRule,
  deleteAutomationRule,
  toggleAutomationRule,
  getAutomationLogs,
  type AutomationRule,
  type AutomationLog,
} from "@/app/actions/automations"

const TRIGGER_TYPES = [
  { value: "checkin_reminder", label: "Check-in herinnering", icon: Bell, description: "Herinner client aan check-in" },
  { value: "workout_reminder", label: "Workout herinnering", icon: Activity, description: "Herinner client aan geplande workout" },
  { value: "welcome", label: "Welkomstbericht", icon: UserPlus, description: "Automatisch welkomstbericht voor nieuwe clients" },
  { value: "inactivity", label: "Inactiviteit waarschuwing", icon: Clock, description: "Stuur bericht na X dagen inactiviteit" },
  { value: "streak_celebration", label: "Streak viering", icon: Trophy, description: "Vier habit streaks bij milestones" },
  { value: "weekly_summary", label: "Wekelijks overzicht", icon: BarChart3, description: "Stuur wekelijks voortgangsoverzicht" },
]

const ACTION_TYPES = [
  { value: "push_notification", label: "Push notificatie" },
  { value: "in_app_notification", label: "In-app notificatie" },
  { value: "both", label: "Beide" },
]

const DAYS = [
  { value: "monday", label: "Ma" },
  { value: "tuesday", label: "Di" },
  { value: "wednesday", label: "Wo" },
  { value: "thursday", label: "Do" },
  { value: "friday", label: "Vr" },
  { value: "saturday", label: "Za" },
  { value: "sunday", label: "Zo" },
]

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function AutomationsClient() {
  const [rules, setRules] = useState<AutomationRule[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [expandedLogs, setExpandedLogs] = useState<string | null>(null)
  const [logs, setLogs] = useState<AutomationLog[]>([])
  const [logsLoading, setLogsLoading] = useState(false)

  // Create form state
  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formTrigger, setFormTrigger] = useState("checkin_reminder")
  const [formActionType, setFormActionType] = useState("push_notification")
  const [formTitle, setFormTitle] = useState("")
  const [formMessage, setFormMessage] = useState("")
  const [formTime, setFormTime] = useState("09:00")
  const [formDays, setFormDays] = useState<string[]>(["monday", "wednesday", "friday"])
  const [formConditions, setFormConditions] = useState<Record<string, any>>({})
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadRules()
  }, [])

  async function loadRules() {
    setLoading(true)
    const result = await getAutomationRules()
    if (result.success && result.rules) {
      setRules(result.rules)
    }
    setLoading(false)
  }

  async function handleCreate() {
    if (!formName.trim() || !formMessage.trim()) return
    setCreating(true)

    const result = await createAutomationRule({
      name: formName,
      description: formDescription || undefined,
      trigger_type: formTrigger,
      schedule_time: formTime,
      schedule_days: formDays,
      conditions: formConditions,
      action_type: formActionType,
      action_title: formTitle || undefined,
      action_message: formMessage,
    })

    if (result.success) {
      resetForm()
      setShowCreate(false)
      loadRules()
    }
    setCreating(false)
  }

  function resetForm() {
    setFormName("")
    setFormDescription("")
    setFormTrigger("checkin_reminder")
    setFormActionType("push_notification")
    setFormTitle("")
    setFormMessage("")
    setFormTime("09:00")
    setFormDays(["monday", "wednesday", "friday"])
    setFormConditions({})
  }

  async function handleToggle(ruleId: string) {
    const result = await toggleAutomationRule(ruleId)
    if (result.success && result.rule) {
      setRules((prev) =>
        prev.map((r) => (r.id === ruleId ? result.rule! : r))
      )
    }
  }

  async function handleDelete(ruleId: string) {
    if (!confirm("Weet je zeker dat je deze automatie wilt verwijderen?")) return
    const result = await deleteAutomationRule(ruleId)
    if (result.success) {
      setRules((prev) => prev.filter((r) => r.id !== ruleId))
    }
  }

  async function handleToggleLogs(ruleId: string) {
    if (expandedLogs === ruleId) {
      setExpandedLogs(null)
      setLogs([])
      return
    }
    setExpandedLogs(ruleId)
    setLogsLoading(true)
    const result = await getAutomationLogs(ruleId)
    if (result.success && result.logs) {
      setLogs(result.logs)
    }
    setLogsLoading(false)
  }

  function getTriggerInfo(type: string) {
    return TRIGGER_TYPES.find((t) => t.value === type)
  }

  // Condition fields based on trigger type
  function renderConditionFields() {
    switch (formTrigger) {
      case "inactivity":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dagen inactief
            </label>
            <input
              type="number"
              min={1}
              max={30}
              value={formConditions.days_inactive || 3}
              onChange={(e) =>
                setFormConditions({ ...formConditions, days_inactive: parseInt(e.target.value) })
              }
              className="w-24 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#1e1839]/20 focus:border-[#1e1839] outline-none"
            />
          </div>
        )
      case "streak_celebration":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Streak milestones (komma-gescheiden)
            </label>
            <input
              type="text"
              value={(formConditions.streak_milestones || [7, 14, 30]).join(", ")}
              onChange={(e) =>
                setFormConditions({
                  ...formConditions,
                  streak_milestones: e.target.value.split(",").map((s) => parseInt(s.trim())).filter((n) => !isNaN(n)),
                })
              }
              placeholder="7, 14, 30, 60, 90"
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#1e1839]/20 focus:border-[#1e1839] outline-none"
            />
          </div>
        )
      case "checkin_reminder":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-in type
            </label>
            <select
              value={formConditions.check_in_type || "daily"}
              onChange={(e) =>
                setFormConditions({ ...formConditions, check_in_type: e.target.value })
              }
              className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#1e1839]/20 focus:border-[#1e1839] outline-none"
            >
              <option value="daily">Dagelijks</option>
              <option value="weekly">Wekelijks</option>
            </select>
          </div>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e1839]"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Automations</h1>
          <p className="text-sm text-gray-500 mt-1">
            Automatische herinneringen en triggers voor je clients
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1e1839] text-white rounded-xl hover:bg-[#2a2054] transition text-sm font-medium"
        >
          {showCreate ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showCreate ? "Annuleren" : "Nieuwe automatie"}
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="bg-white rounded-xl border p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Nieuwe automatie</h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Naam</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Bijv. Dagelijkse check-in herinnering"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#1e1839]/20 focus:border-[#1e1839] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Beschrijving</label>
              <input
                type="text"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Optionele beschrijving"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#1e1839]/20 focus:border-[#1e1839] outline-none"
              />
            </div>
          </div>

          {/* Trigger type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Trigger</label>
            <div className="grid grid-cols-3 gap-2">
              {TRIGGER_TYPES.map((trigger) => {
                const Icon = trigger.icon
                return (
                  <button
                    key={trigger.value}
                    onClick={() => {
                      setFormTrigger(trigger.value)
                      setFormConditions({})
                    }}
                    className={`flex items-start gap-3 p-3 rounded-lg border text-left transition ${
                      formTrigger === trigger.value
                        ? "border-[#1e1839] bg-[#1e1839]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                        formTrigger === trigger.value ? "text-[#1e1839]" : "text-gray-400"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{trigger.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{trigger.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Conditions */}
          {renderConditionFields() && (
            <div className="mb-4">{renderConditionFields()}</div>
          )}

          {/* Schedule */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tijd</label>
              <input
                type="time"
                value={formTime}
                onChange={(e) => setFormTime(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#1e1839]/20 focus:border-[#1e1839] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dagen</label>
              <div className="flex gap-1">
                {DAYS.map((day) => (
                  <button
                    key={day.value}
                    onClick={() =>
                      setFormDays((prev) =>
                        prev.includes(day.value)
                          ? prev.filter((d) => d !== day.value)
                          : [...prev, day.value]
                      )
                    }
                    className={`w-9 h-9 rounded-lg text-xs font-medium transition ${
                      formDays.includes(day.value)
                        ? "bg-[#1e1839] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Actie type</label>
              <select
                value={formActionType}
                onChange={(e) => setFormActionType(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#1e1839]/20 focus:border-[#1e1839] outline-none"
              >
                {ACTION_TYPES.map((at) => (
                  <option key={at.value} value={at.value}>
                    {at.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notificatie titel
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Bijv. Tijd voor je check-in!"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#1e1839]/20 focus:border-[#1e1839] outline-none"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bericht{" "}
              <span className="text-gray-400 font-normal">
                (gebruik {"{name}"} voor client naam, {"{days}"} voor aantal dagen)
              </span>
            </label>
            <textarea
              value={formMessage}
              onChange={(e) => setFormMessage(e.target.value)}
              placeholder="Hey {name}, vergeet je check-in niet vandaag!"
              rows={3}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#1e1839]/20 focus:border-[#1e1839] outline-none resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleCreate}
              disabled={!formName.trim() || !formMessage.trim() || creating}
              className="px-6 py-2.5 bg-[#1e1839] text-white rounded-xl hover:bg-[#2a2054] transition text-sm font-medium disabled:opacity-50"
            >
              {creating ? "Aanmaken..." : "Automatie aanmaken"}
            </button>
          </div>
        </div>
      )}

      {/* Placeholder info */}
      {rules.length === 0 && !showCreate && (
        <div className="bg-white rounded-xl border p-12 text-center shadow-sm">
          <Zap className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Geen automations</h3>
          <p className="text-sm text-gray-500 mb-4">
            Maak automatische herinneringen aan om je clients betrokken te houden
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 bg-[#1e1839] text-white rounded-xl hover:bg-[#2a2054] transition text-sm font-medium"
          >
            Eerste automatie aanmaken
          </button>
        </div>
      )}

      {/* Rules list */}
      <div className="space-y-3">
        {rules.map((rule) => {
          const trigger = getTriggerInfo(rule.trigger_type)
          const TriggerIcon = trigger?.icon || Zap
          const isExpanded = expandedLogs === rule.id

          return (
            <div key={rule.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        rule.is_active
                          ? "bg-[#1e1839]/10 text-[#1e1839]"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <TriggerIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            rule.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {rule.is_active ? "Actief" : "Inactief"}
                        </span>
                      </div>
                      {rule.description && (
                        <p className="text-sm text-gray-500 mt-0.5">{rule.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {trigger?.label}
                        </span>
                        {rule.schedule_time && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {rule.schedule_time}
                          </span>
                        )}
                        {rule.schedule_days && rule.schedule_days.length > 0 && (
                          <span>
                            {(rule.schedule_days as string[])
                              .map((d) => DAYS.find((day) => day.value === d)?.label)
                              .join(", ")}
                          </span>
                        )}
                        {rule.last_triggered_at && (
                          <span>Laatst: {formatDate(rule.last_triggered_at)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleLogs(rule.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition"
                      title="Logs bekijken"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleToggle(rule.id)}
                      className={`p-2 rounded-lg transition ${
                        rule.is_active
                          ? "text-green-600 hover:bg-green-50"
                          : "text-gray-400 hover:bg-gray-50"
                      }`}
                      title={rule.is_active ? "Deactiveren" : "Activeren"}
                    >
                      {rule.is_active ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(rule.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition"
                      title="Verwijderen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Message preview */}
                {rule.action_message && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Bericht</p>
                    <p className="text-sm text-gray-700">{rule.action_message}</p>
                  </div>
                )}
              </div>

              {/* Logs */}
              {isExpanded && (
                <div className="border-t bg-gray-50 px-5 py-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Recente logs</h4>
                  {logsLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#1e1839] mx-auto"></div>
                    </div>
                  ) : logs.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">
                      Nog geen triggers uitgevoerd
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {logs.map((log) => (
                        <div
                          key={log.id}
                          className="flex items-center justify-between py-1.5 text-sm"
                        >
                          <span className="text-gray-600">
                            {formatDate(log.triggered_at)}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              log.status === "sent"
                                ? "bg-green-100 text-green-700"
                                : log.status === "failed"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {log.status === "sent"
                              ? "Verzonden"
                              : log.status === "failed"
                              ? "Mislukt"
                              : "Overgeslagen"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
