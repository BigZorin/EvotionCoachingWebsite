import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Instagram, Globe, Calculator, Calendar, Mail, Phone, Linkedin } from "lucide-react"
import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Martin - Evotion Coaching",
  description: "Jouw persoonlijke fitness & voedingscoach. Samen werken we aan jouw gezondheid, energie en doelen.",
  openGraph: {
    title: "Martin - Evotion Coaching",
    description: "Jouw persoonlijke fitness & voedingscoach",
    type: "profile",
  },
}

export default function MartinSocialsPage() {
  const links = [
    {
      title: "Evotion Coaching Website",
      description: "Bezoek onze hoofdwebsite",
      href: "https://www.evotion-coaching.nl",
      icon: Globe,
    },
    {
      title: "Over Mij",
      description: "Leer mij beter kennen",
      href: "https://www.evotion-coaching.nl/over-ons/coaches/martin",
      icon: Globe,
    },
    {
      title: "Online Coaching",
      description: "Persoonlijke begeleiding op afstand",
      href: "https://www.evotion-coaching.nl/online-coaching",
      icon: Globe,
    },
    {
      title: "Kcal Calculator",
      description: "Bereken jouw dagelijkse caloriebehoefte",
      href: "https://www.evotion-coaching.nl/gratis/caloriebehoefte",
      icon: Calculator,
    },
    {
      title: "Kennismakingsgesprek",
      description: "Plan een gratis intake gesprek",
      href: "https://calendly.com/evotion/evotion-coaching",
      icon: Calendar,
    },
    {
      title: "WhatsApp Bericht",
      description: "Stuur me direct een bericht",
      href: "https://wa.me/31610935077",
      icon: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      ),
    },
    {
      title: "Contact via Email",
      description: "Stuur me een bericht",
      href: "mailto:martin_langenberg@hotmail.com",
      icon: Mail,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-12">
        {/* Profile Section */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-6 relative h-32 w-32 overflow-hidden rounded-full bg-gradient-to-br from-primary to-accent">
            <Image
              src="/images/martin-langenberg.png"
              alt="Martin - Evotion Coaching"
              fill
              className="object-cover"
              priority
            />
          </div>

          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">Martin</h1>

          <p className="mb-1 text-lg font-medium text-primary">Evotion Coaching</p>

          <p className="mb-6 max-w-md text-balance text-muted-foreground leading-relaxed">
            Jouw persoonlijke fitness & voedingscoach. Samen werken we aan jouw gezondheid, energie en doelen.
          </p>

          <div className="flex gap-3">
            <Button variant="outline" size="icon" className="rounded-full bg-transparent" asChild>
              <a
                href="https://instagram.com/mr.martin1981"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full bg-transparent" asChild>
              <a
                href="https://linkedin.com/in/langenberg-martin"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full bg-transparent" asChild>
              <a href="tel:+31610935077" aria-label="Bel Martin">
                <Phone className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>

        {/* Links Section */}
        <div className="space-y-4">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <Card
                key={link.href}
                className="group transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                <a
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-4 p-5"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{link.description}</p>
                  </div>

                  <svg
                    className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </Card>
            )
          })}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Evotion Coaching</p>
          <p className="mt-2 text-xs text-muted-foreground">It is time to bring your evolution in motion.</p>
        </footer>
      </div>
    </div>
  )
}
