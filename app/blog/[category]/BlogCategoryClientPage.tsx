"use client"

import React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Search, Clock, ChevronRight, Utensils, Dumbbell, Brain, Moon, CalendarClock, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { blogArticles, type BlogCategory } from "@/data/blog-articles"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const categoryIcons: Record<string, React.ElementType> = {
  voeding: Utensils,
  training: Dumbbell,
  mindset: Brain,
  herstel: Moon,
  structuur: CalendarClock,
  verantwoordelijkheid: Shield,
}

interface BlogCategoryClientPageProps {
  category: BlogCategory
}

export function BlogCategoryClientPage({ category }: BlogCategoryClientPageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => { setIsLoaded(true) }, [])

  const Icon = categoryIcons[category.icon] || Shield

  const categoryArticles = blogArticles.filter((article) => {
    const matchesCategory = article.category.slug === category.slug
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* HERO - Paurs */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[#1e1839] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          <Link
            href="/blog"
            className="inline-flex items-center text-white/60 hover:text-white mb-8 transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Terug naar Blog
          </Link>

          <div className="max-w-3xl">
            <div className={`flex items-center gap-4 mb-6 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className={`w-14 h-14 ${category.color} rounded-xl flex items-center justify-center`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
            </div>
            
            <h1 className={`text-3xl md:text-5xl font-bold text-white mb-4 transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {category.name}
            </h1>
            
            <p className={`text-base md:text-lg text-white/70 max-w-xl leading-relaxed mb-8 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {category.description}
            </p>

            <div className={`max-w-md transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder={`Zoek in ${category.name.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-6 py-4 bg-white border-0 rounded-xl shadow-lg text-base"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ARTIKELEN - Wit */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <span className="text-sm text-gray-400">{categoryArticles.length} artikelen</span>
          </div>

          {categoryArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryArticles.map((article) => (
                <Link key={article.slug} href={`/blog/${article.category.slug}/${article.slug}`} className="group">
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-300 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className={`${article.category.color} text-white border-0 text-xs`}>
                        {article.category.name}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {article.readingTime} min
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-[#1e1839] mb-3 group-hover:text-[#1e1839]/70 transition-colors leading-tight line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow leading-relaxed">
                      {article.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>

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
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#1e1839] mb-2">Geen artikelen gevonden</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? "Probeer een andere zoekterm." : `Er zijn nog geen artikelen in ${category.name}.`}
              </p>
              {searchTerm && (
                <Button onClick={() => setSearchTerm("")} className="bg-[#1e1839] text-white rounded-xl">
                  Zoekterm wissen
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
            Hulp nodig bij {category.name.toLowerCase()}?
          </h2>
          <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto mb-10">
            Onze coaches helpen je met een persoonlijk plan op basis van jouw situatie.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-[#1e1839] hover:bg-gray-100 rounded-xl h-12 px-8 text-base font-semibold" asChild>
              <Link href="https://calendly.com/evotion/evotion-coaching" target="_blank" rel="noopener noreferrer">
                Gratis Adviesgesprek
              </Link>
            </Button>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent rounded-xl h-12 px-8 text-base font-semibold" asChild>
              <Link href="/online-coaching">Bekijk Online Coaching</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
