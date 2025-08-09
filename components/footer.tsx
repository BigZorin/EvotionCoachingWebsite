import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black text-white overflow-hidden relative">
      <div className="container mx-auto px-4 lg:px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Image
                src="/images/evotion-logo.png"
                alt="Evotion Coaching"
                width={180}
                height={60}
                className="h-12 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-gray-300 leading-relaxed">
              Jouw partner in fitness en gezondheid. We helpen je je droomlichaam te bereiken en te behouden.
            </p>

            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer">
                <Facebook className="w-5 h-5 text-primary" />
              </div>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer">
                <Instagram className="w-5 h-5 text-primary" />
              </div>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer">
                <Linkedin className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#diensten" className="text-gray-300 hover:text-secondary transition-colors">
                  Diensten
                </Link>
              </li>
              <li>
                <Link href="/over-ons/visie-missie" className="text-gray-300 hover:text-secondary transition-colors">
                  Over Ons
                </Link>
              </li>
              <li>
                <Link href="/#resultaten" className="text-gray-300 hover:text-secondary transition-colors">
                  Resultaten
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-gray-300 hover:text-secondary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Diensten</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/personal-training" className="text-gray-300 hover:text-secondary transition-colors">
                  Personal Training
                </Link>
              </li>
              <li>
                <Link href="/online-coaching" className="text-gray-300 hover:text-secondary transition-colors">
                  Online Coaching
                </Link>
              </li>
              <li>
                <Link href="/premium-coaching" className="text-gray-300 hover:text-secondary transition-colors">
                  Premium Coaching
                </Link>
              </li>
              <li>
                <Link href="/12-weken-vetverlies" className="text-gray-300 hover:text-secondary transition-colors">
                  12-Weken Vetverlies
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter - Compact */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Blijf op de hoogte</h3>
            <p className="text-gray-300 text-sm">Ontvang tips en updates</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Je email"
                className="flex-1 px-4 py-2 rounded-l-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-secondary text-sm"
              />
              <Button className="bg-secondary hover:bg-secondary/90 text-primary px-4 py-2 rounded-r-lg border border-secondary font-semibold text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Fixed mobile spacing */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <p className="text-gray-400 text-sm">© 2024 Evotion Coaching. Alle rechten voorbehouden.</p>

            {/* Mobile version - vertical layout with more spacing */}
            <div className="flex flex-col space-y-4 md:hidden">
              <Link href="#" className="text-gray-400 hover:text-secondary transition-colors text-center py-2">
                Privacybeleid
              </Link>
              <Link href="#" className="text-gray-400 hover:text-secondary transition-colors text-center py-2">
                Algemene Voorwaarden
              </Link>
              <Link href="#" className="text-gray-400 hover:text-secondary transition-colors text-center py-2">
                Cookie Beleid
              </Link>
            </div>

            {/* Desktop version - horizontal layout */}
            <div className="hidden md:flex space-x-6 text-sm">
              <Link href="#" className="text-gray-400 hover:text-secondary transition-colors">
                Privacybeleid
              </Link>
              <Link href="#" className="text-gray-400 hover:text-secondary transition-colors">
                Algemene Voorwaarden
              </Link>
              <Link href="#" className="text-gray-400 hover:text-secondary transition-colors">
                Cookie Beleid
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Export als default voor backward compatibility
export default Footer
