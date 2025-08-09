"use client"

import React from "react"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star, Brain, Target, HandHeart, Lightbulb, MessageSquare, UserCheck, Activity } from "lucide-react"
import Link from "next/link"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useParallax } from "@/hooks/use-parallax"
import { useState, useEffect, useRef, useCallback } from "react"

interface IconPosition {
  x: number
  y: number
  vx: number
  vy: number
  isDragging: boolean
}

// Dummy useAdvancedParallax hook to resolve the error
const useAdvancedParallax = (options: any) => {
  const ref = useRef(null)
  const [offset, setOffset] = useState(0)
  const [progress, setProgress] = useState(0)

  return { ref, offset, progress }
}

export function KernwaardenClientPage() {
  const [selectedValue, setSelectedValue] = useState<number | null>(null)
  const [iconPositions, setIconPositions] = useState<IconPosition[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()
  const dragRef = useRef<{ index: number; offsetX: number; offsetY: number } | null>(null)
  const lastUpdateTime = useRef<number>(0)
  const pendingUpdate = useRef<boolean>(false)
  const dragPosition = useRef<{ x: number; y: number } | null>(null)
  const touchStartTime = useRef<number>(0)
  const isTouchDevice = useRef<boolean>(false)

  // Scroll animations
  const heroAnimation = useScrollAnimation({ threshold: 0.2 })
  const valuesAnimation = useScrollAnimation({ threshold: 0.1 })
  const ctaAnimation = useScrollAnimation({ threshold: 0.2 })

  // Parallax effects
  const heroParallax = useParallax({ speed: 0.3, direction: "up" })
  const ctaParallax = useParallax({ speed: 0.25, direction: "down" })

  // Advanced parallax for decorative elements
  const decorativeParallax1 = useAdvancedParallax({ speed: 0.5, direction: "up" })
  const decorativeParallax2 = useAdvancedParallax({ speed: 0.7, direction: "down" })

  const coreValues = [
    {
      icon: Brain,
      title: "Bewustzijn en Zelfinzicht",
      subtitle: "De basis van alle groei",
      description:
        "Groei begint bij bewustwording – weten wie je bent, wat je beweegt en hoe je keuzes invloed hebben op jouw leven en dat van anderen. Door reflectie en eerlijk inzicht in jezelf ontstaat ruimte voor authentieke ontwikkeling.",
      impact: "Leidt tot dieper begrip, openheid en verbinding – essentieel voor duurzame verandering.",
      essence:
        "Groei begint bij bewustwording – weten wie je bent, wat je beweegt en hoe je keuzes invloed hebben op jouw leven en dat van anderen.",
      toepassing: "Door reflectie en eerlijk inzicht in jezelf ontstaat ruimte voor authentieke ontwikkeling.",
      color: "#1e1839",
      gradient: "from-purple-500 to-indigo-600",
      quote: "Zelfkennis is de sleutel tot transformatie",
    },
    {
      icon: Target,
      title: "Verantwoordelijkheid en Eigenaarschap",
      subtitle: "Neem de regie over je leven",
      description:
        "Echte transformatie begint wanneer je verantwoordelijkheid neemt voor je eigen keuzes en resultaten. Eigenaarschap betekent: zelf je koers bepalen, doelgericht handelen en trouw blijven aan je intenties.",
      impact: "Stimuleert toewijding, kracht en een gevoel van autonomie.",
      essence: "Echte transformatie begint wanneer je verantwoordelijkheid neemt voor je eigen keuzes en resultaten.",
      toepassing:
        "Eigenaarschap betekent: zelf je koers bepalen, doelgericht handelen en trouw blijven aan je intenties.",
      color: "#1e1839",
      gradient: "from-blue-500 to-cyan-600",
      quote: "Jij bent de architect van je eigen succes",
    },
    {
      icon: HandHeart,
      title: "Dienstbaarheid",
      subtitle: "Samen sterker worden",
      description:
        "Elke interactie is een kans om te helpen. Vanuit oprechte betrokkenheid staan we klaar om anderen te ondersteunen in hun proces. Door echt te luisteren en af te stemmen op individuele doelen, ontstaat begeleiding die ertoe doet.",
      impact: "Creëert diepe verbinding en blijvende impact – mensen voelen zich gezien, gehoord en geholpen.",
      essence:
        "Elke interactie is een kans om te helpen. Vanuit oprechte betrokkenheid staan we klaar om anderen te ondersteunen in hun proces.",
      toepassing: "Door echt te luisteren en af te stemmen op individuele doelen, ontstaat begeleiding die ertoe doet.",
      color: "#1e1839",
      gradient: "from-rose-500 to-pink-600",
      quote: "Echte kracht ligt in het helpen van anderen",
    },
    {
      icon: Lightbulb,
      title: "Continue Ontwikkeling en Innovatie",
      subtitle: "Altijd in beweging blijven",
      description:
        "Groei stopt nooit. Door te blijven leren en vernieuwen ontstaat vooruitgang, zowel fysiek als mentaal. Kennis, tools en methodes worden voortdurend aangescherpt om jou zo goed mogelijk te ondersteunen.",
      impact: "Houdt trajecten fris, inspirerend en effectief – altijd in beweging, net als jij.",
      essence: "Groei stopt nooit. Door te blijven leren en vernieuwen ontstaat vooruitgang, zowel fysiek als mentaal.",
      toepassing: "Kennis, tools en methodes worden voortdurend aangescherpt om jou zo goed mogelijk te ondersteunen.",
      color: "#1e1839",
      gradient: "from-amber-500 to-orange-600",
      quote: "Stilstand is achteruitgang",
    },
    {
      icon: MessageSquare,
      title: "Transparantie en Eerlijkheid",
      subtitle: "Helderheid in alles wat we doen",
      description:
        "Helderheid in communicatie en intentie is de basis van vertrouwen. We zijn open over wat we doen, waarom we het doen en wat je kunt verwachten.",
      impact: "Maakt relaties betrouwbaar en veilig – essentieel voor langdurige samenwerking en persoonlijke groei.",
      essence: "Helderheid in communicatie en intentie is de basis van vertrouwen.",
      toepassing: "We zijn open over wat we doen, waarom we het doen, en wat je kunt verwachten.",
      color: "#1e1839",
      gradient: "from-emerald-500 to-teal-600",
      quote: "Eerlijkheid bouwt bruggen",
    },
    {
      icon: UserCheck,
      title: "Empathie en Respect voor Individuele Groei",
      subtitle: "Jouw unieke pad respecteren",
      description:
        "Ieder mens bewandelt zijn eigen pad. Er is geen one-size-fits-all. We stemmen af op de unieke behoeften, ritmes en uitdagingen van ieder individu.",
      impact:
        "Zorgt voor een omgeving waarin mensen zich gerespecteerd en gesteund voelen – ongeacht waar ze staan in hun reis.",
      essence: "Ieder mens bewandelt zijn eigen pad. Er is geen one-size-fits-all.",
      toepassing: "We stemmen af op de unieke behoeften, ritmes en uitdagingen van ieder individu.",
      color: "#1e1839",
      gradient: "from-violet-500 to-purple-600",
      quote: "Diversiteit is onze kracht",
    },
    {
      icon: Activity,
      title: "Gezondheid en Welzijn",
      subtitle: "Balans in lichaam en geest",
      description:
        "Gezondheid draait om balans – fysiek, mentaal én emotioneel. Evotion integreert training, voeding, mindset en herstel in één allesomvattende aanpak.",
      impact:
        "Versterkt niet alleen het lichaam, maar ook het leven. Gezondheid wordt een levensstijl, geen tijdelijke fase.",
      essence: "Gezondheid draait om balans – fysiek, mentaal én emotioneel.",
      toepassing: "Evotion integreert training, voeding, mindset en herstel in één allesomvattende aanpak.",
      color: "#1e1839",
      gradient: "from-green-500 to-emerald-600",
      quote: "Een gezond lichaam herbergt een gezonde geest",
    },
  ]

  // Detect touch device
  useEffect(() => {
    isTouchDevice.current = "ontouchstart" in window || navigator.maxTouchPoints > 0
  }, [])

  // Initialize icon positions - only run once
  useEffect(() => {
    if (containerRef.current && !isInitialized) {
      const container = containerRef.current
      const rect = container.getBoundingClientRect()
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const radius = Math.min(rect.width, rect.height) * 0.3

      const positions = coreValues.map((_, index) => {
        const angle = (index / coreValues.length) * 2 * Math.PI
        return {
          x: centerX + Math.cos(angle) * radius - 32, // 32 is half icon size
          y: centerY + Math.sin(angle) * radius - 32,
          vx: (Math.random() - 0.5) * 4, // Increased initial velocity
          vy: (Math.random() - 0.5) * 4,
          isDragging: false,
        }
      })
      setIconPositions(positions)
      setIsInitialized(true)
    }
  }, [isInitialized, coreValues.length])

  // Throttled update function
  const throttledUpdate = useCallback(() => {
    if (!pendingUpdate.current) return

    const currentDrag = dragRef.current
    const currentDragPos = dragPosition.current

    if (currentDrag && currentDragPos && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()

      setIconPositions((prev) =>
        prev.map((pos, i) =>
          i === currentDrag.index
            ? {
                ...pos,
                x: Math.max(0, Math.min(containerRect.width - 64, currentDragPos.x)),
                y: Math.max(0, Math.min(containerRect.height - 64, currentDragPos.y)),
                vx: 0,
                vy: 0,
              }
            : pos,
        ),
      )
    }

    pendingUpdate.current = false
  }, [])

  // Physics simulation with more movement
  useEffect(() => {
    if (!isInitialized) return

    const updatePhysics = () => {
      if (!containerRef.current) {
        animationRef.current = requestAnimationFrame(updatePhysics)
        return
      }

      const now = Date.now()

      // Throttle physics updates to 60fps
      if (now - lastUpdateTime.current < 16) {
        animationRef.current = requestAnimationFrame(updatePhysics)
        return
      }
      lastUpdateTime.current = now

      // Handle throttled drag updates
      throttledUpdate()

      const container = containerRef.current
      const rect = container.getBoundingClientRect()

      setIconPositions((prev) => {
        if (prev.length === 0) return prev

        return prev.map((pos, index) => {
          if (pos.isDragging) return pos

          let newX = pos.x + pos.vx
          let newY = pos.y + pos.vy
          let newVx = pos.vx * 0.995 // Reduced friction for more movement
          let newVy = pos.vy * 0.995

          // Add subtle random movement when velocity is low - only on desktop
          if (Math.abs(newVx) < 0.5 && Math.abs(newVy) < 0.5 && !isTouchDevice.current) {
            newVx += (Math.random() - 0.5) * 0.3
            newVy += (Math.random() - 0.5) * 0.3
          }

          // Boundary collision with more bounce
          if (newX <= 0 || newX >= rect.width - 64) {
            newVx = -newVx * 0.9 // More bounce
            newX = Math.max(0, Math.min(rect.width - 64, newX))
          }
          if (newY <= 0 || newY >= rect.height - 64) {
            newVy = -newVy * 0.9 // More bounce
            newY = Math.max(0, Math.min(rect.height - 64, newY))
          }

          // Icon collision detection with stronger repulsion
          prev.forEach((otherPos, otherIndex) => {
            if (index === otherIndex) return

            const dx = newX - otherPos.x
            const dy = newY - otherPos.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 80) {
              // Increased collision distance
              const angle = Math.atan2(dy, dx)
              const targetX = otherPos.x + Math.cos(angle) * 80
              const targetY = otherPos.y + Math.sin(angle) * 80
              const ax = (targetX - newX) * 0.15 // Stronger repulsion
              const ay = (targetY - newY) * 0.15
              newVx += ax
              newVy += ay
            }
          })

          return {
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            isDragging: false,
          }
        })
      })

      animationRef.current = requestAnimationFrame(updatePhysics)
    }

    animationRef.current = requestAnimationFrame(updatePhysics)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isInitialized, throttledUpdate])

  // Mouse event handlers
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const currentDrag = dragRef.current
    if (!currentDrag || !containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const newX = e.clientX - containerRect.left - currentDrag.offsetX
    const newY = e.clientY - containerRect.top - currentDrag.offsetY

    dragPosition.current = { x: newX, y: newY }
    pendingUpdate.current = true
  }, [])

  const handleMouseUp = useCallback(() => {
    const currentDrag = dragRef.current
    if (!currentDrag) return

    const dragIndex = currentDrag.index

    setIconPositions((prev) =>
      prev.map((pos, i) =>
        i === dragIndex
          ? { ...pos, isDragging: false, vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6 } // More velocity after drag
          : pos,
      ),
    )

    dragRef.current = null
    dragPosition.current = null
    pendingUpdate.current = false
  }, [])

  // Touch event handlers
  const handleTouchMove = useCallback((e: TouchEvent) => {
    const currentDrag = dragRef.current
    if (!currentDrag || !containerRef.current || e.touches.length === 0) return

    e.preventDefault() // Prevent scrolling while dragging

    const touch = e.touches[0]
    const containerRect = containerRef.current.getBoundingClientRect()
    const newX = touch.clientX - containerRect.left - currentDrag.offsetX
    const newY = touch.clientY - containerRect.top - currentDrag.offsetY

    dragPosition.current = { x: newX, y: newY }
    pendingUpdate.current = true
  }, [])

  const handleTouchEnd = useCallback(() => {
    const currentDrag = dragRef.current
    if (!currentDrag) return

    const dragIndex = currentDrag.index
    const touchDuration = Date.now() - touchStartTime.current

    // If touch was very short (< 200ms), treat as tap for modal
    if (touchDuration < 200) {
      setSelectedValue(dragIndex)
    }

    setIconPositions((prev) =>
      prev.map((pos, i) =>
        i === dragIndex
          ? { ...pos, isDragging: false, vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6 }
          : pos,
      ),
    )

    dragRef.current = null
    dragPosition.current = null
    pendingUpdate.current = false
    touchStartTime.current = 0
  }, [])

  // Event listeners setup - Mouse and Touch
  useEffect(() => {
    // Mouse events
    document.addEventListener("mousemove", handleMouseMove, { passive: true })
    document.addEventListener("mouseup", handleMouseUp, { passive: true })

    // Touch events
    document.addEventListener("touchmove", handleTouchMove, { passive: false })
    document.addEventListener("touchend", handleTouchEnd, { passive: true })
    document.addEventListener("touchcancel", handleTouchEnd, { passive: true })

    return () => {
      // Cleanup mouse events
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)

      // Cleanup touch events
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
      document.removeEventListener("touchcancel", handleTouchEnd)
    }
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])

  // Mouse down handler
  const handleMouseDown = useCallback((e: React.MouseEvent, index: number) => {
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()

    dragRef.current = {
      index,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    }

    setIconPositions((prev) => prev.map((pos, i) => (i === index ? { ...pos, isDragging: true } : pos)))
  }, [])

  // Touch start handler
  const handleTouchStart = useCallback((e: React.TouchEvent, index: number) => {
    e.preventDefault()

    if (e.touches.length === 0) return

    const touch = e.touches[0]
    const rect = e.currentTarget.getBoundingClientRect()

    touchStartTime.current = Date.now()

    dragRef.current = {
      index,
      offsetX: touch.clientX - rect.left,
      offsetY: touch.clientY - rect.top,
    }

    setIconPositions((prev) => prev.map((pos, i) => (i === index ? { ...pos, isDragging: true } : pos)))
  }, [])

  // Combined click handler for non-touch devices
  const handleClick = useCallback((index: number) => {
    // Only handle click if not a touch device or if no drag occurred
    if (!isTouchDevice.current) {
      setSelectedValue(index)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-white to-secondary/5 py-16 md:py-24 overflow-hidden">
        <div
          ref={heroParallax.ref}
          className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-secondary/8 will-change-transform"
          style={{
            transform: `translateY(${heroParallax.offset}px)`,
            backfaceVisibility: "hidden",
            perspective: "1000px",
          }}
        />

        <div
          ref={decorativeParallax1.ref}
          className="absolute top-20 right-16 w-28 h-28 bg-gradient-to-br from-primary/15 to-secondary/15 rounded-full blur-sm will-change-transform"
          style={{
            transform: `translateY(${decorativeParallax1.offset}px) rotate(${decorativeParallax1.progress * 270}deg)`,
            opacity: 0.7,
          }}
        />
        <div
          ref={decorativeParallax2.ref}
          className="absolute bottom-32 left-12 w-20 h-20 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-sm will-change-transform"
          style={{
            transform: `translateY(${decorativeParallax2.offset}px) rotate(${-decorativeParallax2.progress * 180}deg)`,
            opacity: 0.5,
          }}
        />

        <div className="container mx-auto px-4 lg:px-6 max-w-4xl relative z-10">
          <div
            ref={heroAnimation.ref}
            className={`text-center animate-on-scroll ${heroAnimation.isVisible ? "animate-visible" : ""}`}
          >
            <div className="inline-flex items-center gap-2 bg-[#bad4e1]/20 text-[#1e1839] px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              Onze Kern. Jouw Groei.
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Kernwaarden</h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Deze waarden vormen de basis van onze coaching filosofie en bepalen hoe we jou begeleiden in jouw
              transformatie naar een sterker, vrijer en gezonder leven.
            </p>
            <div className="bg-gradient-to-r from-[#1e1839] to-[#bad4e1] bg-clip-text text-transparent text-lg font-semibold">
              "It is time to bring your evolution in motion"
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
          <div
            ref={valuesAnimation.ref}
            className={`animate-on-scroll ${valuesAnimation.isVisible ? "animate-visible" : ""}`}
          >
            <div className="grid gap-8 md:gap-12">
              {coreValues.map((value, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#1e1839] to-[#bad4e1] rounded-2xl flex items-center justify-center shadow-lg">
                        {React.createElement(value.icon, {
                          className: "w-8 h-8 md:w-10 md:h-10 text-white",
                        })}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="mb-4">
                        <h3 className="text-xl md:text-2xl font-bold text-[#1e1839] mb-2">{value.title}</h3>
                        <p className="text-base md:text-lg text-[#bad4e1] font-medium">{value.subtitle}</p>
                      </div>

                      <div className="space-y-4">
                        <p className="text-gray-700 leading-relaxed text-base md:text-lg">{value.description}</p>

                        <div className="bg-gradient-to-r from-[#1e1839]/5 to-[#bad4e1]/5 rounded-xl p-4 border-l-4 border-[#1e1839]">
                          <p className="text-[#1e1839] font-medium text-sm md:text-base">
                            <span className="font-semibold">Impact:</span> {value.impact}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Instructions Section */}
      {/*<section className="py-8 md:py-12 bg-white">*/}
      {/*  <div className="container mx-auto px-4 lg:px-6 max-w-4xl">*/}
      {/*    <div className="text-center">*/}
      {/*      <div className="inline-flex items-center gap-2 bg-[#bad4e1]/10 text-[#1e1839] px-4 py-2 rounded-full text-sm font-medium mb-4">*/}
      {/*        <Sparkles className="w-4 h-4" />*/}
      {/*        Hoe werkt het?*/}
      {/*      </div>*/}
      {/*      <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">*/}
      {/*        {isTouchDevice.current*/}
      {/*          ? "Raak de iconen hieronder aan om ze te verslepen door de ruimte. Laat ze tegen elkaar botsen en tik erop om de diepere betekenis van elke kernwaarde te ontdekken."*/}
      {/*          : "Sleep de iconen hieronder door de ruimte, laat ze tegen elkaar botsen en klik erop om de diepere betekenis van elke kernwaarde te ontdekken."}*/}
      {/*      </p>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</section>*/}

      {/* Interactive Bubble Section */}
      {/*<section className="py-12 md:py-20 relative overflow-hidden bg-gradient-to-b from-white to-gray-50/50">*/}
      {/*  <div className="container mx-auto px-4 lg:px-6 max-w-7xl relative z-10">*/}
      {/*    <div*/}
      {/*      ref={interactiveAnimation.ref}*/}
      {/*      className={`animate-on-scroll ${interactiveAnimation.isVisible ? "animate-visible" : ""}`}*/}
      {/*    >*/}
      {/*      <div className="bg-white rounded-3xl p-4 md:p-6 shadow-xl border border-[#bad4e1]/10">*/}
      {/*        <div*/}
      {/*          ref={containerRef}*/}
      {/*          className="relative w-full h-[400px] md:h-[600px] bg-gradient-to-br from-[#bad4e1]/10 to-[#bad4e1]/5 rounded-2xl border-2 border-[#bad4e1]/20 overflow-hidden"*/}
      {/*          style={{ touchAction: "none" }}*/}
      {/*        >*/}
      {/*          {isInitialized &&*/}
      {/*            iconPositions.length > 0 &&*/}
      {/*            iconPositions.map((position, index) => {*/}
      {/*              const IconComponent = coreValues[index]?.icon*/}
      {/*              if (!IconComponent) return null*/}

      {/*              return (*/}
      {/*                <div*/}
      {/*                  key={index}*/}
      {/*                  className="absolute w-12 h-12 md:w-16 md:h-16 cursor-grab active:cursor-grabbing transition-transform hover:scale-110 touch-manipulation"*/}
      {/*                  style={{*/}
      {/*                    left: position.x,*/}
      {/*                    top: position.y,*/}
      {/*                    transform: position.isDragging ? "scale(1.1)" : "scale(1)",*/}
      {/*                  }}*/}
      {/*                  onMouseDown={(e) => handleMouseDown(e, index)}*/}
      {/*                  onTouchStart={(e) => handleTouchStart(e, index)}*/}
      {/*                  onClick={() => handleClick(index)}*/}
      {/*                >*/}
      {/*                  <div className="w-full h-full bg-[#bad4e1]/20 rounded-xl md:rounded-2xl flex items-center justify-center border-2 border-[#bad4e1]/30 shadow-lg backdrop-blur-sm hover:bg-[#bad4e1]/30 transition-all duration-200">*/}
      {/*                    <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-[#1e1839]" />*/}
      {/*                  </div>*/}
      {/*                </div>*/}
      {/*              )*/}
      {/*            })}*/}

      {/*          {/* Status indicator *!/*/}
      {/*          <div className="absolute top-4 left-4 right-4 text-center">*/}
      {/*            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-[#1e1839]/70 border border-[#bad4e1]/20">*/}
      {/*              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>*/}
      {/*              Interactief - {coreValues.length} kernwaarden*/}
      {/*            </div>*/}
      {/*          </div>*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</section>*/}

      {/* Selected Value Modal - Mobile Optimized */}
      {/*{selectedValue !== null && coreValues[selectedValue] && (*/}
      {/*  <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-3 md:p-4">*/}
      {/*    <div className="bg-white rounded-2xl md:rounded-3xl max-w-5xl w-full max-h-[85vh] md:max-h-[80vh] flex flex-col relative shadow-2xl">*/}
      {/*      <button*/}
      {/*        onClick={() => setSelectedValue(null)}*/}
      {/*        className="absolute top-3 right-3 md:top-4 md:right-4 w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors z-20 touch-manipulation shadow-lg"*/}
      {/*      >*/}
      {/*        <X className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />*/}
      {/*      </button>*/}

      {/*      {/* Header *!/*/}
      {/*      <div className="bg-[#1e1839] p-4 md:p-6 text-white rounded-t-2xl md:rounded-t-3xl relative overflow-hidden flex-shrink-0">*/}
      {/*        <div className="absolute inset-0 bg-gradient-to-br from-[#1e1839] via-[#1e1839] to-[#2a2147] opacity-90"></div>*/}
      {/*        <div className="relative z-10">*/}
      {/*          <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">*/}
      {/*            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#bad4e1]/20 rounded-xl md:rounded-2xl flex items-center justify-center backdrop-blur-sm border border-[#bad4e1]/30">*/}
      {/*              {React.createElement(coreValues[selectedValue].icon, {*/}
      {/*                className: "w-6 h-6 md:w-8 md:h-8 text-[#bad4e1]",*/}
      {/*              })}*/}
      {/*            </div>*/}
      {/*            <div className="flex-1">*/}
      {/*              <h3 className="text-lg md:text-2xl lg:text-3xl font-bold mb-1 leading-tight">*/}
      {/*                {coreValues[selectedValue].title}*/}
      {/*              </h3>*/}
      {/*              <p className="text-sm md:text-lg text-[#bad4e1] font-medium">*/}
      {/*                {coreValues[selectedValue].subtitle}*/}
      {/*              </p>*/}
      {/*            </div>*/}
      {/*          </div>*/}

      {/*          <div className="bg-[#bad4e1]/10 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-[#bad4e1]/20">*/}
      {/*            <div className="flex items-center gap-2 mb-2">*/}
      {/*              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-[#bad4e1]" />*/}
      {/*              <span className="text-xs font-semibold text-[#bad4e1] uppercase tracking-wider">Inspiratie</span>*/}
      {/*            </div>*/}
      {/*            <p className="text-sm md:text-lg italic text-white font-medium">*/}
      {/*              "{coreValues[selectedValue].quote}"*/}
      {/*            </p>*/}
      {/*          </div>*/}
      {/*        </div>*/}
      {/*      </div>*/}

      {/*      {/* Content - Mobile Optimized *!/*/}
      {/*      <div className="flex-1 overflow-y-auto p-4 md:p-6">*/}
      {/*        {/* Mobile: Stack cards vertically, Desktop: 3 columns *!/*/}
      {/*        <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-6">*/}
      {/*          <div className="space-y-3">*/}
      {/*            <div className="flex items-center gap-3 mb-3">*/}
      {/*              <div className="w-8 h-8 bg-[#1e1839] rounded-lg flex items-center justify-center">*/}
      {/*                <Heart className="w-4 h-4 text-[#bad4e1]" />*/}
      {/*              </div>*/}
      {/*              <h4 className="font-bold text-base md:text-lg text-[#1e1839]">Essentie</h4>*/}
      {/*            </div>*/}
      {/*            <div className="bg-gradient-to-br from-[#1e1839]/5 to-[#bad4e1]/5 rounded-xl p-4 border border-[#bad4e1]/20">*/}
      {/*              <p className="text-[#1e1839] leading-relaxed text-sm md:text-base">*/}
      {/*                {coreValues[selectedValue].essence}*/}
      {/*              </p>*/}
      {/*            </div>*/}
      {/*          </div>*/}

      {/*          <div className="space-y-3">*/}
      {/*            <div className="flex items-center gap-3 mb-3">*/}
      {/*              <div className="w-8 h-8 bg-[#1e1839] rounded-lg flex items-center justify-center">*/}
      {/*                <Target className="w-4 h-4 text-[#bad4e1]" />*/}
      {/*              </div>*/}
      {/*              <h4 className="font-bold text-base md:text-lg text-[#1e1839]">Toepassing</h4>*/}
      {/*            </div>*/}
      {/*            <div className="bg-gradient-to-br from-[#1e1839]/5 to-[#bad4e1]/5 rounded-xl p-4 border border-[#bad4e1]/20">*/}
      {/*              <p className="text-[#1e1839] leading-relaxed text-sm md:text-base">*/}
      {/*                {coreValues[selectedValue].toepassing}*/}
      {/*              </p>*/}
      {/*            </div>*/}
      {/*          </div>*/}

      {/*          <div className="space-y-3">*/}
      {/*            <div className="flex items-center gap-3 mb-3">*/}
      {/*              <div className="w-8 h-8 bg-[#1e1839] rounded-lg flex items-center justify-center">*/}
      {/*                <Zap className="w-4 h-4 text-[#bad4e1]" />*/}
      {/*              </div>*/}
      {/*              <h4 className="font-bold text-base md:text-lg text-[#1e1839]">Impact</h4>*/}
      {/*            </div>*/}
      {/*            <div className="bg-gradient-to-br from-[#1e1839]/5 to-[#bad4e1]/5 rounded-xl p-4 border border-[#bad4e1]/20">*/}
      {/*              <p className="text-[#1e1839] leading-relaxed text-sm md:text-base">*/}
      {/*                {coreValues[selectedValue].impact}*/}
      {/*              </p>*/}
      {/*            </div>*/}
      {/*          </div>*/}
      {/*        </div>*/}

      {/*        {/* Call to action *!/*/}
      {/*        <div className="mt-6 pt-4 border-t border-[#bad4e1]/20">*/}
      {/*          <div className="text-center bg-gradient-to-br from-[#1e1839]/5 to-[#bad4e1]/5 rounded-2xl p-4 md:p-6 border border-[#bad4e1]/20">*/}
      {/*            <h5 className="text-base md:text-lg font-bold text-[#1e1839] mb-2 md:mb-3">*/}
      {/*              Klaar voor jouw transformatie?*/}
      {/*            </h5>*/}
      {/*            <p className="text-[#1e1839]/80 mb-4 md:mb-6 text-sm md:text-base">*/}
      {/*              Wil je ervaren hoe deze kernwaarde jouw groei kan versterken?*/}
      {/*            </p>*/}
      {/*            <div className="flex flex-col sm:flex-row gap-3 justify-center">*/}
      {/*              <Button*/}
      {/*                size="default"*/}
      {/*                className="bg-[#1e1839] hover:bg-[#1e1839]/90 text-white font-semibold px-6 py-3 touch-manipulation shadow-lg hover:shadow-xl transition-all duration-300 text-sm md:text-base"*/}
      {/*                asChild*/}
      {/*              >*/}
      {/*                <Link href="/#contact">*/}
      {/*                  Start Jouw Reis*/}
      {/*                  <ArrowRight className="w-4 h-4 ml-2" />*/}
      {/*                </Link>*/}
      {/*              </Button>*/}
      {/*              <Button*/}
      {/*                size="default"*/}
      {/*                variant="outline"*/}
      {/*                className="border-2 border-[#1e1839] text-[#1e1839] hover:bg-[#1e1839] hover:text-white font-semibold px-6 py-3 touch-manipulation transition-all duration-300 text-sm md:text-base"*/}
      {/*                asChild*/}
      {/*              >*/}
      {/*                <Link href="/over-ons/visie-missie">Meer Over Ons</Link>*/}
      {/*              </Button>*/}
      {/*            </div>*/}
      {/*          </div>*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*)}*/}

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 lg:px-6 max-w-4xl text-center">
          <div
            ref={ctaAnimation.ref}
            className={`bg-gradient-to-r from-primary to-secondary rounded-2xl md:rounded-3xl p-8 md:p-12 text-white animate-on-scroll-scale ${ctaAnimation.isVisible ? "animate-visible" : ""}`}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Ervaar onze kernwaarden in actie</h3>
            <p className="text-lg md:text-xl mb-6 md:mb-8 text-white/90 max-w-3xl mx-auto">
              Ontdek hoe onze waarden jouw transformatie kunnen ondersteunen. Laten we samen werken aan een sterker,
              vrijer en gezonder leven.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4" asChild>
                <Link href="/#contact">
                  Start Jouw Reis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                className="bg-secondary/20 text-white border-2 border-white/30 hover:bg-white/20 hover:border-white/50 backdrop-blur-sm font-semibold px-8 py-4 transition-all duration-300"
                asChild
              >
                <Link href="/over-ons/visie-missie">Lees Onze Visie & Missie</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
