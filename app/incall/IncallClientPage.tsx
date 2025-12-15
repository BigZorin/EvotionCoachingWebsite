"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  PlayIcon,
  Target,
  Compass,
  Shield,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Users,
  Clock,
  Repeat,
  HandshakeIcon,
} from "lucide-react"

interface Slide {
  id: number
  title: string
  subtitle?: string
  body?: string | string[]
  type: "intro" | "content" | "closing" | "cover" | "overview" | "signals"
  icon?: any
  highlightColor?: string
  points?: { text: string; icon?: any }[]
  introText?: string
}

const slides: Slide[] = [
  {
    id: 0,
    title: "Discovery Call",
    subtitle: "Evotion Coaching",
    type: "cover",
  },
  {
    id: 1,
    title: "Het doel van deze call",
    subtitle: "Helder krijgen waar je staat en wat je nodig hebt",
    icon: Target,
    type: "intro",
    highlightColor: "from-[#1e1839] to-[#3a2d6d]",
    introText: "Deze call is bedoeld om helder te krijgen:",
    points: [
      { text: "Waar je nu staat", icon: Compass },
      { text: "Waar je naartoe wilt", icon: Target },
      { text: "Wat je daarin tegenhoudt", icon: AlertCircle },
    ],
    body: "Mijn rol vandaag is niet om iets te verkopen, maar om te kijken of en hoe ik je kan helpen.",
  },
  {
    id: 2,
    title: "Waarom mensen vaak vastlopen",
    subtitle: "Het is normaal om niet alles helder te hebben",
    icon: Compass,
    type: "overview",
    highlightColor: "from-blue-600 to-indigo-600",
    introText: "Wat we bij veel mensen zien:",
    points: [
      { text: "Veel proberen zonder duurzaam resultaat", icon: Repeat },
      { text: "Losse adviezen volgen die niet bij je passen", icon: Users },
      { text: "Alles zelf willen oplossen zonder structuur", icon: Clock },
    ],
    body: "Niet door gebrek aan motivatie, maar door gebrek aan overzicht en begeleiding.",
  },
  {
    id: 3,
    title: "Het verschil tussen willen en bereiken",
    subtitle: "De kloof die vaak aanwezig is",
    icon: Lightbulb,
    type: "content",
    highlightColor: "from-emerald-500 to-teal-600",
    introText: "Die kloof bestaat vaak uit:",
    points: [
      { text: "Onduidelijkheid over de juiste aanpak", icon: AlertCircle },
      { text: "Inconsistentie door gebrek aan structuur", icon: Repeat },
      { text: "Twijfel over wat écht werkt voor jou", icon: Lightbulb },
    ],
    body: "Deze call is bedoeld om die kloof scherp te krijgen.",
  },
  {
    id: 4,
    title: "Wanneer begeleiding vaak nodig wordt",
    subtitle: "Herkenbare signalen",
    icon: Shield,
    type: "signals",
    highlightColor: "from-rose-500 to-pink-600",
    introText: "Begeleiding is vaak helpend wanneer:",
    points: [
      { text: "Je het gevoel hebt alles al geprobeerd te hebben", icon: Repeat },
      { text: "Alleen blijven zoeken te veel tijd en energie kost", icon: Clock },
      { text: "Consistentie lastig blijft ondanks goede intenties", icon: Target },
    ],
    body: "Niet omdat je het niet kan, maar omdat het samen sneller en helderder gaat.",
  },
  {
    id: 5,
    title: "Wat nu logisch is",
    subtitle: "Jij bepaalt wat voor jou past",
    icon: HandshakeIcon,
    type: "closing",
    highlightColor: "from-[#1e1839] to-[#3a2d6d]",
    introText: "Van hieruit zijn er drie opties:",
    points: [
      { text: "Samen verder kijken naar mogelijkheden", icon: ArrowRight },
      { text: "Dit even laten bezinken en later terugkomen", icon: Clock },
      { text: "Concluderen dat dit nu niet past", icon: CheckCircle2 },
    ],
    body: "Alle drie zijn oké. Het belangrijkste is dat er nu duidelijkheid is.",
  },
]

