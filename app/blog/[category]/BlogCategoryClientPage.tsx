"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Search, Calendar, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { blogArticles, type BlogCategory } from "@/data/blog-articles"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"

interface BlogCategoryClientPageProps {
  category: BlogCategory
}

export function BlogCategoryClientPage({ category }: BlogCategoryClientPageProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter articles for this category
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

      {/* Category Header */}
      <section className="relative pt-16 md:pt-20 py-16 px-4 bg-gradient-to-br from-[#1e1839] via-[#2d1b69] to-[#1e1839] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#bad4e1] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#bad4e1] rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center text-white z-10">
          <Link
            href="/blog"
            className="inline-flex items-center text-[#bad4e1] hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Terug naar Blog
          </Link>

          <div
            className={`w-20 h-20 ${category.color} rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg text-white`}
          >
            {category.icon}
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">{category.name}</h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            {category.description}
          </p>

          {/* Search Bar */}
          <div className="max-w-lg mx-auto">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder={`Zoek in ${category.name.toLowerCase()} artikelen...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-4 text-lg bg-white/95 backdrop-blur-sm border-0 rounded-2xl shadow-xl focus:ring-4 focus:ring-[#bad4e1]/30 transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Articles Grid */}
        {categoryArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryArticles.map((article) => (
              <Link key={article.slug} href={`/blog/${article.category.slug}/${article.slug}`} className="group">
                <Card className="h-full hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] border-0 bg-white shadow-lg overflow-hidden">
                  {article.image && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={article.image || "/placeholder.svg?height=192&width=400"}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      {article.featured && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-[#bad4e1] text-[#1e1839] shadow-lg font-semibold text-xs">
                            ⭐ Featured
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    {!article.image && article.featured && (
                      <div className="flex justify-end mb-3">
                        <Badge className="bg-[#bad4e1] text-[#1e1839] shadow-lg font-semibold text-xs">
                          ⭐ Featured
                        </Badge>
                      </div>
                    )}
                    <CardTitle className="text-lg font-bold text-[#1e1839] group-hover:text-[#bad4e1] transition-colors line-clamp-2">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-gray-600">{article.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Image
                            src="/images/evotion-logo.png"
                            alt="Evotion Coaches"
                            width={16}
                            height={16}
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
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(article.publishedAt).toLocaleDateString("nl-NL")}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {article.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-[#1e1839]/30 text-[#1e1839]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center text-[#bad4e1] font-medium group-hover:text-[#1e1839] transition-colors">
                      <span>Lees meer</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Card className="max-w-md mx-auto bg-white border border-gray-200 shadow-lg">
              <CardContent className="pt-8">
                <Search className="w-16 h-16 text-[#1e1839] mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-[#1e1839] mb-2">Geen artikelen gevonden</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm
                    ? "Probeer een andere zoekterm."
                    : `Er zijn nog geen artikelen in de categorie ${category.name}.`}
                </p>
                {searchTerm && (
                  <Button
                    onClick={() => setSearchTerm("")}
                    className="bg-[#1e1839] hover:bg-[#1e1839]/90 rounded-lg text-white"
                  >
                    Zoekterm Wissen
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* CTA Section */}
        <section className="mt-16 relative py-20 px-8 bg-gradient-to-r from-[#1e1839] to-[#2d1b69] rounded-2xl text-white text-center overflow-hidden">
          <div className="absolute top-10 left-10 w-20 h-20 bg-[#bad4e1]/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#bad4e1]/30 rounded-full blur-xl animate-pulse delay-1000"></div>

          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Klaar voor Jouw <span className="text-[#bad4e1]">Transformatie</span>?
            </h2>
            <p className="text-xl md:text-2xl mb-10 text-gray-200 leading-relaxed">
              Onze {category.name.toLowerCase()} artikelen geven je de kennis, maar echte resultaten komen met
              <span className="text-[#bad4e1] font-semibold"> persoonlijke begeleiding</span> van onze gecertificeerde
              Evotion Coaches.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                className="bg-white text-[#1e1839] hover:bg-gray-100 rounded-full px-10 py-5 text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
                asChild
              >
                <Link href="/contact">Gratis Consult Boeken</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-[#1e1839] bg-transparent rounded-full px-10 py-5 text-lg font-bold transition-all duration-300 hover:scale-105"
                asChild
              >
                <Link href="/gratis/caloriebehoefte">Gratis Calculator</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
