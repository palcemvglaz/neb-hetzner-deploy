import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth/config'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  // Check if user is authenticated and has admin role
  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex h-screen">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-900">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}