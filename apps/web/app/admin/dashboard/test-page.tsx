"use client"

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1839] via-[#2a2054] to-[#1e1839] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Test Page - Admin Dashboard</h1>
        <p className="text-[#bad4e1] text-lg">
          Als je dit ziet, dan werkt de pagina! Het probleem zit dan waarschijnlijk in de ClientsTab component.
        </p>

        <div className="mt-8 p-6 bg-[#1e1839]/60 border-[#bad4e1]/20 border rounded-lg">
          <h2 className="text-2xl text-white mb-2">Debugging Info:</h2>
          <ul className="text-[#bad4e1]/80 space-y-2">
            <li>✅ React werkt</li>
            <li>✅ Styling werkt</li>
            <li>✅ Page rendering werkt</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
