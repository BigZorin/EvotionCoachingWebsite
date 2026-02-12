"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Crown, Play, Lock, CheckCircle, Users, Star, Dumbbell, Heart, Smartphone, Film } from "lucide-react"
import { DeviceMockup } from "./device-mockup"

const SCREENS = [
  { src: "/images/app-screenshots/evotion-welkom.jpg", alt: "Evotion App — Welkom & Login" },
  { src: "/images/app-screenshots/evotion-dashboard.jpg", alt: "Evotion App — Dashboard Overzicht" },
  { src: "/images/app-screenshots/evotion-workout.jpg", alt: "Evotion App — Workouts" },
  { src: "/images/app-screenshots/evotion-voeding.jpg", alt: "Evotion App — Voeding & Macro's" },
  { src: "/images/app-screenshots/evotion-coach-chat.jpg", alt: "Evotion App — Coach Chat" },
  { src: "/images/app-screenshots/evotion-extra.jpg", alt: "Evotion App — Extra Features" },
]

const STORY_STEPS = [
  {
    title: "Snel starten",
    desc: "Log in en bekijk direct jouw dagoverzicht — check-ins, doelen en reminders in één oogopslag.",
    screenIndex: 0,
    bullets: ["Biometrische login", "Dagelijkse check-in", "Persoonlijk dashboard"],
  },
  {
    title: "Train slim",
    desc: "Volg gepersonaliseerde workouts met duidelijke instructies en progressie-overzicht.",
    screenIndex: 2,
    bullets: ["Oefeningen met sets/reps", "RPE en notities", "Progressie per oefening"],
  },
  {
    title: "Eet met richting",
    desc: "Gebruik macro- en calorietracking, met recepten en tips passend bij je schema.",
    screenIndex: 3,
    bullets: ["Macro’s en doelen", "Recepten & tips", "Overzicht per maaltijd"],
  },
  {
    title: "Coach in je broekzak",
    desc: "Stel vragen, deel updates en ontvang feedback — alles via de ingebouwde chat.",
    screenIndex: 4,
    bullets: ["Directe chat", "Snelle feedback", "Motiverende support"],
  },
]

const FEATURES = [
  {
    icon: Dumbbell,
    title: "Workouts op maat",
    desc: "Schema’s afgestemd op jouw niveau, met progressie-tracking per oefening.",
  },
  {
    icon: Heart,
    title: "Voeding en leefstijl",
    desc: "Macrodoelen, recepten en praktische tips voor duurzame resultaten.",
  },
  {
    icon: Smartphone,
    title: "Directe coaching",
    desc: "Krijg snel antwoord via chat en blijf gemotiveerd met regelmatige feedback.",
  },
]

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-10% 0px" },
  transition: { duration: 0.6, delay },
})

