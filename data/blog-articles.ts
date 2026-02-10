import type { BlogCategory, BlogArticle } from "@/types/blog"

export const blogCategories: BlogCategory[] = [
  {
    slug: "voeding",
    name: "Voeding",
    description: "Wetenschappelijk onderbouwde voedingstips voor duurzame resultaten",
    icon: "voeding",
    color: "bg-emerald-600",
  },
  {
    slug: "training",
    name: "Training",
    description: "Effectieve trainingsmethoden voor kracht en lichaamsontwikkeling",
    icon: "training",
    color: "bg-blue-600",
  },
  {
    slug: "mindset",
    name: "Mindset",
    description: "Mentale kracht, discipline en doorzettingsvermogen",
    icon: "mindset",
    color: "bg-amber-600",
  },
  {
    slug: "herstel",
    name: "Herstel & Rust",
    description: "Slaap, herstelstrategieen en stressmanagement",
    icon: "herstel",
    color: "bg-indigo-600",
  },
  {
    slug: "structuur",
    name: "Ritme & Structuur",
    description: "Gewoontes, routines en consistentie in je levensstijl",
    icon: "structuur",
    color: "bg-rose-600",
  },
  {
    slug: "verantwoordelijkheid",
    name: "Verantwoordelijkheid",
    description: "Eigenaarschap over je gezondheid en resultaten",
    icon: "verantwoordelijkheid",
    color: "bg-[#1e1839]",
  },
]

export const blogArticles: BlogArticle[] = [
  {
    slug: "laadfase-creatine-monohydraat",
    title: "Laadfase bij Creatine Monohydraat: Nodig of Niet?",
    description: "Ontdek of een laadfase bij creatine echt nodig is. Complete gids met wetenschappelijke onderbouwing en praktisch advies.",
    content: `Een van de meest gestelde vragen over creatine supplementatie is: "Moet ik een laadfase doen?" In dit artikel geven we je een evidence-based antwoord.

## Wat is een laadfase?

Een laadfase is een periode waarin je bewust meer creatine inneemt dan de standaard onderhoudsdosering. Het doel is om je spieren sneller te verzadigen met creatine fosfaat.

### Het klassieke protocol

- **Laadfase:** 20 gram per dag, verdeeld over 4 doses van 5 gram
- **Duur:** 5-7 dagen
- **Onderhoudsfase:** 3-5 gram per dag

## Is het nodig?

Nee. Zowel een laadfase als directe onderhoudsdosering (3-5g/dag) leiden na 3-4 weken tot dezelfde spierconcentratie creatine.

## Praktisch advies

Voor de meeste recreatieve sporters raden we aan om direct te starten met 3-5 gram per dag. Dit is eenvoudiger, goedkoper en even effectief op de lange termijn.

## Conclusie

Een laadfase bij creatine monohydraat is optioneel, niet essentieel. De keuze hangt af van tijdsdruk en persoonlijke voorkeur.`,
    publishedAt: "2024-01-15",
    readingTime: 12,
    featured: true,
    category: blogCategories[0],
    tags: ["creatine", "supplementen", "wetenschap"],
    seo: {
      metaTitle: "Laadfase creatine: nodig of niet? | Evotion Blog",
      metaDescription: "Laadfase bij creatine: essentieel, optioneel of overbodig? Wetenschappelijk onderbouwd advies van Evotion Coaching.",
      keywords: ["laadfase creatine", "creatine monohydraat", "creatine protocol"],
    },
  },
]
