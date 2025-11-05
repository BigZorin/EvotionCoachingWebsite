"use client"

import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Heart, Target, ArrowRight, Globe, Users, Sparkles } from "lucide-react"
import Link from "next/link"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function VisieEnMissieClientPage() {
  // Simple scroll animations only
  const heroAnimation = useScrollAnimation({ threshold: 0.2 })
  const visionAnimation = useScrollAnimation({ threshold: 0.1 })
  const missionAnimation = useScrollAnimation({ threshold: 0.1 })
  const ctaAnimation = useScrollAnimation({ threshold: 0.2 })

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - Enhanced with better typography and gradient background */}
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(30,24,57,0.03),transparent_50%)]"></div>
        <div className="container mx-auto px-4 lg:px-6 max-w-5xl relative">
          <div
            ref={heroAnimation.ref}
            className={`text-center animate-on-scroll ${heroAnimation.isVisible ? "animate-visible" : ""}`}
          >
            <div className="inline-flex items-center gap-2 bg-[#1e1839]/5 text-[#1e1839] px-5 py-2.5 rounded-full text-sm font-semibold mb-8 border border-[#1e1839]/10">
              <Sparkles className="w-4 h-4" />
              Onze Filosofie
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Visie & Missie
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              De kern van ons bestaan geworteld in liefde, vertrouwen en universele waarheid
            </p>
          </div>
        </div>
      </section>

      {/* Quote Section - More elegant with better styling */}
      <section className="py-20 bg-[#1e1839] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_70%)]"></div>
        <div className="container mx-auto px-4 lg:px-6 max-w-4xl text-center relative">
          <blockquote className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
            "It is time to bring your evolution in motion"
          </blockquote>
          <div className="w-32 h-1 bg-white/20 mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Vision Section - Modernized with shadow-based cards and brand colors */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-white via-gray-50/30 to-white relative">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(30,24,57,0.6) 1px, transparent 0), radial-gradient(circle at 3px 3px, rgba(186,212,225,0.6) 1px, transparent 0)",
            backgroundSize: "28px 28px, 28px 28px",
          }}
        />
        <div className="container mx-auto px-4 lg:px-6 max-w-5xl relative z-10">
          <div
            ref={visionAnimation.ref}
            className={`animate-on-scroll ${visionAnimation.isVisible ? "animate-visible" : ""}`}
          >
            {/* Section Header */}
            <div className="flex items-center gap-5 mb-16">
              <div className="w-20 h-20 bg-gradient-to-br from-[#1e1839] to-[#1e1839] rounded-2xl flex items-center justify-center shadow-xl">
                <Target className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Onze Visie</h2>
                <p className="text-xl text-gray-600">Een verlengstuk van universele waarheid</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
              <div className="ev-gradient-border bg-white/80 backdrop-blur border-transparent rounded-2xl p-10 md:p-14 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                <p className="text-lg text-gray-700 leading-loose mb-8">
                  Bij Evotion draait alles om het doorbreken van limiterende overtuigingen die je tegenhouden. Veel
                  mensen leven met onbewuste gedachtepatronen en geloven die hun potentieel beperken. Wij helpen je deze
                  mentale barrières te herkennen en te weerleggen, zodat je kunt zien wat werkelijk mogelijk is in
                  plaats van wat je altijd hebt gedacht dat mogelijk was.
                </p>

                <p className="text-lg text-gray-700 leading-loose">
                  Evotion staat voor bewuste groei door zelfinzicht en verantwoordelijkheid. We geloven dat echte
                  verandering pas mogelijk wordt wanneer je ten volle beseft welke overtuigingen je vasthouden en welke
                  verantwoordelijkheid je draagt voor je eigen leven. Door deze limiterende gedachten uit te dagen,
                  creëer je ruimte voor nieuwe mogelijkheden en echte transformatie.
                </p>
              </div>

              {/* Key Points Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="group ev-gradient-border bg-white/80 backdrop-blur border-transparent rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#1e1839] to-[#1e1839] rounded-xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <Globe className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#1e1839] transition-colors duration-300">
                    Gedeelde Menselijkheid
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Bij Evotion erkennen we dat we allemaal mens zijn met dezelfde fundamentele behoeften, uitdagingen
                    en mogelijkheden. We staan niet boven of buiten anderen, maar zijn onderdeel van een gemeenschap
                    waarin iedereen zijn eigen rol speelt.
                  </p>
                </div>

                <div className="group ev-gradient-border bg-white/80 backdrop-blur border-transparent rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#1e1839] to-[#1e1839] rounded-xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#1e1839] transition-colors duration-300">
                    Bewuste Keuzevrijheid
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Wij geloven dat elk individu de kracht heeft om invloed uit te oefenen binnen de kaders van
                    verantwoordelijkheid over lichaam, geest en keuzes. Door bewust te worden van je eigen rol en
                    mogelijkheden, kun je actief richting geven aan je leven en groei.
                  </p>
                </div>
              </div>

              {/* Bottom Content */}
              <div className="ev-gradient-border bg-white/80 backdrop-blur border-transparent rounded-2xl p-10 md:p-14 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                <p className="text-lg text-gray-700 leading-loose mb-8">
                  Onze visie gaat verder dan alleen individuele doelen. We kijken naar de bredere context van je leven
                  en hoe verschillende aspecten met elkaar samenhangen. Wat wij bieden is begeleiding die rekening houdt
                  met het grotere plaatje van wie je bent en waar je naartoe wilt.
                </p>

                <p className="text-lg text-gray-700 leading-loose mb-8">
                  Evotion biedt coaching die gebaseerd is op bewezen principes en praktische ervaring. Deze aanpak is
                  eerlijk, open en transparant. We streven ernaar dat iedereen die met ons werkt, deze waarden begrijpt
                  en de kracht ervan in hun eigen leven ervaart.
                </p>

                <p className="text-lg text-gray-700 leading-loose">
                  Evotion is geen quick fix, maar een proces van duurzame groei. In elke stap werken we aan een
                  realistisch beeld van waar je staat en wat mogelijk is. Een aanpak die zowel wij als onze klanten
                  toepassen om stap voor stap meer rust, balans en vervulling te vinden.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section - Modernized with improved spacing and styling */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(30,24,57,0.6) 1px, transparent 0), radial-gradient(circle at 3px 3px, rgba(186,212,225,0.6) 1px, transparent 0)",
            backgroundSize: "28px 28px, 28px 28px",
          }}
        />
        <div className="container mx-auto px-4 lg:px-6 max-w-5xl relative z-10">
          <div
            ref={missionAnimation.ref}
            className={`animate-on-scroll ${missionAnimation.isVisible ? "animate-visible" : ""}`}
          >
            {/* Section Header */}
            <div className="flex items-center gap-5 mb-16">
              <div className="w-20 h-20 bg-gradient-to-br from-[#1e1839] to-[#1e1839] rounded-2xl flex items-center justify-center shadow-xl">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Onze Missie</h2>
                <p className="text-xl text-gray-600">Concrete doelen en praktische resultaten</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
              <div className="ev-gradient-border bg-white/80 backdrop-blur border-transparent rounded-2xl p-10 md:p-14 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                <p className="text-lg text-gray-700 leading-loose mb-8">
                  De missie van Evotion is helder: we begeleiden mensen naar meetbare resultaten op het gebied van
                  fysieke gezondheid, mentale veerkracht en persoonlijke groei. We werken met een gestructureerde aanpak
                  waarbij elke stap gericht is op concrete vooruitgang die je kunt zien, voelen en meten.
                </p>

                <p className="text-lg text-gray-700 leading-loose">
                  Ons proces is gebaseerd op bewezen methoden uit sportwetenschap, gedragspsychologie en coaching. We
                  combineren fysieke training met mentale begeleiding om duurzame verandering te realiseren die verder
                  gaat dan alleen het behalen van je doelen.
                </p>
              </div>

              <div className="ev-gradient-border bg-white/80 backdrop-blur border-transparent rounded-2xl p-10 md:p-14 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Onze Concrete Doelstellingen</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#1e1839] rounded-lg flex items-center justify-center text-white font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">Fysieke Transformatie</h4>
                      <p className="text-gray-700 leading-relaxed">
                        We helpen je om meetbare fysieke doelen te bereiken: vetverlies, spieropbouw, kracht en
                        uithoudingsvermogen. Met gepersonaliseerde trainingsschema's en voedingsplannen werk je naar
                        concrete resultaten binnen een realistische tijdslijn.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#1e1839] rounded-lg flex items-center justify-center text-white font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">Mentale Veerkracht</h4>
                      <p className="text-gray-700 leading-relaxed">
                        We trainen je om limiterende gedachten te herkennen en te doorbreken. Door praktische technieken
                        leer je omgaan met tegenslagen, stress te managen en een groeimindset te ontwikkelen die je
                        helpt bij elke uitdaging.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#1e1839] rounded-lg flex items-center justify-center text-white font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">Duurzame Gewoonten</h4>
                      <p className="text-gray-700 leading-relaxed">
                        We bouwen samen aan gewoonten die blijven. Geen crash diëten of extreme programma's, maar een
                        haalbare levensstijl die past bij jouw situatie en die je voor de lange termijn kunt volhouden.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#1e1839] rounded-lg flex items-center justify-center text-white font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">Zelfstandigheid</h4>
                      <p className="text-gray-700 leading-relaxed">
                        Ons einddoel is dat je zelfstandig verder kunt. We geven je de kennis, tools en vaardigheden om
                        na het traject zelf je gezondheid en groei te blijven managen zonder afhankelijk te zijn van
                        constante begeleiding.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#1e1839] to-[#2a1f4d] rounded-2xl p-10 md:p-14 shadow-2xl text-white hover:shadow-[0_25px_50px_-12px_rgba(30,24,57,0.5)] transition-all duration-500 transform hover:-translate-y-1">
                <h3 className="text-3xl font-bold mb-6">Ons Proces in de Praktijk</h3>
                <p className="text-lg leading-loose text-white/90 mb-6">
                  Elk traject begint met een grondige intake waarin we je huidige situatie, doelen en uitdagingen in
                  kaart brengen. Van daaruit stellen we een persoonlijk plan op met concrete mijlpalen en meetbare
                  voortgang.
                </p>
                <p className="text-lg leading-loose text-white/90">
                  Tijdens het traject combineren we fysieke training met mentale coaching, voedingsbegeleiding en
                  regelmatige evaluaties. We passen de aanpak aan waar nodig en vieren samen de successen. Het
                  resultaat: een sterkere, gezondere en zelfverzekerder versie van jezelf.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced with brand colors and better design */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-[#1e1839] via-[#2a1f4d] to-[#1e1839] relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="container mx-auto px-4 lg:px-6 max-w-5xl text-center relative z-10">
          <div
            ref={ctaAnimation.ref}
            className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-12 md:p-16 text-white shadow-2xl animate-on-scroll ${ctaAnimation.isVisible ? "animate-visible" : ""}`}
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              Klaar om jouw evolutie in beweging te brengen?
            </h3>
            <p className="text-xl mb-10 text-white/90 max-w-2xl mx-auto leading-relaxed">
              Ontdek hoe onze coaching jou kan helpen om in harmonie te leven met je hoogste potentieel.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Button
                size="lg"
                className="bg-white text-[#1e1839] hover:bg-gray-100 font-semibold px-10 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                asChild
              >
                <Link href="/#contact">
                  Start Jouw Reis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                className="bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 hover:border-white/50 font-semibold px-10 py-6 text-lg rounded-xl backdrop-blur-sm transition-all duration-300"
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
