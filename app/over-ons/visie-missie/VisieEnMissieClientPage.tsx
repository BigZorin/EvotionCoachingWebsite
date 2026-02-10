"use client"

import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Target, ArrowRight, Sparkles, Eye, Compass, Dumbbell, Brain, Moon, Clock, Shield, Utensils } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export function VisieEnMissieClientPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [activePillar, setActivePillar] = useState(0)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Auto-rotate pillars on mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePillar((prev) => (prev + 1) % 6)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const pillars = [
    {
      icon: Utensils,
      title: "Voeding",
      description: "Voeding draait bij Evotion om ondersteunen, niet om controleren. We leren je eten op een manier die je lichaam energie geeft, herstel bevordert en past in het echte leven.",
    },
    {
      icon: Dumbbell,
      title: "Training",
      description: "Training is bij ons een middel om je lichaam sterker en belastbaarder te maken. We trainen om beter te functioneren in het dagelijks leven. Het doel is progressie die blijft.",
    },
    {
      icon: Brain,
      title: "Mindset",
      description: "Duurzame verandering vraagt inzicht in je patronen en overtuigingen. We helpen je begrijpen waarom je keuzes maakt, zodat je bewuster en rustiger kunt handelen.",
    },
    {
      icon: Moon,
      title: "Herstel & Rust",
      description: "Zonder herstel geen vooruitgang. Slaap, ontspanning en rustmomenten zijn essentieel. Bij Evotion krijgt herstel net zoveel aandacht als inspanning.",
    },
    {
      icon: Clock,
      title: "Ritme & Structuur",
      description: "Consistentie ontstaat niet door motivatie, maar door structuur. We helpen je een dag en week in te richten die ondersteunt in plaats van tegenwerkt.",
    },
    {
      icon: Shield,
      title: "Verantwoordelijkheid",
      description: "Discipline betekent bij ons trouw blijven aan jezelf. We leren je verantwoordelijkheid nemen voor je keuzes, zodat jij de regie houdt op de lange termijn.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* HERO - Paars */}
      <section className="relative bg-[#1e1839] py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05),transparent_50%)]" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Badge className="bg-white/10 text-white border-white/20 mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Onze Filosofie
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight text-balance">
              Visie & Missie
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-8">
              Waar we voor staan en hoe we jou helpen je doelen te bereiken
            </p>

            <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-8 py-6 mt-4">
              <blockquote className="text-xl md:text-2xl lg:text-3xl font-bold text-white italic text-balance">
                {"\"It is time to bring your evolution in motion\""}
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* VISIE - Wit */}
      <section className="py-16 lg:py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10 lg:mb-14">
            <Badge className="bg-[#1e1839]/10 text-[#1e1839] border-[#1e1839]/20 mb-4">
              <Eye className="w-4 h-4 mr-2" />
              Waar We Voor Staan
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-[#1e1839] mb-4 text-balance">
              Onze Visie
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              Wij geloven dat echte verandering niet begint bij harder je best doen, maar bij begrijpen hoe je als mens en lichaam werkelijk werkt.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Te vaak draait gezondheid om snelle doelen, externe bevestiging en tijdelijke motivatie. Dat werkt even, maar houdt geen stand. Wij zien gezondheid als iets dat ontstaat wanneer denken, doen en leven met elkaar in balans komen.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Onze visie is dat mensen niet steeds opnieuw hoeven te veranderen wie ze zijn, maar mogen leren leven in lijn met zichzelf. Wanneer je stopt met vechten tegen je lichaam en begint te zorgen voor wat je is toevertrouwd, komt ontwikkeling vanzelf in beweging.
            </p>

            <div className="bg-[#1e1839] rounded-2xl p-6 lg:p-8 mt-8">
              <p className="text-white/90 text-lg leading-relaxed font-medium text-center">
                Dat is waar Evotion voor staat. Het moment waarop jouw <span className="text-white font-bold">evolution in motion</span> komt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MISSIE - Paars */}
      <section className="py-16 lg:py-28 bg-[#1e1839]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10 lg:mb-14">
            <Badge className="bg-white/10 text-white border-white/20 mb-4">
              <Target className="w-4 h-4 mr-2" />
              Wat We Doen
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4 text-balance">
              Onze Missie
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-lg text-white/90 leading-relaxed">
              Evotion helpt mensen om duurzame lichaamstransformatie te bereiken door niet alleen te focussen op training en voeding, maar ook op mindset, herstel en leefstijl.
            </p>
            <p className="text-lg text-white/90 leading-relaxed">
              Wij begeleiden mensen in het maken van keuzes die passen bij hun leven op de lange termijn. Geen snelle oplossingen of tijdelijke motivatie, maar begeleiding die leidt tot rust, consistentie en blijvende resultaten.
            </p>
            <p className="text-lg text-white/90 leading-relaxed">
              Onze missie is om mensen zelfstandiger te maken, niet afhankelijk. We willen dat je begrijpt waarom je doet wat je doet, zodat je ook zonder coaching verder kunt.
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 lg:p-8 mt-8">
              <p className="text-white text-lg leading-relaxed text-center">
                Gezondheid zien wij niet als iets dat je afdwingt, maar als iets dat ontstaat wanneer je leeft in lijn met hoe je lichaam en leven bedoeld zijn te functioneren.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PIJLERS - Wit */}
      <section className="py-16 lg:py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10 lg:mb-14">
            <Badge className="bg-[#1e1839]/10 text-[#1e1839] border-[#1e1839]/20 mb-4">
              <Compass className="w-4 h-4 mr-2" />
              Onze Pijlers
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-[#1e1839] mb-4 text-balance">
              Waar Onze Aanpak Op Rust
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Zes pijlers die samen een geheel vormen. Ze versterken elkaar in het dagelijks leven.
            </p>
          </div>

          {/* Mobile: Scrollable list */}
          <div className="lg:hidden space-y-4">
            {pillars.map((pillar, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-5 border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-[#1e1839] rounded-xl flex items-center justify-center flex-shrink-0">
                    <pillar.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1e1839] mb-1">{pillar.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{pillar.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: 3-koloms grid */}
          <div className="hidden lg:grid grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pillars.map((pillar, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-[#1e1839] rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <pillar.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#1e1839] mb-3">{pillar.title}</h3>
                <p className="text-gray-600 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAMENVATTING - Paars */}
      <section className="py-16 lg:py-28 bg-[#1e1839]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl lg:text-4xl font-bold text-white mb-8 text-balance">
              Kort Samengevat
            </h3>
            <p className="text-lg text-white/90 leading-relaxed">
              Evotion is er voor mensen die niet alleen willen veranderen, maar het ook willen volhouden. Door training, voeding en mindset te combineren in een samenhangend geheel helpen we je om je <span className="text-white font-bold">evolution in motion</span> te brengen op een manier die past bij wie je bent en hoe je leeft.
            </p>
          </div>
        </div>
      </section>

      {/* CTA - Wit */}
      <section className="py-16 lg:py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl lg:text-4xl font-bold text-[#1e1839] mb-6 text-balance">
              Klaar om jouw evolutie in beweging te brengen?
            </h3>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              Ontdek hoe onze coaching jou kan helpen om duurzaam resultaat te bereiken.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-[#1e1839] hover:bg-[#1e1839]/90 text-white font-semibold px-8 py-6 text-base rounded-xl"
                asChild
              >
                <Link href="/contact">
                  Start Jouw Reis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#1e1839]/20 text-[#1e1839] hover:bg-[#1e1839]/5 font-semibold px-8 py-6 text-base rounded-xl bg-transparent"
                asChild
              >
                <Link href="/over-ons/coaches">Ontmoet Onze Coaches</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
