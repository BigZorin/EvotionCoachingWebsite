"use client"

interface SubTab {
  id: string
  label: string
  icon?: any
}

interface SubTabNavigationProps {
  tabs: SubTab[]
  active: string
  onChange: (id: string) => void
}

export default function SubTabNavigation({ tabs, active, onChange }: SubTabNavigationProps) {
  return (
    <div className="flex gap-1 bg-muted/60 p-1 rounded-xl w-fit overflow-x-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
              isActive
                ? "bg-card text-evotion-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {Icon && <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-evotion-primary" : ""}`} />}
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
