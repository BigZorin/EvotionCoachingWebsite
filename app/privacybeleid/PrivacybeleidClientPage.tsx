"use client"

import {
  Shield,
  Lock,
  Eye,
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
  Calendar,
  Database,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function PrivacybeleidClientPage() {
  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-[#1e1839] to-[#2d2654] p-4 rounded-full shadow-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1e1839] mb-4">Privacybeleid</h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Transparantie en vertrouwen staan centraal. Hier lees je precies hoe wij omgaan met jouw persoonlijke
          gegevens.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
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
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1e1839] mb-4">
                🧮 Caloriebehoefte Calculator - Belangrijke Informatie
              </h2>
              <div className="bg-white/80 rounded-lg p-4 sm:p-6 border border-[#bad4e1]/30">
                <p className="text-base sm:text-lg font-semibold text-[#1e1839] mb-4">
                  Door onze gratis caloriebehoefte calculator te gebruiken, ga je automatisch akkoord met:
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
                    <span className="text-sm sm:text-base text-gray-700">
                      Het ontvangen van fitness en voeding tips
                    </span>
                  </div>
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
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1e1839]">Wie zijn wij?</h2>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-[#1e1839] mb-2">Evotion Coaching</h3>
                <p className="text-gray-700">Jouw partner in fitness en gezonde levensstijl</p>
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

      {/* Gegevensverzameling */}
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-full shadow-md">
              <Database className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1e1839]">Welke gegevens verzamelen wij?</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-[#1e1839] mb-4 flex items-center gap-2">
                🧮 Via de Caloriebehoefte Calculator:
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Persoonlijke gegevens:</h4>
                  <ul className="space-y-1 text-sm text-gray-700 ml-4">
                    <li>• Voor- en achternaam</li>
                    <li>• E-mailadres</li>
                    <li>• Telefoonnummer (optioneel)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Lichaamsgegevens:</h4>
                  <ul className="space-y-1 text-sm text-gray-700 ml-4">
                    <li>• Leeftijd en geslacht</li>
                    <li>• Lengte en gewicht</li>
                    <li>• Activiteitsniveau</li>
                    <li>• Fitnessdoelen</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-[#1e1839] mb-4">🌐 Automatisch verzamelde gegevens:</h3>
              <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-700">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Technische gegevens:</h4>
                  <ul className="space-y-1 ml-4">
                    <li>• IP-adres</li>
                    <li>• Browsertype</li>
                    <li>• Apparaatinformatie</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Gebruiksgegevens:</h4>
                  <ul className="space-y-1 ml-4">
                    <li>• Bezochte pagina's</li>
                    <li>• Tijd op website</li>
                    <li>• Klikgedrag</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Locatiegegevens:</h4>
                  <ul className="space-y-1 ml-4">
                    <li>• Land/regio</li>
                    <li>• Stad (globaal)</li>
                    <li>• Tijdzone</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gebruik van gegevens */}
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-full shadow-md">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1e1839]">
              Hoe gebruiken wij jouw gegevens?
            </h2>
          </div>

          <div className="grid gap-6">
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-[#1e1839] mb-4">🎯 Primaire doeleinden:</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Persoonlijke coaching aanbiedingen</p>
                    <p className="text-sm text-gray-600">Op basis van jouw calculator resultaten en doelen</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Resultaten versturen</p>
                    <p className="text-sm text-gray-600">Jouw caloriebehoefte en voedingsadvies per e-mail</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Contact opnemen</p>
                    <p className="text-sm text-gray-600">Voor kennismakingsgesprekken en coaching consultaties</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-[#1e1839] mb-4">📧 Marketing en communicatie:</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Nieuwsbrieven</p>
                    <p className="text-sm text-gray-600">Fitness tips, voedingsadvies en success stories</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Programma updates</p>
                    <p className="text-sm text-gray-600">Nieuwe coaching programma's en speciale aanbiedingen</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Motivatie en support</p>
                    <p className="text-sm text-gray-600">Inspirerende content en community updates</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rechtsgrond en bewaartermijn */}
      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-full shadow-md">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1e1839]">Rechtsgrond</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h3 className="font-semibold text-[#1e1839] mb-2">Toestemming (Art. 6 lid 1a AVG)</h3>
                <p className="text-sm text-gray-700">
                  Door de calculator te gebruiken geef je expliciet toestemming voor de verwerking van je gegevens.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-[#1e1839] mb-2">Gerechtvaardigd belang</h3>
                <p className="text-sm text-gray-700">
                  Voor het verbeteren van onze diensten en website functionaliteit.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-full shadow-md">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1e1839]">Bewaartermijn</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <h3 className="font-semibold text-[#1e1839] mb-2">Calculator gegevens</h3>
                <p className="text-sm text-gray-700">
                  <strong>2 jaar</strong> na laatste contact of calculator gebruik
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-[#1e1839] mb-2">Marketing gegevens</h3>
                <p className="text-sm text-gray-700">
                  Tot je je <strong>uitschrijft</strong> voor communicatie
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-[#1e1839] mb-2">Coaching klanten</h3>
                <p className="text-sm text-gray-700">
                  <strong>7 jaar</strong> na beëindiging (wettelijke verplichting)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jouw rechten */}
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 rounded-full shadow-md">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1e1839]">
              Jouw privacy rechten (AVG/GDPR)
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Recht op inzage", desc: "Opvragen welke gegevens we van je hebben", icon: "👁️" },
              { title: "Recht op rectificatie", desc: "Onjuiste gegevens laten corrigeren", icon: "✏️" },
              {
                title: "Recht op verwijdering",
                desc: "Je gegevens laten wissen ('recht om vergeten te worden')",
                icon: "🗑️",
              },
              { title: "Recht op beperking", desc: "Verwerking van je gegevens laten stoppen", icon: "⏸️" },
              {
                title: "Recht op overdraagbaarheid",
                desc: "Je gegevens in een leesbaar formaat ontvangen",
                icon: "📤",
              },
              { title: "Recht van bezwaar", desc: "Bezwaar maken tegen verwerking van je gegevens", icon: "🚫" },
            ].map((right, index) => (
              <div key={index} className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{right.icon}</span>
                  <div>
                    <h3 className="font-semibold text-[#1e1839] mb-1">{right.title}</h3>
                    <p className="text-xs text-gray-600">{right.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 border border-indigo-200">
            <h3 className="font-semibold text-[#1e1839] mb-3">💡 Hoe maak je gebruik van je rechten?</h3>
            <p className="text-sm text-gray-700 mb-3">
              Stuur een e-mail naar <strong>info@evotion-coaching.nl</strong> met je verzoek. We reageren binnen{" "}
              <strong>30 dagen</strong> op je aanvraag.
            </p>
            <p className="text-xs text-gray-600">
              Voor verificatie vragen we je om je identiteit te bevestigen met een kopie van je ID (met BSN afgedekt).
            </p>
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
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-800">Geen contact meer ontvangen?</h2>
          </div>

          <div className="bg-white/80 rounded-lg p-6 border border-red-200">
            <p className="text-base text-red-700 mb-4 font-medium">
              Je kunt op elk moment stoppen met het ontvangen van onze communicatie:
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
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
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-red-600">📱</span>
                  <div>
                    <p className="font-medium text-red-800">WhatsApp</p>
                    <p className="text-sm text-red-700">Stuur "STOP" naar ons nummer</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-red-600">🔗</span>
                  <div>
                    <p className="font-medium text-red-800">Uitschrijflink</p>
                    <p className="text-sm text-red-700">Onderaan elke e-mail</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-100 rounded-lg p-4 border border-red-300">
              <p className="text-sm text-red-800 font-medium">
                ⚡ Snelle actie: We stoppen binnen <strong>48 uur</strong> met alle communicatie en verwijderen je
                gegevens binnen <strong>30 dagen</strong>.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Beveiliging en cookies */}
      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#1e1839] mb-6">🔒 Beveiliging van je gegevens</h2>
            <div className="space-y-4">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h3 className="font-semibold text-[#1e1839] mb-2">Technische maatregelen:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• SSL-versleuteling (HTTPS)</li>
                  <li>• Beveiligde servers</li>
                  <li>• Regelmatige security updates</li>
                  <li>• Toegangscontrole</li>
                </ul>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-[#1e1839] mb-2">Organisatorische maatregelen:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Beperkte toegang tot gegevens</li>
                  <li>• Privacy training medewerkers</li>
                  <li>• Incident response procedures</li>
                  <li>• Regelmatige audits</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#1e1839] mb-6">🍪 Cookies en tracking</h2>
            <div className="space-y-4">
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <h3 className="font-semibold text-[#1e1839] mb-2">Functionele cookies:</h3>
                <p className="text-sm text-gray-700">
                  Noodzakelijk voor het goed functioneren van de website en calculator.
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h3 className="font-semibold text-[#1e1839] mb-2">Analytische cookies:</h3>
                <p className="text-sm text-gray-700">
                  Helpen ons de website te verbeteren door gebruiksstatistieken te verzamelen.
                </p>
              </div>
              <p className="text-xs text-gray-600">
                Je kunt cookies uitschakelen in je browser, maar dit kan de functionaliteit beïnvloeden.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact en klachten */}
      <Card className="bg-gradient-to-br from-[#1e1839] to-[#2d2654] text-white shadow-lg">
        <CardContent className="p-6 sm:p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4">Vragen over je privacy?</h2>
            <p className="text-base sm:text-lg text-gray-300">
              We helpen je graag verder met al je privacy-gerelateerde vragen
            </p>
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
                <AlertTriangle className="h-5 w-5" />
                Klachten
              </h3>
              <div className="space-y-3 text-sm">
                <p className="text-gray-300">Niet tevreden over hoe we met je gegevens omgaan?</p>
                <p className="text-gray-300">
                  Neem eerst contact met ons op. Lukt dat niet, dan kun je een klacht indienen bij:
                </p>
                <p className="text-[#bad4e1]">Autoriteit Persoonsgegevens (AP)</p>
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
