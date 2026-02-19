/**
 * Shared Groq LLM + RAG knowledge base utilities.
 * Used by ai-intake, ai-coaching, and future AI features.
 */
import dns from "node:dns"

// Fix: Node.js undici (fetch) on Windows tries IPv6 first and fails for some hosts.
// Force IPv4-first to prevent "fetch failed" errors.
dns.setDefaultResultOrder("ipv4first")

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
const GROQ_MODEL = "llama-3.3-70b-versatile"
const RAG_API_URL = "https://rag.evotiondata.com/api/v1/query"

function getGroqApiKey(): string {
  const key = process.env.GROQ_API_KEY
  if (!key) throw new Error("GROQ_API_KEY is not configured")
  return key
}

function getRagAuthToken(): string {
  return process.env.RAG_AUTH_TOKEN || ""
}

export interface GroqResponse {
  content: string
  tokensUsed: number
  model: string
}

/**
 * Call Groq (Llama 3.3 70B) with system + user messages.
 */
export async function callGroq(params: {
  systemPrompt: string
  userMessage: string
  maxTokens?: number
  temperature?: number
  jsonMode?: boolean
}): Promise<GroqResponse> {
  const { systemPrompt, userMessage, maxTokens = 4000, temperature = 0.3, jsonMode = false } = params

  const body: Record<string, unknown> = {
    model: GROQ_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    max_tokens: maxTokens,
    temperature,
  }

  if (jsonMode) {
    body.response_format = { type: "json_object" }
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getGroqApiKey()}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(60000), // 60s timeout
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Groq API error: ${response.status} — ${err}`)
  }

  const result = await response.json()
  const content = result.choices?.[0]?.message?.content || ""
  if (!content) throw new Error("Geen antwoord van AI")

  const tokensUsed = (result.usage?.prompt_tokens || 0) + (result.usage?.completion_tokens || 0)

  return { content, tokensUsed, model: GROQ_MODEL }
}

/**
 * Query the RAG knowledge base for relevant coaching knowledge.
 * Returns the answer text, or empty string if RAG is unavailable.
 */
export async function fetchRagContext(query: string, topK: number = 8): Promise<string> {
  const token = getRagAuthToken()
  if (!token) return ""

  try {
    const response = await fetch(RAG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        question: query,
        top_k: topK,
        include_sources: false,
        temperature: 0.1,
      }),
      signal: AbortSignal.timeout(15000),
    })

    if (!response.ok) return ""
    const result = await response.json()
    return result.answer || ""
  } catch {
    return ""
  }
}
