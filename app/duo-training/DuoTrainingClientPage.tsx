"use client"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Star,
  CheckCircle,
  Target,
  ArrowRight,
  Phone,
  MessageCircle,
  Heart,
  TrendingUp,
  Trophy,
  Smile,
  PiggyBank,
  Calendar,
} from "lucide-react"

export default function DuoTrainingClientPage() {
  const benefits = [
    {
      icon: Users,
      title: "Samen Trainen",
      description: "Train met je partner, vriend of familielid voor extra motivatie en plezier",
    },
    {
      icon: PiggyBank,
      title: "Gedeelde Kosten",
      description: "Betaal minder per persoon terwijl je nog steeds persoonlijke begeleiding krijgt",
    },
    {
      icon: Heart,
      title: "Dubbele Motivatie",
      description: "Houd elkaar scherp en gemotiveerd om consequent te blijven trainen",
    },
    {
      icon: Smile,
      title: "Meer Plezier",
      description: "Training wordt leuker wanneer je het deelt met iemand die je kent",
    },
    {
      icon: Target,
      title: "Persoonlijke Aanpak",
      description: "Beide trainingsschema's worden aangepast aan individuele doelen en niveau",
    },
    {
      icon: Calendar,
      title: "Flexibele Planning",
      description: "Plan sessies op tijden die voor jullie beiden uitkomen",
    },
  ]

  const packages = [
    {
      title: "10 Duo Sessies",
      sessions: "10 sessies voor 2 personen",
      features: [
        "10 duo training sessies",
        "Intake voor beide deelnemers",
        "Individuele trainingsschema's",
        "Voedingsadvies",
        "Flexibele planning",
      ],
      popular: false,
      whatsappMessage: "Hoi! Wij hebben interesse in het 10 Duo Sessies pakket.",
    },
    {
      title: "20 Duo Sessies",
      sessions: "20 sessies voor 2 personen",
      features: [
        "20 duo training sessies",
        "Uitgebreide intake",
        "Gepersonaliseerde schema's",
        "Voedingsplan op maat",
        "Tussentijdse evaluaties",
        "WhatsApp support",
      ],
      popular: true,
      whatsappMessage: "Hoi! Wij hebben interesse in het 20 Duo Sessies pakket.",
    },
    {
      title: "40 Duo Sessies",
      sessions: "40 sessies voor 2 personen",
      features: [
        "40 duo training sessies",
        "Complete lifestyle analyse",
        "Volledig trainings- en voedingsplan",
        "Wekelijkse voortgangsmetingen",
        "24/7 WhatsApp support",
        "Gratis herhalingsschema",
        "Prioriteit bij planning",
      ],
      popular: false,
      whatsappMessage: "Hoi! Wij hebben interesse in het 40 Duo Sessies pakket.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - Mobile Optimized */}
      <section className="py-12 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
              <div className="space-y-4 lg:space-y-6">
                <Badge className="bg-gray-100 text-gray-700 border-gray-200 inline-flex">
                  <Users className="w-4 h-4 mr-2" />
                  Duo Training
                </Badge>
                <h1 className="text-3xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Duo Training - <span className="block lg:inline text-gray-700">Samen Sterker</span>
                </h1>
                <p className="text-base lg:text-xl text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Train samen met je partner, vriend of familielid. Met duo training deel je niet alleen de kosten, maar
                  ook de motivatie. Twee keer zoveel plezier, twee keer zoveel resultaat.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="bg-gray-900 hover:bg-gray-800 text-white px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-semibold"
                  asChild
                >
                  <a
                    href="https://wa.me/31064365571?text=Hoi!%20Wij%20hebben%20interesse%20in%20Duo%20Training%20en%20willen%20graag%20meer%20informatie."
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
                  className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
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
                  <div className="text-xl lg:text-3xl font-bold mb-1 text-gray-900">2x</div>
                  <div className="text-xs lg:text-sm text-gray-600">Motivatie</div>
                </div>
                <div className="text-center">
                  <div className="text-xl lg:text-3xl font-bold mb-1 text-gray-900">50%</div>
                  <div className="text-xs lg:text-sm text-gray-600">Besparing p.p.</div>
                </div>
                <div className="text-center">
                  <div className="text-xl lg:text-3xl font-bold mb-1 text-gray-900">100%</div>
                  <div className="text-xs lg:text-sm text-gray-600">Persoonlijk</div>
                </div>
              </div>
            </div>

            {/* Image - Hidden on mobile for cleaner look */}
            <div className="relative hidden lg:block">
              <div className="relative w-full h-[480px] lg:h-[520px] rounded-2xl overflow-hidden border border-gray-200">
                <Image
                  src="/two-people-training-together-in-gym-with-personal-.jpg"
                  alt="Duo Training sessie bij Evotion Coaching"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-white/90 backdrop-blur px-3 py-1.5">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs font-medium text-gray-900">Populaire Keuze</span>
                </div>
                <div className="absolute bottom-4 right-4">
                  <div className="rounded-xl bg-white/90 backdrop-blur px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <Trophy className="w-4 h-4 text-gray-700" />
                      <span className="font-medium">Samen Trainen</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section - Mobile Optimized */}
      <section className="py-12 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 lg:mb-16">
            <Badge className="bg-gray-100 text-gray-700 border-gray-200 mb-4 lg:mb-6 inline-flex">
              <Target className="w-4 h-4 mr-2" />
              Voordelen
            </Badge>
            <h2 className="text-2xl lg:text-5xl font-bold text-gray-900 mb-3 lg:mb-6">
              Waarom Kiezen voor Duo Training?
            </h2>
            <p className="text-sm lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
              Duo training combineert het beste van twee werelden: persoonlijke begeleiding en de motivatie van samen
              trainen.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border border-gray-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4 lg:p-8 text-center space-y-2 lg:space-y-4">
                  <div className="w-10 h-10 lg:w-16 lg:h-16 bg-gray-100 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto">
                    <benefit.icon className="w-5 h-5 lg:w-8 lg:h-8 text-gray-700" />
                  </div>
                  <h3 className="text-sm lg:text-xl font-bold text-gray-900">{benefit.title}</h3>
                  <p className="text-xs lg:text-base text-gray-600 leading-relaxed hidden sm:block">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works - Mobile Optimized */}
      <section className="py-12 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 lg:mb-16">
            <Badge className="bg-gray-100 text-gray-700 border-gray-200 mb-4 lg:mb-6 inline-flex">
              <TrendingUp className="w-4 h-4 mr-2" />
              Hoe Werkt Het
            </Badge>
            <h2 className="text-2xl lg:text-5xl font-bold text-gray-900 mb-3 lg:mb-6">Starten met Duo Training</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-8">
            {[
              {
                step: "01",
                title: "Zoek Partner",
                description: "Kies iemand om mee te trainen: partner, vriend, familielid of collega.",
              },
              {
                step: "02",
                title: "Intake",
                description: "We bespreken jullie individuele doelen en maken een plan voor beiden.",
              },
              {
                step: "03",
                title: "Trainen",
                description: "Train samen onder begeleiding van een ervaren personal trainer.",
              },
              {
                step: "04",
                title: "Resultaat",
                description: "Bereik jullie doelen samen en vier de successen met elkaar.",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="relative text-center border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <CardContent className="p-4 lg:p-6 space-y-2 lg:space-y-4">
                  <div className="w-10 h-10 lg:w-16 lg:h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto text-white">
                    <span className="text-sm lg:text-xl font-bold">{item.step}</span>
                  </div>
                  <h3 className="text-sm lg:text-xl font-bold text-gray-900">{item.title}</h3>
                  <p className="text-xs lg:text-base text-gray-600 leading-relaxed hidden sm:block">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section - Mobile Optimized */}
      <section className="py-12 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 lg:mb-16">
            <Badge className="bg-gray-100 text-gray-700 border-gray-200 mb-4 lg:mb-6 inline-flex">
              <Users className="w-4 h-4 mr-2" />
              Pakketten
            </Badge>
            <h2 className="text-2xl lg:text-5xl font-bold text-gray-900 mb-3 lg:mb-6">Duo Training Pakketten</h2>
            <p className="text-sm lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
              Alle pakketten zijn voor 2 personen samen. Neem contact op voor prijzen en mogelijkheden.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-4 lg:gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <div key={index} className="relative">
                <Card
                  className={`relative border transition-all duration-300 hover:shadow-xl ${
                    pkg.popular ? "border-gray-900 shadow-lg lg:scale-[1.02]" : "border-gray-200 hover:-translate-y-1"
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gray-900 text-white px-3 lg:px-4 py-1.5 lg:py-2 shadow-md text-xs lg:text-sm">
                        <Star className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                        MEEST POPULAIR
                      </Badge>
                    </div>
                  )}

                  <CardContent className="p-6 lg:p-8 space-y-5 lg:space-y-6">
                    <div className="text-center space-y-3">
                      <h3 className="text-xl lg:text-2xl font-bold text-gray-900">{pkg.title}</h3>
                      <div className="space-y-1">
                        <div className="text-2xl lg:text-3xl font-bold text-gray-900">Op Aanvraag</div>
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
                          ? "bg-gray-900 hover:bg-gray-800 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-900"
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

          <div className="text-center mt-8 lg:mt-12">
            <p className="text-sm lg:text-base text-gray-600 mb-4 lg:mb-6 px-2">
              Nog geen trainingspartner? Neem contact op en we helpen je verder.
            </p>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
              asChild
            >
              <a
                href="https://wa.me/31064365571?text=Hoi!%20Ik%20wil%20graag%20meer%20informatie%20over%20Duo%20Training."
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                Vraag Informatie via WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section - Mobile Optimized */}
      <section className="py-12 lg:py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl lg:text-5xl font-bold mb-3 lg:mb-6">Klaar om Samen te Starten?</h2>
          <p className="text-sm lg:text-xl text-gray-300 max-w-2xl mx-auto mb-6 lg:mb-8 px-2">
            Neem vandaag nog contact op en ontdek hoe duo training jullie kan helpen om samen sterker te worden.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center px-4">
            <Button
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100 px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-semibold"
              asChild
            >
              <a
                href="https://wa.me/31064365571?text=Hoi!%20Wij%20willen%20graag%20starten%20met%20Duo%20Training."
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
              className="border-2 border-white text-white hover:bg-white/10 bg-transparent"
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

      <Footer />
    </div>
  )
}
