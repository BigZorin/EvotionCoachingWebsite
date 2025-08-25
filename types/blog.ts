export interface BlogCategory {
  slug: string
  name: string
  description: string
  icon: string
  color: string
}

export interface BlogAuthor {
  slug: string
  name: string
  bio: string
  avatar: string
  expertise: string[]
}

export interface BlogArticle {
  slug: string
  title: string
  description: string
  content: string
  publishedAt: string
  updatedAt: string
  readingTime: number
  featured: boolean
  image?: string
  category: BlogCategory
  author: BlogAuthor
  tags: string[]
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
    canonicalUrl?: string
  }
}

export interface BlogSearchFilters {
  category?: string
  author?: string
  tags?: string[]
  featured?: boolean
}

export const blogCategories: BlogCategory[] = [
  {
    slug: "afvallen",
    name: "Afvallen",
    description: "Bewezen strategieën voor duurzaam gewichtsverlies en vetverbranding",
    icon: "🔥",
    color: "bg-gradient-to-br from-red-500 to-orange-500",
  },
  {
    slug: "spieropbouw",
    name: "Spieropbouw",
    description: "Effectieve methoden voor het opbouwen van spiermassa en kracht",
    icon: "💪",
    color: "bg-gradient-to-br from-blue-500 to-indigo-500",
  },
  {
    slug: "voeding",
    name: "Voeding",
    description: "Voedingsadvies en supplementen voor optimale prestaties en gezondheid",
    icon: "🥗",
    color: "bg-gradient-to-br from-green-500 to-emerald-500",
  },
  {
    slug: "training",
    name: "Training",
    description: "Trainingsschema's en oefeningen voor alle fitnessniveaus",
    icon: "🏋️",
    color: "bg-gradient-to-br from-purple-500 to-violet-500",
  },
  {
    slug: "mindset",
    name: "Mindset",
    description: "Mentale strategieën voor blijvende motivatie en discipline",
    icon: "🧠",
    color: "bg-gradient-to-br from-pink-500 to-rose-500",
  },
  {
    slug: "overig",
    name: "Overig",
    description: "Algemene tips en tricks voor een gezonde levensstijl",
    icon: "✨",
    color: "bg-gradient-to-br from-gray-500 to-slate-500",
  },
]

export const blogAuthors: Record<string, BlogAuthor> = {
  "evotion-coaches": {
    slug: "evotion-coaches",
    name: "Evotion Coaches",
    avatar: "/images/evotion-logo.png",
    bio: "Ons team van gecertificeerde coaches deelt hun expertise en ervaring om jou te helpen bij jouw transformatie.",
    expertise: ["Personal Training", "Voeding", "Afvallen", "Mindset", "Coaching"],
  },
}
