import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { searchRecipes } from "@/lib/spoonacular"

async function checkCoachAuth() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {}
        },
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const role = user.user_metadata?.role || "CLIENT"
  return role === "ADMIN" || role === "COACH"
}

export async function GET(request: NextRequest) {
  const authorized = await checkCoachAuth()
  if (!authorized) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")
  if (!query) {
    return NextResponse.json({ error: "Query parameter required" }, { status: 400 })
  }

  try {
    const result = await searchRecipes(query, {
      diet: searchParams.get("diet") || undefined,
      number: Number(searchParams.get("number")) || 12,
      offset: Number(searchParams.get("offset")) || 0,
    })
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
