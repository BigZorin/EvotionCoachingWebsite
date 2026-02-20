"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Plus,
  FileText,
  Clock,
  Star,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Edit2,
} from "lucide-react"
import {
  getCoachTemplates,
  updateTemplate,
  deleteTemplate,
  type CheckInTemplate,
} from "@/app/actions/check-in-templates"

export default function TemplateListClient() {
  const [templates, setTemplates] = useState<CheckInTemplate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTemplates()
  }, [])

  async function loadTemplates() {
    setLoading(true)
    const result = await getCoachTemplates()
    if (result.success && result.templates) {
      setTemplates(result.templates)
    }
    setLoading(false)
  }

  async function handleToggleActive(template: CheckInTemplate) {
    await updateTemplate(template.id, { isActive: !template.is_active })
    loadTemplates()
  }

  async function handleToggleDefault(template: CheckInTemplate) {
    await updateTemplate(template.id, { isDefault: !template.is_default })
    loadTemplates()
  }

  async function handleDelete(templateId: string) {
    if (!confirm("Weet je zeker dat je dit template wilt verwijderen?")) return
    await deleteTemplate(templateId)
    loadTemplates()
  }

  const weeklyTemplates = templates.filter((t) => t.check_in_type === "weekly")
  const dailyTemplates = templates.filter((t) => t.check_in_type === "daily")

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const renderTemplateCard = (template: CheckInTemplate) => (
    <div
      key={template.id}
      className={`bg-card rounded-xl border p-5 shadow-sm transition ${
        !template.is_active ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-semibold text-foreground">{template.name}</h3>
            {template.description && (
              <p className="text-sm text-muted-foreground mt-0.5">{template.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {template.is_default && (
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full flex items-center gap-1">
              <Star className="h-3 w-3" /> Standaard
            </span>
          )}
          <span
            className={`px-2 py-0.5 text-xs font-medium rounded-full ${
              template.is_active
                ? "bg-green-100 text-green-700"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            {template.is_active ? "Actief" : "Inactief"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {(template.questions || []).length} vragen
        </span>
        <span>
          Aangemaakt{" "}
          {new Date(template.created_at).toLocaleDateString("nl-NL", {
            day: "numeric",
            month: "short",
          })}
        </span>
      </div>

      {/* Question preview */}
      {template.questions && template.questions.length > 0 && (
        <div className="bg-secondary/50 rounded-lg p-3 mb-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Vragen
          </p>
          <ul className="space-y-1">
            {template.questions.slice(0, 4).map((q: any, idx: number) => (
              <li key={q.id} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-muted-foreground text-xs mt-0.5">{idx + 1}.</span>
                <span>{q.question}</span>
                <span className="ml-auto text-xs text-muted-foreground capitalize">
                  {q.question_type.replace("_", "/")}
                </span>
              </li>
            ))}
            {template.questions.length > 4 && (
              <li className="text-xs text-muted-foreground italic">
                +{template.questions.length - 4} meer...
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="flex items-center gap-2 pt-2 border-t">
        <button
          onClick={() => handleToggleActive(template)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2 py-1.5 rounded hover:bg-secondary transition"
        >
          {template.is_active ? (
            <ToggleRight className="h-4 w-4 text-green-600" />
          ) : (
            <ToggleLeft className="h-4 w-4" />
          )}
          {template.is_active ? "Deactiveer" : "Activeer"}
        </button>
        <button
          onClick={() => handleToggleDefault(template)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2 py-1.5 rounded hover:bg-secondary transition"
        >
          <Star className={`h-4 w-4 ${template.is_default ? "text-amber-500" : ""}`} />
          {template.is_default ? "Niet standaard" : "Maak standaard"}
        </button>
        <div className="flex-1" />
        <button
          onClick={() => handleDelete(template.id)}
          className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 px-2 py-1.5 rounded hover:bg-red-50 transition"
        >
          <Trash2 className="h-4 w-4" />
          Verwijder
        </button>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/coach/dashboard/check-ins"
            className="p-2 hover:bg-secondary rounded-lg transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Check-in Templates
            </h1>
            <p className="text-sm text-muted-foreground">
              Maak custom check-in formulieren voor je clients
            </p>
          </div>
        </div>
        <Link
          href="/coach/dashboard/check-ins/templates/create"
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Nieuw template
        </Link>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl border">
          <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground text-lg mb-2">Nog geen templates</p>
          <p className="text-muted-foreground text-sm mb-6">
            Maak een custom check-in formulier om aan clients toe te wijzen.
          </p>
          <Link
            href="/coach/dashboard/check-ins/templates/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Maak je eerste template
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Weekly templates */}
          {weeklyTemplates.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Wekelijkse Check-ins
              </h2>
              <div className="space-y-3">
                {weeklyTemplates.map(renderTemplateCard)}
              </div>
            </div>
          )}

          {/* Daily templates */}
          {dailyTemplates.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Dagelijkse Check-ins
              </h2>
              <div className="space-y-3">
                {dailyTemplates.map(renderTemplateCard)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