export default function EvotionAppPage() {
  const [activeStep, setActiveStep] = useState(0)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  // Observe visible story step to sync mockup
  useEffect(() => {
    const els = stepRefs.current.filter(Boolean) as HTMLDivElement[]
    if (els.length === 0) return
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) {
          const idx = els.findIndex((el) => el === visible.target)
          if (idx !== -1) setActiveStep(idx)
        }
      },
      { threshold: [0.25, 0.5, 0.75] },
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const heroScreens = useMemo(() => SCREENS.slice(0, 3), [])
  const mockupImages = useMemo(
    () => STORY_STEPS.map((s) => SCREENS[s.screenIndex]).filter(Boolean) as { src: string; alt: string }[],
    [],
  )

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* HERO */}
        <section className="relative py-14 md:py-16 lg:py-20">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative">
            <div className="grid md:grid-cols-12 gap-10 items-center">
              {/* Left: text */}
              <motion.div {...fadeIn(0.05)} className="md:col-span-6 space-y-6">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 w-fit"
                >
                  <Crown className="w-4 h-4 mr-2" aria-hidden="true" />
                  Exclusief voor coaching klanten
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary tracking-tight">
                  De Evotion Coaching App
                </h1>
                <p className="text-lg lg:text-xl text-gray-700 max-w-2xl">
                  Jouw personal trainer in je zak — persoonlijke workouts, voeding, voortgang en directe coaching.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/online-coaching">
                    <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-7 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all">
                      <Crown className="w-5 h-5 mr-2" aria-hidden="true" />
                      Start met Coaching
                    </Button>
                  </Link>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-white px-7 py-4 text-lg rounded-xl transition-all bg-transparent"
                        aria-label="Bekijk demo video van de Evotion App"
                      >
                        <Play className="w-5 h-5 mr-2" aria-hidden="true" />
                        Bekijk Demo
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Evotion App Demo</DialogTitle>
                      </DialogHeader>
                      <div className="relative w-full pt-[56.25%] rounded-xl overflow-hidden bg-black/5">
                        <iframe
                          className="absolute inset-0 h-full w-full"
                          src="https://www.youtube.com/embed/5qap5aO4i9A?rel=0"
                          title="Evotion App demo video"
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5" aria-hidden="true" />
                    <span className="text-sm">iOS & Android</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                    ))}
                    <span className="text-sm ml-2">5.0 rating</span>
                  </div>
                </div>
              </motion.div>

              {/* Right: mockup */}
              <motion.div {...fadeIn(0.15)} className="md:col-span-6">
                <div className="rounded-3xl border border-gray-200 bg-white/70 backdrop-blur p-6 shadow-md">
                  <DeviceMockup images={heroScreens} />
                </div>
              </motion.div>
            </div>

            {/* Access box */}
            <motion.div
              {...fadeIn(0.25)}
              className="mt-10 rounded-2xl border border-gray-200 bg-white/70 backdrop-blur p-6 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mt-1 shadow">
                  <Lock className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">App-toegang inbegrepen bij:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
                    {["Online Coaching", "Premium Coaching", "12-Weken Vetverlies", "Personal Training"].map((item) => (
                      <div className="flex items-center gap-2" key={item}>
                        <CheckCircle className="w-4 h-4 text-primary" aria-hidden="true" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SPLIT STICKY STORY */}
        <section className="py-16">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid md:grid-cols-12 gap-10">
              {/* Sticky mockup */}
              <div className="md:col-span-5">
                <div className="sticky top-24">
                  <div className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur p-6 shadow-md">
                    <DeviceMockup images={mockupImages} activeIndex={activeStep} />
                  </div>
                </div>
              </div>

              {/* Story steps */}
              <div className="md:col-span-7 space-y-8">
                {STORY_STEPS.map((step, i) => (
                  <motion.div
                    key={step.title}
                    {...fadeIn(i * 0.05)}
                    ref={(el) => (stepRefs.current[i] = el)}
                    className={`rounded-2xl border transition-all duration-300 px-6 py-5 ${
                      activeStep === i
                        ? "border-primary ring-2 ring-primary/40 bg-primary/[0.03]"
                        : "border-gray-200 hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                          activeStep === i ? "bg-primary text-white" : "bg-primary/10 text-primary"
                        }`}
                      >
                        <Film className="w-6 h-6" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-primary">{step.title}</h3>
                        <p className="text-gray-700 mt-1">{step.desc}</p>
                        <ul className="mt-3 grid sm:grid-cols-3 gap-2">
                          {step.bullets.map((b) => (
                            <li key={b} className="flex items-center gap-2 text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-600" aria-hidden="true" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE HIGHLIGHTS */}
        <section className="py-14 bg-gray-50">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.title}
                  {...fadeIn(i * 0.05)}
                  className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-6 shadow-sm"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-2xl mb-3">
                    <f.icon className="w-7 h-7 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary">{f.title}</h3>
                  <p className="text-gray-700 mt-1">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* HORIZONTAL SCREENS GALLERY */}
        <section className="py-16">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <motion.div {...fadeIn(0.05)} className="mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary">Screenshots</h2>
              <p className="text-gray-700 mt-2">Een snelle blik op verschillende onderdelen van de Evotion App.</p>
            </motion.div>
            <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex gap-6 min-w-max">
                {SCREENS.map((s, i) => (
                  <motion.div
                    key={s.alt}
                    {...fadeIn(0.08 + i * 0.04)}
                    className="shrink-0 w-[240px] rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-4 shadow-sm"
                  >
                    <div className="relative w-full aspect-[1/2]">
                      <Image
                        src={s.src || "/placeholder.svg"}
                        alt={s.alt}
                        fill
                        className="object-cover rounded-xl"
                        sizes="(max-width: 768px) 70vw, 240px"
                        priority={false}
                      />
                    </div>
                    <div className="mt-3 text-sm text-gray-700">{s.alt.replace("Evotion App — ", "")}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* STATS STRIP */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { number: "500+", label: "Actieve Gebruikers", icon: Users },
                { number: "5.0", label: "App Rating", icon: Star },
                { number: "10.000+", label: "Workouts Voltooid", icon: Dumbbell },
                { number: "98%", label: "Tevredenheid", icon: Heart },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  {...fadeIn(i * 0.05)}
                  className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-6 text-center shadow-sm"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-2xl mb-3">
                    <stat.icon className="w-7 h-7 text-primary" aria-hidden="true" />
                  </div>
                  <div className="text-3xl font-bold text-primary">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <motion.div {...fadeIn(0.05)} className="text-center text-white">
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">Krijg Toegang Tot De App</h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Kies een van onze coaching programma’s en ontvang direct premium toegang.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/online-coaching">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white text-primary hover:bg-gray-100 px-7 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    Bekijk Online Coaching
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="bg-primary/10 hover:bg-white hover:text-primary border-2 border-white text-white px-7 py-4 text-lg font-semibold rounded-xl transition-all"
                  >
                    Plan een gratis intake
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
