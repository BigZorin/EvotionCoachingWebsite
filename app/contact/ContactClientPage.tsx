"use client"

import type React from "react"

import { useId, useState } from "react"
import Link from "next/link"
import { Send, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type FormState = {
  name: string
  email: string
  message: string
}

export default function ContactClientPage() {
  const nameId = useId()
  const emailId = useId()
  const messageId = useId()
  const [state, setState] = useState<FormState>({ name: "", email: "", message: "" })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState<null | "ok" | "error">(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setSubmitted(null)
    try {
      // Simulate async submit; hook up to a Server Action when ready.
      await new Promise((r) => setTimeout(r, 800))
      setSubmitted("ok")
      setState({ name: "", email: "", message: "" })
    } catch {
      setSubmitted("error")
    } finally {
      setSubmitting(false)
    }
  }

  const whatsappHref = "https://wa.me/31600000000?text=Hoi%20Evotion%2C%20ik%20heb%20een%20vraag%20over%20coaching."

  return (
    <section className="container mx-auto max-w-5xl px-4 py-10 md:py-16">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-zinc-200">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Neem contact op</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor={nameId}>Naam</Label>
                <Input
                  id={nameId}
                  name="name"
                  placeholder="Jouw naam"
                  value={state.name}
                  onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
                  required
                  aria-required="true"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={emailId}>E‑mail</Label>
                <Input
                  id={emailId}
                  name="email"
                  type="email"
                  placeholder="jij@voorbeeld.nl"
                  value={state.email}
                  onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
                  required
                  aria-required="true"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={messageId}>Bericht</Label>
                <Textarea
                  id={messageId}
                  name="message"
                  placeholder="Waar kunnen we je mee helpen?"
                  rows={5}
                  value={state.message}
                  onChange={(e) => setState((s) => ({ ...s, message: e.target.value }))}
                  required
                  aria-required="true"
                />
              </div>

              <div className="flex items-center gap-3">
                <Button type="submit" disabled={submitting} className="min-w-32">
                  <Send className="mr-2 h-4 w-4" />
                  {submitting ? "Versturen…" : "Verstuur"}
                </Button>
                {submitted === "ok" && (
                  <span role="status" aria-live="polite" className="text-sm text-green-600">
                    Bedankt! We nemen snel contact op.
                  </span>
                )}
                {submitted === "error" && (
                  <span role="status" aria-live="polite" className="text-sm text-red-600">
                    Er ging iets mis. Probeer het later opnieuw.
                  </span>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border border-zinc-200">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">WhatsApp</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-zinc-600">Liever direct chatten? Start een WhatsApp gesprek en krijg snel antwoord.</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  start chat
                </Link>
              </Button>
              <p className="text-xs text-zinc-500">Bereikbaar op werkdagen tussen 09:00–17:00.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
