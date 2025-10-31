import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-foreground">Evotion Coaching</h1>
        <p className="mb-8 text-lg text-muted-foreground">It is time to bring your evolution in motion.</p>
        <Button asChild size="lg">
          <Link href="/martin-socials">Bekijk Martin&apos;s Links</Link>
        </Button>
      </div>
    </div>
  )
}
