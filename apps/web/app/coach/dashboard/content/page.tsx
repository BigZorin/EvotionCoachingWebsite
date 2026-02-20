"use client"

import { useState } from "react"
import {
  Plus,
  Search,
  Video,
  FileText,
  Image,
  Play,
  Clock,
  Eye,
  MoreHorizontal,
  Upload,
  Filter,
  BookOpen,
  Link2,
  Trash2,
  Pencil,
  Copy,
  Share2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

// ─── Types ────────────────────────────────────────────────────────────────────
// These types will map to the Supabase `content_items` table:
//   id          uuid  PK
//   coach_id    uuid  FK → profiles.id
//   title       text
//   description text
//   type        enum  ('video', 'artikel', 'afbeelding')
//   category    text  (e.g. 'Training', 'Voeding', 'Mindset', 'Herstel')
//   url         text  (storage URL or external link)
//   thumbnail   text  (storage URL for thumbnail/preview)
//   duration    text  (e.g. '12:30' for videos, '5 min leestijd' for articles)
//   views       int   default 0
//   status      enum  ('gepubliceerd', 'concept')
//   created_at  timestamptz
//   updated_at  timestamptz

type ContentType = "video" | "artikel" | "afbeelding"
type ContentStatus = "gepubliceerd" | "concept"

interface ContentItem {
  id: string
  title: string
  description: string
  type: ContentType
  category: string
  thumbnail: string | null
  duration: string
  views: number
  status: ContentStatus
  createdAt: string
}

// ─── Placeholder data ─────────────────────────────────────────────────────────
// Replace with Supabase query: supabase.from('content_items').select('*').eq('coach_id', coachId).order('created_at', { ascending: false })
const PLACEHOLDER_CONTENT: ContentItem[] = [
  {
    id: "1",
    title: "Opwarming routine voor krachttraining",
    description: "Een volledige opwarming van 10 minuten die je voor elke krachttraining kunt gebruiken.",
    type: "video",
    category: "Training",
    thumbnail: null,
    duration: "10:24",
    views: 342,
    status: "gepubliceerd",
    createdAt: "2026-02-18",
  },
  {
    id: "2",
    title: "Meal prep guide: eiwitrijke maaltijden",
    description: "Stap-voor-stap handleiding voor het bereiden van 5 eiwitrijke maaltijden.",
    type: "artikel",
    category: "Voeding",
    thumbnail: null,
    duration: "8 min leestijd",
    views: 218,
    status: "gepubliceerd",
    createdAt: "2026-02-15",
  },
  {
    id: "3",
    title: "Correcte deadlift techniek",
    description: "Uitleg van de juiste techniek voor de conventionele deadlift met veelgemaakte fouten.",
    type: "video",
    category: "Training",
    thumbnail: null,
    duration: "15:42",
    views: 567,
    status: "gepubliceerd",
    createdAt: "2026-02-12",
  },
  {
    id: "4",
    title: "Slaaphygiene infographic",
    description: "Visuele gids met 10 tips voor betere slaapkwaliteit en herstel.",
    type: "afbeelding",
    category: "Herstel",
    thumbnail: null,
    duration: "Infographic",
    views: 156,
    status: "gepubliceerd",
    createdAt: "2026-02-10",
  },
  {
    id: "5",
    title: "Supplementen gids 2026",
    description: "Overzicht van evidence-based supplementen voor sporters en hun dosering.",
    type: "artikel",
    category: "Voeding",
    thumbnail: null,
    duration: "12 min leestijd",
    views: 431,
    status: "gepubliceerd",
    createdAt: "2026-02-08",
  },
  {
    id: "6",
    title: "Schouder mobiliteit oefeningen",
    description: "5 oefeningen om je schoudermobiliteit te verbeteren voor beter presteren.",
    type: "video",
    category: "Herstel",
    thumbnail: null,
    duration: "8:15",
    views: 289,
    status: "gepubliceerd",
    createdAt: "2026-02-05",
  },
  {
    id: "7",
    title: "Macro's berekenen voor bulken",
    description: "Hoe je je macronutrienten berekent voor een succesvolle bulk-fase.",
    type: "artikel",
    category: "Voeding",
    thumbnail: null,
    duration: "6 min leestijd",
    views: 194,
    status: "concept",
    createdAt: "2026-02-03",
  },
  {
    id: "8",
    title: "Progressiemodel poster",
    description: "Visueel overzicht van progressieve overbelasting principes.",
    type: "afbeelding",
    category: "Training",
    thumbnail: null,
    duration: "Poster",
    views: 87,
    status: "concept",
    createdAt: "2026-02-01",
  },
  {
    id: "9",
    title: "Mindset & motivatie: doelen stellen",
    description: "Video over het SMART-framework voor het stellen van fitnessdoelen.",
    type: "video",
    category: "Mindset",
    thumbnail: null,
    duration: "11:08",
    views: 203,
    status: "gepubliceerd",
    createdAt: "2026-01-28",
  },
  {
    id: "10",
    title: "Stress management technieken",
    description: "Praktische ademhalings- en ontspanningstechnieken voor dagelijks gebruik.",
    type: "afbeelding",
    category: "Mindset",
    thumbnail: null,
    duration: "Infographic",
    views: 145,
    status: "gepubliceerd",
    createdAt: "2026-01-25",
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<ContentType, { icon: typeof Video; label: string; color: string; bgColor: string }> = {
  video: {
    icon: Video,
    label: "Video",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/50",
  },
  artikel: {
    icon: FileText,
    label: "Artikel",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/50",
  },
  afbeelding: {
    icon: Image,
    label: "Afbeelding",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/50",
  },
}

const CATEGORY_VARIANT: Record<string, string> = {
  Training: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 border-violet-200 dark:border-violet-800",
  Voeding: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800",
  Herstel: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 border-sky-200 dark:border-sky-800",
  Mindset: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800",
}

function formatViews(views: number): string {
  if (views >= 1000) return `${(views / 1000).toFixed(1)}k`
  return views.toString()
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ContentPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("alle")

  // Filter content by search query and active tab
  const filteredContent = PLACEHOLDER_CONTENT.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTab =
      activeTab === "alle" ||
      (activeTab === "videos" && item.type === "video") ||
      (activeTab === "artikelen" && item.type === "artikel") ||
      (activeTab === "afbeeldingen" && item.type === "afbeelding")

    return matchesSearch && matchesTab
  })

  // Stats for header cards
  const stats = {
    totaal: PLACEHOLDER_CONTENT.length,
    videos: PLACEHOLDER_CONTENT.filter((i) => i.type === "video").length,
    artikelen: PLACEHOLDER_CONTENT.filter((i) => i.type === "artikel").length,
    afbeeldingen: PLACEHOLDER_CONTENT.filter((i) => i.type === "afbeelding").length,
    totaalViews: PLACEHOLDER_CONTENT.reduce((sum, i) => sum + i.views, 0),
  }

  return (
    <div className="space-y-6">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Bibliotheek</h1>
          <p className="text-muted-foreground mt-1">
            Beheer en deel video&apos;s, artikelen en afbeeldingen met je clienten.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Uploaden
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Content aanmaken
          </Button>
        </div>
      </div>

      {/* ── Summary stats ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="py-4">
          <CardContent className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totaal}</p>
              <p className="text-xs text-muted-foreground">Totaal items</p>
            </div>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/50">
              <Video className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.videos}</p>
              <p className="text-xs text-muted-foreground">Video&apos;s</p>
            </div>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/50">
              <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.artikelen}</p>
              <p className="text-xs text-muted-foreground">Artikelen</p>
            </div>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/50">
              <Eye className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatViews(stats.totaalViews)}</p>
              <p className="text-xs text-muted-foreground">Totaal views</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Tabs + search / filter bar ───────────────────────────────────── */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="alle">
              Alle
              <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5 py-0">
                {stats.totaal}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="videos">
              Video&apos;s
              <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5 py-0">
                {stats.videos}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="artikelen">
              Artikelen
              <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5 py-0">
                {stats.artikelen}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="afbeeldingen">
              Afbeeldingen
              <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5 py-0">
                {stats.afbeeldingen}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Zoek content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-[240px]"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Nieuwste eerst</DropdownMenuItem>
                <DropdownMenuItem>Oudste eerst</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Meeste views</DropdownMenuItem>
                <DropdownMenuItem>Minste views</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Alleen gepubliceerd</DropdownMenuItem>
                <DropdownMenuItem>Alleen concepten</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* ── Content grid ─────────────────────────────────────────────────── */}
        <TabsContent value={activeTab} className="mt-4">
          {filteredContent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="font-medium text-muted-foreground">Geen content gevonden</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Pas je zoekopdracht of filters aan.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredContent.map((item) => {
                const typeConfig = TYPE_CONFIG[item.type]
                const TypeIcon = typeConfig.icon
                const categoryClass = CATEGORY_VARIANT[item.category] || ""

                return (
                  <Card
                    key={item.id}
                    className="group relative overflow-hidden transition-shadow hover:shadow-md py-0"
                  >
                    {/* Thumbnail / placeholder area */}
                    <div
                      className={`relative flex h-40 items-center justify-center ${typeConfig.bgColor}`}
                    >
                      <TypeIcon
                        className={`h-12 w-12 ${typeConfig.color} opacity-40 group-hover:opacity-60 transition-opacity`}
                      />
                      {item.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 dark:bg-black/60 shadow-lg backdrop-blur-sm">
                            <Play className="h-5 w-5 text-blue-600 dark:text-blue-400 ml-0.5" />
                          </div>
                        </div>
                      )}
                      {/* Status badge */}
                      {item.status === "concept" && (
                        <Badge
                          variant="secondary"
                          className="absolute top-3 left-3 text-[10px] bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
                        >
                          Concept
                        </Badge>
                      )}
                      {/* Type badge */}
                      <Badge
                        variant="outline"
                        className={`absolute top-3 right-3 text-[10px] ${typeConfig.color} border-current/20 bg-white/80 dark:bg-black/40 backdrop-blur-sm`}
                      >
                        <TypeIcon className="h-3 w-3 mr-1" />
                        {typeConfig.label}
                      </Badge>
                    </div>

                    {/* Card body */}
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Pencil className="h-4 w-4 mr-2" />
                              Bewerken
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" />
                              Dupliceren
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="h-4 w-4 mr-2" />
                              Delen met client
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link2 className="h-4 w-4 mr-2" />
                              Link kopieren
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Verwijderen
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Meta row */}
                      <div className="mt-3 flex items-center gap-3 flex-wrap">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-medium ${categoryClass}`}
                        >
                          {item.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{item.duration}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          <span>{formatViews(item.views)} views</span>
                        </div>
                      </div>

                      {/* Date */}
                      <p className="text-[11px] text-muted-foreground/60 mt-2">
                        {formatDate(item.createdAt)}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
