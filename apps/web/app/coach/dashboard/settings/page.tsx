"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  User,
  Bell,
  Link as LinkIcon,
  Camera,
  Upload,
  Trash2,
  X,
  Loader2,
  Save,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Video,
  Dumbbell,
  Heart,
  Zap,
} from "lucide-react"
import {
  getCoachProfile,
  updateCoachProfile,
  uploadCoachAvatar,
  type CoachProfile,
} from "@/app/actions/coach-profile"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// ─── Notification settings placeholder ────────────────────────────────
// TODO: Replace with Supabase notification_preferences table
const defaultNotifications = [
  {
    id: "new_checkin",
    label: "Nieuwe check-in",
    description: "Ontvang een melding wanneer een client een check-in indient",
    enabled: true,
  },
  {
    id: "new_message",
    label: "Nieuw bericht",
    description: "Ontvang een melding bij een nieuw chatbericht van een client",
    enabled: true,
  },
  {
    id: "session_reminder",
    label: "Sessieherinnering",
    description: "Herinnering 30 minuten voor een geplande sessie",
    enabled: true,
  },
  {
    id: "payment_received",
    label: "Betaling ontvangen",
    description: "Melding wanneer een betaling is verwerkt",
    enabled: false,
  },
  {
    id: "client_inactive",
    label: "Inactieve client",
    description: "Waarschuwing wanneer een client 7+ dagen geen activiteit toont",
    enabled: true,
  },
  {
    id: "weekly_summary",
    label: "Wekelijkse samenvatting",
    description: "Ontvang elke maandag een overzicht van je clienten",
    enabled: false,
  },
]

// ─── Integration placeholders ─────────────────────────────────────────
// TODO: Replace with Supabase coach_integrations table
const integrationsList = [
  {
    id: "google_calendar",
    name: "Google Calendar",
    description: "Synchroniseer sessies en afspraken automatisch met je agenda",
    icon: Calendar,
    connected: false,
    color: "text-blue-600 bg-blue-50",
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Ontvang betalingen en beheer abonnementen van je clienten",
    icon: CreditCard,
    connected: false,
    color: "text-purple-600 bg-purple-50",
  },
  {
    id: "zoom",
    name: "Zoom",
    description: "Start videogesprekken direct vanuit het dashboard",
    icon: Video,
    connected: false,
    color: "text-blue-500 bg-blue-50",
  },
  {
    id: "myfitnesspal",
    name: "MyFitnessPal",
    description: "Importeer voedingsdata van je clienten automatisch",
    icon: Dumbbell,
    connected: false,
    color: "text-green-600 bg-green-50",
  },
  {
    id: "apple_health",
    name: "Apple Health",
    description: "Ontvang gezondheidsdata zoals stappen, slaap en hartslag",
    icon: Heart,
    connected: false,
    color: "text-red-500 bg-red-50",
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Verbind Evotion met 5000+ andere apps via automatiseringen",
    icon: Zap,
    connected: false,
    color: "text-orange-500 bg-orange-50",
  },
]

