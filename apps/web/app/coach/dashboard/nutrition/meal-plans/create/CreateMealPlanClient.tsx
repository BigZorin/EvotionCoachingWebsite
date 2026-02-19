"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createMealPlan, getRecipes } from "@/app/actions/nutrition"
import { ArrowLeft, Plus, X, Save, Search, ChefHat, Flame } from "lucide-react"

const DAYS = [
  { num: 1, label: "Maandag" },
  { num: 2, label: "Dinsdag" },
  { num: 3, label: "Woensdag" },
  { num: 4, label: "Donderdag" },
  { num: 5, label: "Vrijdag" },
  { num: 6, label: "Zaterdag" },
  { num: 7, label: "Zondag" },
]

const MEAL_TYPES = [
  { key: "BREAKFAST", label: "Ontbijt" },
  { key: "LUNCH", label: "Lunch" },
  { key: "DINNER", label: "Diner" },
  { key: "SNACK", label: "Snack" },
]

type Recipe = {
  id: string
  title: string
  image_url: string | null
  calories: number | null
  protein_grams: number | null
  carbs_grams: number | null
  fat_grams: number | null
}

type PlanEntry = {
  day_of_week: number
  meal_type: string
  recipe_id?: string
  recipe?: Recipe
  custom_title?: string
}

