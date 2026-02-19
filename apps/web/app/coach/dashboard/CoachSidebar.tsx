"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import {
  LayoutDashboard,
  Users,
  Calendar,
  MessageCircle,
  Dumbbell,
  UtensilsCrossed,
  Zap,
  Activity,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  User,
  ClipboardList,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createBrowserClient } from "@supabase/ssr"
import { getCoachProfile, type CoachProfile } from "@/app/actions/coach-profile"

type NavChild = { name: string; href: string }
type NavItem = {
  name: string
  href?: string
  icon: any
  children?: NavChild[]
}

const navigation: NavItem[] = [
  {
    name: "Dashboard",
    href: "/coach/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Clients",
    icon: Users,
    children: [
      { name: "Overzicht", href: "/coach/dashboard/clients" },
      { name: "Voortgang", href: "/coach/dashboard/progress" },
    ],
  },
  {
    name: "Training",
    icon: Dumbbell,
    children: [
      { name: "Programma's", href: "/coach/dashboard/workouts/programs" },
      { name: "Templates", href: "/coach/dashboard/workouts/templates" },
      { name: "Oefeningen", href: "/coach/dashboard/workouts" },
      { name: "Logs", href: "/coach/dashboard/workouts/logs" },
    ],
  },
  {
    name: "Check-ins",
    icon: ClipboardList,
    children: [
      { name: "Overzicht", href: "/coach/dashboard/check-ins" },
      { name: "Templates", href: "/coach/dashboard/check-ins/templates" },
      { name: "Gewoontes", href: "/coach/dashboard/habits" },
    ],
  },
  {
    name: "Voeding",
    icon: UtensilsCrossed,
    children: [
      { name: "Recepten", href: "/coach/dashboard/nutrition/recipes" },
      { name: "Maaltijdplannen", href: "/coach/dashboard/nutrition/meal-plans" },
      { name: "Toegewezen", href: "/coach/dashboard/nutrition/assigned" },
      { name: "Food Logs", href: "/coach/dashboard/nutrition/food-logs" },
    ],
  },
  {
    name: "Berichten",
    href: "/coach/dashboard/messages",
    icon: MessageCircle,
  },
  {
    name: "Gezondheid",
    href: "/coach/dashboard/health",
    icon: Activity,
  },
  {
    name: "Agenda",
    href: "/coach/dashboard/calendar",
    icon: Calendar,
  },
  {
    name: "Automations",
    href: "/coach/dashboard/automations",
    icon: Zap,
  },
  {
    name: "Instellingen",
    href: "/coach/dashboard/settings",
    icon: Settings,
  },
]

// Check if a path matches a nav item (supports nested routes)
function isPathActive(pathname: string, href: string) {
  if (href === "/coach/dashboard") return pathname === href
  return pathname === href || pathname.startsWith(href + "/")
}

// Check if any child of a group matches the current path
function isGroupActive(pathname: string, children?: NavChild[]) {
  if (!children) return false
  return children.some((child) => isPathActive(pathname, child.href))
}

export default function CoachSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [profile, setProfile] = useState<CoachProfile | null>(null)

  // Load profile on mount and refresh on navigation (catches settings page changes)
  useEffect(() => {
    getCoachProfile().then((res) => {
      if (res.success && res.profile) setProfile(res.profile)
    })
  }, [pathname])

  // Auto-expand groups that contain the active route
  useEffect(() => {
    const activeGroups = navigation
      .filter((item) => item.children && isGroupActive(pathname, item.children))
      .map((item) => item.name)
    if (activeGroups.length > 0) {
      setExpandedItems((prev) => {
        const merged = new Set([...prev, ...activeGroups])
        return Array.from(merged)
      })
    }
  }, [pathname])

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    )
  }

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    router.push("/login")
  }

  const coachName = profile
    ? `${profile.first_name} ${profile.last_name}`.trim() || "Coach"
    : "Coach"

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

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isExpanded = expandedItems.includes(item.name)
            const hasChildren = item.children && item.children.length > 0
            const groupActive = hasChildren && isGroupActive(pathname, item.children)

            return (
              <li key={item.name}>
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => toggleExpand(item.name)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all",
                        groupActive
                          ? "text-white"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>

                    {isExpanded && (
                      <ul className="mt-1 ml-8 space-y-0.5">
                        {item.children!.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className={cn(
                                "block px-3 py-2 text-sm rounded-lg transition-all",
                                isPathActive(pathname, child.href)
                                  ? "bg-white/10 text-white font-medium"
                                  : "text-white/60 hover:bg-white/5 hover:text-white"
                              )}
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href!}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all",
                      isPathActive(pathname, item.href!)
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="border-t border-white/5 p-4 space-y-2">
        <Link
          href="/coach/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all"
        >
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt=""
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 text-white/70" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{coachName}</p>
            <p className="text-xs text-white/50 truncate">{profile?.email || ""}</p>
          </div>
        </Link>

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