export default function IncallClientPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isAutoPlay, setIsAutoPlay] = useState(false)
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next")

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setSlideDirection("next")
      setCurrentSlide(currentSlide + 1)
    } else if (isAutoPlay) {
      setIsAutoPlay(false)
    }
  }, [currentSlide, isAutoPlay])

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setSlideDirection("prev")
      setCurrentSlide(currentSlide - 1)
    }
  }, [currentSlide])

  const goToSlide = (index: number) => {
    setSlideDirection(index > currentSlide ? "next" : "prev")
    setCurrentSlide(index)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault()
        nextSlide()
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        prevSlide()
      } else if (e.key === "Escape" && isFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [nextSlide, prevSlide, isFullscreen])

  useEffect(() => {
    if (!isAutoPlay) return

    const timer = setInterval(() => {
      nextSlide()
    }, 8000)

    return () => clearInterval(timer)
  }, [isAutoPlay, nextSlide])

  const slide = slides[currentSlide]
  const progressPercent = ((currentSlide + 1) / slides.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Progress Bar */}
          <div className="h-1 bg-slate-100">
            <div
              className="h-full bg-gradient-to-r from-[#1e1839] to-[#3a2d6d] transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-600">
                Slide {currentSlide + 1} / {slides.length}
              </span>
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  className={`text-xs ${isAutoPlay ? "bg-[#1e1839] text-white hover:bg-[#2a2050]" : "bg-transparent"}`}
                >
                  {isAutoPlay ? (
                    <>
                      <Pause className="w-3 h-3 mr-1" />
                      Pause
                    </>
                  ) : (
                    <>
                      <PlayIcon className="w-3 h-3 mr-1" />
                      Auto-play
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={toggleFullscreen} className="text-xs bg-transparent">
                  {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={prevSlide} disabled={currentSlide === 0}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextSlide} disabled={currentSlide === slides.length - 1}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div
          key={currentSlide}
          className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[70vh] animate-in fade-in duration-300"
        >
          {/* Cover Slide - Video Background */}
          {slide.type === "cover" && (
            <div className="relative h-full min-h-[70vh] flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute inset-0 z-0">
                <div className="relative w-full h-full">
                  <iframe
                    src="https://www.youtube.com/embed/SpTe8MThxVc?autoplay=1&mute=1&loop=1&playlist=SpTe8MThxVc&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1"
                    className="absolute inset-0 w-full h-full object-cover scale-150"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    style={{ pointerEvents: "none" }}
                    title="Evotion Coaching introductievideo"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#1e1839]/80 via-[#1e1839]/70 to-[#1e1839]/80"></div>
                </div>
              </div>

              <div className="relative z-10 max-w-4xl text-center space-y-8 p-12 text-white">
                <div className="inline-block px-6 py-2 bg-white/10 rounded-full text-sm font-medium backdrop-blur-sm">
                  Evotion Coaching
                </div>
                <h1 className="text-6xl md:text-7xl font-bold leading-tight text-balance">{slide.title}</h1>
                <p className="text-2xl md:text-3xl text-slate-200 text-balance">{slide.subtitle}</p>
                <div className="pt-8">
                  <Button
                    size="lg"
                    onClick={nextSlide}
                    className="bg-white text-[#1e1839] hover:bg-slate-100 px-8 py-6 text-lg rounded-xl"
                  >
                    Start Presentatie
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Intro Slide - Dark gradient with cards */}
          {slide.type === "intro" && (
            <div className="relative h-full min-h-[70vh] overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${slide.highlightColor}`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
              </div>

              <div className="relative flex flex-col items-center justify-center h-full p-8 md:p-16 text-white">
                <div className="max-w-5xl w-full space-y-10">
                  {slide.icon && (
                    <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
                      <slide.icon className="w-10 h-10 text-white" strokeWidth={1.5} />
                    </div>
                  )}

                  <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight text-balance">{slide.title}</h1>
                    {slide.subtitle && (
                      <p className="text-xl md:text-2xl text-white/90 text-balance font-light">{slide.subtitle}</p>
                    )}
                  </div>

                  {slide.points && (
                    <div className="space-y-5 max-w-3xl mx-auto pt-4">
                      {slide.introText && <p className="text-lg text-white/90 text-center mb-8">{slide.introText}</p>}
                      <div className="grid md:grid-cols-3 gap-4">
                        {slide.points.map((point, idx) => {
                          const PointIcon = point.icon
                          return (
                            <div
                              key={idx}
                              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center hover:bg-white/15 transition-all duration-300 group"
                            >
                              {PointIcon && (
                                <div className="w-14 h-14 mx-auto bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                  <PointIcon className="w-7 h-7 text-white" />
                                </div>
                              )}
                              <p className="text-lg font-medium leading-relaxed">{point.text}</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {slide.body && (
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mt-6">
                      <p className="text-xl md:text-2xl font-light italic text-center leading-relaxed">{slide.body}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Overview Slide - White background with colored cards */}
          {slide.type === "overview" && (
            <div className="relative h-full min-h-[70vh] overflow-hidden bg-gradient-to-br from-slate-50 to-white">
              <div className="relative flex flex-col items-center justify-center h-full p-8 md:p-16">
                <div className="max-w-5xl w-full space-y-10">
                  {slide.icon && (
                    <div
                      className={`w-20 h-20 mx-auto bg-gradient-to-br ${slide.highlightColor} rounded-2xl flex items-center justify-center shadow-lg`}
                    >
                      <slide.icon className="w-10 h-10 text-white" strokeWidth={1.5} />
                    </div>
                  )}

                  <div className="text-center space-y-3">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight text-balance">
                      {slide.title}
                    </h1>
                    {slide.subtitle && (
                      <p className="text-xl md:text-2xl text-slate-600 text-balance font-light">{slide.subtitle}</p>
                    )}
                  </div>

                  {slide.points && (
                    <div className="space-y-4 max-w-4xl mx-auto pt-4">
                      {slide.introText && <p className="text-lg text-slate-700 text-center mb-8">{slide.introText}</p>}
                      <div className="grid md:grid-cols-3 gap-5">
                        {slide.points.map((point, idx) => {
                          const PointIcon = point.icon
                          return (
                            <div
                              key={idx}
                              className="bg-white border-2 border-slate-200 rounded-2xl p-6 text-center hover:border-blue-300 hover:shadow-lg transition-all duration-300 group"
                            >
                              {PointIcon && (
                                <div
                                  className={`w-12 h-12 shrink-0 bg-gradient-to-br ${slide.highlightColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                                >
                                  <PointIcon className="w-6 h-6 text-white" />
                                </div>
                              )}
                              <p className="text-lg md:text-xl text-slate-800 leading-relaxed">{point.text}</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {slide.body && (
                    <div className={`bg-gradient-to-br ${slide.highlightColor} rounded-2xl p-8 text-white text-center`}>
                      <p className="text-xl md:text-2xl font-light italic leading-relaxed">{slide.body}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Content Slide - Clean white with accent color */}
          {slide.type === "content" && (
            <div className="relative h-full min-h-[70vh] overflow-hidden bg-white">
              <div className="relative flex flex-col items-center justify-center h-full p-8 md:p-16">
                <div className="max-w-5xl w-full space-y-10">
                  {slide.icon && (
                    <div
                      className={`w-20 h-20 mx-auto bg-gradient-to-br ${slide.highlightColor} rounded-2xl flex items-center justify-center shadow-lg`}
                    >
                      <slide.icon className="w-10 h-10 text-white" strokeWidth={1.5} />
                    </div>
                  )}

                  <div className="text-center space-y-3">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight text-balance">
                      {slide.title}
                    </h1>
                    {slide.subtitle && (
                      <p className="text-xl md:text-2xl text-slate-600 text-balance font-light">{slide.subtitle}</p>
                    )}
                  </div>

                  {slide.points && (
                    <div className="space-y-4 max-w-3xl mx-auto pt-4">
                      {slide.introText && <p className="text-lg text-slate-700 text-center mb-8">{slide.introText}</p>}
                      {slide.points.map((point, idx) => {
                        const PointIcon = point.icon
                        return (
                          <div
                            key={idx}
                            className="bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-emerald-300 transition-all duration-300 group"
                          >
                            <div className="flex items-center gap-5">
                              {PointIcon && (
                                <div
                                  className={`w-12 h-12 shrink-0 bg-gradient-to-br ${slide.highlightColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                                >
                                  <PointIcon className="w-6 h-6 text-white" />
                                </div>
                              )}
                              <p className="text-lg md:text-xl text-slate-800 leading-relaxed flex-1">{point.text}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {slide.body && (
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-2xl p-8 mt-4">
                      <p className="text-xl md:text-2xl text-slate-700 font-light italic text-center leading-relaxed">
                        {slide.body}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Signals Slide - Warm amber background */}
          {slide.type === "signals" && (
            <div className="relative h-full min-h-[70vh] overflow-hidden bg-gradient-to-br from-slate-50 to-white">
              <div className="relative flex flex-col items-center justify-center h-full p-8 md:p-16">
                <div className="max-w-5xl w-full space-y-10">
                  {slide.icon && (
                    <div
                      className={`w-20 h-20 mx-auto bg-gradient-to-br ${slide.highlightColor} rounded-2xl flex items-center justify-center shadow-lg`}
                    >
                      <slide.icon className="w-10 h-10 text-white" strokeWidth={1.5} />
                    </div>
                  )}

                  <div className="text-center space-y-3">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight text-balance">
                      {slide.title}
                    </h1>
                    {slide.subtitle && (
                      <p className="text-xl md:text-2xl text-slate-600 text-balance font-light">{slide.subtitle}</p>
                    )}
                  </div>

                  {slide.points && (
                    <div className="space-y-4 max-w-3xl mx-auto pt-4">
                      {slide.introText && <p className="text-lg text-slate-700 text-center mb-8">{slide.introText}</p>}
                      {slide.points.map((point, idx) => {
                        const PointIcon = point.icon
                        return (
                          <div
                            key={idx}
                            className="bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-rose-300 transition-all duration-300 group"
                          >
                            <div className="flex items-center gap-5">
                              {PointIcon && (
                                <div
                                  className={`w-12 h-12 shrink-0 bg-gradient-to-br ${slide.highlightColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                                >
                                  <PointIcon className="w-6 h-6 text-white" />
                                </div>
                              )}
                              <p className="text-lg md:text-xl font-medium text-slate-800 leading-relaxed flex-1">
                                {point.text}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {slide.body && (
                    <div className={`bg-gradient-to-br ${slide.highlightColor} rounded-2xl p-8 text-white text-center`}>
                      <p className="text-xl md:text-2xl font-light italic leading-relaxed">{slide.body}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Closing Slide - Dark gradient */}
          {slide.type === "closing" && (
            <div className="relative h-full min-h-[70vh] overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${slide.highlightColor}`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
              </div>

              <div className="relative flex flex-col items-center justify-center h-full p-8 md:p-16 text-white">
                <div className="max-w-5xl w-full space-y-10">
                  {slide.icon && (
                    <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
                      <slide.icon className="w-10 h-10 text-white" strokeWidth={1.5} />
                    </div>
                  )}

                  <div className="text-center space-y-3">
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight text-balance">{slide.title}</h1>
                    {slide.subtitle && (
                      <p className="text-xl md:text-2xl text-white/90 text-balance font-light">{slide.subtitle}</p>
                    )}
                  </div>

                  {slide.points && (
                    <div className="space-y-4 max-w-3xl mx-auto pt-4">
                      {slide.introText && <p className="text-lg text-white/90 text-center mb-8">{slide.introText}</p>}
                      {slide.points.map((point, idx) => {
                        const PointIcon = point.icon
                        return (
                          <div
                            key={idx}
                            className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:border-white/30 transition-all duration-300 group"
                          >
                            <div className="flex items-center gap-5">
                              {PointIcon && (
                                <div className="w-12 h-12 shrink-0 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                  <PointIcon className="w-6 h-6 text-white" strokeWidth={2} />
                                </div>
                              )}
                              <p className="text-lg md:text-xl font-medium leading-relaxed">{point.text}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {slide.body && (
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 md:p-10 mt-4">
                      <p className="text-xl md:text-2xl font-medium text-center leading-relaxed">{slide.body}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Slide Navigation Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-6 flex-wrap max-w-4xl mx-auto">
          {slides.map((s, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide
                  ? "bg-[#1e1839] w-8"
                  : idx < currentSlide
                    ? "bg-[#1e1839]/40 w-2 hover:bg-[#1e1839]/60"
                    : "bg-slate-300 w-2 hover:bg-slate-400"
              }`}
              aria-label={`Ga naar slide ${idx + 1}: ${s.title}`}
              title={s.title}
            />
          ))}
        </div>

        {/* Keyboard Navigation Hint */}
        <p className="text-center text-sm text-slate-500 mt-4">
          Gebruik ← → pijltjestoetsen of spatiebalk om te navigeren
        </p>
      </div>
    </div>
  )
}
