import { prisma } from '@/lib/db/prisma'

export interface CreateSchoolData {
  name: string
  slug: string
  description?: string
  email: string
  phone?: string
  address?: string
  website?: string
  adminUserId: string
}

export interface SchoolStats {
  totalStudents: number
  activeStudents: number
  completedCourses: number
  averageProgress: number
  totalRevenue: number
  monthlyEnrollments: number
}

export class SchoolService {
  /**
   * Create a new school
   */
  async createSchool(data: CreateSchoolData) {
    // Check if slug is available
    const existingSchool = await prisma.school.findUnique({
      where: { slug: data.slug }
    })

    if (existingSchool) {
      throw new Error('School slug already exists')
    }

    // Create school and update admin user
    const school = await prisma.$transaction(async (tx) => {
      const newSchool = await tx.school.create({
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          email: data.email,
          phone: data.phone,
          address: data.address,
          website: data.website,
          isActive: true
        }
      })

      // Update user to school admin
      await tx.user.update({
        where: { id: data.adminUserId },
        data: {
          schoolId: newSchool.id,
          role: 'SCHOOL_ADMIN'
        }
      })

      return newSchool
    })

    return school
  }

  /**
   * Get school dashboard statistics
   */
  async getSchoolStats(schoolId: string): Promise<SchoolStats> {
    const [
      students,
      activeStudents,
      enrollments,
      completedEnrollments,
      payments,
      monthlyEnrollments
    ] = await Promise.all([
      // Total students
      prisma.user.count({
        where: { schoolId, role: 'STUDENT' }
      }),

      // Active students (logged in last 30 days)
      prisma.user.count({
        where: {
          schoolId,
          role: 'STUDENT',
          lastLoginAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),

      // All enrollments
      prisma.enrollment.findMany({
        where: {
          user: { schoolId }
        },
        include: {
          course: true,
          user: {
            include: {
              progress: true
            }
          }
        }
      }),

      // Completed enrollments
      prisma.enrollment.count({
        where: {
          user: { schoolId },
          progress: 100
        }
      }),

      // School payments
      prisma.payment.findMany({
        where: {
          user: { schoolId },
          status: 'COMPLETED'
        }
      }),

      // Monthly enrollments
      prisma.enrollment.count({
        where: {
          user: { schoolId },
          enrolledAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      })
    ])

    // Calculate average progress
    const totalProgress = enrollments.reduce((sum, enrollment) => {
      const userProgress = enrollment.user.progress || []
      const courseProgress = userProgress.length > 0 
        ? userProgress.filter(p => p.isCompleted).length / userProgress.length * 100
        : 0
      return sum + courseProgress
    }, 0)

    const averageProgress = enrollments.length > 0 ? totalProgress / enrollments.length : 0

    // Calculate total revenue
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0)

    return {
      totalStudents: students,
      activeStudents,
      completedCourses: completedEnrollments,
      averageProgress: Math.round(averageProgress),
      totalRevenue,
      monthlyEnrollments
    }
  }

  /**
   * Get school students with progress
   */
  async getSchoolStudents(schoolId: string, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit

    const [students, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: {
          schoolId,
          role: 'STUDENT'
        },
        include: {
          enrollments: {
            include: {
              course: {
                select: {
                  id: true,
                  title: true,
                  slug: true
                }
              }
            }
          },
          progress: {
            where: {
              isCompleted: true
            }
          },
          schoolGroup: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      }),

      prisma.user.count({
        where: {
          schoolId,
          role: 'STUDENT'
        }
      })
    ])

    // Calculate progress for each student
    const studentsWithProgress = students.map(student => {
      const totalLessons = student.enrollments.reduce((sum, enrollment) => {
        // This would need course lesson count - simplified for now
        return sum + 10 // Assume 10 lessons per course
      }, 0)

      const completedLessons = student.progress.length
      const overallProgress = totalLessons > 0 
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0

      return {
        ...student,
        overallProgress,
        activeEnrollments: student.enrollments.length,
        completedLessons
      }
    })

    return {
      students: studentsWithProgress,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    }
  }

  /**
   * Create a student group
   */
  async createStudentGroup(schoolId: string, name: string, description?: string) {
    return await prisma.schoolGroup.create({
      data: {
        name,
        description,
        schoolId
      }
    })
  }

  /**
   * Add student to group
   */
  async addStudentToGroup(studentId: string, groupId: string, schoolId: string) {
    // Verify student belongs to school
    const student = await prisma.user.findFirst({
      where: {
        id: studentId,
        schoolId,
        role: 'STUDENT'
      }
    })

    if (!student) {
      throw new Error('Student not found or not in this school')
    }

    // Verify group belongs to school
    const group = await prisma.schoolGroup.findFirst({
      where: {
        id: groupId,
        schoolId
      }
    })

    if (!group) {
      throw new Error('Group not found or not in this school')
    }

    return await prisma.user.update({
      where: { id: studentId },
      data: { schoolGroupId: groupId }
    })
  }

  /**
   * Bulk enroll students in course
   */
  async bulkEnrollStudents(courseId: string, studentIds: string[], schoolId: string) {
    // Verify students belong to school
    const students = await prisma.user.findMany({
      where: {
        id: { in: studentIds },
        schoolId,
        role: 'STUDENT'
      }
    })

    if (students.length !== studentIds.length) {
      throw new Error('Some students not found or not in this school')
    }

    // Check course exists and is accessible
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    })

    if (!course) {
      throw new Error('Course not found')
    }

    // Create enrollments for students who aren't already enrolled
    const existingEnrollments = await prisma.enrollment.findMany({
      where: {
        courseId,
        userId: { in: studentIds }
      },
      select: { userId: true }
    })

    const enrolledUserIds = existingEnrollments.map(e => e.userId)
    const newStudentIds = studentIds.filter(id => !enrolledUserIds.includes(id))

    if (newStudentIds.length === 0) {
      return { message: 'All students already enrolled' }
    }

    const enrollments = await prisma.enrollment.createMany({
      data: newStudentIds.map(userId => ({
        userId,
        courseId,
        enrolledAt: new Date()
      }))
    })

    return {
      message: `Successfully enrolled ${newStudentIds.length} students`,
      enrolled: newStudentIds.length,
      alreadyEnrolled: enrolledUserIds.length
    }
  }

  /**
   * Generate school performance report
   */
  async generateSchoolReport(schoolId: string, startDate: Date, endDate: Date) {
    const [
      enrollments,
      completions,
      students,
      testResults
    ] = await Promise.all([
      // Enrollments in period
      prisma.enrollment.findMany({
        where: {
          user: { schoolId },
          enrolledAt: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          course: {
            select: {
              title: true,
              category: true
            }
          },
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }),

      // Course completions
      prisma.progress.findMany({
        where: {
          user: { schoolId },
          isCompleted: true,
          completedAt: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          lesson: {
            include: {
              section: {
                include: {
                  course: {
                    select: {
                      title: true
                    }
                  }
                }
              }
            }
          },
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }),

      // Student activity
      prisma.user.findMany({
        where: {
          schoolId,
          role: 'STUDENT',
          lastLoginAt: {
            gte: startDate,
            lte: endDate
          }
        },
        select: {
          id: true,
          name: true,
          email: true,
          lastLoginAt: true
        }
      }),

      // Test results
      prisma.testResult.findMany({
        where: {
          user: { schoolId },
          completedAt: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          test: {
            include: {
              course: {
                select: {
                  title: true
                }
              }
            }
          },
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })
    ])

    // Calculate analytics
    const courseStats = enrollments.reduce((acc, enrollment) => {
      const courseTitle = enrollment.course.title
      if (!acc[courseTitle]) {
        acc[courseTitle] = {
          enrollments: 0,
          category: enrollment.course.category
        }
      }
      acc[courseTitle].enrollments++
      return acc
    }, {} as Record<string, any>)

    const averageTestScore = testResults.length > 0
      ? testResults.reduce((sum, result) => sum + result.score, 0) / testResults.length
      : 0

    return {
      period: {
        startDate,
        endDate
      },
      summary: {
        newEnrollments: enrollments.length,
        completedLessons: completions.length,
        activeStudents: students.length,
        testsCompleted: testResults.length,
        averageTestScore: Math.round(averageTestScore)
      },
      courseStats,
      topPerformers: testResults
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map(result => ({
          studentName: result.user.name,
          studentEmail: result.user.email,
          course: result.test.course?.title,
          score: result.score,
          completedAt: result.completedAt
        })),
      recentActivity: {
        enrollments: enrollments.slice(0, 20),
        completions: completions.slice(0, 20),
        testResults: testResults.slice(0, 20)
      }
    }
  }
}

export const schoolService = new SchoolService()