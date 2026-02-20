"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { importSpoonacularRecipe } from "@/app/actions/nutrition"
import {
  ArrowLeft,
  Search,
  Download,
  Flame,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react"

type SearchResult = {
  id: number
  title: string
  image: string
  calories?: number
  protein?: string
  carbs?: string
  fat?: string
}

const DIET_OPTIONS = [
  { value: "", label: "Alle diëten" },
  { value: "vegetarian", label: "Vegetarisch" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten free", label: "Glutenvrij" },
  { value: "ketogenic", label: "Keto" },
  { value: "paleo", label: "Paleo" },
]

export default function ImportRecipeClient() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [diet, setDiet] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [totalResults, setTotalResults] = useState(0)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [importingId, setImportingId] = useState<number | null>(null)
  const [importedIds, setImportedIds] = useState<Set<number>>(new Set())

  const handleSearch = async () => {
    if (!query.trim()) return
    setIsSearching(true)
    setError(null)

    try {
      const params = new URLSearchParams({ query: query.trim(), number: "12" })
      if (diet) params.set("diet", diet)

      const res = await fetch(`/api/spoonacular/search?${params}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Zoeken mislukt")
        return
      }

      setResults(data.results || [])
      setTotalResults(data.totalResults || 0)
    } catch (e: any) {
      setError(e.message || "Netwerkfout")
    } finally {
      setIsSearching(false)
    }
  }

  const handleImport = async (result: SearchResult) => {
    setImportingId(result.id)
    try {
      // Fetch full recipe details
      const res = await fetch(`/api/spoonacular/${result.id}`)
      const detail = await res.json()

      if (!res.ok) {
        alert(detail.error || "Kon recept niet ophalen")
        return
      }

      const importResult = await importSpoonacularRecipe({
        title: detail.title,
        description: detail.summary || undefined,
        image_url: detail.image || undefined,
        source_id: String(detail.id),
        servings: detail.servings || undefined,
        prep_time_min: detail.preparationMinutes || undefined,
        cook_time_min: detail.cookingMinutes || undefined,
        calories: detail.calories || undefined,
        protein_grams: detail.protein || undefined,
        carbs_grams: detail.carbs || undefined,
        fat_grams: detail.fat || undefined,
        instructions: detail.instructions || undefined,
        tags: [...(detail.diets || []), ...(detail.dishTypes || [])].slice(0, 5),
        ingredients: (detail.ingredients || []).map((i: any) => ({
          name: i.name,
          amount: i.amount || undefined,
          unit: i.unit || undefined,
        })),
      })

      if (importResult.success) {
        setImportedIds((prev) => new Set([...prev, result.id]))
      } else {
        alert(importResult.error || "Import mislukt")
      }
    } catch (e: any) {
      alert(e.message || "Fout bij importeren")
    } finally {
      setImportingId(null)
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
          <h1 className="text-3xl font-bold text-foreground">Recepten Importeren</h1>
          <p className="text-muted-foreground">Zoek en importeer recepten uit Spoonacular (365.000+ recepten)</p>
        </div>
      </div>

      {/* Search */}
      <Card className="bg-card border-border shadow-sm">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Zoek recepten, bijv. 'chicken pasta', 'overnight oats'..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <select
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
              className="border border-border rounded-md px-3 py-2 text-sm bg-card"
            >
              {DIET_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Button
              onClick={handleSearch}
              disabled={isSearching || !query.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Zoeken
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-destructive/5 text-destructive rounded-lg">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <>
          <p className="text-sm text-muted-foreground">
            {totalResults} resultaten gevonden
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((recipe) => (
              <Card
                key={recipe.id}
                className="bg-card border-border shadow-sm overflow-hidden"
              >
                {recipe.image && (
                  <div className="aspect-video w-full overflow-hidden bg-secondary">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                    {recipe.title}
                  </h3>

                  {recipe.calories != null && (
                    <div className="flex items-center gap-3 mb-4 text-sm">
                      <span className="flex items-center gap-1 text-orange-600">
                        <Flame className="h-3.5 w-3.5" />
                        {recipe.calories} kcal
                      </span>
                      {recipe.protein && <span className="text-muted-foreground">P: {recipe.protein}</span>}
                      {recipe.carbs && <span className="text-muted-foreground">K: {recipe.carbs}</span>}
                      {recipe.fat && <span className="text-muted-foreground">V: {recipe.fat}</span>}
                    </div>
                  )}

                  <Button
                    className={`w-full ${
                      importedIds.has(recipe.id)
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-primary hover:bg-primary/90"
                    } text-primary-foreground`}
                    disabled={importingId === recipe.id || importedIds.has(recipe.id)}
                    onClick={() => handleImport(recipe)}
                  >
                    {importedIds.has(recipe.id) ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Geïmporteerd
                      </>
                    ) : importingId === recipe.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Importeren...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Importeer
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
