"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { loginAdmin } from "@/app/actions/admin-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, User, AlertCircle } from "lucide-react"
import Image from "next/image"

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await loginAdmin(formData)

    if (result.success) {
      window.location.href = "/admin/dashboard"
    } else {
      setError(result.error || "Er is een fout opgetreden")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1e1839] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/images/evotion-logo.png"
            alt="Evotion Coaching"
            width={180}
            height={60}
            className="h-12 w-auto"
          />
        </div>

        <Card className="bg-[#1e1839]/60 border-[#bad4e1]/20 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Admin Login</CardTitle>
            <CardDescription className="text-[#bad4e1]/70">
              Log in om toegang te krijgen tot het dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="text-[#bad4e1]">
                  Gebruikersnaam
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#bad4e1]/50" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="pl-10 bg-[#1e1839]/40 border-[#bad4e1]/20 text-white placeholder:text-[#bad4e1]/40 focus:border-[#bad4e1]/50"
                    placeholder="Voer gebruikersnaam in"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#bad4e1]">
                  Wachtwoord
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#bad4e1]/50" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="pl-10 bg-[#1e1839]/40 border-[#bad4e1]/20 text-white placeholder:text-[#bad4e1]/40 focus:border-[#bad4e1]/50"
                    placeholder="Voer wachtwoord in"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#bad4e1] text-[#1e1839] hover:bg-[#bad4e1]/90 font-semibold"
              >
                {isLoading ? "Bezig met inloggen..." : "Inloggen"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-[#bad4e1]/40 text-sm mt-6">Alleen voor geautoriseerde beheerders</p>
      </div>
    </div>
  )
}
