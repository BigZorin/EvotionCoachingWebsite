"use client"

import { useEffect, useRef, useState } from "react"
import { useAnimationManager } from "./use-animation-manager"

interface ScrollState {
  scrollY: number
  scrollDirection: "up" | "down"
  scrollVelocity: number
  isScrolling: boolean
}

export function useOptimizedScroll() {
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollY: 0,
    scrollDirection: "down",
    scrollVelocity: 0,
    isScrolling: false,
  })

  const lastScrollY = useRef(0)
  const lastTimestamp = useRef(0)
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null)
  const { addAnimation } = useAnimationManager()

  useEffect(() => {
    let ticking = false

    const updateScrollState = () => {
      const currentScrollY = window.scrollY
      const currentTime = performance.now()
      const deltaTime = currentTime - lastTimestamp.current
      const deltaScroll = currentScrollY - lastScrollY.current

      if (deltaTime > 0) {
        const velocity = Math.abs(deltaScroll) / deltaTime

        setScrollState((prev) => ({
          scrollY: currentScrollY,
          scrollDirection: deltaScroll > 0 ? "down" : "up",
          scrollVelocity: velocity,
          isScrolling: true,
        }))

        // Clear existing timeout
        if (scrollTimeout.current) {
          clearTimeout(scrollTimeout.current)
        }

        // Set scrolling to false after inactivity
        scrollTimeout.current = setTimeout(() => {
          setScrollState((prev) => ({ ...prev, isScrolling: false }))
        }, 150)
      }

      lastScrollY.current = currentScrollY
      lastTimestamp.current = currentTime
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(updateScrollState)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }
    }
  }, [])

  return scrollState
}

export function useOptimizedParallax({ speed = 0.5, offset = 0 }: { speed?: number; offset?: number } = {}) {
  const elementRef = useRef<HTMLElement>(null)
  const [parallaxOffset, setParallaxOffset] = useState(0)
  const { addAnimation } = useAnimationManager()
  const isInViewRef = useRef(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Intersection Observer for performance
    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting
      },
      {
        threshold: 0,
        rootMargin: "50px 0px", // Start animation slightly before element is visible
      },
    )

    observer.observe(element)

    const { cleanup } = addAnimation(
      "parallax",
      () => {
        if (!isInViewRef.current) return true

        const rect = element.getBoundingClientRect()
        const elementTop = rect.top + window.scrollY
        const elementHeight = rect.height
        const windowHeight = window.innerHeight
        const scrollY = window.scrollY

        // Calculate parallax only when element is near viewport
        if (scrollY + windowHeight > elementTop - 100 && scrollY < elementTop + elementHeight + 100) {
          const relativePos = (scrollY - elementTop + windowHeight) / (windowHeight + elementHeight)
          const newOffset = (relativePos - 0.5) * speed * 100 + offset

          setParallaxOffset(newOffset)
        }

        return true
      },
      2,
    ) // Medium priority

    return () => {
      cleanup()
      observer.disconnect()
    }
  }, [addAnimation, speed, offset])

  return { ref: elementRef, offset: parallaxOffset }
}
