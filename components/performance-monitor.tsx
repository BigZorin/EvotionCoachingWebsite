"use client"

import { useEffect, useState } from "react"
import { useAnimationManager } from "@/hooks/use-animation-manager"

interface PerformanceStats {
  fps: number
  frameTime: number
  memoryUsage?: number
}

export function PerformanceMonitor({ showInProduction = false }: { showInProduction?: boolean }) {
  const [stats, setStats] = useState<PerformanceStats>({ fps: 60, frameTime: 16.67 })
  const [isVisible, setIsVisible] = useState(false)
  const { getStats } = useAnimationManager()

  useEffect(() => {
    // Only show in development or when explicitly enabled
    if (process.env.NODE_ENV === "production" && !showInProduction) return

    const updateStats = () => {
      const animationStats = getStats()
      const memoryInfo = (performance as any).memory

      setStats({
        fps: animationStats.currentFps,
        frameTime: animationStats.averageFrameTime,
        memoryUsage: memoryInfo ? Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024) : undefined,
      })
    }

    const interval = setInterval(updateStats, 1000)
    return () => clearInterval(interval)
  }, [getStats, showInProduction])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "p" && e.ctrlKey && e.shiftKey) {
        setIsVisible((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [])

  if (!isVisible || (process.env.NODE_ENV === "production" && !showInProduction)) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/80 text-white p-3 rounded-lg font-mono text-xs backdrop-blur-sm">
      <div className="space-y-1">
        <div className={`${stats.fps < 30 ? "text-red-400" : stats.fps < 50 ? "text-yellow-400" : "text-green-400"}`}>
          FPS: {stats.fps}
        </div>
        <div
          className={`${stats.frameTime > 33 ? "text-red-400" : stats.frameTime > 20 ? "text-yellow-400" : "text-green-400"}`}
        >
          Frame: {stats.frameTime.toFixed(1)}ms
        </div>
        {stats.memoryUsage && (
          <div
            className={`${stats.memoryUsage > 100 ? "text-red-400" : stats.memoryUsage > 50 ? "text-yellow-400" : "text-green-400"}`}
          >
            Memory: {stats.memoryUsage}MB
          </div>
        )}
      </div>
      <div className="text-gray-400 text-xs mt-2">Ctrl+Shift+P to toggle</div>
    </div>
  )
}
