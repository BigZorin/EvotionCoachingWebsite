"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Search, Clock, ArrowRight, ChevronRight, Utensils, Dumbbell, Brain, Moon, CalendarClock, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { blogCategories, blogArticles } from "@/data/blog-articles"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

const categoryIcons: Record<string, React.ElementType> = {
  voeding: Utensils,
  training: Dumbbell,
  mindset: Brain,
  herstel: Moon,
  structuur: CalendarClock,
  verantwoordelijkheid: Shield,
}

export function BlogClientPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [activePillar, setActivePillar] = useState(0)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePillar((prev) => (prev + 1) % blogCategories.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const filteredArticles = blogArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = !selectedCategory || article.category.slug === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredArticle = blogArticles.find((article) => article.featured)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* HERO - Paars */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[#1e1839] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-4 py-2 mb-6">
                Kennis & Inzichten
              </Badge>
            </div>
            
            <h1 className={`text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Evotion Blog
            </h1>
            
            <p className={`text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed mb-10 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Evidence-based artikelen over voeding, training, mindset en meer. Gebouwd op de 6 pijlers van Evotion.
            </p>

            {/* Search */}
            <div className={`max-w-xl mx-auto transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Zoek artikelen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-6 py-4 bg-white border-0 rounded-xl shadow-lg text-base"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PIJLERS / CATEGORIEEN - Wit */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-[#1e1839] mb-4">
              Onze 6 Pijlers
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Elk artikel is geworteld in een van de zes pijlers van onze aanpak.
            </p>
          </div>

          {/* Mobile: Horizontal scroll chips + expandable */}
          <div className="lg:hidden">
            <div className="flex gap-2 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
              {blogCategories.map((cat) => {
                const Icon = categoryIcons[cat.icon] || Shield
                const isSelected = selectedCategory === cat.slug
                return (
                  <button
                    type="button"
                    key={cat.slug}
                    onClick={() => setSelectedCategory(isSelected ? null : cat.slug)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border whitespace-nowrap transition-all flex-shrink-0 ${
                      isSelected
                        ? 'bg-[#1e1839] text-white border-[#1e1839]'
                        : 'bg-white text-[#1e1839] border-gray-200'
                    }`}
                  >
                    <div className={`w-7 h-7 ${isSelected ? 'bg-white/20' : cat.color} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-white'}`} />
                    </div>
                    <span className="text-sm font-medium">{cat.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Desktop: Grid */}
          <div className="hidden lg:grid grid-cols-3 gap-5">
            {blogCategories.map((cat) => {
              const Icon = categoryIcons[cat.icon] || Shield
              const articleCount = blogArticles.filter((a) => a.category.slug === cat.slug).length
              const isSelected = selectedCategory === cat.slug
              return (
                <button
                  type="button"
                  key={cat.slug}
                  onClick={() => setSelectedCategory(isSelected ? null : cat.slug)}
                  className={`text-left bg-white rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg group ${
                    isSelected ? 'border-[#1e1839] shadow-lg ring-1 ring-[#1e1839]' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${cat.color} rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-gray-400 font-medium">{articleCount} artikelen</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1e1839] mb-2">{cat.name}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{cat.description}</p>
                </button>
              )
            })}
          </div>

          {selectedCategory && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="text-sm text-gray-500 hover:text-[#1e1839] transition-colors underline"
              >
                Filter wissen
              </button>
            </div>
          )}
        </div>
      </section>

      {/* FEATURED ARTIKEL - Paars */}
      {featuredArticle && !searchTerm && !selectedCategory && (
        <section className="py-20 lg:py-28 bg-[#1e1839]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <Badge className="bg-white/10 text-white border-white/20 px-4 py-2 mb-4">
                Uitgelicht
              </Badge>
              <h2 className="text-2xl md:text-4xl font-bold text-white">
                Laatst gepubliceerd
              </h2>
            </div>

            <Link href={`/blog/${featuredArticle.category.slug}/${featuredArticle.slug}`} className="group block max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl p-8 lg:p-10 hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.01]">
                <div className="flex items-center gap-3 mb-6">
                  {(() => {
                    const Icon = categoryIcons[featuredArticle.category.icon] || Shield
                    return (
                      <div className={`w-10 h-10 ${featuredArticle.category.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    )
                  })()}
                  <Badge className={`${featuredArticle.category.color} text-white border-0`}>
                    {featuredArticle.category.name}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-400 ml-auto">
                    <Clock className="w-4 h-4" />
                    {featuredArticle.readingTime} min
                  </div>
                </div>
                
                <h3 className="text-xl md:text-3xl font-bold text-[#1e1839] mb-4 group-hover:text-[#1e1839]/80 transition-colors leading-tight">
                  {featuredArticle.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-6">
                  {featuredArticle.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {featuredArticle.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs border-gray-200 text-gray-500">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    {new Date(featuredArticle.publishedAt).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                  <div className="flex items-center text-[#1e1839] font-semibold group-hover:gap-3 gap-2 transition-all">
                    Lees artikel
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ALLE ARTIKELEN - Wit */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-[#1e1839]">
              {selectedCategory
                ? blogCategories.find((c) => c.slug === selectedCategory)?.name || "Artikelen"
                : "Alle Artikelen"}
            </h2>
            <span className="text-sm text-gray-400">{filteredArticles.length} artikelen</span>
          </div>

          {filteredArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => {
                const Icon = categoryIcons[article.category.icon] || Shield
                return (
                  <Link key={article.slug} href={`/blog/${article.category.slug}/${article.slug}`} className="group">
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-300 h-full flex flex-col">
                      {/* Category & Time */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 ${article.category.color} rounded-lg flex items-center justify-center`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-500">{article.category.name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          {article.readingTime} min
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-[#1e1839] mb-3 group-hover:text-[#1e1839]/70 transition-colors leading-tight line-clamp-2 flex-grow-0">
                        {article.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow leading-relaxed">
                        {article.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {article.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                        <span className="text-xs text-gray-400">
                          {new Date(article.publishedAt).toLocaleDateString("nl-NL")}
                        </span>
                        <div className="flex items-center text-sm font-medium text-[#1e1839] group-hover:gap-2 gap-1 transition-all">
                          Lees meer
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#1e1839] mb-2">Geen artikelen gevonden</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? "Probeer een andere zoekterm." : "Er zijn nog geen artikelen in deze categorie."}
              </p>
              {(searchTerm || selectedCategory) && (
                <Button
                  onClick={() => { setSearchTerm(""); setSelectedCategory(null) }}
                  className="bg-[#1e1839] text-white rounded-xl"
                >
                  Filters wissen
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA - Paars */}
      <section className="py-20 lg:py-28 bg-[#1e1839]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
            Kennis in de praktijk brengen?
          </h2>
          <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto mb-10">
            Onze coaches helpen je om deze inzichten toe te passen in een persoonlijk plan dat bij jou past.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-white text-[#1e1839] hover:bg-gray-100 rounded-xl h-12 px-8 text-base font-semibold"
              asChild
            >
              <Link href="https://calendly.com/evotion/evotion-coaching" target="_blank" rel="noopener noreferrer">
                Gratis Adviesgesprek
              </Link>
            </Button>
            <Button
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 bg-transparent rounded-xl h-12 px-8 text-base font-semibold"
              asChild
            >
              <Link href="/online-coaching">
                Bekijk Online Coaching
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
