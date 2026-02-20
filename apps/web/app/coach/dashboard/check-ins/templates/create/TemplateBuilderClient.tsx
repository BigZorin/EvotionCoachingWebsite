"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Save,
  AlertCircle,
} from "lucide-react"
import { createTemplate } from "@/app/actions/check-in-templates"

type QuestionType = "scale" | "number" | "text" | "yes_no" | "multiple_choice"

interface QuestionDraft {
  id: string
  question: string
  questionType: QuestionType
  options: string[]
  scaleLabels: string[]
  isRequired: boolean
  fieldKey: string
  unit: string
}

const QUESTION_TYPES: { value: QuestionType; label: string; description: string }[] = [
  { value: "scale", label: "Schaal (1-5)", description: "Client kiest een waarde op een 5-punt schaal" },
  { value: "number", label: "Getal", description: "Client voert een getal in (bijv. gewicht)" },
  { value: "text", label: "Tekst", description: "Client typt een vrij antwoord" },
  { value: "yes_no", label: "Ja / Nee", description: "Client kiest ja of nee" },
  { value: "multiple_choice", label: "Meerkeuze", description: "Client kiest uit opties" },
]

const FIELD_KEY_OPTIONS = [
  { value: "", label: "Geen (custom)" },
  { value: "feeling", label: "Gevoel" },
  { value: "weight", label: "Gewicht" },
  { value: "energy", label: "Energie" },
  { value: "sleep", label: "Slaap" },
  { value: "stress", label: "Stress" },
  { value: "nutrition", label: "Voeding" },
  { value: "training", label: "Training" },
  { value: "mood", label: "Stemming" },
  { value: "notes", label: "Notities" },
]

const DEFAULT_SCALE_LABELS = ["Slecht", "Matig", "Oké", "Goed", "Uitstekend"]

let nextId = 1
function generateId() {
  return `q_${nextId++}_${Date.now()}`
}

