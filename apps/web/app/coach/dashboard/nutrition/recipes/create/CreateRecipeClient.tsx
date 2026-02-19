"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { createRecipe } from "@/app/actions/nutrition"
import { ArrowLeft, Plus, X, Save } from "lucide-react"

const COMMON_TAGS = [
  "high-protein", "low-carb", "vegan", "vegetarisch", "glutenvrij",
  "zuivelvrij", "snel", "meal-prep", "ontbijt", "lunch", "diner", "snack",
]

type Ingredient = { name: string; amount: string; unit: string }

export default function CreateRecipeClient() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [servings, setServings] = useState("1")
  const [prepTime, setPrepTime] = useState("")
  const [cookTime, setCookTime] = useState("")
  const [calories, setCalories] = useState("")
  const [protein, setProtein] = useState("")
  const [carbs, setCarbs] = useState("")
  const [fat, setFat] = useState("")
  const [instructions, setInstructions] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", amount: "", unit: "" },
  ])

  const toggleTag = (tag: string) => {
    setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag])
  }

  const addIngredient = () => {
    setIngredients((prev) => [...prev, { name: "", amount: "", unit: "" }])
  }

  const removeIngredient = (idx: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== idx))
  }

  const updateIngredient = (idx: number, field: keyof Ingredient, value: string) => {
    setIngredients((prev) => prev.map((ing, i) => i === idx ? { ...ing, [field]: value } : ing))
  }

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Titel is verplicht")
      return
    }

    setSaving(true)
    try {
      const result = await createRecipe({
        title: title.trim(),
        description: description.trim() || undefined,
        image_url: imageUrl.trim() || undefined,
        servings: parseInt(servings) || 1,
        prep_time_min: parseInt(prepTime) || undefined,
        cook_time_min: parseInt(cookTime) || undefined,
        calories: parseInt(calories) || undefined,
        protein_grams: parseInt(protein) || undefined,
        carbs_grams: parseInt(carbs) || undefined,
        fat_grams: parseInt(fat) || undefined,
        instructions: instructions.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
        ingredients: ingredients
          .filter((i) => i.name.trim())
          .map((i) => ({
            name: i.name.trim(),
            amount: parseFloat(i.amount) || undefined,
            unit: i.unit.trim() || undefined,
          })),
      })

      if (result.success) {
        router.push("/coach/dashboard/nutrition/recipes")
      } else {
        alert(result.error || "Fout bij opslaan")
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nieuw Recept</h1>
          <p className="text-gray-600">Voeg een nieuw recept toe aan je bibliotheek</p>
        </div>
      </div>

      {/* Basic Info */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Basisgegevens</h2>

          <div className="space-y-2">
            <Label>Titel *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Bijv. Griekse yoghurt bowl"
            />
          </div>

          <div className="space-y-2">
            <Label>Beschrijving</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Korte beschrijving van het recept..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Afbeelding URL</Label>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Porties</Label>
              <Input
                type="number"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label>Voorbereidingstijd (min)</Label>
              <Input
                type="number"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                placeholder="15"
              />
            </div>
            <div className="space-y-2">
              <Label>Kooktijd (min)</Label>
              <Input
                type="number"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                placeholder="30"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Macros */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Voedingswaarden (per portie)</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Calorieën</Label>
              <Input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="350"
              />
            </div>
            <div className="space-y-2">
              <Label>Eiwit (g)</Label>
              <Input
                type="number"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                placeholder="25"
              />
            </div>
            <div className="space-y-2">
              <Label>Koolhydraten (g)</Label>
              <Input
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                placeholder="40"
              />
            </div>
            <div className="space-y-2">
              <Label>Vet (g)</Label>
              <Input
                type="number"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                placeholder="12"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ingredients */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Ingrediënten</h2>
            <Button variant="outline" size="sm" onClick={addIngredient}>
              <Plus className="h-4 w-4 mr-1" />
              Toevoegen
            </Button>
          </div>

          <div className="space-y-3">
            {ingredients.map((ing, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <Input
                  placeholder="Ingredient"
                  value={ing.name}
                  onChange={(e) => updateIngredient(idx, "name", e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="Hoeveelheid"
                  value={ing.amount}
                  onChange={(e) => updateIngredient(idx, "amount", e.target.value)}
                  className="w-28"
                />
                <Input
                  placeholder="Eenheid"
                  value={ing.unit}
                  onChange={(e) => updateIngredient(idx, "unit", e.target.value)}
                  className="w-24"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeIngredient(idx)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {COMMON_TAGS.map((tag) => (
              <Badge
                key={tag}
                variant={tags.includes(tag) ? "default" : "outline"}
                className={`cursor-pointer ${
                  tags.includes(tag)
                    ? "bg-[#1e1839] hover:bg-[#2a2054]"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Bereidingswijze</h2>
          <Textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Beschrijf stap voor stap hoe het recept bereid wordt..."
            rows={8}
          />
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3 pb-8">
        <Button variant="outline" onClick={() => router.back()}>
          Annuleren
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving || !title.trim()}
          className="bg-[#1e1839] hover:bg-[#2a2054] text-white"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Opslaan..." : "Recept Opslaan"}
        </Button>
      </div>
    </div>
  )
}
