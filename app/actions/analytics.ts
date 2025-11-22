"use server"

import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export type AnalyticsEvent = {
  type: string
  data?: any
  timestamp: string
  userAgent?: string
  path?: string
  visitorId?: string // Added visitorId field
}

export async function trackServerEvent(event: AnalyticsEvent) {
  try {
    const date = new Date().toISOString().split("T")[0] // YYYY-MM-DD

    // 1. Increment daily counter for this event type
    await redis.incr(`analytics:daily:${date}:${event.type}`)

    if (event.visitorId) {
      await redis.sadd(`analytics:daily:${date}:visitors`, event.visitorId)
    }

    if (event.type === "page_view" && event.path) {
      await redis.zincrby(`analytics:pages:${date}`, 1, event.path)
    }

    if (event.type === "cookie_consent_update" && event.data) {
      // Store consent stats separately if needed, or just rely on the event log
      // For now, rely on event log or simple daily counter
    }

    // 2. Store detailed event in a list (capped at 1000 items)
    // specific list for leads to ensure we don't lose them in the noise
    if (event.type === "lead_generated" || event.type === "contact_submission") {
      await redis.lpush("analytics:leads", JSON.stringify(event))
    }

    // General events log
    await redis.lpush("analytics:events", JSON.stringify(event))
    await redis.ltrim("analytics:events", 0, 999) // Keep last 1000 events
  } catch (error) {
    console.error("Failed to track server event:", error)
  }
}

export async function getDashboardData() {
  try {
    const today = new Date().toISOString().split("T")[0]

    // Fetch counts
    const [dailyVisitors, dailyCalculatorStarts, dailyCalculatorCompletions, dailyLeads, dailyContactSubmissions] =
      await Promise.all([
        redis.scard(`analytics:daily:${today}:visitors`), // Use SCARD for unique visitors
        redis.get(`analytics:daily:${today}:calculator_started`),
        redis.get(`analytics:daily:${today}:calculator_completed`),
        redis.get(`analytics:daily:${today}:lead_generated`),
        redis.get(`analytics:daily:${today}:contact_submission`),
      ])

    const topPagesRaw = await redis.zrange(`analytics:pages:${today}`, 0, 4, { rev: true, withScores: true })
    const topPages = []
    for (let i = 0; i < topPagesRaw.length; i += 2) {
      topPages.push({ url: topPagesRaw[i] as string, visits: Number(topPagesRaw[i + 1]) })
    }

    // Fetch recent events
    const recentEventsRaw = await redis.lrange("analytics:events", 0, 49)
    const recentEvents = recentEventsRaw.map((e) => (typeof e === "string" ? JSON.parse(e) : e))

    return {
      stats: {
        visitors: Number(dailyVisitors) || 0,
        calculatorStarts: Number(dailyCalculatorStarts) || 0,
        calculatorCompletions: Number(dailyCalculatorCompletions) || 0,
        leads: Number(dailyLeads) || 0,
        contactSubmissions: Number(dailyContactSubmissions) || 0,
      },
      topPages,
      recentActivity: recentEvents,
    }
  } catch (error) {
    console.error("Failed to get dashboard data:", error)
    return {
      stats: { visitors: 0, calculatorStarts: 0, calculatorCompletions: 0, leads: 0, contactSubmissions: 0 },
      topPages: [],
      recentActivity: [],
    }
  }
}
