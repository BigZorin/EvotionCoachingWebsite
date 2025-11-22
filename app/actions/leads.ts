"use server"

import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

const MANYCHAT_API_KEY = process.env.MANYCHAT_API_KEY || "2895539:8ee87894db25cf91a27133ace4638bcd"

export interface MarketingLead {
  email: string
  name: string
  source: string // "calorie_calculator" | "contact_form"
  phone?: string
  data?: any // Any extra data like calculator results or message subject
  createdAt: string
}

async function syncLeadToManyChat(lead: MarketingLead) {
  if (!MANYCHAT_API_KEY) {
    console.warn("[ManyChat] No API key configured")
    return
  }

  try {
    const nameParts = lead.name.trim().split(" ")
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(" ") || ""

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email: lead.email,
      phone: lead.phone,
      has_opt_in_email: true,
      consent_phrase: `Aangemeld via ${lead.source.replace("_", " ")} op website`,
    }

    console.log("[ManyChat] Syncing subscriber:", lead.email)

    const response = await fetch("https://api.manychat.com/fb/subscriber/createSubscriber", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MANYCHAT_API_KEY}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[ManyChat] API Error:", errorText)
      // Don't throw, just log. We don't want to break the main flow.
    } else {
      const data = await response.json()
      console.log("[ManyChat] Successfully synced:", data?.data?.id || "Unknown ID")

      // If we have extra data (like calculator results), we could theoretically set Custom Fields here
      // using the subscriber ID we just got.
    }
  } catch (error) {
    console.error("[ManyChat] Sync failed:", error)
  }
}

export async function saveLeadToRedis(lead: MarketingLead) {
  try {
    // We don't await this because we don't want to slow down the user experience
    // or fail the request if ManyChat is down.
    syncLeadToManyChat(lead).catch((err) => console.error("ManyChat background sync error:", err))

    // 1. Check if email already exists in our marketing list to avoid duplicates
    const isMember = await redis.sismember("marketing:emails", lead.email)

    if (!isMember) {
      // 2. Add email to the Set of known emails
      await redis.sadd("marketing:emails", lead.email)

      // 3. Add full lead details to the marketing list (LIFO or FIFO depending on need, LPUSH is LIFO)
      // We'll use LPUSH so newest are at the top if we view them
      await redis.lpush("marketing:leads", JSON.stringify(lead))

      console.log(`[Lead Storage] Saved new lead: ${lead.email} from ${lead.source}`)
      return { success: true, isNew: true }
    } else {
      // If email exists, we might want to update the "last seen" or add to a history
      // For now, we'll just log it and maybe push to a "interactions" list if we wanted to be fancy
      // But for a simple email list, we just want unique emails.

      // OPTIONAL: Update the lead data in a hash if we wanted to keep the *latest* info
      // await redis.hset(`marketing:lead:${lead.email}`, lead)

      console.log(`[Lead Storage] Existing lead returned: ${lead.email}`)
      return { success: true, isNew: false }
    }
  } catch (error) {
    console.error("Failed to save lead to Redis:", error)
    return { success: false, error }
  }
}

export async function getMarketingLeads(limit = 100) {
  try {
    const leadsRaw = await redis.lrange("marketing:leads", 0, limit - 1)
    return leadsRaw.map((lead) => (typeof lead === "string" ? JSON.parse(lead) : lead))
  } catch (error) {
    console.error("Failed to fetch marketing leads:", error)
    return []
  }
}
