"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  Calendar,
  Clock,
  ArrowRight,
  Target,
  Users,
  TrendingUp,
  Award,
  Lightbulb,
  Sparkles,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { blogCategories, blogArticles } from "@/data/blog-articles"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import Image from "next/image"

export function BlogClientPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredArticles = blogArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = !selectedCategory || article.category.slug === selectedCategory

    return matchesSearch && matchesCategory
  })

  const featuredArticle = blogArticles.find((article) => article.featured) || blogArticles[0]
  const regularArticles = filteredArticles.filter((article) => article.slug !== featuredArticle?.slug)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <section className="relative pt-20 md:pt-24 pb-20 md:pb-28 px-4 bg-gradient-to-br from-[#1e1839] via-[#2a1f4d] to-[#1e1839] overflow-hidden">
        {/* Enhanced Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-40 h-40 bg-[#bad4e1] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-56 h-56 bg-[#bad4e1] rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#bad4e1] rounded-full blur-3xl animate-pulse animation-delay-500"></div>
        </div>

        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(#bad4e1 1px, transparent 1px), linear-gradient(90deg, #bad4e1 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center text-white z-10">
          {/* Enhanced Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#bad4e1]/20 to-[#bad4e1]/10 backdrop-blur-xl rounded-full px-6 py-3 mb-8 border border-[#bad4e1]/30 shadow-2xl hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-5 h-5 text-[#bad4e1] animate-pulse" />
            <span className="text-sm font-bold tracking-wider text-[#bad4e1]">EXPERT KNOWLEDGE HUB</span>
            <Sparkles className="w-5 h-5 text-[#bad4e1] animate-pulse animation-delay-500" />
          </div>

          {/* Enhanced Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="block mb-2 text-white drop-shadow-2xl">Fitness & Voeding</span>
            <span className="block bg-gradient-to-r from-[#bad4e1] via-white to-[#bad4e1] bg-clip-text text-transparent animate-gradient drop-shadow-2xl">
              Expert Blog
            </span>
          </h1>

          {/* Enhanced Description */}
          <p className="text-base md:text-xl lg:text-2xl mb-14 text-gray-100 max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
            Ontdek bewezen strategieën voor{" "}
            <span className="text-[#bad4e1] font-bold bg-[#bad4e1]/10 px-2 py-1 rounded">afvallen</span>,{" "}
            <span className="text-[#bad4e1] font-bold bg-[#bad4e1]/10 px-2 py-1 rounded">spieropbouw</span> en een{" "}
            <span className="text-[#bad4e1] font-bold bg-[#bad4e1]/10 px-2 py-1 rounded">gezonde levensstijl</span>
          </p>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 mb-14 max-w-4xl mx-auto">
            {[
              { icon: Target, value: "100+", label: "Expert Tips" },
              { icon: Award, value: "5+ Jaar", label: "Ervaring" },
              { icon: TrendingUp, value: "1000+", label: "Transformaties" },
            ].map((stat, index) => (
              <div
                key={index}
                className="group relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 hover:bg-white/15 transition-all duration-300 shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#bad4e1]/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#bad4e1] to-[#bad4e1]/70 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-[#bad4e1] mb-1 drop-shadow-lg">{stat.value}</div>
                  <div className="text-xs md:text-sm text-gray-200 font-semibold">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Search Bar */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#bad4e1] to-[#bad4e1]/60 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#bad4e1] transition-colors z-10" />
                <Input
                  type="text"
                  placeholder="Zoek artikelen, tips of onderwerpen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-14 pr-6 py-7 text-base bg-white backdrop-blur-xl border-2 border-white/20 rounded-2xl shadow-2xl focus:ring-2 focus:ring-[#bad4e1] focus:border-[#bad4e1] transition-all duration-300 placeholder:text-gray-400 hover:border-[#bad4e1]/50"
                />
              </div>
            </div>
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#bad4e1] to-[#bad4e1]/80 text-[#1e1839] hover:from-[#bad4e1]/90 hover:to-[#bad4e1]/70 rounded-full px-8 py-6 text-base font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 border-2 border-white/20"
              asChild
            >
              <Link href="#categories">
                <Lightbulb className="w-5 h-5 mr-2" />
                Ontdek Expertise
              </Link>
            </Button>
            <Button
              size="lg"
              className="bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white hover:bg-white hover:text-[#1e1839] rounded-full px-8 py-6 text-base font-bold transition-all duration-300 hover:scale-105 shadow-2xl"
              asChild
            >
              <Link href="https://calendly.com/evotion/evotion-coaching" target="_blank" rel="noopener noreferrer">
                Gratis Consult
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {featuredArticle && !searchTerm && !selectedCategory && (
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="w-6 h-6 text-[#bad4e1]" />
              <h2 className="text-3xl md:text-4xl font-bold text-[#1e1839]">Featured Artikel</h2>
            </div>
            <Link href={`/blog/${featuredArticle.category.slug}/${featuredArticle.slug}`} className="group">
              <div className="ev-gradient-border bg-white border-transparent rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.01]">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image Section */}
                  <div className="relative h-64 md:h-full min-h-[400px] overflow-hidden">
                    <Image
                      src={featuredArticle.image || "/placeholder.svg?height=400&width=600"}
                      alt={featuredArticle.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 via-black/20 to-transparent"></div>
                    <Badge className="absolute top-6 left-6 bg-[#bad4e1] text-[#1e1839] shadow-xl font-bold text-sm px-4 py-2">
                      ⭐ Featured
                    </Badge>
                  </div>

                  {/* Content Section */}
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <Badge className={`${featuredArticle.category.color} text-white shadow-lg w-fit mb-4`}>
                      {featuredArticle.category.icon} {featuredArticle.category.name}
                    </Badge>
                    <h3 className="text-2xl md:text-4xl font-bold text-[#1e1839] mb-4 group-hover:text-[#bad4e1] transition-colors leading-tight">
                      {featuredArticle.title}
                    </h3>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">{featuredArticle.description}</p>

                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/images/evotion-logo.png"
                          alt="Evotion Coaches"
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <span className="font-semibold">Evotion Coaches</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{featuredArticle.readingTime} min</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(featuredArticle.publishedAt).toLocaleDateString("nl-NL")}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-[#bad4e1] font-bold text-lg group-hover:text-[#1e1839] transition-colors">
                      <span>Lees het volledige artikel</span>
                      <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        <section id="categories" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-[#1e1839] mb-4">Expertise Gebieden</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Van wetenschappelijk onderbouwde voedingstips tot praktische trainingsschema's
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogCategories.map((category) => (
              <Link key={category.slug} href={`/blog/${category.slug}`} className="group">
                <div className="ev-gradient-border bg-white border-transparent rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 group-hover:scale-105 h-full">
                  <div
                    className={`w-20 h-20 ${category.color} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl text-white`}
                  >
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#1e1839] group-hover:text-[#bad4e1] transition-colors mb-3 text-center">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4 text-center">{category.description}</p>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Badge variant="outline" className="border-[#1e1839]/20 text-[#1e1839] font-semibold">
                      {blogArticles.filter((article) => article.category.slug === category.slug).length} artikelen
                    </Badge>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#bad4e1] group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {blogArticles.length > 0 && (
          <section className="mb-16">
            <div className="ev-gradient-border bg-gradient-to-r from-gray-50 to-white border-transparent rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Filter className="w-6 h-6 text-[#1e1839]" />
                <h3 className="text-2xl font-bold text-[#1e1839]">Filter Artikelen</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  onClick={() => setSelectedCategory(null)}
                  className={`rounded-full px-6 py-3 font-semibold transition-all duration-300 ${
                    selectedCategory === null
                      ? "bg-[#1e1839] hover:bg-[#1e1839]/90 text-white shadow-lg scale-105"
                      : "border-2 border-[#1e1839]/30 text-[#1e1839] hover:bg-[#1e1839]/10 hover:border-[#1e1839] hover:scale-105"
                  }`}
                >
                  Alle Categorieën
                </Button>
                {blogCategories.map((category) => (
                  <Button
                    key={category.slug}
                    variant={selectedCategory === category.slug ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.slug)}
                    className={`rounded-full px-6 py-3 font-semibold transition-all duration-300 ${
                      selectedCategory === category.slug
                        ? "bg-[#1e1839] hover:bg-[#1e1839]/90 text-white shadow-lg scale-105"
                        : "border-2 border-[#1e1839]/30 text-[#1e1839] hover:bg-[#1e1839]/10 hover:border-[#1e1839] hover:scale-105"
                    }`}
                  >
                    <span className="mr-2 text-lg">{category.icon}</span>
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </section>
        )}

        {regularArticles.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1e1839]">Alle Artikelen</h2>
              <Badge variant="outline" className="border-[#1e1839]/30 text-[#1e1839] font-semibold px-4 py-2">
                {regularArticles.length} artikelen
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularArticles.map((article) => (
                <Link key={article.slug} href={`/blog/${article.category.slug}/${article.slug}`} className="group">
                  <div className="ev-gradient-border bg-white border-transparent rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02] h-full flex flex-col">
                    {article.image && (
                      <div className="relative h-56 overflow-hidden">
                        <Image
                          src={article.image || "/placeholder.svg?height=224&width=400"}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <Badge className={`absolute top-4 left-4 ${article.category.color} text-white shadow-lg`}>
                          {article.category.icon} {article.category.name}
                        </Badge>
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-grow">
                      {!article.image && (
                        <Badge className={`${article.category.color} text-white shadow-lg w-fit mb-4`}>
                          {article.category.icon} {article.category.name}
                        </Badge>
                      )}
                      <h3 className="text-xl font-bold text-[#1e1839] group-hover:text-[#bad4e1] transition-colors mb-3 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow">{article.description}</p>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <div className="flex items-center gap-2">
                          <Image
                            src="/images/evotion-logo.png"
                            alt="Evotion"
                            width={16}
                            height={16}
                            className="rounded-full"
                          />
                          <span className="font-medium">Evotion</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{article.readingTime} min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(article.publishedAt).toLocaleDateString("nl-NL")}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs border-[#1e1839]/30 text-[#1e1839]">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center text-[#bad4e1] font-semibold group-hover:text-[#1e1839] transition-colors">
                        <span>Lees meer</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {blogArticles.length > 0 && filteredArticles.length === 0 && (
          <section className="text-center py-20">
            <div className="ev-gradient-border bg-white border-transparent rounded-2xl p-12 max-w-md mx-auto shadow-xl">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-[#1e1839] mb-3">Geen artikelen gevonden</h3>
              <p className="text-gray-600 mb-6">Probeer een andere zoekterm of selecteer een andere categorie.</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory(null)
                }}
                className="bg-[#1e1839] hover:bg-[#1e1839]/90 rounded-full text-white px-8 py-3"
              >
                Filters Wissen
              </Button>
            </div>
          </section>
        )}

        <section className="relative py-20 px-8 bg-gradient-to-br from-[#1e1839] via-[#2d1b69] to-[#1e1839] rounded-3xl text-white text-center overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-[#bad4e1]/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#bad4e1]/30 rounded-full blur-2xl animate-pulse animation-delay-1000"></div>

          <div className="relative z-10 max-w-4xl mx-auto">
            <Sparkles className="w-12 h-12 text-[#bad4e1] mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Klaar voor Jouw <span className="text-[#bad4e1]">Transformatie</span>?
            </h2>
            <p className="text-lg md:text-2xl mb-10 text-gray-200 leading-relaxed">
              Onze artikelen geven je de kennis, maar echte resultaten komen met
              <span className="text-[#bad4e1] font-bold"> persoonlijke begeleiding</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                className="bg-white text-[#1e1839] hover:bg-gray-100 rounded-full px-10 py-6 text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
                asChild
              >
                <Link href="/contact">
                  <Users className="w-6 h-6 mr-3" />
                  Gratis Consult Boeken
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-[#1e1839] bg-transparent rounded-full px-10 py-6 text-lg font-bold transition-all duration-300 hover:scale-105"
                asChild
              >
                <Link href="/gratis/caloriebehoefte">
                  <Target className="w-6 h-6 mr-3" />
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
