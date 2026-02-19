"use client"

import { useState, useEffect, useRef } from "react"
import { Camera, Save, Loader2, User } from "lucide-react"
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

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Instellingen</h1>

      {/* Profile Photo Section */}
      <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Profielfoto</h2>
        <div className="flex items-center gap-6">
          <div className="relative group">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Profielfoto"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-[#1e1839] flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              {uploading ? (
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              ) : (
                <Camera className="h-6 w-6 text-white" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
          <div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="text-sm font-medium text-[#1e1839] hover:text-[#1e1839]/80 transition-colors"
            >
              {uploading ? "Uploaden..." : "Foto wijzigen"}
            </button>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG of WebP. Max 5MB.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Profiel</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Voornaam</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1839]/20 focus:border-[#1e1839]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Achternaam</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1839]/20 focus:border-[#1e1839]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              value={profile?.email || ""}
              disabled
              className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Vertel iets over jezelf als coach..."
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1839]/20 focus:border-[#1e1839] resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          {message && (
            <p className={`text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {message.text}
            </p>
          )}
          <div className="ml-auto">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-[#1e1839] text-white text-sm font-medium rounded-lg hover:bg-[#1e1839]/90 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Opslaan
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
