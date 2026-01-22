"use client"

import React from "react"

import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin, Instagram, Facebook, Linkedin, ChevronDown, MessageCircle } from "lucide-react"
import CookieSettingsButton from "./cookie-settings-button"
import { useState } from "react"

// Accordion component for mobile
function FooterAccordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="border-b border-gray-800 lg:border-none">
      {/* Mobile: Clickable header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 lg:hidden"
      >
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Desktop: Always visible header */}
      <h3 className="hidden lg:block text-lg font-semibold mb-4 text-white">{title}</h3>
      
      {/* Content */}
      <div className={`overflow-hidden transition-all duration-300 lg:overflow-visible lg:max-h-none ${
        isOpen ? 'max-h-96 pb-4' : 'max-h-0 lg:max-h-none'
      }`}>
        {children}
      </div>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="bg-[#1e1839] text-white">
      {/* Mobile Quick Actions - Only on mobile */}
      <div className="lg:hidden border-b border-white/10">
        <div className="container mx-auto px-6 py-6">
          <div className="grid grid-cols-3 gap-3">
            <a 
              href="tel:+31610935077"
              className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
            >
              <Phone className="w-5 h-5 text-white" />
              <span className="text-xs text-gray-300">Bellen</span>
            </a>
            <a 
              href="https://wa.me/31610935077"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 bg-green-600/20 rounded-xl hover:bg-green-600/30 transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-green-400" />
              <span className="text-xs text-green-300">WhatsApp</span>
            </a>
            <a 
              href="mailto:info@evotion-coaching.nl"
              className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
            >
              <Mail className="w-5 h-5 text-white" />
              <span className="text-xs text-gray-300">Email</span>
            </a>
          </div>
        </div>
      </div>

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

        {/* Desktop Grid / Mobile Accordions */}
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Logo en Beschrijving - Desktop only */}
          <div className="hidden lg:block space-y-4">
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
          <FooterAccordion title="Services">
            <ul className="space-y-3 lg:space-y-2">
              <li>
                <Link href="/personal-training" className="text-gray-400 hover:text-white transition-colors text-sm block py-1 lg:py-0">
                  Personal Training
                </Link>
              </li>
              <li>
                <Link href="/online-coaching" className="text-gray-400 hover:text-white transition-colors text-sm block py-1 lg:py-0">
                  Online Coaching
                </Link>
              </li>
              <li>
                <Link href="/duo-training" className="text-gray-400 hover:text-white transition-colors text-sm block py-1 lg:py-0">
                  Duo Training
                </Link>
              </li>
              <li>
                <Link href="/gratis/caloriebehoefte" className="text-gray-400 hover:text-white transition-colors text-sm block py-1 lg:py-0">
                  Gratis Calorie Calculator
                </Link>
              </li>
            </ul>
          </FooterAccordion>

          {/* Over Ons */}
          <FooterAccordion title="Over Ons">
            <ul className="space-y-3 lg:space-y-2">
              <li>
                <Link href="/over-ons" className="text-gray-400 hover:text-white transition-colors text-sm block py-1 lg:py-0">
                  Ons Verhaal
                </Link>
              </li>
              <li>
                <Link href="/over-ons/coaches" className="text-gray-400 hover:text-white transition-colors text-sm block py-1 lg:py-0">
                  Onze Coaches
                </Link>
              </li>
              <li>
                <Link href="/resultaten" className="text-gray-400 hover:text-white transition-colors text-sm block py-1 lg:py-0">
                  Resultaten
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors text-sm block py-1 lg:py-0">
                  Blog
                </Link>
              </li>
            </ul>
          </FooterAccordion>

          {/* Contact - Desktop */}
          <div className="hidden lg:block">
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
                className="inline-block bg-white text-[#1e1839] px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
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