export default function CoachSettingsPage() {
  // ─── Profile state (backed by Supabase) ────────────────────────────
  const [profile, setProfile] = useState<CoachProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneInputRef = useRef<HTMLInputElement>(null)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [bio, setBio] = useState("")
  const [phone, setPhone] = useState("") // TODO: add phone to Supabase profiles table

  // ─── Photo upload dialog state ──────────────────────────────────────
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [previewFile, setPreviewFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // ─── Notification state (placeholder) ───────────────────────────────
  const [notifications, setNotifications] = useState(defaultNotifications)

  // ─── Integration state (placeholder) ────────────────────────────────
  const [integrations, setIntegrations] = useState(integrationsList)

  // ─── Load profile from Supabase ─────────────────────────────────────
  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    const result = await getCoachProfile()
    if (result.success && result.profile) {
      setProfile(result.profile)
      setFirstName(result.profile.first_name)
      setLastName(result.profile.last_name)
      setBio(result.profile.bio || "")
    }
    setLoading(false)
  }

  // ─── Save profile to Supabase ───────────────────────────────────────
  async function handleSave() {
    setSaving(true)
    setMessage(null)
    const result = await updateCoachProfile({
      first_name: firstName,
      last_name: lastName,
      bio: bio || null,
    })
    setSaving(false)
    if (result.success) {
      setMessage({ type: "success", text: "Profiel succesvol opgeslagen" })
      setProfile((prev) =>
        prev ? { ...prev, first_name: firstName, last_name: lastName, bio } : prev
      )
    } else {
      setMessage({ type: "error", text: result.error || "Opslaan mislukt" })
    }
  }

  function handleCancel() {
    if (profile) {
      setFirstName(profile.first_name)
      setLastName(profile.last_name)
      setBio(profile.bio || "")
    }
    setMessage(null)
  }

  // ─── Avatar upload (direct click on avatar) ─────────────────────────
  async function handleAvatarUpload(file: File) {
    setUploading(true)
    setMessage(null)

    const formData = new FormData()
    formData.append("file", file)

    const result = await uploadCoachAvatar(formData)
    setUploading(false)

    if (result.success && result.avatarUrl) {
      setProfile((prev) => (prev ? { ...prev, avatar_url: result.avatarUrl! } : prev))
      setMessage({ type: "success", text: "Profielfoto bijgewerkt" })
    } else {
      setMessage({ type: "error", text: result.error || "Upload mislukt" })
    }

    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // ─── Photo dialog handlers ─────────────────────────────────────────
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPreviewFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setPreviewFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }, [])

  async function handlePhotoDialogUpload() {
    if (!previewFile) return
    await handleAvatarUpload(previewFile)
    setPreviewFile(null)
    setPreviewUrl(null)
    setPhotoDialogOpen(false)
  }

  function handlePhotoDialogClose() {
    setPreviewFile(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setPhotoDialogOpen(false)
  }

  function handleRemovePhoto() {
    setPreviewFile(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
  }

  // ─── Notification toggle ────────────────────────────────────────────
  function toggleNotification(id: string) {
    // TODO: Persist to Supabase notification_preferences table
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    )
  }

  // ─── Integration toggle ─────────────────────────────────────────────
  function toggleIntegration(id: string) {
    // TODO: Implement OAuth flow / Supabase coach_integrations table
    setIntegrations((prev) =>
      prev.map((i) => (i.id === id ? { ...i, connected: !i.connected } : i))
    )
  }

  // ─── Initials for avatar fallback ───────────────────────────────────
  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "?"

  // ─── Loading state ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Instellingen</h1>
        <p className="text-muted-foreground">
          Beheer je profiel, meldingen en integraties
        </p>
      </div>

      {/* Status message */}
      {message && (
        <div
          className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <span>{message.text}</span>
          <button
            onClick={() => setMessage(null)}
            className="ml-auto rounded-md p-0.5 hover:bg-black/5 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="profiel" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profiel" className="gap-1.5">
            <User className="h-4 w-4" />
            Profiel
          </TabsTrigger>
          <TabsTrigger value="meldingen" className="gap-1.5">
            <Bell className="h-4 w-4" />
            Meldingen
          </TabsTrigger>
          <TabsTrigger value="integraties" className="gap-1.5">
            <LinkIcon className="h-4 w-4" />
            Integraties
          </TabsTrigger>
        </TabsList>

        {/* ═══════════════════════════════════════════════════════════════
            PROFIEL TAB
        ═══════════════════════════════════════════════════════════════ */}
        <TabsContent value="profiel" className="space-y-6">
          {/* Avatar section */}
          <Card>
            <CardHeader>
              <CardTitle>Profielfoto</CardTitle>
              <CardDescription>
                Deze foto is zichtbaar voor je clienten in de app
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                {/* Avatar with hover overlay */}
                <div className="relative group cursor-pointer" onClick={() => setPhotoDialogOpen(true)}>
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile?.avatar_url || undefined} alt="Profielfoto" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    {uploading ? (
                      <Loader2 className="h-6 w-6 text-white animate-spin" />
                    ) : (
                      <Camera className="h-6 w-6 text-white" />
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPhotoDialogOpen(true)}
                    disabled={uploading}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {uploading ? "Uploaden..." : "Foto wijzigen"}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG of WebP. Max 5MB.
                  </p>
                </div>
              </div>

              {/* Hidden file input for direct avatar click */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleAvatarUpload(file)
                }}
                className="hidden"
              />
            </CardContent>
          </Card>

          {/* Profile form */}
          <Card>
            <CardHeader>
              <CardTitle>Persoonlijke gegevens</CardTitle>
              <CardDescription>
                Pas je contactgegevens en bio aan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Voornaam</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Je voornaam"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Achternaam</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Je achternaam"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={profile?.email || ""}
                    disabled
                    className="pl-9 bg-muted/50"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  E-mailadres kan niet worden gewijzigd
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefoon</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+31 6 12345678"
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  placeholder="Vertel iets over jezelf als coach..."
                />
                <p className="text-xs text-muted-foreground">
                  Maximaal 500 tekens. Dit wordt getoond aan je clienten.
                </p>
              </div>

              <Separator />

              <div className="flex items-center justify-end gap-3">
                <Button variant="outline" onClick={handleCancel}>
                  Annuleren
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Opslaan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════
            MELDINGEN TAB
        ═══════════════════════════════════════════════════════════════ */}
        <TabsContent value="meldingen" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Meldingsvoorkeuren</CardTitle>
              <CardDescription>
                Kies welke meldingen je wilt ontvangen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {notifications.map((notification, index) => (
                  <div key={notification.id}>
                    <div className="flex items-center justify-between py-4">
                      <div className="space-y-0.5 pr-4">
                        <Label className="text-sm font-medium cursor-pointer">
                          {notification.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {notification.description}
                        </p>
                      </div>
                      <Switch
                        checked={notification.enabled}
                        onCheckedChange={() => toggleNotification(notification.id)}
                      />
                    </div>
                    {index < notifications.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>E-mailmeldingen</CardTitle>
              <CardDescription>
                Stel in wanneer je e-mails ontvangt naast push-meldingen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {[
                  {
                    id: "email_daily_digest",
                    label: "Dagelijkse samenvatting",
                    description: "Ontvang elke ochtend een overzicht van openstaande items",
                    enabled: true,
                  },
                  {
                    id: "email_marketing",
                    label: "Tips & updates",
                    description: "Ontvang coaching tips en Evotion productupdates",
                    enabled: false,
                  },
                ].map((item, index, arr) => (
                  <div key={item.id}>
                    <div className="flex items-center justify-between py-4">
                      <div className="space-y-0.5 pr-4">
                        <Label className="text-sm font-medium cursor-pointer">
                          {item.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <Switch defaultChecked={item.enabled} />
                    </div>
                    {index < arr.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════
            INTEGRATIES TAB
        ═══════════════════════════════════════════════════════════════ */}
        <TabsContent value="integraties" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Beschikbare integraties</CardTitle>
              <CardDescription>
                Verbind externe diensten om je workflow te verbeteren
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {integrations.map((integration) => {
                  const IconComponent = integration.icon
                  return (
                    <Card key={integration.id} className="relative overflow-hidden">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${integration.color}`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          {integration.connected && (
                            <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                              Verbonden
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-sm mb-1">
                          {integration.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                          {integration.description}
                        </p>
                        <Button
                          variant={integration.connected ? "outline" : "default"}
                          size="sm"
                          className="w-full"
                          onClick={() => toggleIntegration(integration.id)}
                        >
                          {integration.connected ? (
                            <>
                              <X className="h-3.5 w-3.5 mr-1.5" />
                              Ontkoppelen
                            </>
                          ) : (
                            <>
                              <LinkIcon className="h-3.5 w-3.5 mr-1.5" />
                              Verbinden
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ═══════════════════════════════════════════════════════════════
          PHOTO UPLOAD DIALOG
      ═══════════════════════════════════════════════════════════════ */}
      <Dialog open={photoDialogOpen} onOpenChange={(open) => { if (!open) handlePhotoDialogClose() }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Profielfoto uploaden</DialogTitle>
            <DialogDescription>
              Sleep een afbeelding hierheen of klik om een bestand te selecteren
            </DialogDescription>
          </DialogHeader>

          {previewUrl ? (
            /* ── Preview state ─────────────────────────────────────── */
            <div className="space-y-4">
              <div className="relative mx-auto w-48 h-48 rounded-full overflow-hidden border-2 border-dashed border-muted-foreground/25">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span>{previewFile?.name}</span>
                <button
                  onClick={handleRemovePhoto}
                  className="rounded-md p-1 hover:bg-muted transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5 text-red-500" />
                </button>
              </div>
            </div>
          ) : (
            /* ── Drop zone ─────────────────────────────────────────── */
            <div
              className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-muted-foreground/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => dropZoneInputRef.current?.click()}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">
                Sleep een foto hierheen
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                of klik om te bladeren
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                JPG, PNG of WebP. Max 5MB.
              </p>
              <input
                ref={dropZoneInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handlePhotoDialogClose}>
              Annuleren
            </Button>
            <Button
              onClick={handlePhotoDialogUpload}
              disabled={!previewFile || uploading}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Uploaden
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
