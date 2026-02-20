"use client"

import { usePathname } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

const routeTitles: Record<string, { title: string; subtitle?: string }> = {
  "/coach/dashboard": { title: "Dashboard", subtitle: "Overzicht van je coaching praktijk" },
  "/coach/dashboard/clients": { title: "Cliënten", subtitle: "Beheer je client overzicht" },
  "/coach/dashboard/workouts/programs": { title: "Programma's", subtitle: "Training programma's beheren" },
  "/coach/dashboard/workouts/templates": { title: "Templates", subtitle: "Workout templates beheren" },
  "/coach/dashboard/workouts": { title: "Oefeningen", subtitle: "Oefeningen database" },
  "/coach/dashboard/workouts/logs": { title: "Training Logs", subtitle: "Voltooide trainingen" },
  "/coach/dashboard/nutrition/meal-plans": { title: "Maaltijdplannen", subtitle: "Maaltijdplannen beheren" },
  "/coach/dashboard/nutrition/recipes": { title: "Recepten", subtitle: "Recepten database" },
  "/coach/dashboard/nutrition/assigned": { title: "Toegewezen Plannen", subtitle: "Actieve voedingsplannen" },
  "/coach/dashboard/nutrition/food-logs": { title: "Food Logs", subtitle: "Voedingslogs van clients" },
  "/coach/dashboard/messages": { title: "Berichten", subtitle: "Chat met je cliënten" },
  "/coach/dashboard/calendar": { title: "Agenda", subtitle: "Sessies en planning" },
  "/coach/dashboard/content": { title: "Content", subtitle: "Content library" },
  "/coach/dashboard/check-ins": { title: "Check-ins", subtitle: "Client check-ins overzicht" },
  "/coach/dashboard/progress": { title: "Voortgang", subtitle: "Client voortgang analyse" },
  "/coach/dashboard/health": { title: "Gezondheid", subtitle: "Gezondheidsdata overzicht" },
  "/coach/dashboard/settings": { title: "Instellingen", subtitle: "Account en voorkeuren" },
  "/admin/dashboard": { title: "Admin Overzicht", subtitle: "Platform beheer" },
  "/admin/dashboard/analytics": { title: "Analytics", subtitle: "Website statistieken" },
  "/admin/dashboard/users": { title: "Gebruikers", subtitle: "Gebruikers beheer" },
  "/admin/dashboard/clients": { title: "Clients", subtitle: "Client beheer" },
  "/admin/dashboard/courses": { title: "Courses", subtitle: "Cursussen beheren" },
  "/admin/dashboard/statistics": { title: "Statistieken", subtitle: "Platform statistieken" },
  "/admin/dashboard/billing": { title: "Facturatie", subtitle: "Betalingen en abonnementen" },
}

function getTitleForPath(pathname: string): { title: string; subtitle?: string } {
  if (routeTitles[pathname]) return routeTitles[pathname]
  // Try progressively shorter prefixes for dynamic routes like /clients/[id]
  const segments = pathname.split("/")
  while (segments.length > 2) {
    segments.pop()
    const prefix = segments.join("/")
    if (routeTitles[prefix]) return routeTitles[prefix]
  }
  return { title: "Dashboard" }
}

export function DashboardHeader() {
  const pathname = usePathname()
  const { title, subtitle } = getTitleForPath(pathname)

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4" />
      <div className="flex-1">
        <h1 className="text-sm font-semibold leading-none">{title}</h1>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
    </header>
  )
}
