import ClientsTab from "../ClientsTab"

export default function AdminClientsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Clients</h1>
        <p className="text-sm text-gray-500">Goedkeuring, afwijzing en coach toewijzing</p>
      </div>
      <ClientsTab />
    </div>
  )
}
