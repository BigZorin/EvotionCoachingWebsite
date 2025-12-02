"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dumbbell,
  Users,
  Menu,
  ChevronDown,
  X,
  Target,
  Users2,
  Smartphone,
  BookOpen,
  Calculator,
  Utensils,
  Monitor,
} from "lucide-react"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  const toggleMobileSubmenu = (menu: string) => {
    if (expandedMobileMenu === menu) {
      setExpandedMobileMenu(null)
    } else {
      setExpandedMobileMenu(menu)
    }
  }

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path)
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 lg:px-6 h-16 md:h-20 flex items-center justify-between max-w-7xl">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/evotion-logo.png"
              alt="Evotion Coaching"
              width={160}
              height={50}
              className="h-8 md:h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-8">
              {/* Coaching Dropdown */}
              <div className="relative group">
                <button className="text-gray-700 hover:text-primary transition-colors font-medium text-base px-3 py-2 rounded-lg hover:bg-primary/5 flex items-center gap-1">
                  Coaching
                  <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="p-2">
                    <Link
                      href="/personal-training"
                      className={`block px-4 py-3 text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors font-medium ${
                        isActive("/personal-training") ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Dumbbell className="w-4 h-4 text-primary" />
                        <div>
                          <div className="font-semibold">Personal Training</div>
                          <div className="text-xs text-gray-500">1-op-1 begeleiding</div>
                        </div>
                      </div>
                    </Link>
                    <Link
                      href="/duo-training"
                      className={`block px-4 py-3 text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors font-medium ${
                        isActive("/duo-training") ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-primary" />
                        <div>
                          <div className="font-semibold">Duo Training</div>
                          <div className="text-xs text-gray-500">Train samen met een partner</div>
                        </div>
                      </div>
                    </Link>
                    <Link
                      href="/online-coaching"
                      className={`block px-4 py-3 text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors font-medium ${
                        isActive("/online-coaching") ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Monitor className="w-4 h-4 text-primary" />
                        <div>
                          <div className="font-semibold">Online Begeleiding</div>
                          <div className="text-xs text-gray-500">Flexibele coaching op afstand</div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* OverOns Dropdown */}
              <div className="relative group">
                <button className="text-gray-700 hover:text-primary transition-colors font-medium text-base px-3 py-2 rounded-lg hover:bg-primary/5 flex items-center gap-1">
                  Over Ons
                  <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="p-2">
                    <Link
                      href="/over-ons/visie-missie"
                      className={`block px-4 py-3 text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors font-medium ${
                        isActive("/over-ons/visie-missie") ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Target className="w-4 h-4 text-primary" />
                        <div>
                          <div className="font-semibold">Visie & Missie</div>
                          <div className="text-xs text-gray-500">Onze doelstellingen</div>
                        </div>
                      </div>
                    </Link>
                    <Link
                      href="/over-ons/kernwaarden"
                      className={`block px-4 py-3 text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors font-medium ${
                        isActive("/over-ons/kernwaarden") ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <div>
                          <div className="font-semibold">Kernwaarden</div>
                          <div className="text-xs text-gray-500">Waar wij voor staan</div>
                        </div>
                      </div>
                    </Link>
                    <Link
                      href="/over-ons/coaches"
                      className={`block px-4 py-3 text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors font-medium ${
                        isActive("/over-ons/coaches") ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Users2 className="w-4 h-4 text-primary" />
                        <div>
                          <div className="font-semibold">Coaches</div>
                          <div className="text-xs text-gray-500">Ons team</div>
                        </div>
                      </div>
                    </Link>
                    <Link
                      href="/over-ons/evotion-app"
                      className={`block px-4 py-3 text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors font-medium ${
                        isActive("/over-ons/evotion-app") ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-4 h-4 text-primary" />
                        <div>
                          <div className="font-semibold">Evotion Coaching App</div>
                          <div className="text-xs text-gray-500">Onze technologie</div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Gratis Dropdown */}
              <div className="relative group">
                <button className="text-gray-700 hover:text-primary transition-colors font-medium text-base px-3 py-2 rounded-lg hover:bg-primary/5 flex items-center gap-1">
                  Gratis
                  <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="p-2">
                    <Link
                      href="/blog"
                      className={`block px-4 py-3 text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors font-medium ${
                        isActive("/blog") ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <div>
                          <div className="font-semibold">Blog</div>
                          <div className="text-xs text-gray-500">Gratis fitness & voeding tips</div>
                        </div>
                      </div>
                    </Link>
                    <a
                      href="https://voedingvervanger.evotion-coaching.nl/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-3 text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors font-medium"
                    >
                      <div className="flex items-center gap-3">
                        <Utensils className="w-4 h-4 text-primary" />
                        <div className="flex-1">
                          <div className="font-semibold">Voedingsvervanger</div>
                          <div className="text-xs text-gray-500">Gratis tool</div>
                        </div>
                      </div>
                    </a>
                    <Link
                      href="/gratis/caloriebehoefte"
                      className={`block px-4 py-3 text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors font-medium ${
                        isActive("/gratis/caloriebehoefte") ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Calculator className="w-4 h-4 text-primary" />
                        <div>
                          <div className="font-semibold">Caloriebehoefte Berekenen</div>
                          <div className="text-xs text-gray-500">Gratis calculator</div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              <Link
                href="/resultaten"
                className={`text-gray-700 hover:text-primary transition-colors font-medium text-base px-3 py-2 rounded-lg hover:bg-primary/5 ${isActive("/resultaten") ? "text-primary bg-primary/5" : ""}`}
              >
                Resultaten
              </Link>
              <Link
                href="/contact"
                className={`text-gray-700 hover:text-primary transition-colors font-medium text-base px-3 py-2 rounded-lg hover:bg-primary/5 ${isActive("/contact") ? "text-primary bg-primary/5" : ""}`}
              >
                Contact
              </Link>
            </div>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button
              size="sm"
              className="text-white hover:bg-primary/90 shadow-sm hover:shadow-md px-4 py-2 rounded-lg transition-all duration-200 bg-[rgba(30,24,57,1)]"
              asChild
            >
              <Link href="https://calendly.com/evotion/evotion-coaching" target="_blank" rel="noopener noreferrer">
                Gratis Kennismakingsgesprek
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Menu Panel */}
          <div className="absolute top-0 right-0 w-full max-w-sm h-full bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white shrink-0">
              <Image
                src="/images/evotion-logo.png"
                alt="Evotion Coaching"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto overscroll-contain">
              <div className="px-4 py-6 space-y-1">
                {/* Home Link */}
                <Link
                  href="/"
                  className={`block text-gray-700 hover:text-primary hover:bg-primary/5 transition-all duration-200 font-semibold text-base py-3.5 px-4 rounded-xl ${
                    pathname === "/" ? "bg-primary/10 text-primary" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>

                {/* Coaching Dropdown */}
                <div className="py-1">
                  <button
                    className="flex items-center justify-between w-full text-gray-700 hover:text-primary hover:bg-primary/5 transition-all duration-200 font-semibold text-base py-3.5 px-4 rounded-xl"
                    onClick={() => toggleMobileSubmenu("coaching")}
                  >
                    <span>Coaching</span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        expandedMobileMenu === "coaching" ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedMobileMenu === "coaching" ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pl-3 pr-1 space-y-1 mt-1">
                      <Link
                        href="/personal-training"
                        className={`flex items-center gap-3 text-gray-700 hover:text-primary hover:bg-primary/5 transition-all duration-200 py-3 px-4 rounded-xl ${
                          isActive("/personal-training") ? "bg-primary/10 text-primary" : ""
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Dumbbell className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm">Personal Training</div>
                          <div className="text-xs text-gray-500 truncate">1-op-1 begeleiding</div>
                        </div>
                      </Link>
                      <Link
                        href="/duo-training"
                        className={`flex items-center gap-3 text-gray-700 hover:text-primary hover:bg-primary/5 transition-all duration-200 py-3 px-4 rounded-xl ${
                          isActive("/duo-training") ? "bg-primary/10 text-primary" : ""
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Users className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm">Duo Training</div>
                          <div className="text-xs text-gray-500 truncate">Train samen met een partner</div>
                        </div>
                      </Link>
                      <Link
                        href="/online-coaching"
                        className={`flex items-center gap-3 text-gray-700 hover:text-primary hover:bg-primary/5 transition-all duration-200 py-3 px-4 rounded-xl ${
                          isActive("/online-coaching") ? "bg-primary/10 text-primary" : ""
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Monitor className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm">Online Begeleiding</div>
                          <div className="text-xs text-gray-500 truncate">Flexibele coaching op afstand</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* OverOns Dropdown */}
                <div className="py-1">
                  <button
                    className="flex items-center justify-between w-full text-gray-700 hover:text-primary hover:bg-primary/5 transition-all duration-200 font-semibold text-base py-3.5 px-4 rounded-xl"
                    onClick={() => toggleMobileSubmenu("over-ons")}
                  >
                    <span>Over Ons</span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        expandedMobileMenu === "over-ons" ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedMobileMenu === "over-ons" ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pl-3 pr-1 space-y-1 mt-1">
                      <Link
                        href="/over-ons/visie-missie"
                        className={`flex items-center gap-3 text-gray-700 hover:text-primary hover:bg-primary/5 transition-all duration-200 py-3 px-4 rounded-xl ${
                          isActive("/over-ons/visie-missie") ? "bg-primary/10 text-primary" : ""
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Target className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm">Visie & Missie</div>
                          <div className="text-xs text-gray-500 truncate">Onze doelstellingen</div>
                        </div>
                      </Link>
                      <Link
                        href="/over-ons/kernwaarden"
                        className={`flex items-center gap-3 text-gray-700 hover:text-primary hover:bg-primary/5 transition-all duration-200 py-3 px-4 rounded-xl ${
                          isActive("/over-ons/kernwaarden") ? "bg-primary/10 text-primary" : ""
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <BookOpen className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm">Kernwaarden</div>
                          <div className="text-xs text-gray-500 truncate">Waar wij voor staan</div>
                        </div>
                      </Link>
                      <Link
                        href="/over-ons/coaches"
                        className={`flex items-center gap-3 text-gray-700 hover:text-primary hover:bg-primary/5 transition-all duration-200 py-3 px-4 rounded-xl ${
                          isActive("/over-ons/coaches") ? "bg-primary/10 text-primary" : ""
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Users2 className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm">Coaches</div>
                          <div className="text-xs text-gray-500 truncate">Ons team</div>
                        </div>
                      </Link>
                      <Link
                        href="/over-ons/evotion-app"
                        className={`flex items-center gap-3 text-gray-700 hover:text-primary hover:bg-primary/5 transition-all duration-200 py-3 px-4 rounded-xl ${
                          isActive("/over-ons/evotion-app") ? "bg-primary/10 text-primary" : ""
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Smartphone className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm">Evotion Coaching App</div>
                          <div className="text-xs text-gray-500 truncate">Onze technologie</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Gratis Dropdown */}
                <div className="py-1">
                  <button
                    className="flex items-center justify-between w-full text-gray-700 hover:text-primary hover:bg-primary/5 transition-all duration-200 font-semibold text-base py-3.5 px-4 rounded-xl"
                    onClick={() => toggleMobileSubmenu("gratis")}
                  >
                    <span>Gratis</span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        expandedMobileMenu === "gratis" ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedMobileMenu === "gratis" ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pl-3 pr-1 space-y-1 mt-1">
                      <Link
                        href="/blog"
                        className={`flex items-center gap-3 text-gray-700 hover:text-primary hover:bg-primary/5 transition-all duration-200 py-3 px-4 rounded-xl ${
                          isActive("/blog") ? "bg-primary/10 text-primary" : ""
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <BookOpen className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm">Blog</div>
                          <div className="text-xs text-gray-500 truncate">Gratis fitness & voeding tips</div>
                        </div>
                      </Link>
                      <a
                        href="https://voedingvervanger.evotion-coaching.nl/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-700 hover:text-primary hover:bg-primary/5 transition-all duration-200 py-3 px-4 rounded-xl"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Utensils className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm">Voedingsvervanger</div>
                          <div className="text-xs text-gray-500 truncate">Gratis tool</div>
                        </div>
                      </a>
                      <Link
                        href="/gratis/caloriebehoefte"
                        className={`flex items-center gap-3 text-gray-700 hover:text-primary hover:bg-primary/5 transition-all duration-200 py-3 px-4 rounded-xl ${
                          isActive("/gratis/caloriebehoefte") ? "bg-primary/10 text-primary" : ""
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Calculator className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm">Caloriebehoefte Berekenen</div>
                          <div className="text-xs text-gray-500 truncate">Gratis calculator</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Resultaten Link */}
                <Link
                  href="/resultaten"
                  className={`block text-gray-700 hover:text-primary hover:bg-primary/5 transition-all duration-200 font-semibold text-base py-3.5 px-4 rounded-xl ${
                    isActive("/resultaten") ? "bg-primary/10 text-primary" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Resultaten
                </Link>

                {/* Contact Link */}
                <Link
                  href="/contact"
                  className={`block text-gray-700 hover:text-primary hover:bg-primary/5 transition-all duration-200 font-semibold text-base py-3.5 px-4 rounded-xl ${
                    isActive("/contact") ? "bg-primary/10 text-primary" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
            </nav>

            {/* Mobile CTA Button */}
            <div className="shrink-0 p-4 border-t border-gray-100 bg-white">
              <Button
                size="lg"
                className="w-full text-white hover:bg-primary/90 shadow-lg hover:shadow-xl px-6 py-6 rounded-xl transition-all duration-200 bg-[rgba(30,24,57,1)] font-semibold text-base"
                asChild
              >
                <Link
                  href="https://calendly.com/evotion/evotion-coaching"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Gratis Kennismakingsgesprek
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
