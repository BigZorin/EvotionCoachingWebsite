import { createClient as createServerClient } from '@evotion/auth/src/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function DashboardPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user from database
  const { data: userRecord } = await supabase
    .from('users')
    .select('id, email, role')
    .eq('id', user.id)
    .single()

  // Get user profile from database
  const { data: profileRecord } = await supabase
    .from('profiles')
    .select('first_name, last_name, avatar_url')
    .eq('user_id', user.id)
    .single()

  const profile = {
    ...userRecord,
    profile: profileRecord
  }

  const handleLogout = async () => {
    'use server'
    const supabase = await createServerClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {profile?.profile?.first_name || 'User'}!
            </h1>
            <p className="text-gray-600">
              Role: {profile?.role || 'CLIENT'}
            </p>
          </div>
          <form action={handleLogout}>
            <Button type="submit" variant="outline">
              Logout
            </Button>
          </form>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="font-medium text-gray-500">Email</dt>
                  <dd>{profile?.email}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Name</dt>
                  <dd>
                    {profile?.profile?.first_name} {profile?.profile?.last_name}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Role</dt>
                  <dd>{profile?.role}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>Your progress overview</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Coming soon: Workouts, courses, and more!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                No recent activity yet
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
