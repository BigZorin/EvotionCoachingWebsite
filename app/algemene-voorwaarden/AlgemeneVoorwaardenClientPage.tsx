"use client"

import {
  FileText,
  Calculator,
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Scale,
  Users,
  Shield,
  Clock,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function AlgemeneVoorwaardenClientPage() {
  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-[#1e1839] to-[#2d2654] p-4 rounded-full shadow-lg">
            <FileText className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1e1839] mb-4">Algemene Voorwaarden</h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Duidelijke afspraken voor een prettige samenwerking. Lees hier wat je kunt verwachten van onze diensten.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          Laatst bijgewerkt:{" "}
          {new Date().toLocaleDateString("nl-NL", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Calculator Toestemming - Hero sectie */}
      <Card className="border-2 border-[#bad4e1] bg-gradient-to-br from-[#bad4e1]/10 via-white to-[#bad4e1]/5 shadow-lg">
        <CardContent className="p-6 sm:p-8 lg:p-10">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-full shadow-md flex-shrink-0">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1e1839] mb-4">
                🧮 Caloriebehoefte Calculator - Toestemmingsverklaring
              </h2>
              <div className="bg-white/80 rounded-lg p-4 sm:p-6 border border-[#bad4e1]/30">
                <p className="text-base sm:text-lg font-semibold text-[#1e1839] mb-4">
                  Door onze gratis caloriebehoefte calculator te gebruiken, stem je automatisch in met:
                </p>
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-700">
                      Het verstrekken van jouw persoonlijke gegevens
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-700">
                      Contact opname voor coaching aanbiedingen
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-700">
                      Communicatie via e-mail, telefoon en WhatsApp
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-700">Het ontvangen van marketing communicatie</span>
                  </div>
                </div>
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-800 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Let op:</strong> Door op "Bereken mijn caloriebehoefte" te klikken, ga je automatisch
                      akkoord met bovenstaande punten.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wie zijn wij */}
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-[#1e1839] to-[#2d2654] p-3 rounded-full shadow-md">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1e1839]">1. Wie zijn wij?</h2>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-[#1e1839] mb-2">Evotion Coaching</h3>
                <p className="text-gray-700 mb-4">
                  Wij zijn jouw partner in fitness en gezonde levensstijl. Gevestigd in Sneek, Nederland, helpen we
                  mensen hun fitnessdoelen te bereiken door middel van persoonlijke coaching en begeleiding.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-[#1e1839]" />
                  <div>
                    <p className="font-medium text-gray-900">E-mail</p>
                    <a
                      href="mailto:info@evotion-coaching.nl"
                      className="text-[#1e1839] hover:text-[#bad4e1] transition-colors"
                    >
                      info@evotion-coaching.nl
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-[#1e1839]" />
                  <div>
                    <p className="font-medium text-gray-900">Telefoon</p>
                    <a href="tel:+31610935077" className="text-[#1e1839] hover:text-[#bad4e1] transition-colors">
                      +31 6 10 93 50 77
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Toepasselijkheid */}
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1e1839] mb-6">2. Toepasselijkheid</h2>
          <div className="space-y-6">
            <p className="text-base text-gray-700 leading-relaxed">
              Deze algemene voorwaarden zijn van toepassing op alle diensten en producten van Evotion Coaching,
              inclusief:
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-[#1e1839] mb-3">🆓 Gratis diensten:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Caloriebehoefte calculator
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Fitness tips en advies
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Nieuwsbrief en content
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h3 className="font-semibold text-[#1e1839] mb-3">💰 Betaalde diensten:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Personal training
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Online coaching programma's
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Premium coaching diensten
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    12-weken vetverlies programma
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Belangrijk:</strong> Voor betaalde diensten gelden aanvullende specifieke voorwaarden die bij
                het afsluiten van de overeenkomst worden verstrekt.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculator specifieke voorwaarden */}
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-full shadow-md">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1e1839]">
              3. Caloriebehoefte Calculator - Specifieke Voorwaarden
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-[#1e1839] mb-4">
                📝 Wat gebeurt er wanneer je de calculator gebruikt?
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">Je vult je gegevens in</p>
                    <p className="text-sm text-gray-600">Naam, e-mail, lichaamsgegevens en fitnessdoelen</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">Je ontvangt je resultaten</p>
                    <p className="text-sm text-gray-600">
                      Caloriebehoefte, macronutriënten en voedingsadvies per e-mail
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">Wij nemen contact op</p>
                    <p className="text-sm text-gray-600">
                      Voor persoonlijke coaching aanbiedingen die bij jouw doelen passen
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
              <h3 className="text-lg font-semibold text-[#1e1839] mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                Belangrijke disclaimer over calculator resultaten
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>
                    De calculator geeft een <strong>indicatie</strong> van je caloriebehoefte, geen exacte waarde
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>
                    Resultaten vormen <strong>geen medisch advies</strong> en vervangen geen professioneel advies
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Individuele verschillen kunnen leiden tot afwijkende resultaten</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Raadpleeg altijd een arts</strong> voordat je grote veranderingen aanbrengt in je dieet of
                    training
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact en Marketing */}
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-full shadow-md">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1e1839]">4. Contact en Marketing</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-[#1e1839] mb-4">📞 Hoe en wanneer nemen wij contact op?</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Contactmogelijkheden:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-green-600" />
                      E-mail voor coaching aanbiedingen
                    </li>
                    <li className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-green-600" />
                      Telefoon voor persoonlijke gesprekken
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">💬</span>
                      WhatsApp voor snelle communicatie
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">📧</span>
                      Nieuwsbrieven met tips en updates
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Frequentie en tijden:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>
                      • <strong>E-mail:</strong> Max. 2-3 berichten per week
                    </li>
                    <li>
                      • <strong>Telefoon:</strong> Alleen tijdens kantooruren (9-18u)
                    </li>
                    <li>
                      • <strong>WhatsApp:</strong> Tussen 09:00 - 21:00
                    </li>
                    <li>
                      • <strong>Nieuwsbrief:</strong> Wekelijks, uitschrijven altijd mogelijk
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-[#1e1839] mb-4">🎯 Wat kun je van ons verwachten?</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">🎯</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Persoonlijk</h4>
                  <p className="text-sm text-gray-600">
                    Aanbiedingen gebaseerd op jouw calculator resultaten en doelen
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">💡</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Waardevol</h4>
                  <p className="text-sm text-gray-600">Nuttige fitness en voeding tips, geen spam</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">🤝</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Respectvol</h4>
                  <p className="text-sm text-gray-600">Geen opdringerige verkoop, jouw keuze staat centraal</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aansprakelijkheid */}
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-full shadow-md">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1e1839]">
              5. Aansprakelijkheid en Risico's
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-red-50 rounded-lg p-6 border border-red-200">
              <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Belangrijke aansprakelijkheidsuitsluitingen
              </h3>
              <div className="space-y-3 text-sm text-red-700">
                <p>
                  <strong>Evotion Coaching is niet aansprakelijk voor:</strong>
                </p>
                <ul className="space-y-2 ml-4">
                  <li>• Gezondheidsschade door het volgen van calculator aanbevelingen zonder professioneel advies</li>
                  <li>• Onjuiste resultaten door verkeerde invoer van gegevens</li>
                  <li>• Indirecte schade, gevolgschade of gederfde winst</li>
                  <li>• Technische storingen van de website of calculator</li>
                  <li>• Schade door het niet bereiken van gewenste fitness resultaten</li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-[#1e1839] mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Jouw verantwoordelijkheid
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <p>
                  <strong>Voor een veilige ervaring raden wij je aan om:</strong>
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Altijd een arts te raadplegen voordat je begint met een nieuw dieet of trainingsschema</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Eerlijke en accurate gegevens in te vullen in de calculator</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Bij twijfel of gezondheidsproblemen professioneel advies in te winnen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Naar je lichaam te luisteren en niet door te gaan bij pijn of ongemak</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Geen contact meer */}
      <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100 shadow-lg">
        <CardContent className="p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-full shadow-md">
              <XCircle className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-800">6. Geen Contact Meer Ontvangen?</h2>
          </div>

          <div className="bg-white/80 rounded-lg p-6 border border-red-200">
            <p className="text-base text-red-700 mb-6 font-medium">
              Geen probleem! Je kunt op elk moment stoppen met het ontvangen van onze communicatie. We respecteren jouw
              keuze volledig.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-red-800 mb-4">🚀 Snelle opties:</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-red-600">🔗</span>
                    <div>
                      <p className="font-medium text-red-800">Uitschrijflink</p>
                      <p className="text-sm text-red-700">Onderaan elke e-mail</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-red-600">📱</span>
                    <div>
                      <p className="font-medium text-red-800">WhatsApp</p>
                      <p className="text-sm text-red-700">Stuur "STOP" naar ons nummer</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-red-800 mb-4">📞 Direct contact:</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium text-red-800">E-mail</p>
                      <p className="text-sm text-red-700">info@evotion-coaching.nl</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium text-red-800">Telefoon</p>
                      <p className="text-sm text-red-700">+31 6 10 93 50 77</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-100 rounded-lg p-4 border border-red-300">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-red-800 font-medium mb-1">⚡ Snelle verwerking gegarandeerd</p>
                  <p className="text-xs text-red-700">
                    We stoppen binnen <strong>48 uur</strong> met alle communicatie en verwijderen je gegevens binnen{" "}
                    <strong>30 dagen</strong>. Je ontvangt een bevestiging van ons.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wijzigingen en toepasselijk recht */}
      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#1e1839] mb-6">7. Wijzigingen Voorwaarden</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-[#1e1839] mb-2">Aanpassingen:</h3>
                <p className="text-sm text-gray-700">
                  Wij kunnen deze voorwaarden wijzigen. Wijzigingen worden gepubliceerd op deze pagina en treden in
                  werking vanaf de publicatiedatum.
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h3 className="font-semibold text-[#1e1839] mb-2">Kennisgeving:</h3>
                <p className="text-sm text-gray-700">
                  Bij belangrijke wijzigingen informeren we je via e-mail. Controleer regelmatig deze pagina voor
                  updates.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#1e1839] mb-6">8. Toepasselijk Recht</h2>
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h3 className="font-semibold text-[#1e1839] mb-2">Nederlands recht:</h3>
                <p className="text-sm text-gray-700">
                  Op deze voorwaarden is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde
                  rechter in Nederland.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-[#1e1839] mb-2">Geldigheid:</h3>
                <p className="text-sm text-gray-700">
                  Indien een bepaling nietig blijkt, blijven de overige bepalingen van kracht. De nietige bepaling wordt
                  vervangen door een geldige bepaling.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact */}
      <Card className="bg-gradient-to-br from-[#1e1839] to-[#2d2654] text-white shadow-lg">
        <CardContent className="p-6 sm:p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4">Vragen over deze voorwaarden?</h2>
            <p className="text-base sm:text-lg text-gray-300">We helpen je graag verder met al je vragen</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Direct contact
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-300">E-mail</p>
                  <a
                    href="mailto:info@evotion-coaching.nl"
                    className="text-[#bad4e1] hover:text-white transition-colors"
                  >
                    info@evotion-coaching.nl
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-300">Telefoon</p>
                  <a href="tel:+31610935077" className="text-[#bad4e1] hover:text-white transition-colors">
                    +31 6 10 93 50 77
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Reactietijd
              </h3>
              <div className="space-y-3 text-sm">
                <p className="text-gray-300">
                  <strong>E-mail:</strong> Binnen 24 uur op werkdagen
                </p>
                <p className="text-gray-300">
                  <strong>Telefoon:</strong> Direct tijdens kantooruren (9-18u)
                </p>
                <p className="text-gray-300">
                  <strong>WhatsApp:</strong> Binnen enkele uren
                </p>
              </div>
            </div>
          </div>

          <div className="text-center bg-white/5 rounded-lg p-4">
            <p className="text-sm text-gray-400">Evotion Coaching | Sneek, Nederland</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
