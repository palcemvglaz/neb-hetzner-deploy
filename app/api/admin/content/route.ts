import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'

const contentSchema = z.object({
  type: z.enum(['ARTICLE', 'VIDEO', 'GUIDE', 'LESSON', 'EXERCISE']),
  status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED']),
  isPremium: z.boolean(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  estimatedTime: z.number().nullable(),
  order: z.number(),
  translations: z.array(z.object({
    language: z.string(),
    title: z.string(),
    description: z.string().optional(),
    body: z.string(),
  })).min(1),
  tagIds: z.array(z.string()).optional(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const content = await prisma.content.findMany({
      include: {
        translations: true,
        tags: {
          include: { tag: true }
        },
        category: true,
        _count: {
          select: {
            translations: true
          }
        }
      },
      orderBy: [
        { isCornerstone: 'desc' },
        { priority: 'desc' },
        { updatedAt: 'desc' }
      ]
    })

    // Transform data for frontend with KB_NEB structure
    const transformedContent = content.map(item => {
      const primaryTranslation = item.translations.find(t => t.language === 'ua') || item.translations[0]
      return {
        id: item.id,
        title: primaryTranslation?.title || 'Без назви',
        themeId: item.id,
        category: '05',
        format: 'M',
        language: primaryTranslation?.language || 'ua',
        status: 'todo',
        priority: 5,
        isCornerstone: false,
        knowledgeValue: {
          overallScore: 7,
          valueCategory: 'medium'
        },
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        viewCount: 0,
        _count: item._count
      }
    })

    return NextResponse.json(transformedContent)
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const data = contentSchema.parse(body)

    // Generate slug from the first translation title
    const slug = data.translations[0].title
      .toLowerCase()
      .replace(/[^a-z0-9\u0400-\u04ff]+/g, '-')
      .replace(/^-|-$/g, '')

    // Create content with translations
    const content = await prisma.content.create({
      data: {
        slug,
        type: data.type,
        status: data.status,
        isPublished: data.status === 'PUBLISHED',
        isPremium: data.isPremium,
        difficulty: data.difficulty,
        estimatedTime: data.estimatedTime,
        order: data.order,
        publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
        translations: {
          create: data.translations,
        },
        tags: data.tagIds ? {
          create: data.tagIds.map(tagId => ({
            tag: { connect: { id: tagId } }
          }))
        } : undefined,
      },
      include: {
        translations: true,
        tags: {
          include: { tag: true }
        }
      }
    })

    return NextResponse.json(content, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Create content error:', error)
    return NextResponse.json(
      { error: 'Помилка при створенні контенту' },
      { status: 500 }
    )
  }
}