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
    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
      {tabs.map((tab) => {
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              active === tab.id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {Icon && <Icon className="w-4 h-4 inline mr-1.5 -mt-0.5" />}
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
