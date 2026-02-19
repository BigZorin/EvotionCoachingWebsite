"use client"

import { useState, useEffect } from "react"
import { getCookieConsent, setCookieConsent, logCookieAction, type CookiePreferences } from "@/utils/cookie-utils"

export function useCookieConsent() {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null)
  const [hasConsented, setHasConsented] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const consent = getCookieConsent()
    if (consent) {
      setPreferences(consent)
      setHasConsented(true)
    }
    setLoading(false)
  }, [])

  const updatePreferences = (newPreferences: CookiePreferences) => {
    setPreferences(newPreferences)
    setCookieConsent(newPreferences)
    setHasConsented(true)
    logCookieAction("update_preferences", newPreferences)
  }

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    }
    updatePreferences(allAccepted)
  }

  const rejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    }
    updatePreferences(onlyNecessary)
  }

  return {
    preferences,
    hasConsented,
    loading,
    updatePreferences,
    acceptAll,
    rejectAll,
  }
}
