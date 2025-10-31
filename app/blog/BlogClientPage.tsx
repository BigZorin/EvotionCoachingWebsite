"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  Target,
  Users,
  TrendingUp,
  Award,
  Lightbulb,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { blogCategories, blogArticles } from "@/data/blog-articles"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import Image from "next/image"

export function BlogClientPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Filter artikelen op basis van zoekterm en categorie
  const filteredArticles = blogArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = !selectedCategory || article.category.slug === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Enhanced Hero Section - Mobile Optimized */}
      <section className="relative pt-16 md:pt-20 py-16 md:py-24 px-4 bg-gradient-to-br from-[#1e1839] via-[#2d1b69] to-[#1e1839] overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 md:top-20 left-5 md:left-10 w-20 md:w-32 h-20 md:h-32 bg-[#bad4e1] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 md:bottom-20 right-5 md:right-10 w-24 md:w-40 h-24 md:h-40 bg-[#bad4e1] rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 md:w-64 h-32 md:h-64 bg-[#bad4e1] rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center text-white z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 md:px-6 py-2 md:py-3 mb-6 md:mb-8 border border-white/20">
            <BookOpen className="w-4 md:w-5 h-4 md:h-5 text-[#bad4e1]" />
            <span className="text-xs md:text-sm font-semibold tracking-wide">EXPERT KNOWLEDGE HUB</span>
          </div>

          {/* Main Heading - Mobile Responsive */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 md:mb-8 leading-tight">
            <span className="block">Fitness & Voeding</span>
            <span className="block bg-gradient-to-r from-[#bad4e1] via-white to-[#bad4e1] bg-clip-text text-transparent">
              Expert Blog
            </span>
          </h1>

          {/* Subtitle - Mobile Responsive */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 text-gray-200 max-w-4xl mx-auto leading-relaxed px-4">
            Ontdek bewezen strategieën voor <span className="text-[#bad4e1] font-semibold">afvallen</span>,
            <span className="text-[#bad4e1] font-semibold"> spieropbouw</span> en een
            <span className="text-[#bad4e1] font-semibold"> gezonde levensstijl</span>. Geschreven door onze
            gecertificeerde Evotion Coaches.
          </p>

          {/* Stats Grid - Mobile Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12 max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-2 md:gap-3 bg-white/5 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10">
              <div className="w-10 md:w-12 h-10 md:h-12 bg-[#bad4e1]/20 rounded-full flex items-center justify-center">
                <Target className="w-5 md:w-6 h-5 md:h-6 text-[#bad4e1]" />
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-[#bad4e1]">100+</div>
                <div className="text-xs md:text-sm text-gray-300">Expert Tips</div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 md:gap-3 bg-white/5 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10">
              <div className="w-10 md:w-12 h-10 md:h-12 bg-[#bad4e1]/20 rounded-full flex items-center justify-center">
                <Award className="w-5 md:w-6 h-5 md:h-6 text-[#bad4e1]" />
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-[#bad4e1]">5+ Jaar</div>
                <div className="text-xs md:text-sm text-gray-300">Ervaring</div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 md:gap-3 bg-white/5 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10">
              <div className="w-10 md:w-12 h-10 md:h-12 bg-[#bad4e1]/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 md:w-6 h-5 md:h-6 text-[#bad4e1]" />
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-[#bad4e1]">1000+</div>
                <div className="text-xs md:text-sm text-gray-300">Transformaties</div>
              </div>
            </div>
          </div>

          {/* Enhanced Search Bar - Mobile Responsive */}
          <div className="max-w-lg mx-auto mb-6 md:mb-8 px-4">
            <div className="relative">
              <Search className="absolute left-4 md:left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 md:w-6 h-5 md:h-6" />
              <Input
                type="text"
                placeholder="Zoek naar artikelen, tips of onderwerpen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 md:pl-14 pr-4 md:pr-6 py-4 md:py-5 text-base md:text-lg bg-white/95 backdrop-blur-sm border-0 rounded-xl md:rounded-2xl shadow-2xl focus:ring-4 focus:ring-[#bad4e1]/30 focus:shadow-2xl transition-all duration-300"
              />
            </div>
          </div>

          {/* CTA Buttons - Mobile Responsive */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
            <Button
              size="lg"
              className="bg-[#bad4e1] hover:bg-[#bad4e1]/90 text-[#1e1839] rounded-full px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link href="#categories">
                <Lightbulb className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                Ontdek Expertise
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-[#1e1839] bg-transparent rounded-full px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link href="/contact">
                Gratis Consult
                <ArrowRight className="w-4 md:w-5 h-4 md:h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        {/* Categories Section - Mobile Optimized */}
        <section id="categories" className="mb-12 md:mb-16">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1e1839] mb-4 md:mb-6">
              Expertise Gebieden
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Van wetenschappelijk onderbouwde voedingstips tot praktische trainingsschema's - alles wat je nodig hebt
              voor jouw transformatie
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 max-w-6xl mx-auto">
            {blogCategories.map((category, index) => (
              <Link key={category.slug} href={`/blog/${category.slug}`} className="group">
                <Card className="h-full hover:shadow-2xl transition-all duration-500 group-hover:scale-105 border-0 bg-white shadow-lg hover:shadow-[#bad4e1]/20">
                  <CardHeader className="text-center pb-4 md:pb-6">
                    <div
                      className={`w-16 md:w-20 h-16 md:h-20 ${category.color} rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-3xl mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg text-white`}
                    >
                      {category.icon}
                    </div>
                    <CardTitle className="text-lg md:text-xl font-bold text-[#1e1839] group-hover:text-[#bad4e1] transition-colors">
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-sm md:text-base text-gray-600 leading-relaxed mb-4 md:mb-6">
                      {category.description}
                    </CardDescription>
                    <div className="flex items-center justify-center gap-2 md:gap-3">
                      <Badge
                        variant="outline"
                        className="border-[#1e1839]/20 text-[#1e1839] text-xs md:text-sm px-2 md:px-3 py-1"
                      >
                        {blogArticles.filter((article) => article.category.slug === category.slug).length} artikelen
                      </Badge>
                      <ArrowRight className="w-3 md:w-4 h-3 md:h-4 text-gray-400 group-hover:text-[#bad4e1] group-hover:translate-x-2 transition-all duration-300" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Filter Section - Mobile Optimized */}
        {blogArticles.length > 0 && (
          <section className="mb-12 md:mb-16">
            <Card className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 md:gap-3 text-[#1e1839] text-lg md:text-xl">
                  <Filter className="w-5 md:w-6 h-5 md:h-6" />
                  Filter Artikelen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 md:gap-4">
                  <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    onClick={() => setSelectedCategory(null)}
                    className={`rounded-full px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-semibold transition-all duration-300 ${
                      selectedCategory === null
                        ? "bg-[#1e1839] hover:bg-[#1e1839]/90 text-white shadow-lg"
                        : "border-[#1e1839]/30 text-[#1e1839] hover:bg-[#1e1839]/10 hover:border-[#1e1839]/50"
                    }`}
                  >
                    Alle Categorieën
                  </Button>
                  {blogCategories.map((category) => (
                    <Button
                      key={category.slug}
                      variant={selectedCategory === category.slug ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category.slug)}
                      className={`rounded-full px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-semibold transition-all duration-300 ${
                        selectedCategory === category.slug
                          ? "bg-[#1e1839] hover:bg-[#1e1839]/90 text-white shadow-lg"
                          : "border-[#1e1839]/30 text-[#1e1839] hover:bg-[#1e1839]/10 hover:border-[#1e1839]/50"
                      }`}
                    >
                      <span className="mr-1 md:mr-2 text-base md:text-lg">{category.icon}</span>
                      <span className="hidden sm:inline">{category.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Articles Section - Mobile Optimized */}
        {filteredArticles.length > 0 && (
          <section className="mb-12 md:mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredArticles.map((article) => (
                <Link key={article.slug} href={`/blog/${article.category.slug}/${article.slug}`} className="group">
                  <Card className="h-full hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] border-0 bg-white shadow-lg overflow-hidden">
                    {article.image && (
                      <div className="relative h-40 md:h-48 overflow-hidden">
                        <Image
                          src={article.image || "/placeholder.svg?height=192&width=400"}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute top-3 md:top-4 left-3 md:left-4">
                          <Badge className={`${article.category.color} text-white shadow-lg text-xs`}>
                            {article.category.icon} {article.category.name}
                          </Badge>
                        </div>
                        {article.featured && (
                          <div className="absolute top-3 md:top-4 right-3 md:right-4">
                            <Badge className="bg-[#bad4e1] text-[#1e1839] shadow-lg font-semibold text-xs">
                              ⭐ Featured
                            </Badge>
                          </div>
                        )}
                      </div>
                    )}
                    <CardHeader className="pb-3 md:pb-4">
                      {!article.image && (
                        <div className="flex items-center justify-between mb-3">
                          <Badge className={`${article.category.color} text-white text-xs`}>
                            {article.category.icon} {article.category.name}
                          </Badge>
                          {article.featured && (
                            <Badge className="bg-[#bad4e1] text-[#1e1839] shadow-lg font-semibold text-xs">
                              ⭐ Featured
                            </Badge>
                          )}
                        </div>
                      )}
                      <CardTitle className="text-base md:text-lg font-bold text-[#1e1839] group-hover:text-[#bad4e1] transition-colors line-clamp-2">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3 text-sm md:text-base text-gray-600">
                        {article.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs md:text-sm text-gray-500 mb-3 md:mb-4 gap-2">
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="flex items-center gap-1 md:gap-2">
                            <Image
                              src="/images/evotion-logo.png"
                              alt="Evotion Coaches"
                              width={14}
                              height={14}
                              className="rounded-full"
                            />
                            <span className="font-medium">Evotion Coaches</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{article.readingTime} min</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 md:w-4 h-3 md:h-4" />
                          <span>{new Date(article.publishedAt).toLocaleDateString("nl-NL")}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3 md:mb-4">
                        {article.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs border-[#1e1839]/30 text-[#1e1839]">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center text-[#bad4e1] font-medium group-hover:text-[#1e1839] transition-colors">
                        <span className="text-sm md:text-base">Lees meer</span>
                        <ArrowRight className="w-3 md:w-4 h-3 md:h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* No Results State - Mobile Optimized */}
        {blogArticles.length > 0 && filteredArticles.length === 0 && (
          <section className="text-center py-12 md:py-16">
            <Card className="max-w-md mx-auto bg-white border border-gray-200 shadow-lg">
              <CardContent className="pt-6 md:pt-8">
                <Search className="w-12 md:w-16 h-12 md:h-16 text-[#1e1839] mx-auto mb-4" />
                <h3 className="text-xl md:text-2xl font-bold text-[#1e1839] mb-2">Geen artikelen gevonden</h3>
                <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                  Probeer een andere zoekterm of selecteer een andere categorie.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory(null)
                  }}
                  className="bg-[#1e1839] hover:bg-[#1e1839]/90 rounded-lg text-white"
                >
                  Filters Wissen
                </Button>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Enhanced CTA Section - Mobile Optimized */}
        <section className="relative py-12 md:py-20 px-4 md:px-8 bg-gradient-to-r from-[#1e1839] to-[#2d1b69] rounded-xl md:rounded-2xl text-white text-center overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-5 md:top-10 left-5 md:left-10 w-12 md:w-20 h-12 md:h-20 bg-[#bad4e1]/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-5 md:bottom-10 right-5 md:right-10 w-16 md:w-32 h-16 md:h-32 bg-[#bad4e1]/30 rounded-full blur-xl animate-pulse delay-1000"></div>

          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              Klaar voor Jouw <span className="text-[#bad4e1]">Transformatie</span>?
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 md:mb-10 text-gray-200 leading-relaxed">
              Onze artikelen geven je de kennis, maar echte resultaten komen met
              <span className="text-[#bad4e1] font-semibold"> persoonlijke begeleiding</span> van onze gecertificeerde
              Evotion Coaches.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
              <Button
                size="lg"
                className="bg-white text-[#1e1839] hover:bg-gray-100 rounded-full px-6 md:px-10 py-3 md:py-5 text-base md:text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
                asChild
              >
                <Link href="/contact">
                  <Users className="w-5 md:w-6 h-5 md:h-6 mr-2 md:mr-3" />
                  Gratis Consult Boeken
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-[#1e1839] bg-transparent rounded-full px-6 md:px-10 py-3 md:py-5 text-base md:text-lg font-bold transition-all duration-300 hover:scale-105"
                asChild
              >
                <Link href="/gratis/caloriebehoefte">
                  <Target className="w-5 md:w-6 h-5 md:h-6 mr-2 md:mr-3" />
                  Gratis Calculator
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
