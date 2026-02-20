import { Calendar } from "lucide-react"

export default function CalendarPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Calendar className="h-12 w-12 text-muted-foreground/50 mb-4" />
      <h2 className="text-xl font-semibold mb-2">Agenda</h2>
      <p className="text-muted-foreground max-w-md">
        Plan sessies, gesprekken en afspraken met je cliënten.
        Deze functie wordt binnenkort beschikbaar.
      </p>
    </div>
  )
}
