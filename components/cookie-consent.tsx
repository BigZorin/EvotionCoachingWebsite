"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { X, Settings, Shield, BarChart3, Target } from "lucide-react"

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

const defaultPreferences: CookiePreferences = {
  necessary: true, // Always true, cannot be disabled
  analytics: false,
  marketing: false,
  preferences: false,
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences)
  const [hasConsented, setHasConsented] = useState(false)

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem("evotion-cookie-consent")
    if (consent) {
      try {
        const consentData = JSON.parse(consent)
        setHasConsented(true)
        setPreferences(consentData.preferences || defaultPreferences)

        // Initialize analytics if consented
        if (consentData.preferences?.analytics) {
          initializeAnalytics()
        }
      } catch (error) {
        console.error("Error parsing cookie consent:", error)
        // Clear corrupted data
        localStorage.removeItem("evotion-cookie-consent")
        setShowBanner(true)
      }
    } else {
      setShowBanner(true)
    }
  }, [])

  const initializeAnalytics = () => {
    // Initialize Google Analytics
    if (typeof window !== "undefined" && !window.gtag) {
      const script = document.createElement("script")
      script.async = true
      script.src = "https://www.googletagmanager.com/gtag/js?id=G-MCL41XYPGM"
      document.head.appendChild(script)

      const script2 = document.createElement("script")
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-MCL41XYPGM', {
          page_title: document.title,
          page_location: window.location.href
        });
      `
      document.head.appendChild(script2)

      // Set global gtag function
      window.gtag = () => {
        window.dataLayer.push(arguments)
      }
    }
  }

  const logCookieConsent = (action: string, preferences: CookiePreferences) => {
    try {
      const logs = JSON.parse(localStorage.getItem("evotion-cookie-logs") || "[]")
      const logEntry = {
        timestamp: new Date().toISOString(),
        action,
        preferences,
        userAgent: navigator.userAgent,
        url: window.location.href,
      }
      logs.push(logEntry)

      // Keep only last 100 entries
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100)
      }

      localStorage.setItem("evotion-cookie-logs", JSON.stringify(logs))
    } catch (error) {
      console.error("Error logging cookie consent:", error)
    }
  }

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    }

    setPreferences(allAccepted)
    saveConsent(allAccepted)
    initializeAnalytics()
    logCookieConsent("accept_all", allAccepted)
    setShowBanner(false)
    setShowSettings(false)
    setHasConsented(true)
  }

  const handleRejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    }

    setPreferences(onlyNecessary)
    saveConsent(onlyNecessary)
    logCookieConsent("reject_all", onlyNecessary)
    setShowBanner(false)
    setShowSettings(false)
    setHasConsented(true)
  }

  const handleSavePreferences = () => {
    saveConsent(preferences)

    if (preferences.analytics) {
      initializeAnalytics()
    }

    logCookieConsent("save_preferences", preferences)
    setShowBanner(false)
    setShowSettings(false)
    setHasConsented(true)
  }

  const saveConsent = (prefs: CookiePreferences) => {
    const consentData = {
      timestamp: new Date().toISOString(),
      preferences: prefs,
      version: "1.0",
    }

    try {
      localStorage.setItem("evotion-cookie-consent", JSON.stringify(consentData))
    } catch (error) {
      console.error("Error saving cookie consent:", error)
    }
  }

  const handlePreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
    if (key === "necessary") return // Cannot disable necessary cookies

    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  if (!showBanner && !showSettings) {
    return null
  }

  return (
    <>
      {/* Cookie Banner */}
      {showBanner && !showSettings && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-lg">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-[#1e1839]" />
                  <h3 className="font-semibold text-[#1e1839]">Cookie Voorkeuren</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We gebruiken cookies om je ervaring te verbeteren, verkeer te analyseren en gepersonaliseerde content
                  te bieden. Je kunt je voorkeuren aanpassen of alle cookies accepteren.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 lg:ml-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="text-[#1e1839] border-[#1e1839] hover:bg-[#1e1839] hover:text-white"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Instellingen
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRejectAll}
                  className="text-gray-600 border-gray-300 hover:bg-gray-100 bg-transparent"
                >
                  Alleen Noodzakelijk
                </Button>
                <Button size="sm" onClick={handleAcceptAll} className="bg-[#1e1839] hover:bg-[#1e1839]/90 text-white">
                  Alles Accepteren
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Shield className="w-6 h-6 text-[#1e1839]" />
                  <h2 className="text-xl font-bold text-[#1e1839]">Cookie Instellingen</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                <p className="text-sm text-gray-600">
                  Beheer je cookie voorkeuren. Je kunt je keuzes op elk moment wijzigen via de cookie instellingen in de
                  footer.
                </p>

                {/* Necessary Cookies */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-[#1e1839]">Noodzakelijke Cookies</h3>
                    </div>
                    <Switch checked={true} disabled className="opacity-50" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Deze cookies zijn essentieel voor het functioneren van de website en kunnen niet worden
                    uitgeschakeld.
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-[#1e1839]">Analytische Cookies</h3>
                    </div>
                    <Switch
                      checked={preferences.analytics}
                      onCheckedChange={(checked) => handlePreferenceChange("analytics", checked)}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    Helpen ons te begrijpen hoe bezoekers de website gebruiken via Google Analytics.
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-[#1e1839]">Marketing Cookies</h3>
                    </div>
                    <Switch
                      checked={preferences.marketing}
                      onCheckedChange={(checked) => handlePreferenceChange("marketing", checked)}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    Gebruikt voor het tonen van relevante advertenties en het meten van campagne-effectiviteit.
                  </p>
                </div>

                {/* Preference Cookies */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-orange-600" />
                      <h3 className="font-semibold text-[#1e1839]">Voorkeur Cookies</h3>
                    </div>
                    <Switch
                      checked={preferences.preferences}
                      onCheckedChange={(checked) => handlePreferenceChange("preferences", checked)}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    Onthouden je voorkeuren en instellingen voor een betere gebruikerservaring.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Button
                  variant="outline"
                  onClick={handleRejectAll}
                  className="flex-1 text-gray-600 border-gray-300 hover:bg-gray-100 bg-transparent"
                >
                  Alleen Noodzakelijk
                </Button>
                <Button
                  onClick={handleSavePreferences}
                  className="flex-1 bg-[#1e1839] hover:bg-[#1e1839]/90 text-white"
                >
                  Voorkeuren Opslaan
                </Button>
                <Button onClick={handleAcceptAll} className="flex-1 bg-[#bad4e1] hover:bg-[#bad4e1]/90 text-[#1e1839]">
                  Alles Accepteren
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
