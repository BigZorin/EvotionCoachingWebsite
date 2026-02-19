"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getMealPlans, deleteMealPlan } from "@/app/actions/nutrition"
import {
  UtensilsCrossed,
  Plus,
  Edit,
  Trash2,
  UserPlus,
  Flame,
  AlertCircle,
  Calendar,
  ChefHat,
} from "lucide-react"

type MealPlanEntry = {
  id: string
  day_of_week: number
  meal_type: string
  custom_title: string | null
  recipes: {
    id: string
    title: string
    image_url: string | null
    calories: number | null
  } | null
}

type MealPlan = {
  id: string
  name: string
  description: string | null
  daily_calories: number | null
  protein_grams: number | null
  carbs_grams: number | null
  fat_grams: number | null
  meal_plan_entries: MealPlanEntry[]
  created_at: string
}

export default function MealPlansClient() {
  const router = useRouter()
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    loadMealPlans()
  }, [])

  const loadMealPlans = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await getMealPlans()
      if (result.success && result.mealPlans) {
        setMealPlans(result.mealPlans as MealPlan[])
      } else {
        setError(result.error || "Fout bij laden")
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Weet je zeker dat je dit meal plan wilt verwijderen?")) return
    setDeletingId(id)
    try {
      const result = await deleteMealPlan(id)
      if (result.success) {
        setMealPlans((prev) => prev.filter((p) => p.id !== id))
      } else {
        alert(result.error || "Fout bij verwijderen")
      }
    } finally {
      setDeletingId(null)
    }
  }

  const getRecipeCount = (plan: MealPlan) =>
    (plan.meal_plan_entries || []).filter((e) => e.recipes).length

  const getDayCount = (plan: MealPlan) =>
    new Set((plan.meal_plan_entries || []).map((e) => e.day_of_week)).size

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meal Plans</h1>
          <p className="text-gray-600">Beheer je weekschema's en wijs ze toe aan clients</p>
        </div>
        <Button
          onClick={() => router.push("/coach/dashboard/nutrition/meal-plans/create")}
          className="bg-[#1e1839] hover:bg-[#2a2054] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nieuw Meal Plan
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1e1839]"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <p className="text-gray-600">{error}</p>
        </div>
      ) : mealPlans.length === 0 ? (
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-12 text-center">
            <UtensilsCrossed className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Geen Meal Plans</h3>
            <p className="text-gray-600 mb-6">Maak je eerste weekschema om recepten per dag te plannen.</p>
            <Button
              onClick={() => router.push("/coach/dashboard/nutrition/meal-plans/create")}
              className="bg-[#1e1839] hover:bg-[#2a2054] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Eerste meal plan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mealPlans.map((plan) => (
            <Card key={plan.id} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{plan.name}</h3>
                {plan.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{plan.description}</p>
                )}

                {plan.daily_calories && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">{plan.daily_calories} kcal/dag</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                      {plan.protein_grams && <div>P: <span className="font-medium">{plan.protein_grams}g</span></div>}
                      {plan.carbs_grams && <div>K: <span className="font-medium">{plan.carbs_grams}g</span></div>}
                      {plan.fat_grams && <div>V: <span className="font-medium">{plan.fat_grams}g</span></div>}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1"><ChefHat className="h-4 w-4" /> {getRecipeCount(plan)} recepten</span>
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {getDayCount(plan)} dagen</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => router.push(`/coach/dashboard/nutrition/meal-plans/${plan.id}/assign`)}>
                    <UserPlus className="h-3.5 w-3.5 mr-1" /> Toewijzen
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => router.push(`/coach/dashboard/nutrition/meal-plans/${plan.id}/edit`)}>
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(plan.id)} disabled={deletingId === plan.id} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    {deletingId === plan.id ? <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-red-600" /> : <Trash2 className="h-3.5 w-3.5" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
