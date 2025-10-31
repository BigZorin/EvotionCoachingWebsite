"use client"

import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Heart, Target, ArrowRight, Globe, Users } from "lucide-react"
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

      {/* Hero Section - Clean & Minimal */}
      <section className="bg-gray-50 py-20 md:py-28">
        <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
          <div
            ref={heroAnimation.ref}
            className={`text-center animate-on-scroll ${heroAnimation.isVisible ? "animate-visible" : ""}`}
          >
            <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
              Onze Filosofie
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">Visie & Missie</h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              De kern van ons bestaan geworteld in liefde, vertrouwen en universele waarheid
            </p>
          </div>
        </div>
      </section>

      {/* Quote Section - Simplified */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 lg:px-6 max-w-4xl text-center">
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">
            "It is time to bring your evolution in motion"
          </blockquote>
          <div className="w-24 h-1 bg-white/30 mx-auto"></div>
        </div>
      </section>

      {/* Vision Section - Clean Layout */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
          <div
            ref={visionAnimation.ref}
            className={`animate-on-scroll ${visionAnimation.isVisible ? "animate-visible" : ""}`}
          >
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-12">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                <Target className="w-8 h-8 text-gray-700" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Onze Visie</h2>
                <p className="text-lg text-gray-600">Een verlengstuk van universele waarheid</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="prose prose-lg md:prose-xl max-w-none">
              <div className="bg-white border border-gray-200 rounded-xl p-8 md:p-12 mb-8">
                <p className="text-gray-700 leading-relaxed mb-6">
                  Bij Evotion is de kern van ons bestaan geworteld in de waarden van liefde en vertrouwen. Wij zien
                  onszelf niet als de vormers van realiteit, maar als een verlengstuk, een kanaal van de universele
                  waarheid die al bestaat binnen en buiten onszelf. Ons doel is om bewustwording te creëren voor die
                  waarheid – een waarheid die de diepere structuren van het leven onthult en ons helpt te zien wat
                  daadwerkelijk is, in plaats van wat we zouden willen dat het is.
                </p>

                <p className="text-gray-700 leading-relaxed mb-6">
                  Evotion staat hiermee in dienst van het leven zelf, als een uitdrukking van de wegen van het
                  universum. Deze wegen vormen geen abstract ideaal, maar een leidraad voor mensen die vanuit
                  zelfinzicht en verantwoordelijkheid willen leven. We geloven dat echte verandering pas mogelijk wordt
                  wanneer men ten volle beseft welke verantwoordelijkheid men draagt voor het eigen leven, en deze
                  verantwoordelijkheid omarmt.
                </p>
              </div>

              {/* Key Points Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <Globe className="w-8 h-8 text-gray-700 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Universele Verbondenheid</h3>
                  <p className="text-gray-600">
                    Evotion erkent dat we allen verbonden zijn met de universele krachten die ons overstijgen en dat
                    onze rol slechts een klein, maar belangrijk, onderdeel is van het grotere geheel.
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <Users className="w-8 h-8 text-gray-700 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Bewuste Keuzevrijheid</h3>
                  <p className="text-gray-600">
                    Wij geloven dat elk individu de kracht heeft om invloed uit te oefenen binnen de kaders van
                    verantwoordelijkheid over lichaam, geest en keuzes.
                  </p>
                </div>
              </div>

              {/* Bottom Content */}
              <div className="bg-gray-50 rounded-xl p-8 md:p-12">
                <p className="text-gray-700 leading-relaxed mb-6">
                  Onze visie gaat voorbij het individu en strekt zich uit naar de waarheid zoals die bestaat in elke
                  hoek van het universum. Wat wij bieden, is een vertakking van dat allesomvattende proces van leven en
                  groei, en door Evotion kiezen we ervoor om ons aan die waarheid over te geven.
                </p>

                <p className="text-gray-700 leading-relaxed mb-6">
                  Evotion biedt begeleiding die voortvloeit uit universele principes. Deze visie is eerlijk, open en
                  transparant – we streven ernaar dat iedereen die ons pad volgt, doordrongen raakt van deze waarden en
                  hun kracht begrijpt.
                </p>

                <p className="text-gray-700 leading-relaxed">
                  Evotion is daarmee geen eindpunt, maar een reis die in elke stap afstemming zoekt met de werkelijkheid
                  zoals die is – een werkelijkheid die zowel wij als onze klanten leren omarmen en waarin we steeds
                  dieper tot rust en vervulling komen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section - Clean Layout */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
          <div
            ref={missionAnimation.ref}
            className={`animate-on-scroll ${missionAnimation.isVisible ? "animate-visible" : ""}`}
          >
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-12">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center border border-gray-200">
                <Heart className="w-8 h-8 text-gray-700" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Onze Missie</h2>
                <p className="text-lg text-gray-600">Praktische uitwerking van onze kernwaarden</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="prose prose-lg md:prose-xl max-w-none">
              <div className="bg-white rounded-xl p-8 md:p-12 mb-8 border border-gray-200">
                <p className="text-gray-700 leading-relaxed mb-6">
                  Bij Evotion komt onze visie tot leven in onze missie: een gedreven inzet om mensen te begeleiden in
                  hun proces van bewustwording en persoonlijke groei. De missie van Evotion is een praktische uitwerking
                  van de kernwaarden die ons richting geven, waarbij we de universele wetten als leidraad nemen.
                </p>

                <p className="text-gray-700 leading-relaxed mb-6">
                  In dit proces helpen we mensen niet alleen om zichzelf te versterken, maar ook om hun leven te leiden
                  vanuit een diepe, bewuste verbinding met zichzelf en de wereld om hen heen.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 md:p-12 mb-8 border border-gray-200">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Ware Transformatie</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  In de missie van Evotion gaan we verder dan alleen het creëren van fysieke en mentale groei – we
                  werken vanuit de overtuiging dat ware transformatie ontstaat wanneer mensen hun intenties en acties
                  afstemmen op universele principes.
                </p>

                <p className="text-gray-700 leading-relaxed mb-6">
                  Door onze coaching en begeleiding te bouwen op deze fundamentele wetten, bieden we klanten de tools en
                  ondersteuning die hen helpen om een leven te leiden dat in lijn is met hun hoogste potentieel.
                </p>

                <p className="text-gray-700 leading-relaxed">
                  Elk aspect van onze missie is een stap in de richting van een leven waarin klanten niet alleen bewuste
                  keuzes maken, maar ook vanuit een stevige basis verantwoordelijkheid nemen voor hun groei en welzijn.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 md:p-12 border border-gray-200">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Een Uitnodiging tot Groei</h3>
                <p className="text-gray-700 leading-relaxed">
                  Laten we beginnen met de praktische toepassing van deze wetten binnen onze coachingtrajecten en
                  diensten. Evotion nodigt iedereen uit om deze reis van groei en transformatie aan te gaan – een reis
                  waarin elke actie, elke intentie en elk doel een afspiegeling is van een dieper verlangen om in
                  harmonie te leven met de waarheid van wie we zijn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Simplified */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 lg:px-6 max-w-4xl text-center">
          <div
            ref={ctaAnimation.ref}
            className={`bg-gray-900 rounded-2xl p-8 md:p-12 text-white animate-on-scroll ${ctaAnimation.isVisible ? "animate-visible" : ""}`}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-6">Klaar om jouw evolutie in beweging te brengen?</h3>
            <p className="text-xl mb-8 text-gray-300">
              Ontdek hoe onze coaching jou kan helpen om in harmonie te leven met je hoogste potentieel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-4" asChild>
                <Link href="/#contact">
                  Start Jouw Reis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                className="bg-transparent text-white border-2 border-gray-600 hover:bg-gray-800 hover:border-gray-500 font-semibold px-8 py-4"
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