export default function TemplateBuilderClient() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [checkInType, setCheckInType] = useState<"daily" | "weekly">("weekly")
  const [isDefault, setIsDefault] = useState(false)
  const [questions, setQuestions] = useState<QuestionDraft[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Add a default first question on mount
  useState(() => {
    setQuestions([{
      id: generateId(),
      question: "",
      questionType: "scale",
      options: ["Optie 1", "Optie 2"],
      scaleLabels: [...DEFAULT_SCALE_LABELS],
      isRequired: true,
      fieldKey: "",
      unit: "",
    }])
  })

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: generateId(),
        question: "",
        questionType: "scale",
        options: ["Optie 1", "Optie 2"],
        scaleLabels: [...DEFAULT_SCALE_LABELS],
        isRequired: true,
        fieldKey: "",
        unit: "",
      },
    ])
  }

  const updateQuestion = (id: string, updates: Partial<QuestionDraft>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updates } : q))
    )
  }

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  const moveQuestion = (index: number, direction: "up" | "down") => {
    const newQuestions = [...questions]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newQuestions.length) return
    ;[newQuestions[index], newQuestions[targetIndex]] = [
      newQuestions[targetIndex],
      newQuestions[index],
    ]
    setQuestions(newQuestions)
  }

  const addOption = (questionId: string) => {
    const q = questions.find((q) => q.id === questionId)
    if (!q) return
    updateQuestion(questionId, {
      options: [...q.options, `Optie ${q.options.length + 1}`],
    })
  }

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const q = questions.find((q) => q.id === questionId)
    if (!q) return
    const newOptions = [...q.options]
    newOptions[optionIndex] = value
    updateQuestion(questionId, { options: newOptions })
  }

  const removeOption = (questionId: string, optionIndex: number) => {
    const q = questions.find((q) => q.id === questionId)
    if (!q || q.options.length <= 2) return
    updateQuestion(questionId, {
      options: q.options.filter((_, i) => i !== optionIndex),
    })
  }

  const updateScaleLabel = (questionId: string, index: number, value: string) => {
    const q = questions.find((q) => q.id === questionId)
    if (!q) return
    const newLabels = [...q.scaleLabels]
    newLabels[index] = value
    updateQuestion(questionId, { scaleLabels: newLabels })
  }

  const handleSave = async () => {
    setError(null)
    if (!name.trim()) {
      setError("Geef je template een naam")
      return
    }
    if (questions.length === 0) {
      setError("Voeg minimaal één vraag toe")
      return
    }
    const emptyQuestions = questions.filter((q) => !q.question.trim())
    if (emptyQuestions.length > 0) {
      setError("Alle vragen moeten een tekst hebben")
      return
    }

    setSaving(true)
    const result = await createTemplate({
      name: name.trim(),
      description: description.trim() || undefined,
      checkInType,
      isDefault,
      questions: questions.map((q) => ({
        question: q.question,
        questionType: q.questionType,
        options: q.questionType === "multiple_choice" ? q.options : undefined,
        scaleLabels: q.questionType === "scale" ? q.scaleLabels : undefined,
        isRequired: q.isRequired,
        fieldKey: q.fieldKey || undefined,
        unit: q.unit || undefined,
      })),
    })

    if (result.success) {
      router.push("/coach/dashboard/check-ins/templates")
    } else {
      setError(result.error || "Kon template niet opslaan")
    }
    setSaving(false)
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/coach/dashboard/check-ins/templates"
          className="p-2 hover:bg-secondary rounded-lg transition"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nieuw Template</h1>
          <p className="text-sm text-muted-foreground">
            Definieer de vragen voor je check-in formulier
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 rounded-lg p-4 mb-6 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Template settings */}
      <div className="bg-white rounded-xl border p-6 shadow-sm mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Template instellingen
        </h2>

        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Template naam *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Bijv. Wekelijkse voortgang check-in"
              className="w-full px-3 py-2 border rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-ring outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Beschrijving
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Korte beschrijving van dit template..."
              className="w-full px-3 py-2 border rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-ring outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Type check-in
              </label>
              <select
                value={checkInType}
                onChange={(e) => setCheckInType(e.target.value as "daily" | "weekly")}
                className="w-full px-3 py-2 border rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-ring outline-none"
              >
                <option value="weekly">Wekelijks</option>
                <option value="daily">Dagelijks</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus-visible:ring-ring"
                />
                <span className="text-sm text-foreground">
                  Standaard template (voor alle clients zonder toewijzing)
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Vragen ({questions.length})
          </h2>
        </div>

        {questions.map((q, index) => (
          <div
            key={q.id}
            className="bg-white rounded-xl border p-5 shadow-sm"
          >
            <div className="flex items-start gap-3">
              {/* Reorder buttons */}
              <div className="flex flex-col gap-0.5 pt-1">
                <button
                  onClick={() => moveQuestion(index, "up")}
                  disabled={index === 0}
                  className="p-0.5 text-muted-foreground hover:text-muted-foreground disabled:opacity-30"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                <button
                  onClick={() => moveQuestion(index, "down")}
                  disabled={index === questions.length - 1}
                  className="p-0.5 text-muted-foreground hover:text-muted-foreground disabled:opacity-30"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 space-y-3">
                {/* Question number + text */}
                <div className="flex items-start gap-3">
                  <span className="text-sm font-bold text-muted-foreground mt-2">
                    {index + 1}.
                  </span>
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) =>
                      updateQuestion(q.id, { question: e.target.value })
                    }
                    placeholder="Typ je vraag..."
                    className="flex-1 px-3 py-2 border rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-ring outline-none"
                  />
                </div>

                {/* Type + settings */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pl-7">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Type
                    </label>
                    <select
                      value={q.questionType}
                      onChange={(e) =>
                        updateQuestion(q.id, {
                          questionType: e.target.value as QuestionType,
                        })
                      }
                      className="w-full px-2 py-1.5 border rounded text-xs focus-visible:ring-1 focus-visible:ring-ring outline-none"
                    >
                      {QUESTION_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {QUESTION_TYPES.find(t => t.value === q.questionType)?.description}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Dataveld
                    </label>
                    <select
                      value={q.fieldKey}
                      onChange={(e) =>
                        updateQuestion(q.id, { fieldKey: e.target.value })
                      }
                      className="w-full px-2 py-1.5 border rounded text-xs focus-visible:ring-1 focus-visible:ring-ring outline-none"
                    >
                      {FIELD_KEY_OPTIONS.map((f) => (
                        <option key={f.value} value={f.value}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end gap-3">
                    {q.questionType === "number" && (
                      <div className="flex-1">
                        <label className="block text-xs text-muted-foreground mb-1">
                          Eenheid
                        </label>
                        <input
                          type="text"
                          value={q.unit}
                          onChange={(e) =>
                            updateQuestion(q.id, { unit: e.target.value })
                          }
                          placeholder="kg"
                          className="w-full px-2 py-1.5 border rounded text-xs focus-visible:ring-1 focus-visible:ring-ring outline-none"
                        />
                      </div>
                    )}
                    <label className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={q.isRequired}
                        onChange={(e) =>
                          updateQuestion(q.id, { isRequired: e.target.checked })
                        }
                        className="w-3.5 h-3.5 rounded border-border text-primary"
                      />
                      <span className="text-xs text-muted-foreground">Verplicht</span>
                    </label>
                  </div>
                </div>

                {/* Scale labels */}
                {q.questionType === "scale" && (
                  <div className="pl-7">
                    <label className="block text-xs text-muted-foreground mb-1">
                      Schaal labels
                    </label>
                    <div className="flex gap-2">
                      {q.scaleLabels.map((label, i) => (
                        <input
                          key={i}
                          type="text"
                          value={label}
                          onChange={(e) =>
                            updateScaleLabel(q.id, i, e.target.value)
                          }
                          className="flex-1 px-2 py-1 border rounded text-xs text-center focus-visible:ring-1 focus-visible:ring-ring outline-none"
                          placeholder={`${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Multiple choice options */}
                {q.questionType === "multiple_choice" && (
                  <div className="pl-7 space-y-2">
                    <label className="block text-xs text-muted-foreground">Opties</label>
                    {q.options.map((option, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-4">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            updateOption(q.id, optIdx, e.target.value)
                          }
                          className="flex-1 px-2 py-1 border rounded text-xs focus-visible:ring-1 focus-visible:ring-ring outline-none"
                        />
                        {q.options.length > 2 && (
                          <button
                            onClick={() => removeOption(q.id, optIdx)}
                            className="p-1 text-muted-foreground hover:text-red-500"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addOption(q.id)}
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" /> Optie toevoegen
                    </button>
                  </div>
                )}
              </div>

              {/* Delete button */}
              <button
                onClick={() => removeQuestion(q.id)}
                className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Add question button */}
        <button
          onClick={addQuestion}
          className="w-full py-4 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary hover:text-primary transition flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Plus className="h-5 w-5" />
          Vraag toevoegen
        </button>
      </div>

      {/* Save button */}
      <div className="sticky bottom-0 bg-secondary/50 -mx-6 px-6 py-4 border-t flex items-center justify-end gap-3">
        <Link
          href="/coach/dashboard/check-ins/templates"
          className="px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition"
        >
          Annuleren
        </Link>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition text-sm font-medium disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {saving ? "Opslaan..." : "Template opslaan"}
        </button>
      </div>
    </div>
  )
}
