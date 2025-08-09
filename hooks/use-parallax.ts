"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface ParallaxOptions {
  speed?: number
  direction?: "up" | "down"
  disabled?: boolean
}

export function useParallax(options: ParallaxOptions = {}) {
  const { speed = 0.5, direction = "up", disabled = false } = options
  const ref = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState(0)

  const handleScroll = useCallback(() => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const scrolled = window.pageYOffset
    const rate = scrolled * -speed

    // Only apply parallax when element is in viewport
    if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
      const parallaxOffset = direction === "up" ? rate : -rate
      setOffset(parallaxOffset)
    }
  }, [speed, direction])

  useEffect(() => {
    if (disabled) return

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    handleScroll() // Initial call
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [speed, direction, disabled, handleScroll])

  return { ref, offset }
}

export function useMultiLayerParallax(layers: ParallaxOptions[] = []) {
  const parallaxLayers = layers.map((options) => useParallax(options))

  return parallaxLayers
}

// Advanced parallax hook with more control
export function useAdvancedParallax(
  options: ParallaxOptions & {
    startOffset?: number
    endOffset?: number
    easing?: (t: number) => number
  } = {},
) {
  const {
    speed = 0.5,
    direction = "up",
    disabled = false,
    startOffset = 0,
    endOffset = 1,
    easing = (t: number) => t, // Linear easing by default
  } = options

  const ref = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState(0)
  const [progress, setProgress] = useState(0)

  const handleScroll = useCallback(() => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const scrolled = window.pageYOffset
    const elementTop = rect.top + scrolled
    const elementHeight = rect.height
    const windowHeight = window.innerHeight

    // Calculate progress (0 to 1) based on element position
    const scrollProgress = Math.max(
      0,
      Math.min(1, (scrolled + windowHeight - elementTop) / (windowHeight + elementHeight)),
    )

    // Apply easing function
    const easedProgress = easing(scrollProgress)

    // Calculate offset based on progress and speed
    const parallaxOffset = (easedProgress - 0.5) * speed * 100
    const finalOffset = direction === "up" ? -parallaxOffset : parallaxOffset

    setOffset(finalOffset)
    setProgress(scrollProgress)
  }, [direction, easing, speed])

  useEffect(() => {
    if (disabled) return

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    handleScroll() // Initial call
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [speed, direction, disabled, easing, handleScroll])

  return { ref, offset, progress }
}
