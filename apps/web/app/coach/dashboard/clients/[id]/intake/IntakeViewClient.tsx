"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Trophy,
  Heart,
  Moon,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"
import { getClientIntakeForm, type IntakeForm } from "@/app/actions/intake"

const STRESS_LABELS: Record<number, string> = {
  1: "Zeer laag",
  2: "Laag",
  3: "Gemiddeld",
  4: "Hoog",
  5: "Zeer hoog",
}

function InfoCard({
  label,
  value,
  icon,
}: {
  label: string
  value: string | null | undefined
  icon?: React.ReactNode
}) {
  if (!value) return null
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="text-sm text-gray-900 whitespace-pre-line">{value}</p>
    </div>
  )
}

export default function IntakeViewClient({ clientId }: { clientId: string }) {
  const [intake, setIntake] = useState<IntakeForm | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const result = await getClientIntakeForm(clientId)
      if (result.success) {
        setIntake(result.intake || null)
      } else {
        setError(result.error || "Kon intake niet laden")
      }
      setLoading(false)
    }
    load()
  }, [clientId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e1839]"></div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href={`/coach/dashboard/clients/${clientId}`}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Intake Formulier</h1>
          {intake?.completed_at && (
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              Ingevuld op{" "}
              {new Date(intake.completed_at).toLocaleDateString("nl-NL", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 rounded-lg p-4 mb-6 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {!intake ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-lg mb-2">Nog niet ingevuld</p>
          <p className="text-gray-400 text-sm">
            De client heeft het intake formulier nog niet voltooid.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Section 1: Goals & Experience */}
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-semibold text-gray-900">
                Doelen & Ervaring
              </h2>
            </div>
            <div className="grid gap-3">
              <InfoCard label="Doelen" value={intake.goals} />
              <InfoCard label="Ervaring" value={intake.fitness_experience} />
              <InfoCard
                label="Trainingsgeschiedenis"
                value={intake.training_history}
              />
            </div>
          </div>

          {/* Section 2: Health */}
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-semibold text-gray-900">
                Gezondheid
              </h2>
            </div>
            <div className="grid gap-3">
              <InfoCard label="Blessures" value={intake.injuries} />
              <InfoCard
                label="Medische aandoeningen"
                value={intake.medical_conditions}
              />
              <InfoCard label="Medicijnen" value={intake.medications} />
            </div>
            {!intake.injuries &&
              !intake.medical_conditions &&
              !intake.medications && (
                <p className="text-sm text-gray-400 italic">
                  Geen gezondheidsinformatie opgegeven
                </p>
              )}
          </div>

          {/* Section 3: Lifestyle */}
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Moon className="h-5 w-5 text-indigo-500" />
              <h2 className="text-lg font-semibold text-gray-900">Leefstijl</h2>
            </div>
            <div className="grid gap-3">
              <InfoCard
                label="Voedingsrestricties"
                value={intake.dietary_restrictions}
              />
              <InfoCard label="Allergieën" value={intake.allergies} />
              <InfoCard label="Beroep" value={intake.occupation} />
              {intake.sleep_hours && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slaap
                  </span>
                  <p className="text-sm text-gray-900 mt-1">
                    {intake.sleep_hours} uur per nacht
                  </p>
                </div>
              )}
              {intake.stress_level && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stressniveau
                  </span>
                  <p className="text-sm text-gray-900 mt-1">
                    {STRESS_LABELS[intake.stress_level] || intake.stress_level} (
                    {intake.stress_level}/5)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Schedule & Equipment */}
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-900">
                Schema & Uitrusting
              </h2>
            </div>
            <div className="grid gap-3">
              {intake.available_days && intake.available_days.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Beschikbare dagen
                  </span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {intake.available_days.map((day) => (
                      <span
                        key={day}
                        className="px-3 py-1 bg-[#1e1839] text-white text-xs font-medium rounded-full"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {intake.preferred_training_time && (
                <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-2">
                  <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Voorkeurstijd
                    </span>
                    <p className="text-sm text-gray-900 mt-1">
                      {intake.preferred_training_time}
                    </p>
                  </div>
                </div>
              )}
              <InfoCard
                label="Beschikbare uitrusting"
                value={intake.equipment_access}
              />
              <InfoCard
                label="Overige opmerkingen"
                value={intake.additional_notes}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
