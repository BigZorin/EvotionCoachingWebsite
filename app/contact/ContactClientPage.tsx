"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { Mail, Phone, MessageCircle, Send, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ContactClientPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    // Simulate send. You can wire this to a Server Action later.
    await new Promise((r) => setTimeout(r, 900))

    setIsSubmitting(false)
    setSubmitted(true)
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-16">
      <section className="mb-10 space-y-3 text-center animate-in fade-in-0 duration-500">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Neem contact op</h1>
        <p className="text-muted-foreground">
          We reageren meestal binnen 24 uur. Liever direct contact? Start een WhatsApp-chat.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-5">
        {/* Form */}
        <Card className="md:col-span-3 animate-in fade-in-0 slide-in-from-left-4 duration-500">
          <CardHeader>
            <CardTitle>Stuur ons een bericht</CardTitle>
            <CardDescription>Vul je gegevens in en vertel kort waar we je mee kunnen helpen.</CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="flex items-start gap-3 rounded-md border border-green-200 bg-green-50 p-4 text-green-700">
                <CheckCircle2 className="mt-0.5 size-5" aria-hidden="true" />
                <div>
                  <p className="font-medium">Bedankt voor je bericht!</p>
                  <p className="text-sm">
                    We hebben je inzending ontvangen en nemen zo snel mogelijk contact met je op.
                  </p>
                </div>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={onSubmit} aria-describedby={error ? "form-error" : undefined}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Naam</Label>
                    <Input id="name" name="name" placeholder="Jouw naam" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" name="email" type="email" placeholder="jij@voorbeeld.nl" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefoon (optioneel)</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="06 12345678" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Onderwerp</Label>
                  <Input id="subject" name="subject" placeholder="Waar kunnen we mee helpen?" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Bericht</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Vertel kort over je doelen of vraag..."
                    rows={5}
                    required
                  />
                </div>

                {error && (
                  <p id="form-error" className="text-sm text-red-600">
                    {error}
                  </p>
                )}

                <div className="flex items-center gap-3">
                  <Button
                    type="submit"
                    className="bg-purple-600 text-white hover:bg-purple-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <Send className="size-4 animate-pulse" aria-hidden="true" />
                        Versturen...
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <Send className="size-4" aria-hidden="true" />
                        Verstuur bericht
                      </span>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      const form = document.querySelector("form")
                      form?.reset()
                      setError(null)
                    }}
                  >
                    Reset
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Door te verzenden ga je akkoord met onze verwerking van je gegevens om je aanvraag te behandelen.
                </p>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Direct contact options */}
        <div className="flex flex-col gap-6 md:col-span-2">
          <Card className="animate-in fade-in-0 slide-in-from-right-4 duration-500">
            <CardHeader>
              <CardTitle>WhatsApp</CardTitle>
              <CardDescription>Chat direct met ons team. We antwoorden doorgaans snel.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="rounded-md bg-purple-100 p-2 text-purple-700">
                  <MessageCircle className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-medium">Start chat</p>
                  <p className="text-sm text-muted-foreground">
                    Stel je vraag of deel je doel en we denken direct met je mee.
                  </p>
                </div>
              </div>
              <Button asChild className="bg-purple-600 text-white hover:bg-purple-700">
                <a
                  href="https://wa.me/31600000000?text=Hi%20Evotion%20Coaching%2C%20ik%20heb%20een%20vraag%20over..."
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Start chat via WhatsApp"
                >
                  Start chat
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in-0 slide-in-from-right-6 duration-500">
            <CardHeader>
              <CardTitle>Andere contactopties</CardTitle>
              <CardDescription>Je kunt ons ook mailen of bellen.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="size-5 text-muted-foreground" aria-hidden="true" />
                <Link href="mailto:info@evotioncoaching.nl" className="underline underline-offset-2">
                  info@evotioncoaching.nl
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="size-5 text-muted-foreground" aria-hidden="true" />
                <Link href="tel:+31600000000" className="underline underline-offset-2">
                  +31 6 00000000
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
