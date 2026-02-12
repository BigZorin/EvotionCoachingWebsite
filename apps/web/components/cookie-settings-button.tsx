"use client"

import { useState } from "react"
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

export default function CookieSettingsButton() {
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  })

  // Load current preferences when component mounts
  useState(() => {
    if (typeof window !== "undefined") {
      try {
        const consent = localStorage.getItem("evotion-cookie-consent")
        if (consent) {
          const consentData = JSON.parse(consent)
          setPreferences(consentData.preferences || preferences)
        }
      } catch (error) {
        console.error("Error loading cookie preferences:", error)
      }
    }
  })

  const handlePreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
    if (key === "necessary") return // Cannot disable necessary cookies

    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSavePreferences = () => {
    const consentData = {
      timestamp: new Date().toISOString(),
      preferences,
      version: "1.0",
    }

    try {
      localStorage.setItem("evotion-cookie-consent", JSON.stringify(consentData))

      // Log the change
      const logs = JSON.parse(localStorage.getItem("evotion-cookie-logs") || "[]")
      logs.push({
        timestamp: new Date().toISOString(),
        action: "update_preferences",
        preferences,
        userAgent: navigator.userAgent,
        url: window.location.href,
      })
      localStorage.setItem("evotion-cookie-logs", JSON.stringify(logs))

      setShowSettings(false)

      // Reload page to apply changes
      window.location.reload()
    } catch (error) {
      console.error("Error saving cookie preferences:", error)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowSettings(true)}
        className="text-gray-400 hover:text-white transition-colors text-sm"
      >
        Cookie Instellingen
      </button>

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-4">
          <Card className="w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto mx-2 sm:mx-0">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-[#1e1839]" />
                  <h2 className="text-lg sm:text-xl font-bold text-[#1e1839]">Cookie Instellingen</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                  className="text-gray-500 hover:text-gray-700 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <p className="text-xs sm:text-sm text-gray-600">
                  Beheer je cookie voorkeuren. Deze wijzigingen worden direct toegepast.
                </p>

                {/* Necessary Cookies */}
                <div className="border rounded-lg p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      <h3 className="font-semibold text-sm sm:text-base text-[#1e1839]">Noodzakelijke Cookies</h3>
                    </div>
                    <Switch checked={true} disabled className="opacity-50" />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Deze cookies zijn essentieel voor het functioneren van de website en kunnen niet worden
                    uitgeschakeld.
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="border rounded-lg p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      <h3 className="font-semibold text-sm sm:text-base text-[#1e1839]">Analytische Cookies</h3>
                    </div>
                    <Switch
                      checked={preferences.analytics}
                      onCheckedChange={(checked) => handlePreferenceChange("analytics", checked)}
                    />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Helpen ons te begrijpen hoe bezoekers de website gebruiken via Google Analytics.
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className="border rounded-lg p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                      <h3 className="font-semibold text-sm sm:text-base text-[#1e1839]">Marketing Cookies</h3>
                    </div>
                    <Switch
                      checked={preferences.marketing}
                      onCheckedChange={(checked) => handlePreferenceChange("marketing", checked)}
                    />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Gebruikt voor het tonen van relevante advertenties en het meten van campagne-effectiviteit.
                  </p>
                </div>

                {/* Preference Cookies */}
                <div className="border rounded-lg p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                      <h3 className="font-semibold text-sm sm:text-base text-[#1e1839]">Voorkeur Cookies</h3>
                    </div>
                    <Switch
                      checked={preferences.preferences}
                      onCheckedChange={(checked) => handlePreferenceChange("preferences", checked)}
                    />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Onthouden je voorkeuren en instellingen voor een betere gebruikerservaring.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 mt-6 sm:mt-8">
                <Button
                  variant="outline"
                  onClick={() => setShowSettings(false)}
                  className="flex-1 text-gray-600 border-gray-300 hover:bg-gray-100 text-sm h-10 sm:h-9"
                >
                  Annuleren
                </Button>
                <Button
                  onClick={handleSavePreferences}
                  className="flex-1 bg-[#1e1839] hover:bg-[#1e1839]/90 text-white text-sm h-10 sm:h-9"
                >
                  Voorkeuren Opslaan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
