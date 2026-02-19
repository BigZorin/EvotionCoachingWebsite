import UsersTab from "../UsersTab"

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Gebruikers</h1>
        <p className="text-sm text-gray-500">Rollen beheren en accounts verwijderen</p>
      </div>
      <UsersTab />
    </div>
  )
}
