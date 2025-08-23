import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Users, BookOpen, TrendingUp, Calendar,
  Award, Clock, UserCheck, AlertCircle
} from 'lucide-react'

async function getSchoolStats(schoolId: string) {
  const [
    totalStudents,
    activeStudents,
    totalGroups,
    totalEnrollments,
    completedCourses,
    averageProgress
  ] = await Promise.all([
    prisma.user.count({
      where: { schoolId, role: 'STUDENT' }
    }),
    prisma.user.count({
      where: {
        schoolId,
        role: 'STUDENT',
        lastLoginAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days
        }
      }
    }),
    prisma.schoolGroup.count({
      where: { schoolId }
    }),
    prisma.enrollment.count({
      where: {
        user: { schoolId }
      }
    }),
    prisma.enrollment.count({
      where: {
        user: { schoolId },
        progress: 100
      }
    }),
    prisma.enrollment.aggregate({
      where: {
        user: { schoolId }
      },
      _avg: { progress: true }
    })
  ])

  return {
    totalStudents,
    activeStudents,
    totalGroups,
    totalEnrollments,
    completedCourses,
    averageProgress: averageProgress._avg.progress || 0
  }
}

async function getRecentStudents(schoolId: string) {
  return prisma.user.findMany({
    where: {
      schoolId,
      role: 'STUDENT'
    },
    include: {
      enrollments: {
        include: {
          course: {
            include: {
              translations: {
                where: { language: 'UA' },
                select: { title: true }
              }
            }
          }
        }
      },
      progress: {
        orderBy: { lastAccessedAt: 'desc' },
        take: 1
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  })
}

async function getActiveGroups(schoolId: string) {
  return prisma.schoolGroup.findMany({
    where: {
      schoolId,
      startDate: { lte: new Date() },
      OR: [
        { endDate: null },
        { endDate: { gte: new Date() } }
      ]
    },
    include: {
      _count: {
        select: { students: true }
      }
    },
    orderBy: { startDate: 'desc' },
    take: 3
  })
}

export default async function SchoolDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Check if user is school admin or instructor
  if (!['SCHOOL_ADMIN', 'INSTRUCTOR'].includes(session.user.role)) {
    redirect('/dashboard')
  }

  // Get user's school
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { school: true }
  })

  if (!user?.school) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-yellow-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-yellow-900">
                Школу не знайдено
              </h3>
              <p className="text-yellow-700 mt-1">
                Ваш акаунт не прив'язаний до жодної школи. Зверніться до адміністратора.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const [stats, recentStudents, activeGroups] = await Promise.all([
    getSchoolStats(user.school.id),
    getRecentStudents(user.school.id),
    getActiveGroups(user.school.id)
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {user.school.name}
        </h1>
        <p className="mt-2 text-gray-600">
          Панель управління мотошколою
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Всього студентів
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalStudents}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserCheck className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Активні студенти
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.activeStudents}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-6 w-6 text-nebachiv-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Записів на курси
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalEnrollments}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Середній прогрес
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {Math.round(stats.averageProgress)}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent students */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Нові студенти
              </h2>
              <Link
                href="/school/students"
                className="text-sm text-nebachiv-600 hover:text-nebachiv-700"
              >
                Всі студенти →
              </Link>
            </div>

            {recentStudents.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {recentStudents.map((student: any) => (
                  <li key={student.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {student.name?.charAt(0) || 'S'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            {student.name || 'Без імені'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {student.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900">
                          {student.enrollments.length} курсів
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(student.createdAt).toLocaleDateString('uk-UA')}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Немає нових студентів
              </p>
            )}
          </div>
        </div>

        {/* Active groups */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Активні групи
              </h2>
              <Link
                href="/school/groups"
                className="text-sm text-nebachiv-600 hover:text-nebachiv-700"
              >
                Всі групи →
              </Link>
            </div>

            {activeGroups.length > 0 ? (
              <div className="space-y-4">
                {activeGroups.map((group) => (
                  <div
                    key={group.id}
                    className="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">
                        {group.name}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {group._count.students}/{group.maxStudents} студентів
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {new Date(group.startDate).toLocaleDateString('uk-UA')}
                        {group.endDate && (
                          <> - {new Date(group.endDate).toLocaleDateString('uk-UA')}</>
                        )}
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-nebachiv-600 h-2 rounded-full"
                          style={{
                            width: `${(group._count.students / group.maxStudents) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Немає активних груп</p>
                <Link
                  href="/school/groups/new"
                  className="mt-4 inline-flex items-center px-4 py-2 bg-nebachiv-600 text-white rounded-md hover:bg-nebachiv-700"
                >
                  Створити групу
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Швидкі дії
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/school/students/new"
            className="border border-gray-300 rounded-lg p-4 hover:bg-gray-50 text-center"
          >
            <Users className="h-8 w-8 text-nebachiv-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Додати студента</p>
          </Link>
          
          <Link
            href="/school/groups/new"
            className="border border-gray-300 rounded-lg p-4 hover:bg-gray-50 text-center"
          >
            <Calendar className="h-8 w-8 text-nebachiv-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Створити групу</p>
          </Link>
          
          <Link
            href="/school/reports"
            className="border border-gray-300 rounded-lg p-4 hover:bg-gray-50 text-center"
          >
            <TrendingUp className="h-8 w-8 text-nebachiv-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Звіти</p>
          </Link>
        </div>
      </div>
    </div>
  )
}