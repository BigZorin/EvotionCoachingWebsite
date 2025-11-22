export interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

export const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
}

export function getCookieConsent(): CookiePreferences | null {
  if (typeof window === "undefined") return null

  try {
    const consent = localStorage.getItem("evotion-cookie-consent")
    if (!consent) return null

    const consentData = JSON.parse(consent)
    return consentData.preferences || null
  } catch (error) {
    console.error("Error getting cookie consent:", error)
    // Clear corrupted data
    localStorage.removeItem("evotion-cookie-consent")
    return null
  }
}

export function setCookieConsent(preferences: CookiePreferences): void {
  if (typeof window === "undefined") return

  const consentData = {
    timestamp: new Date().toISOString(),
    preferences,
    version: "1.0",
  }

  try {
    localStorage.setItem("evotion-cookie-consent", JSON.stringify(consentData))
  } catch (error) {
    console.error("Error setting cookie consent:", error)
  }
}

export function hasAnalyticsConsent(): boolean {
  const consent = getCookieConsent()
  return consent?.analytics || false
}

export function hasMarketingConsent(): boolean {
  const consent = getCookieConsent()
  return consent?.marketing || false
}

export function hasPreferencesConsent(): boolean {
  const consent = getCookieConsent()
  return consent?.preferences || false
}

import { trackServerEvent } from "@/app/actions/analytics"

export function logCookieAction(action: string, preferences?: CookiePreferences): void {
  if (typeof window === "undefined") return

  try {
    const logs = JSON.parse(localStorage.getItem("evotion-cookie-logs") || "[]")
    const logEntry = {
      timestamp: new Date().toISOString(),
      action,
      preferences: preferences || getCookieConsent(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    logs.push(logEntry)

    // Keep only last 100 entries
    if (logs.length > 100) {
      logs.splice(0, logs.length - 100)
    }

    localStorage.setItem("evotion-cookie-logs", JSON.stringify(logs))

    trackServerEvent({
      type: "cookie_consent_update",
      data: { action, preferences },
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      path: window.location.pathname,
    }).catch((err) => console.error("Failed to track cookie action:", err))
  } catch (error) {
    console.error("Error logging cookie action:", error)
  }
}

export function initializeGoogleAnalytics(): void {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) return

  // Check if already initialized
  if (window.gtag) return

  try {
    // Load Google Analytics script
    const script = document.createElement("script")
    script.async = true
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-MCL41XYPGM"
    document.head.appendChild(script)

    // Initialize gtag
    const script2 = document.createElement("script")
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-MCL41XYPGM', {
        page_title: document.title,
        page_location: window.location.href,
        anonymize_ip: true
      });
    `
    document.head.appendChild(script2)

    // Set global gtag function
    window.gtag = () => {
      window.dataLayer.push(arguments)
    }
  } catch (error) {
    console.error("Error initializing Google Analytics:", error)
  }
}

export function trackEvent(eventName: string, parameters?: Record<string, any>): void {
  if (typeof window === "undefined" || !hasAnalyticsConsent() || !window.gtag) return

  try {
    window.gtag("event", eventName, parameters)
  } catch (error) {
    console.error("Error tracking event:", error)
  }
}

export function trackPageView(path: string): void {
  if (typeof window === "undefined" || !hasAnalyticsConsent() || !window.gtag) return

  try {
    window.gtag("config", "G-MCL41XYPGM", {
      page_path: path,
      page_title: document.title,
      page_location: window.location.href,
    })
  } catch (error) {
    console.error("Error tracking page view:", error)
  }

  if (hasAnalyticsConsent()) {
    trackServerEvent({
      type: "page_view",
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      path: path,
    }).catch((err) => console.error("Failed to track page view:", err))
  }
}

export function logCalculatorAction(action: "started" | "completed", data?: any): void {
  if (typeof window === "undefined") return

  try {
    const logs = JSON.parse(localStorage.getItem("evotion-calculator-logs") || "[]")
    const logEntry = {
      timestamp: new Date().toISOString(),
      action,
      data,
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    logs.push(logEntry)

    // Keep only last 200 entries
    if (logs.length > 200) {
      logs.splice(0, logs.length - 200)
    }

    localStorage.setItem("evotion-calculator-logs", JSON.stringify(logs))

    trackServerEvent({
      type: `calculator_${action}`,
      data,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      path: window.location.pathname,
    }).catch((err) => console.error("Failed to track calculator action:", err))
  } catch (error) {
    console.error("Error logging calculator action:", error)
  }
}

export function logContactSubmission(type: "contact" | "calculator", data?: any): void {
  if (typeof window === "undefined") return

  try {
    const logs = JSON.parse(localStorage.getItem("evotion-contact-logs") || "[]")
    const logEntry = {
      timestamp: new Date().toISOString(),
      type,
      data,
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    logs.push(logEntry)

    // Keep only last 200 entries
    if (logs.length > 200) {
      logs.splice(0, logs.length - 200)
    }

    localStorage.setItem("evotion-contact-logs", JSON.stringify(logs))

    // Track on server only if it's a generic contact form
    if (type === "contact") {
      trackServerEvent({
        type: "contact_submission_client_log",
        data,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        path: window.location.pathname,
      }).catch((err) => console.error("Failed to track contact submission:", err))
    }
  } catch (error) {
    console.error("Error logging contact submission:", error)
  }
}

export function getCalculatorLogs(): any[] {
  if (typeof window === "undefined") return []

  try {
    return JSON.parse(localStorage.getItem("evotion-calculator-logs") || "[]")
  } catch (error) {
    console.error("Error getting calculator logs:", error)
    return []
  }
}

export function getContactLogs(): any[] {
  if (typeof window === "undefined") return []

  try {
    return JSON.parse(localStorage.getItem("evotion-contact-logs") || "[]")
  } catch (error) {
    console.error("Error getting contact logs:", error)
    return []
  }
}

export function getCookieLogs(): any[] {
  if (typeof window === "undefined") return []

  try {
    return JSON.parse(localStorage.getItem("evotion-cookie-logs") || "[]")
  } catch (error) {
    console.error("Error getting cookie logs:", error)
    return []
  }
}

export function clearCookieLogs(): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem("evotion-cookie-logs")
  } catch (error) {
    console.error("Error clearing cookie logs:", error)
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}
