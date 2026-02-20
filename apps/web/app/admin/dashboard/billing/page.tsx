import { CreditCard, Receipt, TrendingUp, Wallet, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function BillingPage() {
  const features = [
    { icon: Receipt, title: "Facturatie", desc: "Automatische maandelijkse facturatie voor coaching pakketten" },
    { icon: TrendingUp, title: "Omzet Overzicht", desc: "Inzicht in maandelijkse en jaarlijkse omzet trends" },
    { icon: Wallet, title: "Stripe Integratie", desc: "Veilige betalingen via Stripe Connect" },
    { icon: Users, title: "Abonnementsbeheer", desc: "Beheer client abonnementen en betaalstatus" },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Facturatie</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Betalingen, abonnementen en omzet</p>
      </div>

      <Card className="shadow-sm border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <CreditCard className="size-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Facturatie — Binnenkort beschikbaar</h3>
          <p className="text-sm text-muted-foreground max-w-md mb-6">
            Beheer betalingen, abonnementen en facturatie via Stripe integratie.
            Bekijk omzet trends en client betaalstatus.
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
