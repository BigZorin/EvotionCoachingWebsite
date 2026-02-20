"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getMealPlans, deleteMealPlan } from "@/app/actions/nutrition"
import {
  UtensilsCrossed,
  Plus,
  Edit,
  Trash2,
  UserPlus,
  Users,
  AlertCircle,
  Calendar,
  ChefHat,
  Loader2,
  MoreHorizontal,
  Copy,
  Utensils,
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

function MacroBalk({ label, waarde, max, kleur }: { label: string; waarde: number; max: number; kleur: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{waarde}g</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-secondary">
        <div
          className={`h-full rounded-full ${kleur}`}
          style={{ width: `${Math.min((waarde / max) * 100, 100)}%` }}
        />
      </div>
    </div>
  )
}

export default function MealPlansClient() {
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
    if (!confirm("Weet je zeker dat je dit voedingsplan wilt verwijderen?")) return
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Voedingsplannen laden...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">Voeding</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Beheer voedingsplannen en volg cliëntvoeding</p>
        </div>
        <Button asChild>
          <Link href="/coach/dashboard/nutrition/meal-plans/create">
            <Plus className="size-4 mr-1.5" />
            Voedingsplan aanmaken
          </Link>
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg">
          <AlertCircle className="size-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <Tabs defaultValue="plannen">
        <TabsList>
          <TabsTrigger value="plannen">Voedingsplannen ({mealPlans.length})</TabsTrigger>
          <TabsTrigger value="tracking">Cliënt tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="plannen" className="mt-4">
          {mealPlans.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <UtensilsCrossed className="size-10 text-muted-foreground/30 mb-3" />
              <h3 className="font-semibold mb-1">Nog geen voedingsplannen</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md">
                Maak je eerste voedingsplan met macro-targets en recepten om aan cliënten toe te wijzen.
              </p>
              <Button asChild>
                <Link href="/coach/dashboard/nutrition/meal-plans/create">
                  <Plus className="size-4 mr-1.5" />
                  Maak voedingsplan
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {mealPlans.map((plan) => (
                <Card key={plan.id} className="border-border shadow-sm hover:border-primary/30 transition-all cursor-pointer group">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Utensils className="size-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold group-hover:text-primary transition-colors">
                            {plan.name}
                          </p>
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] mt-0.5">
                            Actief
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/coach/dashboard/nutrition/meal-plans/${plan.id}/edit`}>
                              <Edit className="mr-2 size-4" />
                              Plan bewerken
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/coach/dashboard/nutrition/meal-plans/${plan.id}/assign`}>
                              <UserPlus className="mr-2 size-4" />
                              Toewijzen aan cliënt
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDelete(plan.id)}
                            disabled={deletingId === plan.id}
                          >
                            <Trash2 className="mr-2 size-4" />
                            Verwijderen
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {plan.description && (
                      <p className="mt-3 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {plan.description}
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between text-xs">
                      <span className="font-semibold">
                        {plan.daily_calories ? `${plan.daily_calories} kcal` : "—"}
                      </span>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <ChefHat className="size-3.5" />
                          {getRecipeCount(plan)} recepten
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3.5" />
                          {getDayCount(plan)} dagen
                        </span>
                      </div>
                    </div>

                    {/* Macro bars */}
                    {(plan.protein_grams || plan.carbs_grams || plan.fat_grams) && (
                      <div className="mt-3 flex flex-col gap-2">
                        {plan.protein_grams && (
                          <MacroBalk label="Eiwit" waarde={plan.protein_grams} max={250} kleur="bg-primary" />
                        )}
                        {plan.carbs_grams && (
                          <MacroBalk label="Koolhydraten" waarde={plan.carbs_grams} max={400} kleur="bg-blue-500" />
                        )}
                        {plan.fat_grams && (
                          <MacroBalk label="Vet" waarde={plan.fat_grams} max={100} kleur="bg-amber-500" />
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tracking" className="mt-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Voedingsnaleving cliënten</CardTitle>
              <p className="text-xs text-muted-foreground">Weekgemiddelden en tracking compliance</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="size-10 text-muted-foreground/30 mb-3" />
                <h3 className="font-semibold mb-1">Cliënt tracking</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Wanneer cliënten hun voeding gaan loggen in de app, verschijnt hier een
                  overzicht van hun naleving en macro-tracking per week.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
