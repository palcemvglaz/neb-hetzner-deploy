import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'

interface LearnPageProps {
  params: { slug: string }
}

export default async function LearnPage({ params }: LearnPageProps) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/login')
  }

  // Get course
  const course = await prisma.course.findUnique({
    where: { slug: params.slug },
    include: {
      sections: {
        include: {
          items: {
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { order: 'asc' }
      }
    }
  })

  if (!course) {
    redirect('/courses')
  }

  // Check enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: course.id
      }
    }
  })

  if (!enrollment) {
    redirect(`/courses/${params.slug}`)
  }

  // For now, redirect to course page since lesson structure needs refactoring
  redirect(`/courses/${params.slug}`)
}