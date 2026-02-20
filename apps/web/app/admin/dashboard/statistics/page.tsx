import { BarChart3, Activity, Users, TrendingUp, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function StatisticsPage() {
  const features = [
    { icon: Activity, title: "Platform Activiteit", desc: "Real-time overzicht van gebruikers en sessies" },
    { icon: Users, title: "Gebruikers Groei", desc: "Registraties, churn en retentie statistieken" },
    { icon: TrendingUp, title: "Engagement Metrics", desc: "Check-in compliance, app gebruik en feature adoptie" },
    { icon: Calendar, title: "Periode Vergelijking", desc: "Vergelijk metrics week-over-week en maand-over-maand" },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Statistieken</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Platform statistieken en gebruikersdata</p>
      </div>

      <Card className="shadow-sm border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <BarChart3 className="size-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Statistieken — Binnenkort beschikbaar</h3>
          <p className="text-sm text-muted-foreground max-w-md mb-6">
            Gedetailleerde platform statistieken en gebruikersanalytics.
            Van registratie trends tot engagement metrics.
          </p>
          <Badge variant="outline" className="text-xs text-muted-foreground">In ontwikkeling</Badge>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {features.map((f) => (
          <Card key={f.title} className="shadow-sm">
            <CardContent className="p-4 flex items-start gap-3">
              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <f.icon className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{f.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
