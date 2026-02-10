import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BlogArticleClientPage } from "./BlogArticleClientPage"
import { blogArticles } from "@/data/blog-articles"

interface BlogArticlePageProps {
  params: Promise<{
    category: string
    slug: string
  }>
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { category, slug } = await params
  const article = blogArticles.find((a) => a.category.slug === category && a.slug === slug)

  if (!article) {
    return {
      title: "Artikel niet gevonden | Evotion Coaching",
    }
  }

  return {
    title: article.seo.metaTitle,
    description: article.seo.metaDescription,
    keywords: article.seo.keywords,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      url: `https://evotion-coaching.nl/blog/${article.category.slug}/${article.slug}`,
      publishedTime: article.publishedAt,
      authors: ["Evotion Coaches"],
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
  }
}

export async function generateStaticParams() {
  return blogArticles.map((article) => ({
    category: article.category.slug,
    slug: article.slug,
  }))
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { category, slug } = await params
  const article = blogArticles.find((a) => a.category.slug === category && a.slug === slug)

  if (!article) {
    notFound()
  }

  return <BlogArticleClientPage article={article} />
}
