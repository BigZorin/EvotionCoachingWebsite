"use client"

import { useState, useEffect, useRef } from "react"
import { Camera, Save, Loader2, User, Bell, Link as LinkIcon, Upload, Trash2, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  getCoachProfile,
  updateCoachProfile,
  uploadCoachAvatar,
  type CoachProfile,
} from "@/app/actions/coach-profile"

export default function CoachSettingsClient() {
  const [profile, setProfile] = useState<CoachProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [bio, setBio] = useState("")

  useEffect(() => { loadProfile() }, [])

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
      setMessage({ type: "success", text: "Profiel opgeslagen" })
      setProfile((prev) => prev ? { ...prev, first_name: firstName, last_name: lastName, bio } : prev)
    } else {
      setMessage({ type: "error", text: result.error || "Opslaan mislukt" })
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setMessage(null)
    const formData = new FormData()
    formData.append("file", file)
    const result = await uploadCoachAvatar(formData)
    setUploading(false)
    if (result.success && result.avatarUrl) {
      setProfile((prev) => prev ? { ...prev, avatar_url: result.avatarUrl! } : prev)
      setMessage({ type: "success", text: "Profielfoto bijgewerkt" })
    } else {
      setMessage({ type: "error", text: result.error || "Upload mislukt" })
    }
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const initials = profile
    ? `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "C"
    : "C"

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Instellingen laden...</span>
        </div>
      </div>
    )
  }

  // Notification settings (placeholder — connect to Supabase later)
  const meldingInstellingen = [
    { titel: "Nieuwe check-in ontvangen", beschrijving: "Melding wanneer een cliënt een check-in indient", actief: true },
    { titel: "Nieuw bericht", beschrijving: "Melding bij nieuwe cliëntberichten", actief: true },
    { titel: "Sessieherinnering", beschrijving: "Herinnering 15 minuten voor geplande sessies", actief: true },
    { titel: "Cliënt mijlpaal", beschrijving: "Wanneer een cliënt een programma-mijlpaal bereikt", actief: false },
    { titel: "Weekrapport", beschrijving: "Ontvang wekelijks een bedrijfsoverzicht per e-mail", actief: true },
  ]

  // Integrations (placeholder)
  const integraties = [
    { naam: "Google Calendar", beschrijving: "Synchroniseer je coaching sessies", gekoppeld: false, icoon: "GC" },
    { naam: "Stripe", beschrijving: "Verwerk cliëntbetalingen", gekoppeld: false, icoon: "ST" },
    { naam: "Zoom", beschrijving: "Videogesprek integratie voor sessies", gekoppeld: false, icoon: "ZM" },
    { naam: "MyFitnessPal", beschrijving: "Importeer cliënt voedingsdata", gekoppeld: false, icoon: "MF" },
  ]

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold">Instellingen</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Beheer je account en voorkeuren</p>
      </div>

      <Tabs defaultValue="profiel" className="flex flex-col gap-4">
        <TabsList className="w-fit">
          <TabsTrigger value="profiel" className="gap-2">
            <User className="size-4" />
            Profiel
          </TabsTrigger>
          <TabsTrigger value="meldingen" className="gap-2">
            <Bell className="size-4" />
            Meldingen
          </TabsTrigger>
          <TabsTrigger value="integraties" className="gap-2">
            <LinkIcon className="size-4" />
            Integraties
          </TabsTrigger>
        </TabsList>

        {/* Profiel Tab */}
        <TabsContent value="profiel">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Profielinformatie</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <Avatar className="size-20 border-2 border-border">
                    {profile?.avatar_url ? (
                      <AvatarImage src={profile.avatar_url} alt="Profielfoto" />
                    ) : null}
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    {uploading ? (
                      <Loader2 className="size-5 text-white animate-spin" />
                    ) : (
                      <Camera className="size-5 text-white" />
                    )}
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                      <Upload className="size-3.5" />
                      {uploading ? "Uploaden..." : "Foto wijzigen"}
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground">JPG, PNG of WebP. Max 5MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium">Voornaam</label>
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium">Achternaam</label>
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label className="text-xs font-medium">E-mail</label>
                  <Input value={profile?.email || ""} disabled className="bg-secondary/50" />
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="Vertel iets over jezelf als coach..."
                  className="min-h-24 rounded-lg border border-border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
              </div>

              <div className="flex items-center justify-between">
                {message && (
                  <p className={`text-sm ${message.type === "success" ? "text-emerald-600" : "text-destructive"}`}>
                    {message.text}
                  </p>
                )}
                <div className="ml-auto flex gap-2">
                  <Button variant="outline">Annuleren</Button>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="size-4 mr-1.5 animate-spin" /> : <Save className="size-4 mr-1.5" />}
                    Wijzigingen opslaan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Meldingen Tab */}
        <TabsContent value="meldingen">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Meldingsvoorkeuren</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {meldingInstellingen.map((melding) => (
                <div key={melding.titel} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{melding.titel}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{melding.beschrijving}</p>
                  </div>
                  <button
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      melding.actief ? "bg-primary" : "bg-secondary"
                    }`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      melding.actief ? "translate-x-4.5" : "translate-x-0.5"
                    }`} />
                  </button>
                </div>
              ))}
              <p className="text-[11px] text-muted-foreground">
                Meldingsinstellingen worden binnenkort beschikbaar. Momenteel ontvang je standaard meldingen.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integraties Tab */}
        <TabsContent value="integraties">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Gekoppelde diensten</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {integraties.map((integratie) => (
                <div key={integratie.naam} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-xs font-bold">
                      {integratie.icoon}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{integratie.naam}</p>
                      <p className="text-xs text-muted-foreground">{integratie.beschrijving}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" disabled className="text-xs">
                    Binnenkort
                  </Button>
                </div>
              ))}
              <p className="text-[11px] text-muted-foreground">
                Integraties worden stap voor stap beschikbaar. De eerste integratie (Google Calendar) is in ontwikkeling.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
