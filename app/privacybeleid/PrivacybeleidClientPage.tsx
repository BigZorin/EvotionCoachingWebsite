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
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-[#1e1839] p-4 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1e1839] mb-4">Privacybeleid</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Transparantie over hoe wij jouw persoonlijke gegevens verzamelen, gebruiken en beschermen
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

        {/* Calculator Notice */}
        <Card className="mb-12 border-2 border-[#bad4e1]">
          <CardContent className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-[#1e1839] p-3 rounded-full flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1e1839] mb-4">
                  Caloriebehoefte Calculator - Belangrijke Informatie
                </h2>
                <p className="text-lg font-semibold text-[#1e1839] mb-4">
                  Door onze caloriebehoefte calculator te gebruiken, ga je automatisch akkoord met:
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Het verstrekken van jouw persoonlijke gegevens</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Contact opname voor coaching aanbiedingen</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Communicatie via e-mail, telefoon en WhatsApp</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Het ontvangen van fitness en voeding tips</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-12">
          {/* Wie zijn wij */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-[#1e1839] p-3 rounded-full">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#1e1839]">Wie zijn wij?</h2>
              </div>
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
                      <a href="mailto:info@evotion-coaching.nl" className="text-[#1e1839] hover:text-[#bad4e1]">
                        info@evotion-coaching.nl
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-[#1e1839]" />
                    <div>
                      <p className="font-medium text-gray-900">Telefoon</p>
                      <a href="tel:+31610935077" className="text-[#1e1839] hover:text-[#bad4e1]">
                        +31 6 10 93 50 77
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gegevensverzameling */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-[#1e1839] p-3 rounded-full">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#1e1839]">Welke gegevens verzamelen wij?</h2>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-[#1e1839] mb-4">Via de Caloriebehoefte Calculator:</h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Persoonlijke gegevens:</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Voor- en achternaam</li>
                        <li>• E-mailadres</li>
                        <li>• Telefoonnummer (optioneel)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Lichaamsgegevens:</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Leeftijd en geslacht</li>
                        <li>• Lengte en gewicht</li>
                        <li>• Activiteitsniveau</li>
                        <li>• Fitnessdoelen</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#1e1839] mb-4">Automatisch verzamelde gegevens:</h3>
                  <div className="grid sm:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Technische gegevens:</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• IP-adres</li>
                        <li>• Browsertype</li>
                        <li>• Apparaatinformatie</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Gebruiksgegevens:</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Bezochte pagina's</li>
                        <li>• Tijd op website</li>
                        <li>• Klikgedrag</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Locatiegegevens:</h4>
                      <ul className="space-y-2 text-gray-700">
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
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-[#1e1839] p-3 rounded-full">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#1e1839]">Hoe gebruiken wij jouw gegevens?</h2>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-[#1e1839] mb-4">Primaire doeleinden:</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Persoonlijke coaching aanbiedingen</p>
                        <p className="text-gray-600">Op basis van jouw calculator resultaten en doelen</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Resultaten versturen</p>
                        <p className="text-gray-600">Jouw caloriebehoefte en voedingsadvies per e-mail</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Contact opnemen</p>
                        <p className="text-gray-600">Voor kennismakingsgesprekken en coaching consultaties</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#1e1839] mb-4">Marketing en communicatie:</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Nieuwsbrieven</p>
                        <p className="text-gray-600">Fitness tips, voedingsadvies en success stories</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Programma updates</p>
                        <p className="text-gray-600">Nieuwe coaching programma's en speciale aanbiedingen</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Motivatie en support</p>
                        <p className="text-gray-600">Inspirerende content en community updates</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rechtsgrond en bewaartermijn */}
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-[#1e1839] p-3 rounded-full">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-[#1e1839]">Rechtsgrond</h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-[#1e1839] mb-2">Toestemming (Art. 6 lid 1a AVG)</h3>
                    <p className="text-gray-700">
                      Door de calculator te gebruiken geef je expliciet toestemming voor de verwerking van je gegevens.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1e1839] mb-2">Gerechtvaardigd belang</h3>
                    <p className="text-gray-700">Voor het verbeteren van onze diensten en website functionaliteit.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-[#1e1839] p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-[#1e1839]">Bewaartermijn</h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-[#1e1839] mb-2">Calculator gegevens</h3>
                    <p className="text-gray-700">2 jaar na laatste contact of calculator gebruik</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1e1839] mb-2">Marketing gegevens</h3>
                    <p className="text-gray-700">Tot je je uitschrijft voor communicatie</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1e1839] mb-2">Coaching klanten</h3>
                    <p className="text-gray-700">7 jaar na beëindiging (wettelijke verplichting)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Jouw rechten */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-[#1e1839] p-3 rounded-full">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#1e1839]">Jouw privacy rechten (AVG/GDPR)</h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div>
                  <h3 className="font-semibold text-[#1e1839] mb-2">Recht op inzage</h3>
                  <p className="text-sm text-gray-600">Opvragen welke gegevens we van je hebben</p>
                </div>
                <div>
                  <h3 className="font-semibold text-[#1e1839] mb-2">Recht op rectificatie</h3>
                  <p className="text-sm text-gray-600">Onjuiste gegevens laten corrigeren</p>
                </div>
                <div>
                  <h3 className="font-semibold text-[#1e1839] mb-2">Recht op verwijdering</h3>
                  <p className="text-sm text-gray-600">Je gegevens laten wissen ('recht om vergeten te worden')</p>
                </div>
                <div>
                  <h3 className="font-semibold text-[#1e1839] mb-2">Recht op beperking</h3>
                  <p className="text-sm text-gray-600">Verwerking van je gegevens laten stoppen</p>
                </div>
                <div>
                  <h3 className="font-semibold text-[#1e1839] mb-2">Recht op overdraagbaarheid</h3>
                  <p className="text-sm text-gray-600">Je gegevens in een leesbaar formaat ontvangen</p>
                </div>
                <div>
                  <h3 className="font-semibold text-[#1e1839] mb-2">Recht van bezwaar</h3>
                  <p className="text-sm text-gray-600">Bezwaar maken tegen verwerking van je gegevens</p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-[#1e1839] mb-3">Hoe maak je gebruik van je rechten?</h3>
                <p className="text-gray-700 mb-3">
                  Stuur een e-mail naar <strong>info@evotion-coaching.nl</strong> met je verzoek. We reageren binnen 30
                  dagen op je aanvraag.
                </p>
                <p className="text-sm text-gray-600">
                  Voor verificatie vragen we je om je identiteit te bevestigen met een kopie van je ID (met BSN
                  afgedekt).
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Geen contact meer */}
          <Card className="border-2 border-red-200">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-red-600 p-3 rounded-full">
                  <XCircle className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-red-800">Geen contact meer ontvangen?</h2>
              </div>

              <div className="space-y-6">
                <p className="text-red-700 font-medium">
                  Je kunt op elk moment stoppen met het ontvangen van onze communicatie:
                </p>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium text-red-800">E-mail</p>
                        <p className="text-red-700">info@evotion-coaching.nl</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium text-red-800">Telefoon</p>
                        <p className="text-red-700">+31 6 10 93 50 77</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium text-red-800">WhatsApp</p>
                      <p className="text-red-700">Stuur "STOP" naar ons nummer</p>
                    </div>
                    <div>
                      <p className="font-medium text-red-800">Uitschrijflink</p>
                      <p className="text-red-700">Onderaan elke e-mail</p>
                    </div>
                  </div>
                </div>

                <div className="border border-red-300 rounded-lg p-4">
                  <p className="text-red-800 font-medium">
                    Snelle actie: We stoppen binnen 48 uur met alle communicatie en verwijderen je gegevens binnen 30
                    dagen.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Beveiliging en cookies */}
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-xl font-bold text-[#1e1839] mb-6">Beveiliging van je gegevens</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-[#1e1839] mb-3">Technische maatregelen:</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• SSL-versleuteling (HTTPS)</li>
                      <li>• Beveiligde servers</li>
                      <li>• Regelmatige security updates</li>
                      <li>• Toegangscontrole</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1e1839] mb-3">Organisatorische maatregelen:</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Beperkte toegang tot gegevens</li>
                      <li>• Privacy training medewerkers</li>
                      <li>• Incident response procedures</li>
                      <li>• Regelmatige audits</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-xl font-bold text-[#1e1839] mb-6">Cookies en tracking</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-[#1e1839] mb-3">Functionele cookies:</h3>
                    <p className="text-gray-700">
                      Noodzakelijk voor het goed functioneren van de website en calculator.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1e1839] mb-3">Analytische cookies:</h3>
                    <p className="text-gray-700">
                      Helpen ons de website te verbeteren door gebruiksstatistieken te verzamelen.
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">
                    Je kunt cookies uitschakelen in je browser, maar dit kan de functionaliteit beïnvloeden.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact */}
          <Card className="bg-[#1e1839] text-white">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">Vragen over je privacy?</h2>
                <p className="text-gray-300">We helpen je graag verder met al je privacy-gerelateerde vragen</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Direct contact
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-300">E-mail</p>
                      <a href="mailto:info@evotion-coaching.nl" className="text-[#bad4e1] hover:text-white">
                        info@evotion-coaching.nl
                      </a>
                    </div>
                    <div>
                      <p className="text-sm text-gray-300">Telefoon</p>
                      <a href="tel:+31610935077" className="text-[#bad4e1] hover:text-white">
                        +31 6 10 93 50 77
                      </a>
                    </div>
                  </div>
                </div>

                <div>
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

              <div className="text-center border-t border-gray-600 pt-6">
                <p className="text-sm text-gray-400">Evotion Coaching | Sneek, Nederland</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
