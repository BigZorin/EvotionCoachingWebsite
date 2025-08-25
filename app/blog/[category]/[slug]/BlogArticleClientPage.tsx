"use client"

import Link from "next/link"
import { ArrowLeft, Clock, User, Share2, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { blogArticles, blogAuthors, type BlogArticle } from "@/data/blog-articles"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface BlogArticleClientPageProps {
  article: BlogArticle
}

export function BlogArticleClientPage({ article }: BlogArticleClientPageProps) {
  const author = blogAuthors.find((a) => a.slug === article.author.slug)

  // Get related articles from same category
  const relatedArticles = blogArticles
    .filter((a) => a.category.slug === article.category.slug && a.slug !== article.slug)
    .slice(0, 3)

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(article.title)

    let shareUrl = ""

    switch (platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${title} ${url}`
        break
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`
        break
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        break
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400")
    }
  }

  const createTableOfContents = (content: string) => {
    const headings = content.match(/^## (.+)$/gm)
    if (!headings) return []

    return headings.map((heading) => {
      const title = heading.replace(/^## /, "")
      const id = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/^-|-$/g, "")
      return { title, id }
    })
  }

  const formatContent = (content: string) => {
    return (
      content
        // Headers with proper anchor IDs
        .replace(/^## (.+)$/gm, (match, title) => {
          const id = title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/^-|-$/g, "")
          return `<h2 id="${id}" class="text-lg md:text-2xl font-semibold mt-4 md:mt-8 mb-2 md:mb-4 text-gray-800 scroll-mt-20">${title}</h2>`
        })
        .replace(/^### (.+)$/gm, (match, title) => {
          const id = title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/^-|-$/g, "")
          return `<h3 id="${id}" class="text-base md:text-xl font-medium mt-3 md:mt-6 mb-2 md:mb-3 text-gray-700 scroll-mt-20">${title}</h3>`
        })
        // Bold and italic
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        // Lists
        .replace(/^- (.*$)/gm, '<li class="ml-4 mb-2 text-gray-700 list-disc">$1</li>')
        // Blockquotes
        .replace(
          /^> \*\*(.+?):\*\* (.+)$/gm,
          '<div class="border-l-4 border-blue-500 bg-blue-50 p-3 md:p-4 my-4 md:my-6 rounded-r"><p class="text-xs md:text-base text-gray-800"><strong class="font-semibold text-blue-800">$1:</strong> $2</p></div>',
        )
        // Internal links
        .replace(
          /\[([^\]]+)\]$$\/([^)]+)$$/g,
          '<a href="/$2" class="text-blue-600 hover:text-blue-800 underline font-medium">$1</a>',
        )
        // External links
        .replace(
          /\[([^\]]+)\]$$(https?:\/\/[^)]+)$$/g,
          '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1">$1 <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>',
        )
        // Line breaks and paragraphs
        .replace(/\n\n/g, "</p><p class='mb-2 md:mb-4 text-xs md:text-base text-gray-700 leading-relaxed'>")
        .replace(/\n/g, "<br>")
    )
  }

  const tableOfContents = createTableOfContents(article.content)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Navigation - Mobile Optimized */}
      <div className="container mx-auto px-4 py-4 md:py-6 pt-16 md:pt-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-4 md:mb-6">
            <Link href="/blog" className="hover:text-gray-700">
              Blog
            </Link>
            <span>/</span>
            <Link href={`/blog/${article.category.slug}`} className="hover:text-gray-700">
              {article.category.name}
            </Link>
            <span>/</span>
            <span className="text-gray-900">Laadfase Creatine</span>
          </div>

          <Link
            href={`/blog/${article.category.slug}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 md:mb-6 transition-colors"
          >
            <ArrowLeft className="h-3 md:h-4 w-3 md:w-4 mr-2" />
            <span className="text-sm md:text-base">Terug naar {article.category.name}</span>
          </Link>
        </div>
      </div>

      <article className="container mx-auto px-4 pb-8 md:pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Article Header - Mobile Optimized */}
          <header className="mb-6 md:mb-8">
            <Badge className={`${article.category.color} text-white mb-3 md:mb-4 text-xs md:text-sm`}>
              <span className="mr-1 md:mr-2">{article.category.icon}</span>
              {article.category.name}
            </Badge>

            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 md:mb-6 leading-tight text-gray-900">
              {article.title}
            </h1>

            <p className="text-sm md:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed">{article.description}</p>

            {/* Article Meta - Mobile Optimized */}
            <div className="flex flex-wrap items-center gap-3 md:gap-6 text-xs md:text-sm text-gray-500 mb-4 md:mb-6">
              <div className="flex items-center gap-1 md:gap-2">
                <User className="h-3 md:h-4 w-3 md:w-4" />
                <span>{author?.name}</span>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <Clock className="h-3 md:h-4 w-3 md:w-4" />
                <span>{article.readingTime} min leestijd</span>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <span>📅</span>
                <span>
                  {new Date(article.publishedAt).toLocaleDateString("nl-NL", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Tags - Mobile Optimized */}
            <div className="flex flex-wrap gap-1 md:gap-2 mb-6 md:mb-8">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs text-gray-600">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Share Buttons - Mobile Optimized */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-6 md:mb-8">
              <span className="text-xs md:text-sm text-gray-600">Delen:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("whatsapp")}
                className="text-green-600 hover:text-green-700 text-xs md:text-sm px-2 md:px-3 py-1 md:py-2"
              >
                <MessageCircle className="h-3 md:h-4 w-3 md:w-4 mr-1" />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("facebook")}
                className="text-blue-600 hover:text-blue-700 text-xs md:text-sm px-2 md:px-3 py-1 md:py-2"
              >
                <Share2 className="h-3 md:h-4 w-3 md:w-4 mr-1" />
                Facebook
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("linkedin")}
                className="text-blue-700 hover:text-blue-800 text-xs md:text-sm px-2 md:px-3 py-1 md:py-2"
              >
                <Share2 className="h-3 md:h-4 w-3 md:w-4 mr-1" />
                LinkedIn
              </Button>
            </div>
          </header>

          {/* Table of Contents - Mobile Optimized */}
          {tableOfContents.length > 0 && (
            <Card className="mb-6 md:mb-8 bg-gray-50">
              <CardHeader className="pb-3 md:pb-4">
                <h3 className="text-base md:text-lg font-semibold">Inhoudsopgave</h3>
              </CardHeader>
              <CardContent>
                <ol className="space-y-1 md:space-y-2">
                  {tableOfContents.map((item, index) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors text-sm md:text-base"
                      >
                        {index + 1}. {item.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}

          {/* Article Content - Mobile Optimized */}
          <div className="prose prose-sm md:prose-lg max-w-none mb-8 md:mb-12">
            <div
              className="article-content text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: `<p class='mb-2 md:mb-4 text-xs md:text-base text-gray-700 leading-relaxed'>${formatContent(article.content)}</p>`,
              }}
            />
          </div>

          <Separator className="my-8 md:my-12" />

          {/* Author Bio - Mobile Optimized */}
          {author && (
            <Card className="mb-8 md:mb-12 bg-gray-50">
              <CardHeader className="pb-3 md:pb-4">
                <h3 className="text-lg md:text-xl font-semibold">Over de auteur</h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-12 md:w-16 h-12 md:h-16 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold text-base md:text-xl flex-shrink-0">
                    {author.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-base md:text-lg mb-2">{author.name}</h4>
                    <p className="text-sm md:text-base text-gray-600 mb-3">{author.bio}</p>
                    <div className="flex flex-wrap gap-1 md:gap-2">
                      {author.expertise.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Related Articles - Mobile Optimized */}
          {relatedArticles.length > 0 && (
            <section className="mb-8 md:mb-12">
              <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Gerelateerde Artikelen</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {relatedArticles.map((relatedArticle) => {
                  const relatedAuthor = blogAuthors.find((a) => a.slug === relatedArticle.author.slug)
                  return (
                    <Card key={relatedArticle.slug} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3 md:pb-4">
                        <h4 className="font-semibold leading-tight text-sm md:text-base">
                          <Link
                            href={`/blog/${relatedArticle.category.slug}/${relatedArticle.slug}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {relatedArticle.title}
                          </Link>
                        </h4>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 text-xs md:text-sm mb-3 line-clamp-2">
                          {relatedArticle.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{relatedAuthor?.name}</span>
                          <span>{relatedArticle.readingTime} min</span>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </section>
          )}

          {/* CTA Section - Mobile Optimized */}
          <section className="mt-12 md:mt-16 bg-gray-900 rounded-lg p-6 md:p-8 text-white text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 md:mb-4">
              Klaar om te Starten met Creatine?
            </h2>
            <p className="text-base md:text-xl mb-4 md:mb-6 text-gray-300">
              Ontdek onze hoogwaardige creatine of krijg persoonlijk advies van onze experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Link href="/supplementen/creatine">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto text-sm md:text-base">
                  Bekijk Creatine Supplementen
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-gray-900 bg-transparent text-sm md:text-base"
                >
                  Plan Gratis Intake
                </Button>
              </Link>
            </div>
            <div className="mt-3 md:mt-4">
              <Link
                href="/12-weken-vetverlies"
                className="text-gray-300 hover:text-white underline text-sm md:text-base"
              >
                Of ontdek ons complete 12-weken transformatieprogramma →
              </Link>
            </div>
          </section>
        </div>
      </article>

      <Footer />
    </div>
  )
}