export default function CreateMealPlanClient() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [dailyCalories, setDailyCalories] = useState("")
  const [protein, setProtein] = useState("")
  const [carbs, setCarbs] = useState("")
  const [fat, setFat] = useState("")

  const [entries, setEntries] = useState<PlanEntry[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerTarget, setPickerTarget] = useState<{ day: number; meal: string } | null>(null)
  const [recipeSearch, setRecipeSearch] = useState("")

  useEffect(() => {
    loadRecipes()
  }, [])

  const loadRecipes = async () => {
    const result = await getRecipes()
    if (result.success && result.recipes) {
      setRecipes(result.recipes as Recipe[])
    }
  }

  const openPicker = (day: number, meal: string) => {
    setPickerTarget({ day, meal })
    setRecipeSearch("")
    setPickerOpen(true)
  }

  const selectRecipe = (recipe: Recipe) => {
    if (!pickerTarget) return
    setEntries((prev) => {
      const filtered = prev.filter(
        (e) => !(e.day_of_week === pickerTarget.day && e.meal_type === pickerTarget.meal)
      )
      return [
        ...filtered,
        {
          day_of_week: pickerTarget.day,
          meal_type: pickerTarget.meal,
          recipe_id: recipe.id,
          recipe,
        },
      ]
    })
    setPickerOpen(false)
  }

  const removeEntry = (day: number, meal: string) => {
    setEntries((prev) => prev.filter((e) => !(e.day_of_week === day && e.meal_type === meal)))
  }

  const getEntry = (day: number, meal: string) =>
    entries.find((e) => e.day_of_week === day && e.meal_type === meal)

  const getDayCalories = (day: number) =>
    entries
      .filter((e) => e.day_of_week === day && e.recipe?.calories)
      .reduce((sum, e) => sum + (e.recipe?.calories || 0), 0)

  const filteredRecipes = recipes.filter((r) =>
    r.title.toLowerCase().includes(recipeSearch.toLowerCase())
  )

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Naam is verplicht")
      return
    }
    setSaving(true)
    try {
      const result = await createMealPlan({
        name: name.trim(),
        description: description.trim() || undefined,
        daily_calories: parseInt(dailyCalories) || undefined,
        protein_grams: parseInt(protein) || undefined,
        carbs_grams: parseInt(carbs) || undefined,
        fat_grams: parseInt(fat) || undefined,
        entries: entries.map((e, idx) => ({
          recipe_id: e.recipe_id,
          day_of_week: e.day_of_week,
          meal_type: e.meal_type,
          custom_title: e.custom_title,
          order_index: idx,
        })),
      })
      if (result.success) {
        router.push("/coach/dashboard/nutrition/meal-plans")
      } else {
        alert(result.error || "Fout bij opslaan")
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nieuw Meal Plan</h1>
          <p className="text-gray-600">Stel een weekschema samen met recepten</p>
        </div>
      </div>

      {/* Basic info + macros */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Basisgegevens</h2>
            <div className="space-y-2">
              <Label>Naam *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Bijv. Cut Schema Week 1" />
            </div>
            <div className="space-y-2">
              <Label>Beschrijving</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Optionele beschrijving..." />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Macro Targets (per dag)</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Calorieën</Label>
                <Input type="number" value={dailyCalories} onChange={(e) => setDailyCalories(e.target.value)} placeholder="2000" />
              </div>
              <div className="space-y-2">
                <Label>Eiwit (g)</Label>
                <Input type="number" value={protein} onChange={(e) => setProtein(e.target.value)} placeholder="150" />
              </div>
              <div className="space-y-2">
                <Label>Koolhydraten (g)</Label>
                <Input type="number" value={carbs} onChange={(e) => setCarbs(e.target.value)} placeholder="200" />
              </div>
              <div className="space-y-2">
                <Label>Vet (g)</Label>
                <Input type="number" value={fat} onChange={(e) => setFat(e.target.value)} placeholder="60" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Week grid */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekoverzicht</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-sm font-medium text-gray-500 p-2 w-24"></th>
                  {DAYS.map((day) => (
                    <th key={day.num} className="text-center text-sm font-medium text-gray-700 p-2 min-w-[140px]">
                      <div>{day.label}</div>
                      {getDayCalories(day.num) > 0 && (
                        <div className="text-xs text-orange-600 font-normal mt-1">
                          {getDayCalories(day.num)} kcal
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MEAL_TYPES.map((meal) => (
                  <tr key={meal.key} className="border-t border-gray-100">
                    <td className="text-sm font-medium text-gray-600 p-2 align-top">{meal.label}</td>
                    {DAYS.map((day) => {
                      const entry = getEntry(day.num, meal.key)
                      return (
                        <td key={day.num} className="p-2 align-top">
                          {entry?.recipe ? (
                            <div className="bg-gray-50 rounded-lg p-2 relative group">
                              <button
                                onClick={() => removeEntry(day.num, meal.key)}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              {entry.recipe.image_url && (
                                <img src={entry.recipe.image_url} alt="" className="w-full h-16 object-cover rounded mb-1" />
                              )}
                              <p className="text-xs font-medium text-gray-900 line-clamp-2">{entry.recipe.title}</p>
                              {entry.recipe.calories && (
                                <p className="text-xs text-orange-600 mt-1">{entry.recipe.calories} kcal</p>
                              )}
                            </div>
                          ) : (
                            <button
                              onClick={() => openPicker(day.num, meal.key)}
                              className="w-full h-20 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:border-[#1e1839] hover:text-[#1e1839] transition-colors"
                            >
                              <Plus className="h-5 w-5" />
                            </button>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-end gap-3 pb-8">
        <Button variant="outline" onClick={() => router.back()}>Annuleren</Button>
        <Button onClick={handleSave} disabled={saving || !name.trim()} className="bg-[#1e1839] hover:bg-[#2a2054] text-white">
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Opslaan..." : "Meal Plan Opslaan"}
        </Button>
      </div>

      {/* Recipe Picker Dialog */}
      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Kies een recept</DialogTitle>
          </DialogHeader>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Zoek recept..."
              value={recipeSearch}
              onChange={(e) => setRecipeSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="overflow-y-auto flex-1 space-y-2">
            {filteredRecipes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ChefHat className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>Geen recepten gevonden</p>
                <p className="text-sm mt-1">Maak eerst recepten aan of importeer ze</p>
              </div>
            ) : (
              filteredRecipes.map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => selectRecipe(recipe)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  {recipe.image_url ? (
                    <img src={recipe.image_url} alt="" className="w-12 h-12 rounded object-cover shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center shrink-0">
                      <ChefHat className="h-5 w-5 text-gray-300" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{recipe.title}</p>
                    {recipe.calories && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Flame className="h-3 w-3 text-orange-500" />
                        {recipe.calories} kcal
                        {recipe.protein_grams && <span>· P: {recipe.protein_grams}g</span>}
                        {recipe.carbs_grams && <span>· K: {recipe.carbs_grams}g</span>}
                        {recipe.fat_grams && <span>· V: {recipe.fat_grams}g</span>}
                      </p>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
