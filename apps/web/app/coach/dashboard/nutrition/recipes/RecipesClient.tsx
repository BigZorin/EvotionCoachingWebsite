"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getRecipes, deleteRecipe } from "@/app/actions/nutrition"
import {
  ChefHat,
  Plus,
  Search,
  Trash2,
  Edit,
  Flame,
  Clock,
  Download,
  AlertCircle,
  Eye,
} from "lucide-react"

type Recipe = {
  id: string
  title: string
  description: string | null
  image_url: string | null
  source: string
  calories: number | null
  protein_grams: number | null
  carbs_grams: number | null
  fat_grams: number | null
  prep_time_min: number | null
  cook_time_min: number | null
  tags: string[]
  created_at: string
}

export default function RecipesClient() {
  const router = useRouter()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    loadRecipes()
  }, [])

  const loadRecipes = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await getRecipes()
      if (result.success && result.recipes) {
        setRecipes(result.recipes as Recipe[])
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
    if (!confirm("Weet je zeker dat je dit recept wilt verwijderen?")) return
    setDeletingId(id)
    try {
      const result = await deleteRecipe(id)
      if (result.success) {
        setRecipes((prev) => prev.filter((r) => r.id !== id))
      } else {
        alert(result.error || "Fout bij verwijderen")
      }
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = recipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    (r.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recepten</h1>
          <p className="text-gray-600">Beheer je receptenbibliotheek</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.push("/coach/dashboard/nutrition/recipes/import")}
          >
            <Download className="h-4 w-4 mr-2" />
            Importeer
          </Button>
          <Button
            onClick={() => router.push("/coach/dashboard/nutrition/recipes/create")}
            className="bg-[#1e1839] hover:bg-[#2a2054] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nieuw Recept
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Zoek op naam of tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-900 text-xl flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1e1839]"></div>
            Laden...
          </div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Fout</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-12 text-center">
            <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {search ? "Geen resultaten" : "Geen Recepten"}
            </h3>
            <p className="text-gray-600 mb-6">
              {search
                ? "Probeer een andere zoekterm"
                : "Maak je eerste recept aan of importeer uit Spoonacular."}
            </p>
            {!search && (
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => router.push("/coach/dashboard/nutrition/recipes/import")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Importeer
                </Button>
                <Button
                  onClick={() => router.push("/coach/dashboard/nutrition/recipes/create")}
                  className="bg-[#1e1839] hover:bg-[#2a2054] text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nieuw Recept
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((recipe) => (
            <Card
              key={recipe.id}
              className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Image */}
              {recipe.image_url ? (
                <div className="aspect-video w-full overflow-hidden bg-gray-100">
                  <img
                    src={recipe.image_url}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full bg-gray-100 flex items-center justify-center">
                  <ChefHat className="h-12 w-12 text-gray-300" />
                </div>
              )}

              <CardContent className="p-5">
                {/* Title + Source badge */}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                    {recipe.title}
                  </h3>
                  {recipe.source === "spoonacular" && (
                    <Badge variant="secondary" className="ml-2 text-xs shrink-0">
                      Spoonacular
                    </Badge>
                  )}
                </div>

                {/* Macros */}
                {recipe.calories != null && (
                  <div className="flex items-center gap-4 mb-3 text-sm">
                    <span className="flex items-center gap-1 text-orange-600">
                      <Flame className="h-3.5 w-3.5" />
                      {recipe.calories} kcal
                    </span>
                    {recipe.protein_grams != null && (
                      <span className="text-gray-600">P: {recipe.protein_grams}g</span>
                    )}
                    {recipe.carbs_grams != null && (
                      <span className="text-gray-600">K: {recipe.carbs_grams}g</span>
                    )}
                    {recipe.fat_grams != null && (
                      <span className="text-gray-600">V: {recipe.fat_grams}g</span>
                    )}
                  </div>
                )}

                {/* Time */}
                {(recipe.prep_time_min || recipe.cook_time_min) && (
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                    <Clock className="h-3.5 w-3.5" />
                    {(recipe.prep_time_min || 0) + (recipe.cook_time_min || 0)} min
                  </div>
                )}

                {/* Tags */}
                {recipe.tags && recipe.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {recipe.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {recipe.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{recipe.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/coach/dashboard/nutrition/recipes/${recipe.id}`)}
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    Bekijk
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/coach/dashboard/nutrition/recipes/${recipe.id}/edit`)}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(recipe.id)}
                    disabled={deletingId === recipe.id}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {deletingId === recipe.id ? (
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-red-600" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
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
