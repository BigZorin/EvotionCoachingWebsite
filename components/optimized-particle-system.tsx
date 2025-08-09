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

  // Throttled resize handler
  const handleResize = useCallback(() => {
    const now = performance.now()
    if (now - lastResizeRef.current < 100) return // Throttle to 10fps

    lastResizeRef.current = now
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2) // Cap at 2x for performance

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.scale(dpr, dpr)
    }

    // Recreate particles for new canvas size
    particlesRef.current = Array.from({ length: particleCount }, () => createParticle(canvas))
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

    // Optimized animation loop
    const { cleanup } = addAnimation(
      "particle-system",
      (deltaTime: number) => {
        if (!isVisibleRef.current) return true // Skip rendering when not visible

        const particles = particlesRef.current
        const canvas = canvasRef.current!

        // Clear with optimized method
        ctx.clearRect(
          0,
          0,
          canvas.width / (window.devicePixelRatio || 1),
          canvas.height / (window.devicePixelRatio || 1),
        )

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
          if (particle.x < -particle.size) particle.x = canvas.width / (window.devicePixelRatio || 1) + particle.size
          if (particle.x > canvas.width / (window.devicePixelRatio || 1) + particle.size) particle.x = -particle.size
          if (particle.y < -particle.size) particle.y = canvas.height / (window.devicePixelRatio || 1) + particle.size
          if (particle.y > canvas.height / (window.devicePixelRatio || 1) + particle.size) particle.y = -particle.size

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
        return true // Continue animation
      },
      1,
    ) // High priority

    // Throttled resize listener
    let resizeTimeout: NodeJS.Timeout
    const throttledResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(handleResize, 100)
    }

    window.addEventListener("resize", throttledResize, { passive: true })

    return () => {
      cleanup()
      window.removeEventListener("resize", throttledResize)
      clearTimeout(resizeTimeout)
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
