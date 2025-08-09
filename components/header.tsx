"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dumbbell,
  Users,
  Heart,
  TrendingUp,
  Menu,
  ChevronDown,
  X,
  Target,
  Users2,
  Smartphone,
  BookOpen,
} from "lucide-react"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null)
  const pathname = usePathname()

  const toggleMobileSubmenu = (menu: string) => {
    if (expandedMobileMenu === menu) {
      setExpandedMobileMenu(null)
    } else {
      setExpandedMobileMenu(menu)
    }
  }

  const isActive = (path: string) => {
    return pathname === path
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
                      href="/online-coaching"
                      className={`block px-4 py-3 text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors font-medium ${
                        isActive("/online-coaching") ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-primary" />
                        <div>
                          <div className="font-semibold">Online Coaching</div>
                          <div className="text-xs text-gray-500">Flexibele coaching</div>
                        </div>
                      </div>
                    </Link>
                    <Link
                      href="/premium-coaching"
                      className={`block px-4 py-3 text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors font-medium ${
                        isActive("/premium-coaching") ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Heart className="w-4 h-4 text-primary" />
                        <div>
                          <div className="font-semibold">Premium Coaching</div>
                          <div className="text-xs text-gray-500">Complete begeleiding</div>
                        </div>
                      </div>
                    </Link>
                    <Link
                      href="/12-weken-vetverlies"
                      className={`block px-4 py-3 text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors font-medium ${
                        isActive("/12-weken-vetverlies") ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <div>
                          <div className="font-semibold">12-Weken Vetverlies</div>
                          <div className="text-xs text-gray-500">Intensief programma</div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Over Ons Dropdown */}
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
                    <a
                      href="https://voedingvervanger.evotion-coaching.nl/"
                      className="block px-4 py-3 text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors font-medium"
                    >
                      <div className="flex items-center gap-3">
                        <Heart className="w-4 h-4 text-[#1e1839]" />
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
                        <Target className="w-4 h-4 text-[#1e1839]" />
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
                href="/resultaten" // Aangepast naar de nieuwe pagina
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
              variant="ghost"
              size="sm"
              className="text-gray-700 hover:text-primary hover:bg-primary/10 border border-gray-200 hover:border-primary/30 px-4 py-2 rounded-lg transition-all duration-200"
              asChild
            >
              <a href="https://klanten.evotion-coaching.nl" target="_blank" rel="noopener noreferrer">
                <Users className="h-4 w-4 mr-2" />
                <span className="font-medium">Mijn Account</span>
              </a>
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 font-semibold text-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
              Gratis Consult
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
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Menu Panel */}
          <div className="absolute top-0 right-0 w-full max-w-sm h-full bg-white shadow-2xl transform transition-transform duration-300 overflow-y-auto">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
                <Image
                  src="/images/evotion-logo.png"
                  alt="Evotion Coaching"
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                />
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 px-4 py-6 overflow-y-auto">
                <div className="space-y-2">
                  {/* Home Link */}
                  <Link
                    href="/"
                    className="block text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors font-medium text-base py-3 px-3 rounded-lg border-b border-gray-100 mb-4"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>

                  {/* Coaching Dropdown */}
                  <div className="border-b border-gray-100 pb-4 mb-4">
                    <button
                      className="flex items-center justify-between w-full text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors font-medium text-base py-3 px-3 rounded-lg"
                      onClick={() => toggleMobileSubmenu("coaching")}
                    >
                      <span>Coaching</span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-200 ${
                          expandedMobileMenu === "coaching" ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {expandedMobileMenu === "coaching" && (
                      <div className="pl-2 space-y-1 mt-2">
                        <Link
                          href="/personal-training"
                          className={`flex items-center gap-3 text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors py-3 px-3 rounded-lg text-sm ${
                            isActive("/personal-training") ? "bg-primary/5" : ""
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Dumbbell className="w-4 h-4 text-primary" />
                          <div>
                            <div className="font-medium">Personal Training</div>
                            <div className="text-xs text-gray-500">1-op-1 begeleiding</div>
                          </div>
                        </Link>
                        <Link
                          href="/online-coaching"
                          className={`flex items-center gap-3 text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors py-3 px-3 rounded-lg text-sm ${
                            isActive("/online-coaching") ? "bg-primary/5" : ""
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Users className="w-4 h-4 text-primary" />
                          <div>
                            <div className="font-medium">Online Coaching</div>
                            <div className="text-xs text-gray-500">Flexibele coaching</div>
                          </div>
                        </Link>
                        <Link
                          href="/premium-coaching"
                          className={`flex items-center gap-3 text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors py-3 px-3 rounded-lg text-sm ${
                            isActive("/premium-coaching") ? "bg-primary/5" : ""
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Heart className="w-4 h-4 text-primary" />
                          <div>
                            <div className="font-medium">Premium Coaching</div>
                            <div className="text-xs text-gray-500">Complete begeleiding</div>
                          </div>
                        </Link>
                        <Link
                          href="/12-weken-vetverlies"
                          className={`flex items-center gap-3 text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors py-3 px-3 rounded-lg text-sm ${
                            isActive("/12-weken-vetverlies") ? "bg-primary/5" : ""
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <TrendingUp className="w-4 h-4 text-primary" />
                          <div>
                            <div className="font-medium">12-Weken Vetverlies</div>
                            <div className="text-xs text-gray-500">Intensief programma</div>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Over Ons Dropdown */}
                  <div className="border-b border-gray-100 pb-4 mb-4">
                    <button
                      className="flex items-center justify-between w-full text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors font-medium text-base py-3 px-3 rounded-lg"
                      onClick={() => toggleMobileSubmenu("over-ons")}
                    >
                      <span>Over Ons</span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-200 ${
                          expandedMobileMenu === "over-ons" ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {expandedMobileMenu === "over-ons" && (
                      <div className="pl-2 space-y-1 mt-2">
                        <Link
                          href="/over-ons/visie-missie"
                          className={`flex items-center gap-3 text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors py-3 px-3 rounded-lg text-sm ${
                            isActive("/over-ons/visie-missie") ? "bg-primary/5" : ""
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Target className="w-4 h-4 text-primary" />
                          <div>
                            <div className="font-medium">Visie & Missie</div>
                            <div className="text-xs text-gray-500">Onze doelstellingen</div>
                          </div>
                        </Link>
                        <Link
                          href="/over-ons/kernwaarden"
                          className={`flex items-center gap-3 text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors py-3 px-3 rounded-lg text-sm ${
                            isActive("/over-ons/kernwaarden") ? "bg-primary/5" : ""
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <BookOpen className="w-4 h-4 text-primary" />
                          <div>
                            <div className="font-medium">Kernwaarden</div>
                            <div className="text-xs text-gray-500">Waar wij voor staan</div>
                          </div>
                        </Link>
                        <Link
                          href="/over-ons/coaches"
                          className={`flex items-center gap-3 text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors py-3 px-3 rounded-lg text-sm ${
                            isActive("/over-ons/coaches") ? "bg-primary/5" : ""
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Users2 className="w-4 h-4 text-primary" />
                          <div>
                            <div className="font-medium">Coaches</div>
                            <div className="text-xs text-gray-500">Ons team</div>
                          </div>
                        </Link>
                        <Link
                          href="/over-ons/evotion-app"
                          className={`flex items-center gap-3 text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors py-3 px-3 rounded-lg text-sm ${
                            isActive("/over-ons/evotion-app") ? "bg-primary/5" : ""
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Smartphone className="w-4 h-4 text-primary" />
                          <div>
                            <div className="font-medium">Evotion Coaching App</div>
                            <div className="text-xs text-gray-500">Onze technologie</div>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Gratis Dropdown */}
                  <div className="border-b border-gray-100 pb-4 mb-4">
                    <button
                      className="flex items-center justify-between w-full text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors font-medium text-base py-3 px-3 rounded-lg"
                      onClick={() => toggleMobileSubmenu("gratis")}
                    >
                      <span>Gratis</span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-200 ${
                          expandedMobileMenu === "gratis" ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {expandedMobileMenu === "gratis" && (
                      <div className="pl-2 space-y-1 mt-2">
                        <a
                          href="https://voedingvervanger.evotion-coaching.nl/"
                          className="flex items-center gap-3 text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors py-3 px-3 rounded-lg text-sm"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Heart className="w-4 h-4 text-[#1e1839]" />
                          <div className="flex-1">
                            <div className="font-medium">Voedingsvervanger</div>
                            <div className="text-xs text-gray-500">Gratis tool</div>
                          </div>
                        </a>
                        <Link
                          href="/gratis/caloriebehoefte"
                          className={`flex items-center gap-3 text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors py-3 px-3 rounded-lg text-sm ${
                            isActive("/gratis/caloriebehoefte") ? "bg-primary/5" : ""
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Target className="w-4 h-4 text-[#1e1839]" />
                          <div>
                            <div className="font-medium">Caloriebehoefte Berekenen</div>
                            <div className="text-xs text-gray-500">Gratis calculator</div>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>

                  <Link
                    href="/resultaten" // Aangepast naar de nieuwe pagina
                    className={`block text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors font-medium text-base py-3 px-3 rounded-lg border-b border-gray-100 mb-2 ${isActive("/resultaten") ? "bg-primary/5 text-primary" : ""}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Resultaten
                  </Link>
                  <Link
                    href="/contact"
                    className={`block text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors font-medium text-base py-3 px-3 rounded-lg ${isActive("/contact") ? "bg-primary/5 text-primary" : ""}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </div>
              </nav>

              {/* Mobile CTA Buttons */}
              <div className="p-4 space-y-3 border-t border-gray-100 bg-white">
                <Button
                  variant="ghost"
                  className="w-full text-gray-700 hover:text-primary hover:bg-primary/10 border border-gray-200 hover:border-primary/30 py-3 text-sm font-medium justify-start transition-all duration-200"
                  asChild
                >
                  <a
                    href="https://klanten.evotion-coaching.nl"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center w-full"
                  >
                    <Users className="h-4 w-4 mr-3" />
                    Mijn Account
                  </a>
                </Button>
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-sm font-semibold border border-primary hover:border-primary/80 transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Start Nu
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
