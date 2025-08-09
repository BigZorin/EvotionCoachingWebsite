"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useAnimationManager } from "./use-animation-manager"

export function useOptimizedTypewriter(text: string, speed = 50) {
  const [displayText, setDisplayText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const currentIndexRef = useRef(0)
  const { addAnimation } = useAnimationManager()

  useEffect(() => {
    if (!text) return

    currentIndexRef.current = 0
    setDisplayText("")
    setIsComplete(false)

    let lastUpdate = 0
    const cleanup = addAnimation(
      "typewriter",
      (deltaTime, timestamp) => {
        if (timestamp - lastUpdate < speed) return true

        if (currentIndexRef.current < text.length) {
          setDisplayText(text.slice(0, currentIndexRef.current + 1))
          currentIndexRef.current++
          lastUpdate = timestamp
          return true
        } else {
          setIsComplete(true)
          return false // Animation complete
        }
      },
      3,
    ) // High priority for text

    return cleanup
  }, [text, speed, addAnimation])

  return { displayText, isComplete }
}

export function useOptimizedCountUp(
  end: number,
  duration = 2000,
  start = 0,
  easing: (t: number) => number = (t) => 1 - Math.pow(1 - t, 4), // easeOutQuart
) {
  const [count, setCount] = useState(start)
  const [isVisible, setIsVisible] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const { addAnimation } = useAnimationManager()

  const startAnimation = useCallback(() => {
    if (isVisible) return

    setIsVisible(true)
    setIsComplete(false)

    let startTime: number | null = null

    const cleanup = addAnimation(
      "countup",
      (deltaTime, timestamp) => {
        if (!startTime) startTime = timestamp

        const elapsed = timestamp - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = easing(progress)
        const currentCount = Math.floor(easedProgress * (end - start) + start)

        setCount(currentCount)

        if (progress >= 1) {
          setIsComplete(true)
          return false // Animation complete
        }

        return true
      },
      2,
    ) // Medium priority

    return cleanup
  }, [isVisible, end, duration, start, easing, addAnimation])

  return { count, setIsVisible: startAnimation, isComplete }
}
