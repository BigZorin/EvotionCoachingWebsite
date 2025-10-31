import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BlogCategoryClientPage } from "./BlogCategoryClientPage"
import { blogCategories } from "@/data/blog-articles"

interface BlogCategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export async function generateMetadata({ params }: BlogCategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const categoryData = blogCategories.find((cat) => cat.slug === category)

  if (!categoryData) {
    return {
      title: "Categorie niet gevonden | Evotion Coaching",
    }
  }

  return {
    title: `${categoryData.name} Artikelen | Evotion Coaching Blog`,
    description: `Ontdek onze ${categoryData.name.toLowerCase()} artikelen. ${categoryData.description}`,
    openGraph: {
      title: `${categoryData.name} Artikelen | Evotion Coaching`,
      description: categoryData.description,
      type: "website",
      url: `https://evotioncoaching.nl/blog/${categoryData.slug}`,
    },
  }
}

export async function generateStaticParams() {
  return blogCategories.map((category) => ({
    category: category.slug,
  }))
}

export default async function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  const { category } = await params
  const categoryData = blogCategories.find((cat) => cat.slug === category)

  if (!categoryData) {
    notFound()
  }

  return <BlogCategoryClientPage category={categoryData} />
}
