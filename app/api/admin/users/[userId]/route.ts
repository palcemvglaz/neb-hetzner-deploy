import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { userId } = params

    // Prevent admin from deleting themselves
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: 'Ви не можете видалити свій власний акаунт' },
        { status: 400 }
      )
    }

    // Delete user
    await prisma.user.delete({
      where: { id: userId }
    })

    return NextResponse.json(
      { message: 'Користувача видалено успішно' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: 'Помилка при видаленні користувача' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { userId } = params
    const body = await request.json()

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: body.name,
        role: body.role,
        schoolId: body.schoolId || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        school: true,
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'Помилка при оновленні користувача' },
      { status: 500 }
    )
  }
}