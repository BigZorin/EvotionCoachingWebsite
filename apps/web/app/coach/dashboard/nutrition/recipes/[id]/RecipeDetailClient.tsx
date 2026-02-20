"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getRecipe, deleteRecipe } from "@/app/actions/nutrition"
import { ArrowLeft, Edit, Trash2, Flame, Clock, ChefHat, Users } from "lucide-react"

type Recipe = {
  id: string
  title: string
  description: string | null
  image_url: string | null
  source: string
  source_id: string | null
  servings: number
  prep_time_min: number | null
  cook_time_min: number | null
  calories: number | null
  protein_grams: number | null
  carbs_grams: number | null
  fat_grams: number | null
  instructions: string | null
  tags: string[]
  recipe_ingredients: Array<{
    id: string
    name: string
    amount: number | null
    unit: string | null
    order_index: number
  }>
}

export default function RecipeDetailClient() {
  const router = useRouter()
  const params = useParams()
  const recipeId = params.id as string

  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadRecipe()
  }, [recipeId])

  const loadRecipe = async () => {
    setIsLoading(true)
    const result = await getRecipe(recipeId)
    if (result.success && result.recipe) {
      setRecipe(result.recipe as Recipe)
    }
    setIsLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm("Weet je zeker dat je dit recept wilt verwijderen?")) return
    setDeleting(true)
    const result = await deleteRecipe(recipeId)
    if (result.success) {
      router.push("/coach/dashboard/nutrition/recipes")
    } else {
      alert(result.error || "Fout bij verwijderen")
      setDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Recept niet gevonden</p>
        <Button variant="outline" onClick={() => router.back()} className="mt-4">
          Terug
        </Button>
      </div>
    )
  }

  const totalTime = (recipe.prep_time_min || 0) + (recipe.cook_time_min || 0)

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">{recipe.title}</h1>
          {recipe.source === "spoonacular" && (
            <Badge variant="secondary">Spoonacular</Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/coach/dashboard/nutrition/recipes/${recipeId}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Bewerken
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={deleting}
            className="text-destructive hover:text-destructive hover:bg-destructive/5"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Verwijderen
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          {recipe.image_url && (
            <div className="aspect-video rounded-lg overflow-hidden bg-secondary">
              <img
                src={recipe.image_url}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Description */}
          {recipe.description && (
            <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-6">
                <p className="text-foreground">{recipe.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Ingredients */}
          {recipe.recipe_ingredients?.length > 0 && (
            <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Ingrediënten</h2>
                <ul className="space-y-2">
                  {recipe.recipe_ingredients
                    .sort((a, b) => a.order_index - b.order_index)
                    .map((ing) => (
                      <li key={ing.id} className="flex items-center gap-2 text-foreground">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                        {ing.amount && (
                          <span className="font-medium">
                            {ing.amount} {ing.unit}
                          </span>
                        )}
                        <span>{ing.name}</span>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          {recipe.instructions && (
            <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Bereidingswijze</h2>
                <div className="text-foreground whitespace-pre-line">{recipe.instructions}</div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Macros */}
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Voedingswaarden</h2>
              <div className="space-y-3">
                {recipe.calories != null && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Flame className="h-4 w-4 text-orange-500" />
                      Calorieën
                    </span>
                    <span className="font-semibold">{recipe.calories} kcal</span>
                  </div>
                )}
                {recipe.protein_grams != null && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Eiwit</span>
                    <span className="font-semibold">{recipe.protein_grams}g</span>
                  </div>
                )}
                {recipe.carbs_grams != null && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Koolhydraten</span>
                    <span className="font-semibold">{recipe.carbs_grams}g</span>
                  </div>
                )}
                {recipe.fat_grams != null && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Vet</span>
                    <span className="font-semibold">{recipe.fat_grams}g</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Info */}
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-6 space-y-3">
              {recipe.servings && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    Porties
                  </span>
                  <span className="font-semibold">{recipe.servings}</span>
                </div>
              )}
              {totalTime > 0 && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Totale tijd
                  </span>
                  <span className="font-semibold">{totalTime} min</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-3">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
