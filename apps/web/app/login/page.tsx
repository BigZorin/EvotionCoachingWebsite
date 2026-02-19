'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient as createBrowserClient } from '@evotion/auth/src/lib/supabase/client'
import { AuthService } from '@evotion/auth/src/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Mail, Lock } from 'lucide-react'

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#1e1839] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#bad4e1]" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectParam = searchParams.get('redirect')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createBrowserClient()
      const authService = new AuthService(supabase)

      const { user, error } = await authService.login({ email, password })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      if (user) {
        // Role-based redirect
        let redirectTo = redirectParam || '/dashboard'

        // ADMIN goes to admin dashboard
        if (user.role === 'ADMIN') {
          redirectTo = '/admin/dashboard'
        }
        // COACH goes to coach dashboard
        else if (user.role === 'COACH') {
          redirectTo = '/coach/dashboard'
        }

        router.push(redirectTo)
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || 'Inloggen mislukt')
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
            <CardTitle className="text-2xl text-white">Inloggen</CardTitle>
            <CardDescription className="text-[#bad4e1]/70">
              Log in om toegang te krijgen tot je account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    placeholder="Voer je wachtwoord in"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                {loading ? 'Bezig met inloggen...' : 'Inloggen'}
              </Button>

              <div className="text-center text-sm text-[#bad4e1]/60">
                Nog geen account?{' '}
                <Link href="/register" className="font-medium text-[#bad4e1] hover:text-white transition-colors">
                  Registreren
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-[#bad4e1]/40 text-sm mt-6">
          Wachtwoord vergeten?{' '}
          <Link href="/wachtwoord-vergeten" className="underline hover:text-[#bad4e1]/60">
            Herstel je wachtwoord
          </Link>
        </p>
      </div>
    </div>
  )
}
