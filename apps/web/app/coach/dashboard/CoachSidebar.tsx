"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Calendar,
  MessageCircle,
  Dumbbell,
  UtensilsCrossed,
  BookOpen,
  Settings,
  LogOut,
  ChevronsUpDown,
  User,
} from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"
import { getCoachProfile, type CoachProfile } from "@/app/actions/coach-profile"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const coachNavItems = [
  { title: "Dashboard", href: "/coach/dashboard", icon: LayoutDashboard },
  { title: "Cliënten", href: "/coach/dashboard/clients", icon: Users },
  { title: "Programma's", href: "/coach/dashboard/workouts/programs", icon: Dumbbell },
  { title: "Voeding", href: "/coach/dashboard/nutrition/meal-plans", icon: UtensilsCrossed },
  { title: "Berichten", href: "/coach/dashboard/messages", icon: MessageCircle },
  { title: "Agenda", href: "/coach/dashboard/calendar", icon: Calendar },
  { title: "Content", href: "/coach/dashboard/content", icon: BookOpen },
]

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/coach/dashboard") return pathname === href
  if (href === "/coach/dashboard/workouts/programs") {
    return pathname.startsWith("/coach/dashboard/workouts")
  }
  if (href === "/coach/dashboard/nutrition/meal-plans") {
    return pathname.startsWith("/coach/dashboard/nutrition")
  }
  return pathname === href || pathname.startsWith(href + "/")
}

export default function CoachSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [profile, setProfile] = useState<CoachProfile | null>(null)

  useEffect(() => {
    getCoachProfile().then((res) => {
      if (res.success && res.profile) setProfile(res.profile)
    })
  }, [pathname])

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

  const initials = profile
    ? `${(profile.first_name || "")[0] || ""}${(profile.last_name || "")[0] || ""}`.toUpperCase()
    : "C"

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <Image
            src="/images/evotion-logo.png"
            alt="Evotion"
            width={28}
            height={28}
            className="h-7 w-7 brightness-0 invert flex-shrink-0"
          />
          <span className="text-sm font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            Evotion Coaching
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {coachNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isNavActive(pathname, item.href)}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    {profile?.avatar_url ? (
                      <AvatarImage src={profile.avatar_url} alt={coachName} />
                    ) : null}
                    <AvatarFallback className="rounded-lg bg-sidebar-accent text-sidebar-accent-foreground text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{coachName}</span>
                    <span className="truncate text-xs text-sidebar-foreground/60">
                      {profile?.email || ""}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top"
                align="start"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link href="/coach/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Instellingen
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Uitloggen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
