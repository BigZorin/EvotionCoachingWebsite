"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, Weight } from "lucide-react"
import {
  getClientProgressPhotos,
  getProgressPhotoSignedUrl,
  type ProgressEntry,
} from "@/app/actions/progress-photos"

export default function ClientPhotosClient({ clientId }: { clientId: string }) {
  const [entries, setEntries] = useState<ProgressEntry[]>([])
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [clientId])

  async function loadData() {
    setLoading(true)
    const result = await getClientProgressPhotos(clientId)
    if (result.success && result.entries) {
      setEntries(result.entries)
      // Load signed URLs for all photos
      const urls: Record<string, string> = {}
      for (const entry of result.entries) {
        for (const photo of entry.photos || []) {
          const urlResult = await getProgressPhotoSignedUrl(photo.storagePath)
          if (urlResult.success && urlResult.url) {
            urls[photo.storagePath] = urlResult.url
          }
        }
      }
      setSignedUrls(urls)
    }
    setLoading(false)
  }

  const entriesWithPhotos = entries.filter((e) => e.photos && e.photos.length > 0)
  const categoryLabel = (cat: string) =>
    cat === "front" ? "Voorkant" : cat === "side" ? "Zijkant" : "Achterkant"

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e1839]"></div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href={`/coach/dashboard/clients/${clientId}`}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Voortgangsfoto&apos;s</h1>
          <p className="text-sm text-gray-500">{entriesWithPhotos.length} sessies</p>
        </div>
      </div>

      {entriesWithPhotos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <p className="text-gray-500 text-lg mb-2">Nog geen voortgangsfoto&apos;s</p>
          <p className="text-gray-400 text-sm">Deze client heeft nog geen foto&apos;s geüpload.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {entriesWithPhotos.map((entry) => (
            <div key={entry.id} className="bg-white rounded-xl border p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="font-semibold text-gray-900">
                    {new Date(entry.date).toLocaleDateString("nl-NL", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {entry.weight_kg && (
                  <div className="flex items-center gap-1 text-sm text-blue-600 font-medium">
                    <Weight className="h-4 w-4" />
                    {entry.weight_kg} kg
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {entry.photos.map((photo, idx) => {
                  const url = signedUrls[photo.storagePath]
                  return (
                    <div key={idx} className="text-center">
                      <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 mb-2">
                        {url ? (
                          <img
                            src={url}
                            alt={`${categoryLabel(photo.category)} - ${entry.date}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-300"></div>
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{categoryLabel(photo.category)}</span>
                    </div>
                  )
                })}
              </div>

              {entry.notes && (
                <p className="text-sm text-gray-500 italic mt-4">{entry.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
