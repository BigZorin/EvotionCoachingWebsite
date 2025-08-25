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
          return `<h2 id="${id}" class="text-2xl font-semibold mt-8 mb-4 text-gray-800 scroll-mt-20">${title}</h2>`
        })
        .replace(/^### (.+)$/gm, (match, title) => {
          const id = title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/^-|-$/g, "")
          return `<h3 id="${id}" class="text-xl font-medium mt-6 mb-3 text-gray-700 scroll-mt-20">${title}</h3>`
        })
        // Bold and italic
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        // Lists
        .replace(/^- (.*$)/gm, '<li class="ml-4 mb-2 text-gray-700 list-disc">$1</li>')
        // Blockquotes
        .replace(
          /^> \*\*(.+?):\*\* (.+)$/gm,
          '<div class="border-l-4 border-blue-500 bg-blue-50 p-4 my-6 rounded-r"><p class="text-gray-800"><strong class="font-semibold text-blue-800">$1:</strong> $2</p></div>',
        )
        // Table of contents - convert numbered list with links to proper HTML
        .replace(
          /^(\d+)\. \[([^\]]+)\]$$#([^)]+)$$$/gm,
          '<li class="mb-2"><a href="#$3" class="text-blue-600 hover:text-blue-800 hover:underline transition-colors">$1. $2</a></li>',
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
        .replace(/\n\n/g, "</p><p class='mb-4 text-gray-700 leading-relaxed'>")
        .replace(/\n/g, "<br>")
    )
  }

  const tableOfContents = createTableOfContents(article.content)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Navigation */}
      <div className="container mx-auto px-4 py-6 pt-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
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
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Terug naar {article.category.name}
          </Link>
        </div>
      </div>

      <article className="container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-8">
            <Badge className={`${article.category.color} text-white mb-4`}>
              <span className="mr-2">{article.category.icon}</span>
              {article.category.name}
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">{article.title}</h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">{article.description}</p>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 text-gray-500 mb-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{author?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{article.readingTime} min leestijd</span>
              </div>
              <div className="flex items-center gap-2">
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

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-gray-600">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-3 mb-8">
              <span className="text-sm text-gray-600">Delen:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("whatsapp")}
                className="text-green-600 hover:text-green-700"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("facebook")}
                className="text-blue-600 hover:text-blue-700"
              >
                <Share2 className="h-4 w-4 mr-1" />
                Facebook
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("linkedin")}
                className="text-blue-700 hover:text-blue-800"
              >
                <Share2 className="h-4 w-4 mr-1" />
                LinkedIn
              </Button>
            </div>
          </header>

          {/* Table of Contents */}
          {tableOfContents.length > 0 && (
            <Card className="mb-8 bg-gray-50">
              <CardHeader>
                <h3 className="text-lg font-semibold">Inhoudsopgave</h3>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2">
                  {tableOfContents.map((item, index) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                      >
                        {index + 1}. {item.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div
              className="article-content text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: `<p class='mb-4 text-gray-700 leading-relaxed'>${formatContent(article.content)}</p>`,
              }}
            />
          </div>

          <Separator className="my-12" />

          {/* Author Bio */}
          {author && (
            <Card className="mb-12 bg-gray-50">
              <CardHeader>
                <h3 className="text-xl font-semibold">Over de auteur</h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {author.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-2">{author.name}</h4>
                    <p className="text-gray-600 mb-3">{author.bio}</p>
                    <div className="flex flex-wrap gap-2">
                      {author.expertise.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section>
              <h3 className="text-2xl font-semibold mb-6">Gerelateerde Artikelen</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => {
                  const relatedAuthor = blogAuthors.find((a) => a.slug === relatedArticle.author.slug)
                  return (
                    <Card key={relatedArticle.slug} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-4">
                        <h4 className="font-semibold leading-tight">
                          <Link
                            href={`/blog/${relatedArticle.category.slug}/${relatedArticle.slug}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {relatedArticle.title}
                          </Link>
                        </h4>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{relatedArticle.description}</p>
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

          {/* CTA Section */}
          <section className="mt-16 bg-gray-900 rounded-lg p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Klaar om te Starten met Creatine?</h2>
            <p className="text-xl mb-6 text-gray-300">
              Ontdek onze hoogwaardige creatine of krijg persoonlijk advies van onze experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/supplementen/creatine">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Bekijk Creatine Supplementen
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-gray-900 bg-transparent"
                >
                  Plan Gratis Intake
                </Button>
              </Link>
            </div>
            <div className="mt-4">
              <Link href="/12-weken-vetverlies" className="text-gray-300 hover:text-white underline">
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
