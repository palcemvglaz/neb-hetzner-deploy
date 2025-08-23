import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import InstructorSidebar from '@/components/instructor-sidebar'

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  // Check if user is instructor
  if (!session || (session.user.role !== 'INSTRUCTOR' && session.user.role !== 'ADMIN')) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <InstructorSidebar />
        <main className="flex-1 lg:pl-64">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}