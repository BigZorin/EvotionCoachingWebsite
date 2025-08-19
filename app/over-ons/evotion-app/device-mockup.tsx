"use client"

import type React from "react"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

type DeviceMockupProps = {
  images: { src: string; alt: string }[]
  className?: string
  autoRotateMs?: number
  activeIndex?: number
}

export function DeviceMockup({ images, className = "", autoRotateMs = 4000, activeIndex }: DeviceMockupProps) {
  const [index, setIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // External control
  useEffect(() => {
    if (typeof activeIndex === "number") setIndex(activeIndex)
  }, [activeIndex])

  // Auto-rotate with proper cleanup
  useEffect(() => {
    if (hovered || typeof activeIndex === "number") return

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length)
    }, autoRotateMs)

    return () => clearInterval(id)
  }, [images.length, autoRotateMs, hovered, activeIndex])

  // 3D tilt effect
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const el = containerRef.current
    if (!el) return

    try {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const rx = ((y - rect.height / 2) / rect.height) * -8
      const ry = ((x - rect.width / 2) / rect.width) * 8
      setTilt({ rx, ry })
    } catch (error) {
      console.warn("Tilt calculation error:", error)
    }
  }, [])

  const resetTilt = useCallback(() => {
    setTilt({ rx: 0, ry: 0 })
  }, [])

  const safeIndex = Math.max(0, Math.min(index, images.length - 1))
  const current = images[safeIndex]

  return (
    <motion.div
      ref={containerRef}
      className={`relative outline-none ${className}`}
      style={{ perspective: 1000 }}
      onMouseMove={onMouseMove}
      onMouseLeave={resetTilt}
      onMouseEnter={() => setHovered(true)}
      tabIndex={0}
      aria-label="App mockup"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className="relative w-72 sm:w-80 aspect-[9/19] mx-auto"
        style={{
          transformStyle: "preserve-3d",
          rotateX: tilt.rx,
          rotateY: tilt.ry,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Phone Frame */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 rounded-[2.5rem] p-1 shadow-[0_25px_80px_rgba(0,0,0,0.4)]">
          <div className="w-full h-full bg-black rounded-[2.3rem] overflow-hidden relative">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-36 rounded-b-3xl bg-black z-30" />

            {/* Screen Content */}
            <div className="absolute inset-0 bg-white rounded-[2.3rem] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current?.src || "placeholder"}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={current?.src || "/placeholder.svg?height=760&width=360&query=evotion%20app%20interface"}
                    alt={current?.alt || "App interface"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 90vw, 360px"
                    priority={false}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Reflection overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[2.5rem]"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
            maskImage: "radial-gradient(70% 100% at 30% 0%, black 30%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* Pagination dots */}
      <motion.div
        className="mt-6 flex items-center justify-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {images.map((_, i) => (
          <button
            key={i}
            aria-label={`Toon screenshot ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === safeIndex ? "w-8 bg-primary" : "w-2 bg-gray-300 hover:bg-gray-400"
            }`}
            type="button"
          />
        ))}
      </motion.div>
    </motion.div>
  )
}
