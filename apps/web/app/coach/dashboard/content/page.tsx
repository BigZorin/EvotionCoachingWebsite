"use client"

import { useState, useEffect } from "react"
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
  Loader2,
  FileDown,
  LayoutTemplate,
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
import {
  getContentItems,
  deleteContentItem,
  duplicateContentItem,
  type ContentItem,
} from "@/app/actions/content"

// ─── Types ────────────────────────────────────────────────────────────────────

type ContentType = "video" | "article" | "image" | "pdf" | "template"

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<ContentType, { icon: typeof Video; label: string; color: string; bgColor: string }> = {
  video: {
    icon: Video,
    label: "Video",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/50",
  },
  article: {
    icon: FileText,
    label: "Artikel",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/50",
  },
  image: {
    icon: Image,
    label: "Afbeelding",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/50",
  },
  pdf: {
    icon: FileDown,
    label: "PDF",
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/50",
  },
  template: {
    icon: LayoutTemplate,
    label: "Template",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/50",
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
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  useEffect(() => {
    loadContent()
  }, [])

  async function loadContent() {
    setIsLoading(true)
    const result = await getContentItems()
    if (result.success && result.data) {
      setContentItems(result.data)
    }
    setIsLoading(false)
  }

  async function handleDelete(id: string) {
    setActionLoadingId(id)
    const result = await deleteContentItem(id)
    if (result.success) {
      await loadContent()
    }
    setActionLoadingId(null)
  }

  async function handleDuplicate(id: string) {
    setActionLoadingId(id)
    const result = await duplicateContentItem(id)
    if (result.success) {
      await loadContent()
    }
    setActionLoadingId(null)
  }

  // Filter content by search query and active tab
  const filteredContent = contentItems.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category || "").toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTab =
      activeTab === "alle" ||
      (activeTab === "videos" && item.type === "video") ||
      (activeTab === "artikelen" && item.type === "article") ||
      (activeTab === "afbeeldingen" && item.type === "image")

    return matchesSearch && matchesTab
  })

  // Stats for header cards
  const stats = {
    totaal: contentItems.length,
    videos: contentItems.filter((i) => i.type === "video").length,
    artikelen: contentItems.filter((i) => i.type === "article").length,
    afbeeldingen: contentItems.filter((i) => i.type === "image").length,
    totaalViews: contentItems.reduce((sum, i) => sum + i.views, 0),
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
              <p className="text-2xl font-bold">{isLoading ? "-" : stats.totaal}</p>
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
              <p className="text-2xl font-bold">{isLoading ? "-" : stats.videos}</p>
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
              <p className="text-2xl font-bold">{isLoading ? "-" : stats.artikelen}</p>
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
              <p className="text-2xl font-bold">{isLoading ? "-" : formatViews(stats.totaalViews)}</p>
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/60 mb-3" />
              <p className="text-sm text-muted-foreground">Content laden...</p>
            </div>
          ) : filteredContent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="font-medium text-muted-foreground">Geen content gevonden</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                {contentItems.length === 0
                  ? "Maak je eerste content item aan om te beginnen."
                  : "Pas je zoekopdracht of filters aan."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredContent.map((item) => {
                const typeConfig = TYPE_CONFIG[item.type]
                const TypeIcon = typeConfig.icon
                const categoryClass = CATEGORY_VARIANT[item.category || ""] || ""
                const isActionLoading = actionLoadingId === item.id

                return (
                  <Card
                    key={item.id}
                    className={`group relative overflow-hidden transition-shadow hover:shadow-md py-0 ${isActionLoading ? "opacity-50 pointer-events-none" : ""}`}
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
                      {/* Loading overlay */}
                      {isActionLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/30">
                          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                      )}
                      {/* Status badge */}
                      {item.status === "draft" && (
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
                              disabled={isActionLoading}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Pencil className="h-4 w-4 mr-2" />
                              Bewerken
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicate(item.id)}>
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
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Verwijderen
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Meta row */}
                      <div className="mt-3 flex items-center gap-3 flex-wrap">
                        {item.category && (
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-medium ${categoryClass}`}
                          >
                            {item.category}
                          </Badge>
                        )}
                        {item.duration && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{item.duration}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          <span>{formatViews(item.views)} views</span>
                        </div>
                      </div>

                      {/* Date */}
                      <p className="text-[11px] text-muted-foreground/60 mt-2">
                        {formatDate(item.created_at)}
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
