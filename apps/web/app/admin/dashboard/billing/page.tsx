import { CreditCard } from "lucide-react"

export default function BillingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <CreditCard className="h-12 w-12 text-muted-foreground/50 mb-4" />
      <h2 className="text-xl font-semibold mb-2">Facturatie</h2>
      <p className="text-muted-foreground max-w-md">
        Beheer betalingen, abonnementen en facturatie.
        Deze functie wordt binnenkort beschikbaar.
      </p>
    </div>
  )
}
