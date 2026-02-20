import { BookOpen } from "lucide-react"

export default function ContentPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
      <h2 className="text-xl font-semibold mb-2">Content Library</h2>
      <p className="text-muted-foreground max-w-md">
        Hier kun je artikelen, video&apos;s en andere content beheren voor je cliënten.
        Deze functie wordt binnenkort beschikbaar.
      </p>
    </div>
  )
}
