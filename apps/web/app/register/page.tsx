'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient as createBrowserClient } from '@evotion/auth/src/lib/supabase/client'
import { AuthService } from '@evotion/auth/src/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, User, Mail, Lock } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Wachtwoorden komen niet overeen')
      return
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError('Wachtwoord moet minimaal 6 karakters bevatten')
      return
    }

    setLoading(true)

    try {
      const supabase = createBrowserClient()
      const authService = new AuthService(supabase)

      const { user, error } = await authService.register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: 'CLIENT', // Always CLIENT for public registration
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      if (user) {
        // Redirect to dashboard after successful registration
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || 'Registratie mislukt')
      setLoading(false)
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
            <CardTitle className="text-2xl text-white">Account Aanmaken</CardTitle>
            <CardDescription className="text-[#bad4e1]/70">
              Start je fitness journey met Evotion Coaching
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-[#bad4e1]">
                    Voornaam
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#bad4e1]/50" />
                    <Input
                      id="firstName"
                      placeholder="Jan"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                      disabled={loading}
                      className="pl-10 bg-[#1e1839]/40 border-[#bad4e1]/20 text-white placeholder:text-[#bad4e1]/40 focus:border-[#bad4e1]/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-[#bad4e1]">
                    Achternaam
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#bad4e1]/50" />
                    <Input
                      id="lastName"
                      placeholder="Jansen"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                      disabled={loading}
                      className="pl-10 bg-[#1e1839]/40 border-[#bad4e1]/20 text-white placeholder:text-[#bad4e1]/40 focus:border-[#bad4e1]/50"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#bad4e1]">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#bad4e1]/50" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="jouw@email.nl"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={loading}
                    className="pl-10 bg-[#1e1839]/40 border-[#bad4e1]/20 text-white placeholder:text-[#bad4e1]/40 focus:border-[#bad4e1]/50"
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
                    type="password"
                    placeholder="Minimaal 6 karakters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={loading}
                    className="pl-10 bg-[#1e1839]/40 border-[#bad4e1]/20 text-white placeholder:text-[#bad4e1]/40 focus:border-[#bad4e1]/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#bad4e1]">
                  Bevestig Wachtwoord
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#bad4e1]/50" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Herhaal je wachtwoord"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    disabled={loading}
                    className="pl-10 bg-[#1e1839]/40 border-[#bad4e1]/20 text-white placeholder:text-[#bad4e1]/40 focus:border-[#bad4e1]/50"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#bad4e1] text-[#1e1839] hover:bg-[#bad4e1]/90 font-semibold"
              >
                {loading ? 'Account aanmaken...' : 'Account Aanmaken'}
              </Button>

              <div className="text-center text-sm text-[#bad4e1]/60">
                Al een account?{' '}
                <Link href="/login" className="font-medium text-[#bad4e1] hover:text-white transition-colors">
                  Inloggen
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-[#bad4e1]/40 text-sm mt-6">
          Door je te registreren ga je akkoord met onze{' '}
          <Link href="/algemene-voorwaarden" className="underline hover:text-[#bad4e1]/60">
            algemene voorwaarden
          </Link>
        </p>
      </div>
    </div>
  )
}
