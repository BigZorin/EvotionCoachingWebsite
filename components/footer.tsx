"use client"

import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin, Instagram, Facebook, Linkedin } from "lucide-react"
import CookieSettingsButton from "./cookie-settings-button"

export function Footer() {
  return (
    <footer className="bg-[#1e1839] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo en Beschrijving */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/images/evotion-logo.png"
                alt="Evotion Coaching Logo"
                width={150}
                height={60}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Jouw partner in gezonde gewichtsbeheersing en duurzame levensstijlverandering. Samen bereiken we jouw
              doelen.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/evotion.coaching"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/evotioncoaching"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/company/evotion-coaching"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/personal-training" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Personal Training
                </Link>
              </li>
              <li>
                <Link href="/online-coaching" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Online Coaching
                </Link>
              </li>
              <li>
                <Link href="/premium-coaching" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Premium Coaching
                </Link>
              </li>
              <li>
                <Link href="/12-weken-vetverlies" className="text-gray-300 hover:text-white transition-colors text-sm">
                  12 Weken Vetverlies
                </Link>
              </li>
              <li>
                <Link
                  href="/gratis/caloriebehoefte"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Gratis Calorie Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Over Ons */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Over Ons</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/over-ons" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Ons Verhaal
                </Link>
              </li>
              <li>
                <Link href="/over-ons/coaches" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Onze Coaches
                </Link>
              </li>
              <li>
                <Link
                  href="/over-ons/visie-missie"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Visie & Missie
                </Link>
              </li>
              <li>
                <Link href="/over-ons/kernwaarden" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Kernwaarden
                </Link>
              </li>
              <li>
                <Link href="/resultaten" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Resultaten
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <a href="tel:+31612345678" className="text-gray-300 hover:text-white transition-colors text-sm">
                  +31 6 12 34 56 78
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <a
                  href="mailto:info@evotion-coaching.nl"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  info@evotion-coaching.nl
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">
                  Amsterdam
                  <br />
                  Nederland
                </span>
              </li>
            </ul>
            <div className="mt-4">
              <Link
                href="/contact"
                className="inline-block bg-[#bad4e1] text-[#1e1839] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#9bc4d4] transition-colors"
              >
                Neem Contact Op
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-400">
              <p>&copy; 2024 Evotion Coaching. Alle rechten voorbehouden.</p>
              <div className="flex space-x-4">
                <Link href="/privacybeleid" className="hover:text-white transition-colors">
                  Privacybeleid
                </Link>
                <Link href="/algemene-voorwaarden" className="hover:text-white transition-colors">
                  Algemene Voorwaarden
                </Link>
                <CookieSettingsButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Export both named and default for compatibility
export default Footer
