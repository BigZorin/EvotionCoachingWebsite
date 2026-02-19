"use client"

import React from "react"

import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin, Instagram, Facebook, Linkedin } from "lucide-react"
import CookieSettingsButton from "./cookie-settings-button"



export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-6 py-8 lg:py-12">
        {/* Mobile: Logo centered at top */}
        <div className="flex flex-col items-center text-center mb-6 lg:hidden">
          <Link href="/" className="inline-block mb-4">
            <Image
              src="/images/evotion-logo-white.png"
              alt="Evotion Coaching Logo"
              width={140}
              height={56}
              className="h-11 w-auto"
            />
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            Jouw partner in gezonde gewichtsbeheersing en duurzame levensstijlverandering.
          </p>
          
          {/* Social Icons - Larger on mobile */}
          <div className="flex gap-4 mt-5">
            <a
              href="https://instagram.com/evotion_coaching"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61565513770164"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/langenberg-martin/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>



        {/* Desktop Grid */}
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Logo en Beschrijving */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/images/evotion-logo-white.png"
                alt="Evotion Coaching Logo"
                width={150}
                height={60}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Jouw partner in gezonde gewichtsbeheersing en duurzame levensstijlverandering. Samen bereiken we jouw
              doelen.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://instagram.com/evotion_coaching"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61565513770164"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/langenberg-martin/"
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
            <h3 className="text-lg font-semibold mb-4 text-white">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/personal-training" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Personal Training
                </Link>
              </li>
              <li>
                <Link href="/online-coaching" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Online Coaching
                </Link>
              </li>
              <li>
                <Link href="/duo-training" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Duo Training
                </Link>
              </li>
              <li>
                <Link href="/gratis/caloriebehoefte" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Gratis Calorie Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Over Ons */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Over Ons</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/over-ons" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Ons Verhaal
                </Link>
              </li>
              <li>
                <Link href="/over-ons/coaches" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Onze Coaches
                </Link>
              </li>
              <li>
                <Link href="/resultaten" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Resultaten
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors text-sm">
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
                <a href="tel:+31610935077" className="text-gray-400 hover:text-white transition-colors text-sm">
                  +31 6 10 93 50 77
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <a
                  href="mailto:info@evotion-coaching.nl"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  info@evotion-coaching.nl
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  Friesland, Nederland
                </span>
              </li>
            </ul>
            <div className="mt-5">
              <Link
                href="/contact"
                className="inline-block bg-white text-black px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Neem Contact Op
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-8 pt-6">
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:justify-between">
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500 order-2 lg:order-1">
              <Link href="/privacybeleid" className="hover:text-white transition-colors">
                Privacybeleid
              </Link>
              <span className="text-gray-700">|</span>
              <Link href="/algemene-voorwaarden" className="hover:text-white transition-colors">
                Algemene Voorwaarden
              </Link>
              <span className="text-gray-700">|</span>
              <CookieSettingsButton />
            </div>
            
            {/* Copyright */}
            <p className="text-xs text-gray-500 order-1 lg:order-2">
              &copy; 2025 Evotion Coaching
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
