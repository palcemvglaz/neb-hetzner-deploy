import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripeService } from '@/lib/stripe/stripe-service'
import LessonPlayer from './lesson-player'

interface LessonPageProps {
  params: {
    slug: string
    lessonId: string
  }
}

async function getLesson(lessonId: string, courseSlug: string) {
  // Since we don't have lesson model, return null for now
  // This page needs to be refactored to work with the Content model
  return null
}

async function checkEnrollment(courseId: string, userId: string) {
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId
      }
    }
  })

  return !!enrollment
}

async function getOrCreateProgress(contentId: string, userId: string) {
  let progress = await prisma.userProgress.findUnique({
    where: {
      userId_contentId: {
        userId,
        contentId
      }
    }
  })

  if (!progress) {
    progress = await prisma.userProgress.create({
      data: {
        userId,
        contentId,
        status: 'NOT_STARTED'
      }
    })
  }

  return progress
}

export default async function LessonPage({ params }: LessonPageProps) {
  // For now, redirect to course page since lesson model doesn't exist
  // This page needs to be refactored to work with Content model
  notFound()
}