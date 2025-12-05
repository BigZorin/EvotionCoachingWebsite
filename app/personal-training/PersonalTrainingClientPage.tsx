"use client"

import type React from "react"

import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dumbbell,
  Star,
  CheckCircle,
  Target,
  ArrowRight,
  Phone,
  MessageCircle,
  TrendingUp,
  Trophy,
  Clock,
  User,
  Shield,
  Zap,
  Heart,
} from "lucide-react"
import { useState, useEffect } from "react"
import { sendContactEmail } from "@/app/actions/contact"

function useAnimatedCounter(target: number, duration = 1400, startWhenVisible = true) {
  const [value, setValue] = useState(0)
  const [ref, setRef] = useState<HTMLDivElement | null>(null)
  const [startedRef, setStartedRef] = useState(false)

  useEffect(() => {
    if (!startWhenVisible) {
      let start: number | null = null
      let raf: number
      const step = (ts: number) => {
        if (start === null) start = ts
        const progress = Math.min((ts - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setValue(Math.floor(target * eased))
        if (progress < 1) {
          raf = requestAnimationFrame(step)
        }
      }
      raf = requestAnimationFrame(step)
      return () => cancelAnimationFrame(raf)
    }

    const node = ref
    if (!node) return
    if (startedRef) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && !startedRef) {
          setStartedRef(true)
          let start: number | null = null
          let raf: number
          const step = (ts: number) => {
            if (start === null) start = ts
            const progress = Math.min((ts - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(Math.floor(target * eased))
            if (progress < 1) {
              raf = requestAnimationFrame(step)
            }
          }
          raf = requestAnimationFrame(step)
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
    }
  }, [duration, startWhenVisible, target])

  return { ref: setRef, value }
}

export default function PersonalTrainingClientPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    goal: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      const result = await sendContactEmail({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        subject: "Personal Training interesse",
        message: formData.message,
      })

      if (result.success) {
        setSubmitMessage({ type: "success", text: result.message || "Bericht verzonden!" })
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          goal: "",
          message: "",
        })
      } else {
        setSubmitMessage({ type: "error", text: result.error || "Er ging iets mis." })
      }
    } catch (error) {
      setSubmitMessage({ type: "error", text: "Er ging iets mis bij het verzenden." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const benefits = [
    {
      icon: User,
      title: "100% Persoonlijke Aandacht",
      description: "Volledige focus van je gecertificeerde personal trainer tijdens elke sessie",
    },
    {
      icon: Target,
      title: "Doelgerichte Training",
      description: "Trainingen perfect afgestemd op jouw specifieke doelen en niveau",
    },
    {
      icon: Shield,
      title: "Veilige Uitvoering",
      description: "Correcte techniek en voorkoming van blessures door professionele begeleiding",
    },
    {
      icon: Zap,
      title: "Snellere Resultaten",
      description: "Efficiëntere trainingen leiden tot snellere en betere resultaten",
    },
    {
      icon: Heart,
      title: "Motivatie & Support",
      description: "Constante motivatie en ondersteuning om je doelen te bereiken",
    },
    {
      icon: Clock,
      title: "Flexibele Planning",
      description: "Plan je sessies op tijden die perfect bij jouw schema passen",
    },
  ]

  const packages = [
    {
      title: "10 Sessies",
      sessions: "10 personal training sessies",
      features: [
        "10 personal training sessies",
        "Intake en doelstelling",
        "Basis trainingsschema",
        "Voedingsadvies",
        "Flexibele planning",
      ],
      popular: false,
      whatsappMessage: "Hoi! Ik heb interesse in het 10 Sessies pakket voor Personal Training.",
    },
    {
      title: "20 Sessies",
      sessions: "20 personal training sessies",
      features: [
        "20 personal training sessies",
        "Uitgebreide intake",
        "Gepersonaliseerd trainingsschema",
        "Voedingsplan op maat",
        "Tussentijdse evaluaties",
        "WhatsApp support",
      ],
      popular: true,
      whatsappMessage: "Hoi! Ik heb interesse in het 20 Sessies pakket voor Personal Training.",
    },
    {
      title: "40 Sessies",
      sessions: "40 personal training sessies",
      features: [
        "40 personal training sessies",
        "Complete lifestyle analyse",
        "Volledig trainings- en voedingsplan",
        "Wekelijkse voortgangsmetingen",
        "24/7 WhatsApp support",
        "Gratis herhalingsschema",
        "Prioriteit bij planning",
      ],
      popular: false,
      whatsappMessage: "Hoi! Ik heb interesse in het 40 Sessies pakket voor Personal Training.",
    },
  ]

  const stat1 = useAnimatedCounter(100)
  const stat2 = useAnimatedCounter(70)
  const stat3 = useAnimatedCounter(10)
  const stat4 = useAnimatedCounter(95)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - #1e1839 background */}
      <section className="relative py-16 lg:py-28 bg-[#1e1839] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e1839] via-[#1e1839] to-[#2a2252]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
              <div className="space-y-4 lg:space-y-6">
                <Badge className="bg-[#bad4e1]/20 text-[#bad4e1] border-[#bad4e1]/30 inline-flex">
                  <Dumbbell className="w-4 h-4 mr-2" />
                  Personal Training
                </Badge>
                <h1 className="text-3xl lg:text-6xl font-bold text-white leading-tight">
                  Personal Training <span className="block lg:inline text-[#bad4e1]">1-op-1 Begeleiding</span>
                </h1>
                <p className="text-base lg:text-xl text-white/80 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Ervaar de kracht van 1-op-1 begeleiding met onze gecertificeerde personal trainers. Bereik je doelen
                  sneller, veiliger en effectiever dan ooit tevoren.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="bg-[#bad4e1] hover:bg-[#bad4e1]/90 text-[#1e1839] px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-semibold"
                  asChild
                >
                  <a
                    href="https://wa.me/31064365571?text=Hoi!%20Ik%20heb%20interesse%20in%20Personal%20Training%20en%20wil%20graag%20meer%20informatie."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                    Stuur een Bericht
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 bg-transparent"
                  asChild
                >
                  <a href="tel:0064365571">
                    <Phone className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                    Bel Direct
                  </a>
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 lg:gap-6 pt-4 lg:pt-8">
                <div className="text-center">
                  <div className="text-xl lg:text-3xl font-bold mb-1 text-white">100%</div>
                  <div className="text-xs lg:text-sm text-white/60">Persoonlijk</div>
                </div>
                <div className="text-center">
                  <div className="text-xl lg:text-3xl font-bold mb-1 text-white">1-op-1</div>
                  <div className="text-xs lg:text-sm text-white/60">Begeleiding</div>
                </div>
                <div className="text-center">
                  <div className="text-xl lg:text-3xl font-bold mb-1 text-[#bad4e1]">5.0</div>
                  <div className="text-xs lg:text-sm text-white/60">Google Score</div>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative w-full h-[480px] lg:h-[520px] rounded-2xl overflow-hidden border border-white/10">
                <Image
                  src="/images/personal-training-session.jpeg"
                  alt="Personal Training Sessie bij Evotion Coaching"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e1839]/40 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-white/90 backdrop-blur px-3 py-1.5">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs font-medium text-[#1e1839]">Top Beoordelingen</span>
                </div>
                <div className="absolute bottom-4 right-4">
                  <div className="rounded-xl bg-white/90 backdrop-blur px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-[#1e1839]">
                      <Trophy className="w-4 h-4 text-[#1e1839]" />
                      <span className="font-medium">1-op-1 Focus</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section - White background */}
      <section className="py-12 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 lg:mb-16">
            <Badge className="bg-[#1e1839]/10 text-[#1e1839] border-[#1e1839]/20 mb-4 lg:mb-6 inline-flex">
              <Target className="w-4 h-4 mr-2" />
              Voordelen
            </Badge>
            <h2 className="text-2xl lg:text-5xl font-bold text-[#1e1839] mb-3 lg:mb-6">
              Waarom Personal Training bij Evotion?
            </h2>
            <p className="text-sm lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
              Ontdek wat ons onderscheidt en waarom onze cliënten consistent resultaten behalen.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-8">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="border border-gray-200 hover:border-[#bad4e1] hover:shadow-lg transition-all duration-300 bg-white"
              >
                <CardContent className="p-4 lg:p-8 text-center space-y-2 lg:space-y-4">
                  <div className="w-10 h-10 lg:w-16 lg:h-16 bg-[#1e1839] rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto">
                    <benefit.icon className="w-5 h-5 lg:w-8 lg:h-8 text-[#bad4e1]" />
                  </div>
                  <h3 className="text-sm lg:text-xl font-bold text-[#1e1839]">{benefit.title}</h3>
                  <p className="text-xs lg:text-base text-gray-600 leading-relaxed hidden sm:block">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works - Light gray background */}
      <section className="py-12 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 lg:mb-16">
            <Badge className="bg-[#1e1839]/10 text-[#1e1839] border-[#1e1839]/20 mb-4 lg:mb-6 inline-flex">
              <TrendingUp className="w-4 h-4 mr-2" />
              Hoe Werkt Het
            </Badge>
            <h2 className="text-2xl lg:text-5xl font-bold text-[#1e1839] mb-3 lg:mb-6">Jouw Traject in 4 Stappen</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-8">
            {[
              {
                step: "01",
                title: "Intake",
                description: "Gratis kennismakingsgesprek om je doelen en situatie te bespreken.",
              },
              {
                step: "02",
                title: "Plan op Maat",
                description: "Persoonlijk trainings- en voedingsplan afgestemd op jouw doelen.",
              },
              {
                step: "03",
                title: "Training",
                description: "1-op-1 sessies met je personal trainer voor optimale resultaten.",
              },
              {
                step: "04",
                title: "Resultaat",
                description: "Regelmatige metingen en aanpassingen voor blijvend succes.",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="relative text-center border border-gray-200 hover:border-[#bad4e1] transition-colors bg-white"
              >
                <CardContent className="p-4 lg:p-6 space-y-2 lg:space-y-4">
                  <div className="w-10 h-10 lg:w-16 lg:h-16 bg-[#1e1839] rounded-full flex items-center justify-center mx-auto">
                    <span className="text-sm lg:text-xl font-bold text-white">{item.step}</span>
                  </div>
                  <h3 className="text-sm lg:text-xl font-bold text-[#1e1839]">{item.title}</h3>
                  <p className="text-xs lg:text-base text-gray-600 leading-relaxed hidden sm:block">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section - White background */}
      <section className="py-12 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 lg:mb-16">
            <Badge className="bg-[#1e1839]/10 text-[#1e1839] border-[#1e1839]/20 mb-4 lg:mb-6 inline-flex">
              <Dumbbell className="w-4 h-4 mr-2" />
              Pakketten
            </Badge>
            <h2 className="text-2xl lg:text-5xl font-bold text-[#1e1839] mb-3 lg:mb-6">Kies Jouw Pakket</h2>
            <p className="text-sm lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
              Flexibele opties voor elk niveau en elke doelstelling. Neem contact op voor meer informatie.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-4 lg:gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <div key={index} className="relative">
                <Card
                  className={`relative border transition-all duration-300 hover:shadow-xl bg-white ${
                    pkg.popular ? "border-[#bad4e1] shadow-lg lg:scale-[1.02]" : "border-gray-200 hover:-translate-y-1"
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-[#1e1839] text-white px-3 lg:px-4 py-1.5 lg:py-2 shadow-md text-xs lg:text-sm">
                        <Star className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                        MEEST POPULAIR
                      </Badge>
                    </div>
                  )}

                  <CardContent className="p-6 lg:p-8 space-y-5 lg:space-y-6">
                    <div className="text-center space-y-4">
                      <h3 className="text-xl lg:text-2xl font-bold text-[#1e1839]">{pkg.title}</h3>
                      <div className="space-y-1">
                        <div className="text-2xl lg:text-3xl font-bold text-[#1e1839]">Op Aanvraag</div>
                        <div className="text-sm lg:text-base text-gray-600">{pkg.sessions}</div>
                      </div>
                    </div>

                    <div className="space-y-2.5 lg:space-y-3">
                      {pkg.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 lg:gap-3">
                          <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm lg:text-base text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      className={`w-full py-2.5 lg:py-3 text-base lg:text-lg font-semibold ${
                        pkg.popular
                          ? "bg-[#1e1839] hover:bg-[#1e1839]/90 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-[#1e1839]"
                      }`}
                      asChild
                    >
                      <a
                        href={`https://wa.me/31064365571?text=${encodeURIComponent(pkg.whatsappMessage)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                        Vraag Informatie
                        <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 ml-2" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              Niet zeker welk pakket het beste bij je past? We helpen je graag bij het maken van de juiste keuze.
            </p>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-[#1e1839] text-[#1e1839] hover:bg-[#1e1839]/10 bg-transparent"
              asChild
            >
              <a
                href="https://wa.me/31064365571?text=Hoi!%20Ik%20wil%20graag%20advies%20over%20welk%20Personal%20Training%20pakket%20het%20beste%20bij%20mij%20past."
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Vraag Advies via WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section - #1e1839 background */}
      <section className="py-12 lg:py-24 bg-[#1e1839] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl lg:text-5xl font-bold mb-3 lg:mb-6">Klaar om te Beginnen?</h2>
          <p className="text-sm lg:text-xl text-white/80 max-w-2xl mx-auto mb-6 lg:mb-8 px-2">
            Neem vandaag nog contact op voor een vrijblijvend kennismakingsgesprek en ontdek wat personal training voor
            jou kan betekenen.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center px-4">
            <Button
              size="lg"
              className="bg-[#bad4e1] text-[#1e1839] hover:bg-[#bad4e1]/90 px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-semibold"
              asChild
            >
              <a
                href="https://wa.me/31064365571?text=Hoi!%20Ik%20wil%20graag%20starten%20met%20Personal%20Training."
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                Start via WhatsApp
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/30 text-white hover:bg-white/10 bg-transparent"
              asChild
            >
              <a href="tel:0064365571">
                <Phone className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                Bel 06 43 65 571
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section - Gray background */}
      

      <Footer />
    </div>
  )
}
