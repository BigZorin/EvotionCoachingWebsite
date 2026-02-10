"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  Star,
  Users,
  Smartphone,
  Dumbbell,
  ArrowRight,
  MapPin,
  ChevronDown,
  Utensils,
  Brain,
  Moon,
  Clock,
  ShieldCheck,
  UserPlus,
  Wifi,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function EvotionBrandClientPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const stats = [
    { number: "5.0", label: "Google Score", icon: Star },
    { number: "100%", label: "Persoonlijk", icon: Users },
    { number: "3", label: "Coaching Opties", icon: Dumbbell },
    { number: "1", label: "Eigen App", icon: Smartphone },
  ]

  const pillars = [
    { title: "Voeding", desc: "Op maat gemaakte voedingsplannen", icon: Utensils },
    { title: "Training", desc: "Gepersonaliseerde trainingsschema's", icon: Dumbbell },
    { title: "Mindset", desc: "Mentale begeleiding en motivatie", icon: Brain },
    { title: "Herstel & Rust", desc: "Optimaal herstel voor groei", icon: Moon },
    { title: "Ritme & Structuur", desc: "Consistentie in je routine", icon: Clock },
    { title: "Verantwoordelijkheid", desc: "Accountability en support", icon: ShieldCheck },
  ]

  const services = [
    {
      title: "Personal Training",
      subtitle: "1-op-1 in Sneek",
      description: "Persoonlijke begeleiding in de gym met je eigen coach. Maximale aandacht, maximale resultaten.",
      features: ["Eigen Evotion trainer", "Voedings- en trainingsplan", "Evotion App toegang"],
      href: "/personal-training",
      icon: Dumbbell,
    },
    {
      title: "Duo Training",
      subtitle: "Samen trainen in Sneek",
      description: "Train samen met een partner onder begeleiding. Extra motivatie, gedeelde kosten.",
      features: ["Train met een partner", "App voor beiden", "Extra motivatie & support"],
      href: "/duo-training",
      icon: UserPlus,
    },
    {
      title: "Online Coaching",
      subtitle: "Door heel Nederland",
      description: "Flexibele coaching via de Evotion App. Persoonlijk programma, overal beschikbaar.",
      features: ["Evotion App premium", "Direct coach contact", "Wekelijkse check-ins"],
      href: "/online-coaching",
      icon: Wifi,
    },
  ]

  const coaches = [
    {
      name: "Martin Langenberg",
      role: "Head Coach & Online Coaching",
      description:
        "Specialist in online coaching en body transformations. Martin begeleidt je via de Evotion App met het modulaire programma naar duurzame resultaten.",
      image: "/images/martin-langenberg.png",
      href: "/over-ons/coaches/martin",
    },
    {
      name: "Zorin Wijnands",
      role: "Personal Training & Duo Training",
      description:
        "Expert in krachttraining en personal training. Zorin begeleidt je in de gym met 1-op-1 of duo sessies voor maximale resultaten.",
      image: "/images/zorin-foto.png",
      href: "/over-ons/coaches/zorin",
    },
  ]

  const faqs = [
    {
      question: "Wat is Evotion?",
      answer:
        "Evotion is een fitness en coaching brand uit Sneek, Friesland. De naam ontstond uit de combinatie van Evolution en Motion. Wij helpen mensen hun fitnessdoelen te bereiken door middel van persoonlijke coaching, een unieke app en een bewezen aanpak rondom 6 pijlers.",
    },
    {
      question: "Wat maakt Evotion uniek?",
      answer:
        "Evotion combineert persoonlijke coaching met een eigen app. We bieden directe toegang tot je coach, gepersonaliseerde trainingsschema's, voedingsbegeleiding en een exclusieve community. Onze aanpak rondom 6 pijlers zorgt voor duurzame resultaten.",
    },
    {
      question: "Waar is Evotion gevestigd?",
      answer:
        "Evotion biedt Personal Training en Duo Training in Sneek, Friesland. Daarnaast bieden we Online Coaching aan door heel Nederland via de Evotion App.",
    },
    {
      question: "Welke services biedt Evotion aan?",
      answer:
        "Evotion biedt drie hoofdservices: Personal Training met 1-op-1 begeleiding in Sneek, Duo Training om samen met een partner te trainen, en Online Coaching met trajecten van 6 of 12 maanden inclusief volledige app toegang.",
    },
    {
      question: "Hoe werkt de Evotion aanpak?",
      answer:
        "Onze aanpak is gebaseerd op 6 pijlers: Voeding, Training, Mindset, Herstel & Rust, Ritme & Structuur en Verantwoordelijkheid. Door al deze gebieden aan te pakken, bereiken we duurzame verandering in plaats van tijdelijke resultaten.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <article>
        {/* Hero - Paars */}
        <section className="relative pt-28 pb-20 px-6 bg-[#1e1839] overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-5xl mx-auto text-center">
            <div
              className={`transition-all duration-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <MapPin className="w-4 h-4 text-white/60" />
                <span className="text-white/60 text-sm tracking-wider uppercase">
                  Fitness & Coaching uit Sneek
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight">
                EVOTION
              </h1>

              <div className="text-lg md:text-xl text-white/70 mb-4">
                <span className="text-white font-medium">Evolution</span>
                {" + "}
                <span className="text-white font-medium">Motion</span>
                {" = "}
                <span className="text-[#bad4e1] font-semibold">Evotion</span>
              </div>

              <p className="text-white/50 italic text-base md:text-lg mb-10">
                It is time to bring your evolution in motion
              </p>

              <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
                Ontdek Evotion - de fitness en coaching brand uit Sneek.
                Van onze eigen Evotion App tot de bewezen aanpak rondom 6 pijlers -
                wij helpen jou je fitnessdoelen bereiken.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <button
                    type="button"
                    className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#1e1839] font-semibold rounded-xl hover:bg-[#bad4e1] transition-colors flex items-center justify-center gap-2"
                  >
                    Start je journey
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link href="/over-ons/coaches">
                  <button
                    type="button"
                    className="w-full sm:w-auto px-8 py-3.5 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-colors"
                  >
                    Ontmoet de coaches
                  </button>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div
              className={`grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 transition-all duration-700 delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                  <stat.icon className="w-5 h-5 text-[#bad4e1] mb-3 mx-auto" />
                  <div className="text-2xl md:text-3xl font-bold text-white">{stat.number}</div>
                  <div className="text-white/50 text-xs mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Wat is Evotion - Wit */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1e1839] mb-4">
                Wat is Evotion?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Meer dan een fitness brand - een filosofie voor duurzame transformatie.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6 mb-16">
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-[#1e1839]">Evotion</strong> ontstond uit de combinatie van twee krachtige concepten:
                <span className="font-semibold text-[#1e1839]"> Evolution</span> en
                <span className="font-semibold text-[#1e1839]"> Motion</span>.
                Wij geloven dat echte transformatie ontstaat wanneer je jezelf continu ontwikkelt en deze ontwikkeling in beweging brengt.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Vanuit Sneek, Friesland helpen we mensen hun doelen te bereiken met een bewezen aanpak rondom 6 pijlers. Van personal training tot online coaching - wij maken het verschil in jouw fitness journey.
              </p>
            </div>

            {/* 4 Values */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: "Evolution", desc: "Voortdurende groei en ontwikkeling" },
                { title: "Motion", desc: "Ontwikkeling in beweging brengen" },
                { title: "Innovatie", desc: "Methodes en technologie via de app" },
                { title: "Integriteit", desc: "Eerlijkheid in coaching relaties" },
              ].map((value) => (
                <div
                  key={value.title}
                  className="bg-gray-50 rounded-xl p-5 text-center border border-gray-100 hover:border-[#1e1839]/20 transition-colors"
                >
                  <h4 className="font-bold text-[#1e1839] mb-1.5 text-sm">{value.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6 Pijlers - Paurs */}
        <section className="py-20 px-6 bg-[#1e1839]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                De 6 Pijlers van Evotion
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto leading-relaxed">
                Onze aanpak gaat verder dan alleen training en voeding.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <pillar.icon className="w-4 h-4 text-[#bad4e1]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm mb-0.5">{pillar.title}</h3>
                      <p className="text-white/50 text-xs leading-relaxed">{pillar.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services - Wit */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1e1839] mb-4">
                Evotion Services
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Drie coaching opties voor elk doel en elke locatie.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {services.map((service) => (
                <Link key={service.title} href={service.href} className="group block">
                  <div className="h-full bg-gray-50 rounded-2xl p-6 border border-gray-100 group-hover:border-[#1e1839]/20 group-hover:shadow-lg transition-all">
                    <div className="w-11 h-11 bg-[#1e1839] rounded-xl flex items-center justify-center mb-4">
                      <service.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1e1839] mb-1">{service.title}</h3>
                    <p className="text-xs text-gray-400 mb-3">{service.subtitle}</p>
                    <p className="text-sm text-gray-600 leading-relaxed mb-5">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-gray-500">
                          <div className="w-1 h-1 bg-[#1e1839] rounded-full flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex items-center gap-1 text-[#1e1839] text-sm font-medium group-hover:gap-2 transition-all">
                      Meer info
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Evotion App - Paurs */}
        <section className="py-20 px-6 bg-[#1e1839]">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-[#bad4e1] text-sm font-medium tracking-wider uppercase mb-4 block">
                  Exclusief
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  De Evotion App
                </h2>
                <p className="text-white/70 leading-relaxed mb-8">
                  Onze eigen app combineert technologie met persoonlijke coaching.
                  Alles wat je nodig hebt voor je transformatie, altijd bij de hand.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Gepersonaliseerde trainingsschema's",
                    "Voedingsbegeleiding op maat",
                    "Direct contact met je coach",
                    "Voortgang bijhouden",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-white/80 text-sm">
                      <div className="w-1.5 h-1.5 bg-[#bad4e1] rounded-full flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/over-ons/evotion-app">
                  <button
                    type="button"
                    className="px-6 py-3 bg-white text-[#1e1839] font-semibold rounded-xl hover:bg-[#bad4e1] transition-colors flex items-center gap-2 text-sm"
                  >
                    Ontdek de app
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
              <div className="flex justify-center">
                <div className="relative w-56 md:w-64">
                  <Image
                    src="/images/evotion-app-mockup-angled.png"
                    alt="Evotion App mockup"
                    width={300}
                    height={600}
                    className="rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Coaches - Wit */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1e1839] mb-4">
                De Evotion Coaches
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Leer kennen wie jou gaat begeleiden.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {coaches.map((coach) => (
                <Link key={coach.name} href={coach.href} className="group block">
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 group-hover:border-[#1e1839]/20 group-hover:shadow-lg transition-all">
                    <div className="flex items-start gap-5">
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200">
                        <Image
                          src={coach.image || "/placeholder.svg"}
                          alt={coach.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#1e1839] mb-0.5">{coach.name}</h3>
                        <p className="text-xs text-gray-400 mb-3">{coach.role}</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{coach.description}</p>
                        <div className="mt-4 flex items-center gap-1 text-[#1e1839] text-sm font-medium group-hover:gap-2 transition-all">
                          Leer kennen
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ - Paurs */}
        <section className="py-20 px-6 bg-[#1e1839]">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Veelgestelde vragen
              </h2>
              <p className="text-white/60 leading-relaxed">
                Alles wat je wilt weten over Evotion.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={faq.question}
                  className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <h3 className="font-semibold text-white text-sm pr-4">{faq.question}</h3>
                    <ChevronDown
                      className={`w-4 h-4 text-white/50 flex-shrink-0 transition-transform duration-300 ${
                        openFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFaq === index ? "max-h-60 pb-5" : "max-h-0"
                    }`}
                  >
                    <p className="px-5 text-white/60 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA - Wit */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e1839] mb-4">
              Klaar voor jouw Evotion journey?
            </h2>
            <p className="text-gray-500 italic mb-3">It is time to bring your evolution in motion</p>
            <p className="text-gray-600 mb-10 leading-relaxed max-w-xl mx-auto">
              Van personal training in Sneek tot online coaching door heel Nederland.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <button
                  type="button"
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#1e1839] text-white font-semibold rounded-xl hover:bg-[#2a1f4d] transition-colors flex items-center justify-center gap-2"
                >
                  Start nu
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/gratis/caloriebehoefte">
                <button
                  type="button"
                  className="w-full sm:w-auto px-8 py-3.5 border border-[#1e1839]/20 text-[#1e1839] font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Gratis caloriecalculator
                </button>
              </Link>
            </div>
          </div>
        </section>
      </article>

      <Footer />
    </div>
  )
}
