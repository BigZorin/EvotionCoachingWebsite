import { BarChart3 } from "lucide-react"

export default function StatisticsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <BarChart3 className="h-12 w-12 text-muted-foreground/50 mb-4" />
      <h2 className="text-xl font-semibold mb-2">Statistieken</h2>
      <p className="text-muted-foreground max-w-md">
        Platform statistieken en gebruikersdata.
        Deze functie wordt binnenkort beschikbaar.
      </p>
    </div>
  )
}
