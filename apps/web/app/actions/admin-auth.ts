"use server"

import { Redis } from "@upstash/redis"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

// Admin credentials - in production, use environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "evotion2024!"

const SESSION_EXPIRY = 60 * 60 * 24 // 24 hours in seconds

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

export async function loginAdmin(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  if (!username || !password) {
    return { success: false, error: "Vul beide velden in" }
  }

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return { success: false, error: "Ongeldige inloggegevens" }
  }

  try {
    // Create session
    const sessionId = generateSessionId()

    await redis.set(`admin:session:${sessionId}`, { username, createdAt: Date.now() }, { ex: SESSION_EXPIRY })

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set("admin_session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_EXPIRY,
      path: "/",
    })

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "Er is een fout opgetreden bij het inloggen" }
  }
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("admin_session")?.value

  if (sessionId) {
    await redis.del(`admin:session:${sessionId}`)
    cookieStore.delete("admin_session")
  }

  redirect("/admin/login")
}

export async function checkAdminSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("admin_session")?.value

  if (!sessionId) {
    return false
  }

  const session = await redis.get(`admin:session:${sessionId}`)
  return !!session
}

export async function getAdminSession(): Promise<{ username: string; createdAt: number } | null> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("admin_session")?.value

  if (!sessionId) {
    return null
  }

  const session = await redis.get<{ username: string; createdAt: number }>(`admin:session:${sessionId}`)
  return session
}
