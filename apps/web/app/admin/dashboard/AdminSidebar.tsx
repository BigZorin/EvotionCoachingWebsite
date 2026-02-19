"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { createBrowserClient } from "@supabase/ssr"
import {
  LayoutDashboard,
  Users,
  Shield,
  Globe,
  Dumbbell,
  LogOut,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  {
    name: "Overzicht",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Clients",
    href: "/admin/dashboard/clients",
    icon: Users,
  },
  {
    name: "Gebruikers",
    href: "/admin/dashboard/users",
    icon: Shield,
  },
  {
    name: "Website Analytics",
    href: "/admin/dashboard/analytics",
    icon: Globe,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") return pathname === href
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <div className="flex h-screen w-64 flex-col bg-[#1e1839] border-r border-white/5">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-white/5">
        <Image
          src="/images/evotion-logo.png"
          alt="Evotion Coaching"
          width={120}
          height={40}
          className="h-8 w-auto brightness-0 invert"
        />
      </div>

      {/* Role badge */}
      <div className="px-5 pt-4 pb-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
          <Shield className="h-3 w-3" />
          Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all",
                  isActive(item.href)
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Divider */}
        <div className="my-4 border-t border-white/10" />

        {/* Coach Dashboard Link */}
        <Link
          href="/coach/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-white/50 hover:bg-white/5 hover:text-white rounded-lg transition-all"
        >
          <Dumbbell className="h-5 w-5" />
          <span>Coach Dashboard</span>
          <ExternalLink className="h-3.5 w-3.5 ml-auto" />
        </Link>
      </nav>

      {/* Logout */}
      <div className="border-t border-white/5 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white rounded-lg transition-all"
        >
          <LogOut className="h-5 w-5" />
          <span>Uitloggen</span>
        </button>
      </div>
    </div>
  )
}
