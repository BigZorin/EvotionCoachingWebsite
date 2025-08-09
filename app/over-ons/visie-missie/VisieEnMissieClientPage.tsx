"use client"

import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Heart, Target, ArrowRight, Sparkles, Globe, Users } from "lucide-react"
import Link from "next/link"
import { useScrollAnimation, useStaggeredAnimation } from "@/hooks/use-scroll-animation"
import { useParallax, useAdvancedParallax } from "@/hooks/use-parallax"

export function VisieEnMissieClientPage() {
  // Scroll animations
  const heroAnimation = useScrollAnimation({ threshold: 0.2 })
  const quoteAnimation = useScrollAnimation({ threshold: 0.3 })
  const visionHeaderAnimation = useScrollAnimation({ threshold: 0.2 })
  const visionContentAnimation = useScrollAnimation({ threshold: 0.1 })
  const { containerRef: cardsContainerRef, visibleItems: visibleCards } = useStaggeredAnimation(2, 200)
  const visionBottomAnimation = useScrollAnimation({ threshold: 0.1 })
  const missionHeaderAnimation = useScrollAnimation({ threshold: 0.2 })
  const missionContentAnimation = useScrollAnimation({ threshold: 0.1 })
  const missionTransformAnimation = useScrollAnimation({ threshold: 0.1 })
  const missionInvitationAnimation = useScrollAnimation({ threshold: 0.1 })
  const ctaAnimation = useScrollAnimation({ threshold: 0.2 })

  // Parallax effects - subtle background movements
  const heroParallax = useParallax({ speed: 0.3, direction: "up" })
  const quoteParallax = useParallax({ speed: 0.4, direction: "down" })
  const visionParallax = useParallax({ speed: 0.2, direction: "up" })
  const missionParallax = useParallax({ speed: 0.35, direction: "down" })
  const ctaParallax = useParallax({ speed: 0.25, direction: "up" })

  // Advanced parallax for decorative elements
  const decorativeParallax1 = useAdvancedParallax({ speed: 0.6, direction: "up" })
  const decorativeParallax2 = useAdvancedParallax({ speed: 0.8, direction: "down" })
  const decorativeParallax3 = useAdvancedParallax({ speed: 0.4, direction: "up" })

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-white to-secondary/5 py-16 md:py-24 overflow-hidden">
        {/* Parallax Background Layer */}
        <div
          ref={heroParallax.ref}
          className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-secondary/8 will-change-transform"
          style={{
            transform: `translateY(${heroParallax.offset}px)`,
            backfaceVisibility: "hidden",
            perspective: "1000px",
          }}
        />

        {/* Floating Decorative Elements with Advanced Parallax */}
        <div
          ref={decorativeParallax1.ref}
          className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-sm will-change-transform"
          style={{
            transform: `translateY(${decorativeParallax1.offset}px) rotate(${decorativeParallax1.progress * 360}deg)`,
            opacity: 0.6,
          }}
        />
        <div
          ref={decorativeParallax2.ref}
          className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-br from-secondary/15 to-primary/15 rounded-full blur-sm will-change-transform"
          style={{
            transform: `translateY(${decorativeParallax2.offset}px) rotate(${-decorativeParallax2.progress * 180}deg)`,
            opacity: 0.4,
          }}
        />

        <div className="container mx-auto px-4 lg:px-6 max-w-4xl relative z-10">
          <div
            ref={heroAnimation.ref}
            className={`text-center mb-12 animate-on-scroll ${heroAnimation.isVisible ? "animate-visible" : ""}`}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Onze Filosofie
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">Visie & Missie</h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              De kern van ons bestaan geworteld in liefde, vertrouwen en universele waarheid
            </p>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary relative overflow-hidden">
        {/* Multi-layer Parallax Background */}
        <div
          ref={quoteParallax.ref}
          className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90 will-change-transform"
          style={{
            transform: `translateY(${quoteParallax.offset}px)`,
            backfaceVisibility: "hidden",
          }}
        />

        {/* Subtle overlay pattern */}
        <div
          className="absolute inset-0 opacity-10 will-change-transform"
          style={{
            transform: `translateY(${quoteParallax.offset * 0.5}px)`,
            backgroundImage: "radial-gradient(circle at 25% 25%, white 2px, transparent 2px)",
            backgroundSize: "50px 50px",
          }}
        />

        <div className="container mx-auto px-4 lg:px-6 max-w-4xl text-center relative z-10">
          <div
            ref={quoteAnimation.ref}
            className={`animate-on-scroll-scale ${quoteAnimation.isVisible ? "animate-visible" : ""}`}
          >
            <blockquote className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">
              "It is time to bring your evolution in motion"
            </blockquote>
            <div className="w-24 h-1 bg-white/30 mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* Subtle Parallax Background */}
        <div
          ref={visionParallax.ref}
          className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/3 to-transparent will-change-transform"
          style={{
            transform: `translateY(${visionParallax.offset}px)`,
            backfaceVisibility: "hidden",
          }}
        />

        {/* Floating Decoration */}
        <div
          ref={decorativeParallax3.ref}
          className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-secondary/8 to-primary/8 rounded-full blur-md will-change-transform"
          style={{
            transform: `translateY(${decorativeParallax3.offset}px) scale(${0.8 + decorativeParallax3.progress * 0.4})`,
            opacity: 0.5,
          }}
        />

        <div className="container mx-auto px-4 lg:px-6 max-w-4xl relative z-10">
          <div className="mb-16">
            <div
              ref={visionHeaderAnimation.ref}
              className={`flex items-center gap-4 mb-8 animate-on-scroll-left ${visionHeaderAnimation.isVisible ? "animate-visible" : ""}`}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Onze Visie</h2>
                <p className="text-lg text-gray-600">Een verlengstuk van universele waarheid</p>
              </div>
            </div>

            <div className="prose prose-lg md:prose-xl max-w-none">
              <div
                ref={visionContentAnimation.ref}
                className={`bg-gray-50 rounded-2xl p-8 md:p-12 mb-8 animate-on-scroll relative overflow-hidden ${visionContentAnimation.isVisible ? "animate-visible" : ""}`}
              >
                {/* Subtle inner parallax effect */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl will-change-transform"
                  style={{
                    transform: `translateY(${visionParallax.offset * 0.3}px)`,
                    opacity: 0.6,
                  }}
                />
                <div className="relative z-10">
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
                    zelfinzicht en verantwoordelijkheid willen leven. We geloven dat echte verandering pas mogelijk
                    wordt wanneer men ten volle beseft welke verantwoordelijkheid men draagt voor het eigen leven, en
                    deze verantwoordelijkheid omarmt.
                  </p>
                </div>
              </div>

              <div ref={cardsContainerRef} className="grid md:grid-cols-2 gap-8 mb-8">
                <div
                  className={`bg-white border border-gray-200 rounded-xl p-6 animate-on-scroll-left relative overflow-hidden ${visibleCards[0] ? "animate-visible" : ""}`}
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent rounded-xl will-change-transform"
                    style={{
                      transform: `translateY(${visionParallax.offset * 0.2}px)`,
                      opacity: 0.4,
                    }}
                  />
                  <div className="relative z-10">
                    <Globe className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Universele Verbondenheid</h3>
                    <p className="text-gray-600">
                      Evotion erkent dat we allen verbonden zijn met de universele krachten die ons overstijgen en dat
                      onze rol slechts een klein, maar belangrijk, onderdeel is van het grotere geheel.
                    </p>
                  </div>
                </div>

                <div
                  className={`bg-white border border-gray-200 rounded-xl p-6 animate-on-scroll-right relative overflow-hidden ${visibleCards[1] ? "animate-visible" : ""}`}
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-secondary/3 to-transparent rounded-xl will-change-transform"
                    style={{
                      transform: `translateY(${visionParallax.offset * -0.2}px)`,
                      opacity: 0.4,
                    }}
                  />
                  <div className="relative z-10">
                    <Users className="w-8 h-8 text-secondary mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Bewuste Keuzevrijheid</h3>
                    <p className="text-gray-600">
                      Wij geloven dat elk individu de kracht heeft om invloed uit te oefenen binnen de kaders van
                      verantwoordelijkheid over lichaam, geest en keuzes.
                    </p>
                  </div>
                </div>
              </div>

              <div
                ref={visionBottomAnimation.ref}
                className={`bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 md:p-12 animate-on-scroll relative overflow-hidden ${visionBottomAnimation.isVisible ? "animate-visible" : ""}`}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-primary/8 to-secondary/8 rounded-2xl will-change-transform"
                  style={{
                    transform: `translateY(${visionParallax.offset * 0.4}px)`,
                    opacity: 0.5,
                  }}
                />
                <div className="relative z-10">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Onze visie gaat voorbij het individu en strekt zich uit naar de waarheid zoals die bestaat in elke
                    hoek van het universum. Wat wij bieden, is een vertakking van dat allesomvattende proces van leven
                    en groei, en door Evotion kiezen we ervoor om ons aan die waarheid over te geven.
                  </p>

                  <p className="text-gray-700 leading-relaxed mb-6">
                    Evotion biedt begeleiding die voortvloeit uit universele principes. Deze visie is eerlijk, open en
                    transparant – we streven ernaar dat iedereen die ons pad volgt, doordrongen raakt van deze waarden
                    en hun kracht begrijpt.
                  </p>

                  <p className="text-gray-700 leading-relaxed">
                    Evotion is daarmee geen eindpunt, maar een reis die in elke stap afstemming zoekt met de
                    werkelijkheid zoals die is – een werkelijkheid die zowel wij als onze klanten leren omarmen en
                    waarin we steeds dieper tot rust en vervulling komen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
        {/* Parallax Background */}
        <div
          ref={missionParallax.ref}
          className="absolute inset-0 bg-gradient-to-br from-secondary/4 via-gray-50 to-primary/4 will-change-transform"
          style={{
            transform: `translateY(${missionParallax.offset}px)`,
            backfaceVisibility: "hidden",
          }}
        />

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-5 will-change-transform"
          style={{
            transform: `translateY(${missionParallax.offset * -0.3}px)`,
            backgroundImage: "linear-gradient(45deg, transparent 40%, rgba(59, 130, 246, 0.1) 50%, transparent 60%)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="container mx-auto px-4 lg:px-6 max-w-4xl relative z-10">
          <div className="mb-16">
            <div
              ref={missionHeaderAnimation.ref}
              className={`flex items-center gap-4 mb-8 animate-on-scroll-right ${missionHeaderAnimation.isVisible ? "animate-visible" : ""}`}
            >
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center">
                <Heart className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Onze Missie</h2>
                <p className="text-lg text-gray-600">Praktische uitwerking van onze kernwaarden</p>
              </div>
            </div>

            <div className="prose prose-lg md:prose-xl max-w-none">
              <div
                ref={missionContentAnimation.ref}
                className={`bg-white rounded-2xl p-8 md:p-12 mb-8 shadow-sm animate-on-scroll relative overflow-hidden ${missionContentAnimation.isVisible ? "animate-visible" : ""}`}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-br from-primary/2 to-secondary/2 rounded-2xl will-change-transform"
                  style={{
                    transform: `translateY(${missionParallax.offset * 0.2}px)`,
                    opacity: 0.6,
                  }}
                />
                <div className="relative z-10">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Bij Evotion komt onze visie tot leven in onze missie: een gedreven inzet om mensen te begeleiden in
                    hun proces van bewustwording en persoonlijke groei. De missie van Evotion is een praktische
                    uitwerking van de kernwaarden die ons richting geven, waarbij we de universele wetten als leidraad
                    nemen.
                  </p>

                  <p className="text-gray-700 leading-relaxed mb-6">
                    In dit proces helpen we mensen niet alleen om zichzelf te versterken, maar ook om hun leven te
                    leiden vanuit een diepe, bewuste verbinding met zichzelf en de wereld om hen heen.
                  </p>
                </div>
              </div>

              <div
                ref={missionTransformAnimation.ref}
                className={`bg-gradient-to-br from-primary/10 via-white to-secondary/10 rounded-2xl p-8 md:p-12 mb-8 animate-on-scroll-left relative overflow-hidden ${missionTransformAnimation.isVisible ? "animate-visible" : ""}`}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl will-change-transform"
                  style={{
                    transform: `translateY(${missionParallax.offset * -0.3}px)`,
                    opacity: 0.7,
                  }}
                />
                <div className="relative z-10">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Ware Transformatie</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    In de missie van Evotion gaan we verder dan alleen het creëren van fysieke en mentale groei – we
                    werken vanuit de overtuiging dat ware transformatie ontstaat wanneer mensen hun intenties en acties
                    afstemmen op universele principes.
                  </p>

                  <p className="text-gray-700 leading-relaxed mb-6">
                    Door onze coaching en begeleiding te bouwen op deze fundamentele wetten, bieden we klanten de tools
                    en ondersteuning die hen helpen om een leven te leiden dat in lijn is met hun hoogste potentieel.
                  </p>

                  <p className="text-gray-700 leading-relaxed">
                    Elk aspect van onze missie is een stap in de richting van een leven waarin klanten niet alleen
                    bewuste keuzes maken, maar ook vanuit een stevige basis verantwoordelijkheid nemen voor hun groei en
                    welzijn.
                  </p>
                </div>
              </div>

              <div
                ref={missionInvitationAnimation.ref}
                className={`bg-white rounded-2xl p-8 md:p-12 shadow-sm animate-on-scroll-right relative overflow-hidden ${missionInvitationAnimation.isVisible ? "animate-visible" : ""}`}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-br from-secondary/2 to-primary/2 rounded-2xl will-change-transform"
                  style={{
                    transform: `translateY(${missionParallax.offset * 0.25}px)`,
                    opacity: 0.5,
                  }}
                />
                <div className="relative z-10">
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* Parallax Background */}
        <div
          ref={ctaParallax.ref}
          className="absolute inset-0 bg-gradient-to-br from-primary/6 to-secondary/6 will-change-transform"
          style={{
            transform: `translateY(${ctaParallax.offset}px)`,
            backfaceVisibility: "hidden",
          }}
        />

        <div className="container mx-auto px-4 lg:px-6 max-w-4xl text-center relative z-10">
          <div
            ref={ctaAnimation.ref}
            className={`bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 md:p-12 text-white animate-on-scroll-scale relative overflow-hidden ${ctaAnimation.isVisible ? "animate-visible" : ""}`}
          >
            <div
              className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90 rounded-3xl will-change-transform"
              style={{
                transform: `translateY(${ctaParallax.offset * 0.1}px)`,
                opacity: 0.8,
              }}
            />
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-6">Klaar om jouw evolutie in beweging te brengen?</h3>
              <p className="text-xl mb-8 text-white/90">
                Ontdek hoe onze coaching jou kan helpen om in harmonie te leven met je hoogste potentieel.
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
                  <Link href="/over-ons/coaches">Ontmoet Onze Coaches</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
