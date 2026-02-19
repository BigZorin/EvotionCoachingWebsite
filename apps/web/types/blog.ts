export interface BlogCategory {
  slug: string
  name: string
  description: string
  icon: string
  color: string
}

export interface BlogArticle {
  slug: string
  title: string
  description: string
  content: string
  publishedAt: string
  readingTime: number
  featured: boolean
  image?: string
  category: BlogCategory
  tags: string[]
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
  }
}
