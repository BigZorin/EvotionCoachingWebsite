"use client"

import { useEffect, useRef, useCallback } from "react"
import { useAnimationManager } from "@/hooks/use-animation-manager"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  baseOpacity: number
  color: string
  life: number
  maxLife: number
}

interface OptimizedParticleSystemProps {
  particleCount?: number
  colors?: string[]
  className?: string
  intensity?: number
}

export function OptimizedParticleSystem({
  particleCount = 50,
  colors = ["rgba(59, 130, 246, 0.3)", "rgba(234, 179, 8, 0.3)", "rgba(255, 255, 255, 0.2)"],
  className = "",
  intensity = 1,
}: OptimizedParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const { addAnimation } = useAnimationManager()
  const isVisibleRef = useRef(true)
  const lastResizeRef = useRef(0)
  const resizeTimeoutRef = useRef<NodeJS.Timeout>()

  // Optimized particle creation with object pooling
  const createParticle = useCallback(
    (canvas: HTMLCanvasElement): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5 * intensity,
      vy: (Math.random() - 0.5) * 0.5 * intensity,
      size: Math.random() * 2 + 0.5,
      opacity: 0,
      baseOpacity: Math.random() * 0.4 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
      maxLife: Math.random() * 1000 + 2000,
    }),
    [colors, intensity],
  )

  // Heavily throttled resize handler to prevent ResizeObserver loops
  const handleResize = useCallback(() => {
    const now = performance.now()
    if (now - lastResizeRef.current < 200) return // Increased throttle to 200ms

    lastResizeRef.current = now
    const canvas = canvasRef.current
    if (!canvas) return

    // Clear any pending resize timeout
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current)
    }

    // Debounce the actual resize operation
    resizeTimeoutRef.current = setTimeout(() => {
      try {
        const rect = canvas.getBoundingClientRect()
        const dpr = Math.min(window.devicePixelRatio || 1, 2) // Cap at 2x for performance

        // Only resize if dimensions actually changed
        const newWidth = rect.width * dpr
        const newHeight = rect.height * dpr

        if (canvas.width !== newWidth || canvas.height !== newHeight) {
          canvas.width = newWidth
          canvas.height = newHeight
          canvas.style.width = `${rect.width}px`
          canvas.style.height = `${rect.height}px`

          const ctx = canvas.getContext("2d")
          if (ctx) {
            ctx.scale(dpr, dpr)
          }

          // Recreate particles for new canvas size
          particlesRef.current = Array.from({ length: particleCount }, () => createParticle(canvas))
        }
      } catch (error) {
        console.warn("Canvas resize error:", error)
      }
    }, 100)
  }, [particleCount, createParticle])

  // Intersection Observer for performance
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting
      },
      { threshold: 0 },
    )

    observer.observe(canvas)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true, // Better performance for animations
    })
    if (!ctx) return

    handleResize()

    // Use ResizeObserver with heavy debouncing
    const resizeObserver = new ResizeObserver((entries) => {
      // Only handle resize if canvas is visible and mounted
      if (isVisibleRef.current && canvas.parentElement) {
        handleResize()
      }
    })

    resizeObserver.observe(canvas)

    // Optimized animation loop
    const cleanup = addAnimation(
      "particle-system",
      (deltaTime: number) => {
        if (!isVisibleRef.current || !canvas.parentElement) return true // Skip rendering when not visible or unmounted

        const particles = particlesRef.current
        if (!particles.length) return true

        try {
          const dpr = window.devicePixelRatio || 1
          const canvasWidth = canvas.width / dpr
          const canvasHeight = canvas.height / dpr

          // Clear with optimized method
          ctx.clearRect(0, 0, canvasWidth, canvasHeight)

          // Batch particle updates and rendering
          ctx.save()

          for (let i = 0; i < particles.length; i++) {
            const particle = particles[i]

            // Update particle
            particle.life += deltaTime
            particle.x += particle.vx * (deltaTime / 16.67) // Normalize to 60fps
            particle.y += particle.vy * (deltaTime / 16.67)

            // Lifecycle management
            const lifeRatio = particle.life / particle.maxLife
            if (lifeRatio < 0.1) {
              particle.opacity = particle.baseOpacity * (lifeRatio / 0.1)
            } else if (lifeRatio > 0.9) {
              particle.opacity = particle.baseOpacity * ((1 - lifeRatio) / 0.1)
            } else {
              particle.opacity = particle.baseOpacity + Math.sin(particle.life * 0.001 + particle.x * 0.01) * 0.1
            }

            // Wrap around edges
            if (particle.x < -particle.size) particle.x = canvasWidth + particle.size
            if (particle.x > canvasWidth + particle.size) particle.x = -particle.size
            if (particle.y < -particle.size) particle.y = canvasHeight + particle.size
            if (particle.y > canvasHeight + particle.size) particle.y = -particle.size

            // Reset particle if life exceeded
            if (particle.life > particle.maxLife) {
              Object.assign(particle, createParticle(canvas))
            }

            // Render particle (batched)
            if (particle.opacity > 0.01) {
              ctx.globalAlpha = Math.max(0, Math.min(1, particle.opacity))
              ctx.fillStyle = particle.color
              ctx.beginPath()
              ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
              ctx.fill()
            }
          }

          ctx.restore()
        } catch (error) {
          console.warn("Particle animation error:", error)
        }

        return true // Continue animation
      },
      1,
    ) // High priority

    return () => {
      cleanup()
      resizeObserver.disconnect()
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
    }
  }, [addAnimation, createParticle, handleResize, particleCount])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        mixBlendMode: "screen",
        willChange: "transform", // Optimize for animations
      }}
    />
  )
}
