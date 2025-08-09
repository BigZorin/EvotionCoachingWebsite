"use client"

import type React from "react"
import { useState, useId } from "react"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type FormState = {
  name: string
  email: string
  phone: string
  message: string
}

export default function ContactClientPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formId = useId()
  const [state, setState] = useState<FormState>({ name: "", email: "", phone: "", message: "" })
  const [submitted, setSubmitted] = useState<null | "ok" | "error">(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitted(null)
    try {
      const data = new FormData(e.currentTarget)
      // TODO: Wire to server action in app/actions/contact.ts if desired.
      // await submitContact(data)

      // Simulate latency for UX feedback
      await new Promise((r) => setTimeout(r, 800))
      setSubmitted("ok")
      e.currentTarget.reset()
    } catch (err) {
      console.error(err)
      setSubmitted("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const whatsappHref =
    // Replace with your real number, format: https://wa.me/<countrycode><number>
    "https://wa.me/31600000000?text=Hoi%20Evotion%20Coach,%20ik%20heb%20een%20vraag%20over%20coaching."

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 md:py-16">
      <div className="mb-8 text-center md:mb-12">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Neem contact op</h1>
        <p className="mt-2 text-muted-foreground">
          Stel je vraag of plan een gratis kennismaking. We reageren meestal binnen 24 uur.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact form */}
        <Card className="animate-in fade-in slide-in-from-left-2 duration-500 border border-zinc-200">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Stuur ons een bericht</CardTitle>
          </CardHeader>
          <CardContent>
            <form aria-labelledby={formId} onSubmit={onSubmit} className="space-y-4">
              <span id={formId} className="sr-only">
                Contactformulier
              </span>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Naam
                  </label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="Jouw naam"
                    autoComplete="name"
                    value={state.name}
                    onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    E-mail
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="jij@example.com"
                    autoComplete="email"
                    value={state.email}
                    onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Telefoon (optioneel)
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="06 12345678"
                  autoComplete="tel"
                  value={state.phone}
                  onChange={(e) => setState((s) => ({ ...s, phone: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Bericht
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  placeholder="Vertel ons waar we je mee kunnen helpen..."
                  rows={5}
                  value={state.message}
                  onChange={(e) => setState((s) => ({ ...s, message: e.target.value }))}
                />
              </div>

              <div className="flex items-center gap-3">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Versturen..." : "Verstuur"}
                </Button>

                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex">
                  <Button type="button" variant="secondary" className="gap-2">
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    <span>Start chat</span>
                  </Button>
                </a>
              </div>

              <p className="text-xs text-muted-foreground">
                Door te verzenden ga je akkoord met onze verwerking van je gegevens uitsluitend om op je bericht te
                reageren.
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Info panel */}
        <Card className="animate-in fade-in slide-in-from-right-2 duration-500 border border-zinc-200">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Onze gegevens</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              E-mail:{" "}
              <a className="underline hover:no-underline" href="mailto:info@evotioncoaching.nl">
                info@evotioncoaching.nl
              </a>
            </p>
            <p>
              WhatsApp:{" "}
              <a className="underline hover:no-underline" href={whatsappHref} target="_blank" rel="noopener noreferrer">
                +31 6 00000000
              </a>
            </p>
            <p>Beschikbaar: ma–vr, 09:00–18:00</p>
            <p className="text-muted-foreground">
              Liever direct plannen? Stuur “KENNISMAKING” via WhatsApp, dan sturen wij je een kalenderlink.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
