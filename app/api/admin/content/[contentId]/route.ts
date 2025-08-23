import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { contentId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { contentId } = params

    // Delete content
    await prisma.content.delete({
      where: { id: contentId }
    })

    return NextResponse.json(
      { message: 'Контент видалено успішно' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete content error:', error)
    return NextResponse.json(
      { error: 'Помилка при видаленні контенту' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { contentId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { contentId } = params
    const body = await request.json()

    // Update content
    const content = await prisma.content.update({
      where: { id: contentId },
      data: {
        type: body.type,
        status: body.status,
        isPublished: body.status === 'PUBLISHED',
        isPremium: body.isPremium,
        difficulty: body.difficulty,
        estimatedTime: body.estimatedTime,
        order: body.order,
        publishedAt: body.status === 'PUBLISHED' && !body.publishedAt ? new Date() : undefined,
        updatedAt: new Date(),
      },
    })

    // Update translations
    if (body.translations) {
      for (const translation of body.translations) {
        await prisma.contentTranslation.upsert({
          where: {
            contentId_language: {
              contentId,
              language: translation.language,
            }
          },
          update: {
            title: translation.title,
            description: translation.description,
            body: translation.body,
          },
          create: {
            contentId,
            language: translation.language,
            title: translation.title,
            description: translation.description,
            body: translation.body,
          }
        })
      }
    }

    // Update tags
    if (body.tagIds !== undefined) {
      // Remove all existing tags
      await prisma.contentTag.deleteMany({
        where: { contentId }
      })

      // Add new tags
      if (body.tagIds.length > 0) {
        await prisma.contentTag.createMany({
          data: body.tagIds.map((tagId: string) => ({
            contentId,
            tagId,
          }))
        })
      }
    }

    return NextResponse.json(content)
  } catch (error) {
    console.error('Update content error:', error)
    return NextResponse.json(
      { error: 'Помилка при оновленні контенту' },
      { status: 500 }
    )
  }
}