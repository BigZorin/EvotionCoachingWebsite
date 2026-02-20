"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { getRecipe, updateRecipe } from "@/app/actions/nutrition"
import { ArrowLeft, Plus, X, Save } from "lucide-react"

const COMMON_TAGS = [
  "high-protein", "low-carb", "vegan", "vegetarisch", "glutenvrij",
  "zuivelvrij", "snel", "meal-prep", "ontbijt", "lunch", "diner", "snack",
]

type Ingredient = { name: string; amount: string; unit: string }

export default function EditRecipeClient() {
  const router = useRouter()
  const params = useParams()
  const recipeId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
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
  const [ingredients, setIngredients] = useState<Ingredient[]>([])

  useEffect(() => {
    loadRecipe()
  }, [recipeId])

  const loadRecipe = async () => {
    const result = await getRecipe(recipeId)
    if (result.success && result.recipe) {
      const r = result.recipe as any
      setTitle(r.title || "")
      setDescription(r.description || "")
      setImageUrl(r.image_url || "")
      setServings(String(r.servings || 1))
      setPrepTime(r.prep_time_min ? String(r.prep_time_min) : "")
      setCookTime(r.cook_time_min ? String(r.cook_time_min) : "")
      setCalories(r.calories ? String(r.calories) : "")
      setProtein(r.protein_grams ? String(r.protein_grams) : "")
      setCarbs(r.carbs_grams ? String(r.carbs_grams) : "")
      setFat(r.fat_grams ? String(r.fat_grams) : "")
      setInstructions(r.instructions || "")
      setTags(r.tags || [])
      setIngredients(
        (r.recipe_ingredients || [])
          .sort((a: any, b: any) => a.order_index - b.order_index)
          .map((ing: any) => ({
            name: ing.name,
            amount: ing.amount ? String(ing.amount) : "",
            unit: ing.unit || "",
          }))
      )
    }
    setIsLoading(false)
  }

  const toggleTag = (tag: string) => {
    setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag])
  }

  const addIngredient = () => {
    setIngredients((prev) => [...prev, { name: "", amount: "", unit: "" }])
  }

  const removeIngredient = (idx: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== idx))
  }

  const updateIng = (idx: number, field: keyof Ingredient, value: string) => {
    setIngredients((prev) => prev.map((ing, i) => i === idx ? { ...ing, [field]: value } : ing))
  }

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Titel is verplicht")
      return
    }

    setSaving(true)
    try {
      const result = await updateRecipe(recipeId, {
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
        tags: tags.length > 0 ? tags : [],
        ingredients: ingredients
          .filter((i) => i.name.trim())
          .map((i) => ({
            name: i.name.trim(),
            amount: parseFloat(i.amount) || undefined,
            unit: i.unit.trim() || undefined,
          })),
      })

      if (result.success) {
        router.push(`/coach/dashboard/nutrition/recipes/${recipeId}`)
      } else {
        alert(result.error || "Fout bij opslaan")
      }
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Recept Bewerken</h1>
          <p className="text-muted-foreground">{title}</p>
        </div>
      </div>

      {/* Basic Info */}
      <Card className="bg-card border-border shadow-sm">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Basisgegevens</h2>
          <div className="space-y-2">
            <Label>Titel *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Beschrijving</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Afbeelding URL</Label>
            <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Porties</Label>
              <Input type="number" value={servings} onChange={(e) => setServings(e.target.value)} min="1" />
            </div>
            <div className="space-y-2">
              <Label>Voorbereidingstijd (min)</Label>
              <Input type="number" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Kooktijd (min)</Label>
              <Input type="number" value={cookTime} onChange={(e) => setCookTime(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Macros */}
      <Card className="bg-card border-border shadow-sm">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Voedingswaarden (per portie)</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Calorieën</Label>
              <Input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Eiwit (g)</Label>
              <Input type="number" value={protein} onChange={(e) => setProtein(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Koolhydraten (g)</Label>
              <Input type="number" value={carbs} onChange={(e) => setCarbs(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Vet (g)</Label>
              <Input type="number" value={fat} onChange={(e) => setFat(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ingredients */}
      <Card className="bg-card border-border shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Ingrediënten</h2>
            <Button variant="outline" size="sm" onClick={addIngredient}>
              <Plus className="h-4 w-4 mr-1" /> Toevoegen
            </Button>
          </div>
          <div className="space-y-3">
            {ingredients.map((ing, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <Input placeholder="Ingredient" value={ing.name} onChange={(e) => updateIng(idx, "name", e.target.value)} className="flex-1" />
                <Input type="number" placeholder="Hoev." value={ing.amount} onChange={(e) => updateIng(idx, "amount", e.target.value)} className="w-28" />
                <Input placeholder="Eenheid" value={ing.unit} onChange={(e) => updateIng(idx, "unit", e.target.value)} className="w-24" />
                <Button variant="ghost" size="sm" onClick={() => removeIngredient(idx)} className="text-muted-foreground hover:text-red-500">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card className="bg-card border-border shadow-sm">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {COMMON_TAGS.map((tag) => (
              <Badge
                key={tag}
                variant={tags.includes(tag) ? "default" : "outline"}
                className={`cursor-pointer ${tags.includes(tag) ? "bg-primary hover:bg-primary/90" : "hover:bg-secondary"}`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-card border-border shadow-sm">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Bereidingswijze</h2>
          <Textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={8} />
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-end gap-3 pb-8">
        <Button variant="outline" onClick={() => router.back()}>Annuleren</Button>
        <Button onClick={handleSave} disabled={saving || !title.trim()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Opslaan..." : "Wijzigingen Opslaan"}
        </Button>
      </div>
    </div>
  )
}
