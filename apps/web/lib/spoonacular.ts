const API_KEY = process.env.SPOONACULAR_API_KEY || ""
const BASE_URL = "https://api.spoonacular.com"

export interface SpoonacularRecipe {
  id: number
  title: string
  image: string
  servings: number
  readyInMinutes: number
  preparationMinutes: number
  cookingMinutes: number
  summary: string
  instructions: string
  // Nutrition
  calories: number
  protein: number
  carbs: number
  fat: number
  // Ingredients
  ingredients: Array<{
    name: string
    amount: number
    unit: string
  }>
  // Tags
  diets: string[]
  dishTypes: string[]
}

export interface SpoonacularSearchResult {
  id: number
  title: string
  image: string
  calories?: number
  protein?: string
  carbs?: string
  fat?: string
}

/**
 * Search recipes by query with optional diet filter.
 */
export async function searchRecipes(
  query: string,
  options?: { diet?: string; number?: number; offset?: number }
): Promise<{ results: SpoonacularSearchResult[]; totalResults: number }> {
  if (!API_KEY) throw new Error("SPOONACULAR_API_KEY not configured")

  const params = new URLSearchParams({
    apiKey: API_KEY,
    query,
    number: String(options?.number || 12),
    offset: String(options?.offset || 0),
    addRecipeNutrition: "true",
    fillIngredients: "false",
  })

  if (options?.diet) params.set("diet", options.diet)

  const res = await fetch(`${BASE_URL}/recipes/complexSearch?${params}`)
  if (!res.ok) throw new Error(`Spoonacular API error: ${res.status}`)

  const data = await res.json()

  const results: SpoonacularSearchResult[] = (data.results || []).map((r: any) => {
    const nutrients = r.nutrition?.nutrients || []
    const cal = nutrients.find((n: any) => n.name === "Calories")
    const prot = nutrients.find((n: any) => n.name === "Protein")
    const carb = nutrients.find((n: any) => n.name === "Carbohydrates")
    const fatN = nutrients.find((n: any) => n.name === "Fat")

    return {
      id: r.id,
      title: r.title,
      image: r.image,
      calories: cal ? Math.round(cal.amount) : undefined,
      protein: prot ? `${Math.round(prot.amount)}g` : undefined,
      carbs: carb ? `${Math.round(carb.amount)}g` : undefined,
      fat: fatN ? `${Math.round(fatN.amount)}g` : undefined,
    }
  })

  return { results, totalResults: data.totalResults || 0 }
}

/**
 * Get full recipe details by Spoonacular ID.
 */
export async function getRecipeById(id: number): Promise<SpoonacularRecipe> {
  if (!API_KEY) throw new Error("SPOONACULAR_API_KEY not configured")

  const params = new URLSearchParams({
    apiKey: API_KEY,
    includeNutrition: "true",
  })

  const res = await fetch(`${BASE_URL}/recipes/${id}/information?${params}`)
  if (!res.ok) throw new Error(`Spoonacular API error: ${res.status}`)

  const r = await res.json()

  const nutrients = r.nutrition?.nutrients || []
  const cal = nutrients.find((n: any) => n.name === "Calories")
  const prot = nutrients.find((n: any) => n.name === "Protein")
  const carb = nutrients.find((n: any) => n.name === "Carbohydrates")
  const fatN = nutrients.find((n: any) => n.name === "Fat")

  // Strip HTML from instructions/summary
  const stripHtml = (html: string) => html?.replace(/<[^>]*>/g, "") || ""

  return {
    id: r.id,
    title: r.title,
    image: r.image,
    servings: r.servings,
    readyInMinutes: r.readyInMinutes || 0,
    preparationMinutes: r.preparationMinutes || 0,
    cookingMinutes: r.cookingMinutes || 0,
    summary: stripHtml(r.summary || ""),
    instructions: stripHtml(r.instructions || ""),
    calories: cal ? Math.round(cal.amount) : 0,
    protein: prot ? Math.round(prot.amount) : 0,
    carbs: carb ? Math.round(carb.amount) : 0,
    fat: fatN ? Math.round(fatN.amount) : 0,
    ingredients: (r.extendedIngredients || []).map((ing: any) => ({
      name: ing.name || ing.originalName || "",
      amount: ing.amount || 0,
      unit: ing.unit || "",
    })),
    diets: r.diets || [],
    dishTypes: r.dishTypes || [],
  }
}
