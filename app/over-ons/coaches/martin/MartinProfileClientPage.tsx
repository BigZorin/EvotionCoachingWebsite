"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Clock,
  GraduationCap,
  Heart,
  Quote,
  MessageCircle,
  CheckCircle,
  Award,
  Target,
  Users,
  TrendingUp,
  MessageSquare,
} from "lucide-react"

export default function MartinProfileClientPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const certifications = [
    {
      title: "Personal Trainer Cursus",
      institution: "Menno Henselmanns",
      year: "2024",
      skills: [
        "Wetenschappelijk onderbouwde trainings- en voedingsprincipes",
        "Persoonlijke trainingsprogramma's ontwerpen voor kracht, spieropbouw en vetverlies",
        "Inzicht in evidence-based voeding en supplementatie",
        "Coachingstrategieën voor het begeleiden van cliënten",
        "Analyse van klantendata voor maatwerkprogramma's",
        "Gedragsverandering en motivatie toepassen om klantresultaten te verbeteren",
      ],
    },
    {
      title: "Nutrition and Program Design for Trainability",
      institution: "N1 Education",
      year: "2024",
      skills: [
        "Inzicht in individuele respons op trainingsstimuli en programma-aanpassing",
        "Gepersonaliseerde voeding- en trainingsplannen ontwerpen op basis van biofeedback",
        "Voeding (macronutriënten) aanpassen voor vetverlies of spieropbouw en periodiseren",
        "Volume, intensiteit, en frequentie optimaliseren op basis van aanpassing en herstel",
        "Hormonen begrijpen en voeding/training afstemmen voor metabole ondersteuning",
        "Progressie faseren op basis van feedback en aanpassingsvermogen van cliënten",
      ],
    },
    {
      title: "Practical Nutrition Level 1 & 2",
      institution: "Frank den Blanken",
      year: "2024",
      skills: [
        "Basisprincipes van voeding: koolhydraten, eiwitten, vetten",
        "Energiebehoeften en calorieberekening",
        "Geavanceerde macro- en micronutriënten",
        "Dieetmanipulatie zoals carb cycling en periodisering",
        "Supplementen voor sportprestaties",
        "Voeding rond training en herstel",
      ],
    },
    {
      title: "Personal Trainer Academie",
      institution: "Frank den Blanken",
      year: "2024",
      skills: [
        "Gedetailleerde kennis van lichaam, spieren, gewrichten en hun samenwerking",
        "Begrijpen van biomechanica voor juiste trainingsvormen",
        "Basis- en geavanceerde trainingsprincipes: overload, specificiteit, periodisering, herstel",
        "Maatwerkprogramma's maken voor beginners, gevorderden, en specifieke doelen",
        "Basisprincipes van voeding en toepassing bij trainingsdoelen",
        "Voedingsstrategieën voor optimale resultaten met cliënten",
      ],
    },
    {
      title: "Level 1",
      institution: "J3University",
      year: "2024",
      skills: [
        "Anatomie en biomechanica",
        "Voeding en macronutriënten",
        "Trainingsprogrammering",
        "Correcte techniek en uitvoering van oefeningen",
        "Voedingsstrategieën voor spieropbouw en vetverlies",
      ],
    },
    {
      title: "Biomechanics and Execution Course",
      institution: "N1 Education",
      year: "2024",
      skills: [
        "Inzicht in biomechanica en hoe het lichaam beweegt tijdens oefeningen",
        "Correcte uitvoering van oefeningen om prestaties te verbeteren en blessures te voorkomen",
        "Aanpassen van oefeningen op basis van individuele anatomie en doelen",
        "Optimaliseren van spieractivatie door juiste techniek",
        "Analyse van bewegingspatronen voor efficiënte krachttraining",
        "Toepassing van biomechanische principes voor betere resultaten",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="pt-20 pb-3 px-4 md:pt-3">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/over-ons/coaches"
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-[#1e1839] hover:bg-gray-100 transition-all duration-300 group text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Terug naar Coaches
          </Link>
        </div>
      </section>

      

      <section className="pb-12 md:pb-16 px-4 bg-gradient-to-br from-[#1e1839] via-[#2a1f4d] to-[#1e1839] relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10 py-12 md:py-16">
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                  <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-xs md:text-sm">
                    25+ Jaar Ervaring
                  </Badge>
                  <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-xs md:text-sm">
                    Ondernemer & Vader
                  </Badge>
                  <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-xs md:text-sm">
                    N1 Certified
                  </Badge>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
                  Martin Langenberg
                </h1>
                <p className="text-lg md:text-xl text-white/90 mb-8 md:mb-10 leading-relaxed">
                  Personal trainer en coach die drukke professionals helpt om fit en gezond te blijven — met een aanpak
                  die écht past bij jouw leven.
                </p>

                <div className="space-y-3 md:space-y-4 mb-8 md:mb-10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-base md:text-lg text-white/90">25+ jaar ervaring in krachttraining</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-base md:text-lg text-white/90">Gecertificeerd via N1 Education</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-base md:text-lg text-white/90">
                      Specialist voor drukke ouders en ondernemers
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <Link
                    href="https://wa.me/31610935077?text=Hoi%20Martin%2C%20ik%20ben%20klaar%20om%20te%20starten%20met%20begeleiding!%20Ik%20kom%20via%20jouw%20coaching%20pagina."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="lg"
                      className="bg-white text-[#1e1839] hover:bg-white/90 w-full sm:w-auto font-semibold px-8"
                    >
                      <MessageSquare className="w-5 h-5 mr-2" />
                      WhatsApp Martin
                    </Button>
                  </Link>
                  <Link href="https://calendly.com/evotion/evotion-coaching" target="_blank" rel="noopener noreferrer">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-white/30 text-white hover:bg-white/10 w-full sm:w-auto backdrop-blur-sm px-8 bg-transparent"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Gratis Gesprek
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative order-1 lg:order-2">
                <div className="relative w-full h-[350px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl ev-gradient-border bg-white/10 backdrop-blur border-transparent">
                  <Image
                    src="/images/martin-foto.avif"
                    alt="Martin Langenberg - Personal Trainer met 25+ jaar ervaring"
                    fill
                    className="object-cover object-[center_20%]"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="bg-[#1e1839]/10 text-[#1e1839] border-[#1e1839]/20 mb-4">
              <Users className="w-4 h-4 mr-2" />
              Over Martin
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e1839] mb-6">Waarom Martin?</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="ev-gradient-border bg-white/80 backdrop-blur border-transparent rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 group">
              <div className="w-16 h-16 bg-gradient-to-br from-[#1e1839] to-[#2a1f4d] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#1e1839] mb-4">Ervaring die Telt</h3>
              <p className="text-gray-700 leading-loose">
                Met 25+ jaar ervaring in krachttraining weet Martin precies wat werkt. Als ondernemer en vader van drie
                begrijpt hij de uitdagingen van een druk leven en hoe je toch fit kunt blijven.
              </p>
            </div>

            <div className="ev-gradient-border bg-white/80 backdrop-blur border-transparent rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 group">
              <div className="w-16 h-16 bg-gradient-to-br from-[#1e1839] to-[#2a1f4d] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#1e1839] mb-4">Wetenschappelijk Onderbouwd</h3>
              <p className="text-gray-700 leading-loose">
                Gecertificeerd via N1 Education, de gouden standaard in evidence-based training. Martin combineert
                jarenlange praktijkervaring met de nieuwste wetenschappelijke inzichten.
              </p>
            </div>
          </div>

          {/* Enhanced quote card */}
          <div className="bg-gradient-to-br from-[#1e1839] via-[#2a1f4d] to-[#1e1839] rounded-2xl p-10 md:p-14 shadow-2xl border border-white/10">
            <Quote className="w-12 h-12 text-white/40 mx-auto mb-6" />
            <blockquote className="text-xl md:text-2xl italic mb-6 leading-relaxed text-center text-white font-medium">
              "Ik train je voor het leven, niet alleen voor de gym. Echte transformatie gebeurt wanneer gezonde
              gewoontes zo natuurlijk worden als ademhalen."
            </blockquote>
            <cite className="text-white/90 font-semibold text-center block not-italic">— Martin Langenberg</cite>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-[#1e1839]/5 via-white to-[#1e1839]/5 relative overflow-hidden">
        {/* Subtle pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #1e1839 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="bg-[#1e1839]/10 text-[#1e1839] border-[#1e1839]/20 mb-4">
              <GraduationCap className="w-4 h-4 mr-2" />
              Certificeringen & Opleiding
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e1839] mb-6">Expertise & Kennis</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Martin blijft zichzelf continu ontwikkelen met de beste opleidingen in de industrie, zodat jij profiteert
              van de nieuwste inzichten.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="ev-gradient-border bg-white/90 backdrop-blur border-transparent rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#1e1839] to-[#2a1f4d] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-[#1e1839] mb-2 leading-tight">{cert.title}</h3>
                <p className="text-sm text-gray-600 mb-6 font-medium">{cert.institution}</p>

                <div className="space-y-3">
                  {cert.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-[#1e1839] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 leading-relaxed">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="bg-[#1e1839]/10 text-[#1e1839] border-[#1e1839]/20 mb-4">
              <TrendingUp className="w-4 h-4 mr-2" />
              Werkwijze
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e1839] mb-6">Martin's Aanpak</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Een bewezen methode die flexibel is, wetenschappelijk onderbouwd, en afgestemd op jouw unieke situatie.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                number: "1",
                title: "Maatwerk",
                description:
                  "Geen standaard programma's, maar oplossingen die passen bij jouw leven, doelen en beschikbare tijd.",
                icon: Target,
              },
              {
                number: "2",
                title: "Flexibiliteit",
                description:
                  "Aanpasbaar aan jouw drukte en omstandigheden, zodat je altijd kunt blijven volhouden op de lange termijn.",
                icon: TrendingUp,
              },
              {
                number: "3",
                title: "Educatie",
                description:
                  "Je leert waarom je doet wat je doet, zodat je uiteindelijk zelfstandig verder kunt en onafhankelijk wordt.",
                icon: GraduationCap,
              },
            ].map((step, index) => (
              <div
                key={index}
                className="ev-gradient-border bg-white/80 backdrop-blur border-transparent rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 group text-center"
              >
                {/* Enhanced number badge */}
                <div className="w-16 h-16 bg-gradient-to-br from-[#1e1839] to-[#2a1f4d] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-white font-bold text-2xl">{step.number}</span>
                </div>
                <div className="mb-4">
                  <step.icon className="w-8 h-8 text-[#1e1839] mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-[#1e1839] mb-4">{step.title}</h3>
                <p className="text-gray-700 leading-loose">{step.description}</p>
              </div>
            ))}
          </div>

          {/* Enhanced expectations card */}
          <div className="ev-gradient-border bg-gradient-to-br from-white to-[#1e1839]/5 backdrop-blur border-transparent rounded-2xl p-10 md:p-14 shadow-xl">
            <h3 className="text-2xl md:text-3xl font-bold text-[#1e1839] mb-8 text-center">Wat je kunt verwachten</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Persoonlijk trainingsplan dat past bij jouw schema en doelen",
                "Voedingsadvies zonder extreme diëten of onrealistische restricties",
                "Regelmatige check-ins en bijsturing op basis van jouw voortgang",
                "Kennis en tools om zelfstandig verder te gaan na de coaching",
                "Toegang tot de Evotion app voor tracking en communicatie",
                "Ondersteuning bij het doorbreken van limiterende overtuigingen",
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  {/* Enhanced checkmark */}
                  <div className="w-6 h-6 bg-gradient-to-br from-[#1e1839] to-[#2a1f4d] rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-[#1e1839] via-[#2a1f4d] to-[#1e1839] relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-10 md:p-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6">Klaar om te Beginnen?</h2>
            <p className="text-lg md:text-xl text-white/90 mb-8 md:mb-10 leading-relaxed max-w-2xl mx-auto">
              Ontdek hoe Martin's persoonlijke aanpak jou kan helpen om duurzame resultaten te boeken, zelfs met een
              druk schema. Plan een gratis kennismakingsgesprek in.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://wa.me/31610935077?text=Hoi%20Martin%2C%20ik%20ben%20klaar%20om%20te%20starten%20met%20begeleiding!%20Ik%20kom%20via%20jouw%20coaching%20pagina."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-white text-[#1e1839] hover:bg-white/90 font-semibold px-10 py-6 text-lg w-full sm:w-auto"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  WhatsApp Martin
                </Button>
              </Link>
              <Link href="https://calendly.com/evotion/evotion-coaching" target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-6 text-lg backdrop-blur-sm w-full sm:w-auto bg-transparent"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Gratis Kennismakingsgesprek
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
