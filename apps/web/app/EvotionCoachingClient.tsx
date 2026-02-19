"use client"

import { useState, useEffect } from "react"
import EvotionCoachingDesktop from "./EvotionCoachingDesktop"
import EvotionCoachingMobile from "./EvotionCoachingMobile"

export default function EvotionCoachingClient() {
  const [isMobile, setIsMobile] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    setIsLoaded(true)

    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return isMobile ? <EvotionCoachingMobile /> : <EvotionCoachingDesktop />
}
