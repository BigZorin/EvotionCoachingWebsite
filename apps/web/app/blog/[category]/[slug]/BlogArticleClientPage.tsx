"use client"

import React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Clock, Share2, MessageCircle, ChevronRight, ArrowRight, Utensils, Dumbbell, Brain, Moon, CalendarClock, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { blogArticles, type BlogArticle } from "@/data/blog-articles"
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

interface BlogArticleClientPageProps {
  article: BlogArticle
}

export function BlogArticleClientPage({ article }: BlogArticleClientPageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  useEffect(() => { setIsLoaded(true) }, [])

  const Icon = categoryIcons[article.category.icon] || Shield

  const relatedArticles = blogArticles
    .filter((a) => a.category.slug === article.category.slug && a.slug !== article.slug)
    .slice(0, 3)

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(article.title)
    let shareUrl = ""
    switch (platform) {
      case "whatsapp": shareUrl = `https://wa.me/?text=${title} ${url}`; break
      case "facebook": shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break
      case "linkedin": shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`; break
    }
    if (shareUrl) window.open(shareUrl, "_blank", "width=600,height=400")
  }

  const createTableOfContents = (content: string) => {
    const headings = content.match(/^## (.+)$/gm)
    if (!headings) return []
    return headings.map((heading) => {
      const title = heading.replace(/^## /, "")
      const id = title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/^-|-$/g, "")
      return { title, id }
    })
  }

  const formatContent = (content: string) => {
    return content
      .replace(/^## (.+)$/gm, (_, title) => {
        const id = title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/^-|-$/g, "")
        return `<h2 id="${id}" class="text-xl md:text-2xl font-bold mt-10 mb-4 text-[#1e1839] scroll-mt-24">${title}</h2>`
      })
      .replace(/^### (.+)$/gm, (_, title) => {
        const id = title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/^-|-$/g, "")
        return `<h3 id="${id}" class="text-lg md:text-xl font-semibold mt-8 mb-3 text-[#1e1839]/90 scroll-mt-24">${title}</h3>`
      })
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-[#1e1839]">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*$)/gm, '<li class="ml-5 mb-2 text-gray-700 list-disc leading-relaxed">$1</li>')
      .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-[#1e1839] bg-gray-50 p-4 my-6 rounded-r-xl text-gray-700 leading-relaxed">$1</blockquote>')
      .replace(/\n\n/g, "</p><p class='mb-4 text-base text-gray-700 leading-relaxed'>")
      .replace(/\n/g, "<br>")
  }

  const tableOfContents = createTableOfContents(article.content)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* HERO - Paars */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 bg-[#1e1839] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <div className={`flex items-center gap-2 text-sm text-white/50 mb-8 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <Link href="/blog" className="hover:text-white/80 transition-colors">Blog</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href={`/blog/${article.category.slug}`} className="hover:text-white/80 transition-colors">{article.category.name}</Link>
            </div>

            <div className={`flex items-center gap-3 mb-6 transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className={`w-10 h-10 ${article.category.color} rounded-lg flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <Badge className={`${article.category.color} text-white border-0`}>
                {article.category.name}
              </Badge>
            </div>

            <h1 className={`text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {article.title}
            </h1>

            <p className={`text-base md:text-lg text-white/70 leading-relaxed mb-8 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {article.description}
            </p>

            <div className={`flex flex-wrap items-center gap-4 text-sm text-white/50 transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {article.readingTime} min leestijd
              </div>
              <span>|</span>
              <span>
                {new Date(article.publishedAt).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT - Wit */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            
            {/* Table of Contents */}
            {tableOfContents.length > 0 && (
              <div className="bg-gray-50 rounded-2xl p-6 mb-12 border border-gray-100">
                <h3 className="text-base font-bold text-[#1e1839] mb-4">Inhoudsopgave</h3>
                <ol className="space-y-2">
                  {tableOfContents.map((item, index) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`} className="text-sm text-gray-600 hover:text-[#1e1839] transition-colors leading-relaxed">
                        {index + 1}. {item.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Article Content */}
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: `<p class='mb-4 text-base text-gray-700 leading-relaxed'>${formatContent(article.content)}</p>`,
              }}
            />

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-gray-100">
              {article.tags.map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-3 py-1.5 rounded-lg">
                  {tag}
                </span>
              ))}
            </div>

            {/* Share */}
            <div className="flex flex-wrap items-center gap-3 mt-8 pt-8 border-t border-gray-100">
              <span className="text-sm text-gray-500 font-medium">Deel dit artikel:</span>
              <Button variant="outline" size="sm" onClick={() => handleShare("whatsapp")} className="text-xs rounded-lg border-gray-200">
                <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                WhatsApp
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleShare("facebook")} className="text-xs rounded-lg border-gray-200">
                <Share2 className="w-3.5 h-3.5 mr-1.5" />
                Facebook
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleShare("linkedin")} className="text-xs rounded-lg border-gray-200">
                <Share2 className="w-3.5 h-3.5 mr-1.5" />
                LinkedIn
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* GERELATEERD - Paars */}
      {relatedArticles.length > 0 && (
        <section className="py-20 lg:py-28 bg-[#1e1839]">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-10 text-center">
              Meer over {article.category.name}
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {relatedArticles.map((related) => (
                <Link key={related.slug} href={`/blog/${related.category.slug}/${related.slug}`} className="group">
                  <div className="bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    <h3 className="text-base font-bold text-[#1e1839] mb-3 group-hover:text-[#1e1839]/70 transition-colors leading-tight line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">{related.description}</p>
                    <div className="flex items-center text-sm font-medium text-[#1e1839] group-hover:gap-2 gap-1 transition-all">
                      Lees meer
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA - Wit */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto bg-[#1e1839] rounded-2xl p-8 lg:p-12 text-center">
            <h2 className="text-xl md:text-3xl font-bold text-white mb-4">
              Persoonlijk advies nodig?
            </h2>
            <p className="text-white/70 mb-8 leading-relaxed">
              Onze coaches helpen je om deze kennis toe te passen in een plan dat bij jou past.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-[#1e1839] hover:bg-gray-100 rounded-xl h-12 px-8 font-semibold" asChild>
                <Link href="https://calendly.com/evotion/evotion-coaching" target="_blank" rel="noopener noreferrer">
                  Gratis Adviesgesprek
                </Link>
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent rounded-xl h-12 px-8 font-semibold" asChild>
                <Link href="/blog">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Terug naar Blog
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
