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
    <div className="flex gap-1 bg-secondary p-1 rounded-lg w-fit overflow-x-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition whitespace-nowrap ${
              active === tab.id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
