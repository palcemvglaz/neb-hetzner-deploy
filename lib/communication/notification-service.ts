import { prisma } from '@/lib/db/prisma'

export type NotificationType = 
  | 'COURSE_ENROLLMENT'
  | 'LESSON_COMPLETED'
  | 'TEST_PASSED'
  | 'TEST_FAILED'
  | 'CERTIFICATE_EARNED'
  | 'PAYMENT_SUCCESS'
  | 'COURSE_UPDATE'
  | 'SYSTEM_ANNOUNCEMENT'
  | 'MESSAGE_RECEIVED'
  | 'ACHIEVEMENT_UNLOCKED'

export interface CreateNotificationData {
  userId: string
  type: NotificationType
  title: string
  message: string
  actionUrl?: string
  metadata?: Record<string, any>
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  actionUrl?: string | null
  isRead: boolean
  metadata?: Record<string, any>
  createdAt: Date
}

export class NotificationService {
  /**
   * Create a new notification
   */
  async createNotification(data: CreateNotificationData): Promise<Notification> {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        actionUrl: data.actionUrl,
        metadata: JSON.stringify(data.metadata || {}),
        isRead: false
      }
    })

    // TODO: Send real-time notification via WebSocket/SSE
    this.sendRealTimeNotification({
      ...notification,
      type: notification.type as NotificationType,
      metadata: data.metadata
    })

    return {
      ...notification,
      type: notification.type as NotificationType,
      metadata: data.metadata
    }
  }

  /**
   * Create bulk notifications for multiple users
   */
  async createBulkNotifications(
    userIds: string[], 
    notificationData: Omit<CreateNotificationData, 'userId'>
  ): Promise<void> {
    await prisma.notification.createMany({
      data: userIds.map(userId => ({
        userId,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        actionUrl: notificationData.actionUrl,
        metadata: JSON.stringify(notificationData.metadata || {}),
        isRead: false
      }))
    })

    // TODO: Send bulk real-time notifications
  }

  /**
   * Get notifications for a user
   */
  async getUserNotifications(
    userId: string, 
    options: {
      limit?: number
      offset?: number
      unreadOnly?: boolean
    } = {}
  ): Promise<{ notifications: Notification[]; unreadCount: number }> {
    const { limit = 20, offset = 0, unreadOnly = false } = options

    const where = {
      userId,
      ...(unreadOnly ? { isRead: false } : {})
    }

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.notification.count({
        where: { userId, isRead: false }
      })
    ])

    return { 
      notifications: notifications.map(n => ({
        ...n,
        type: n.type as NotificationType,
        metadata: n.metadata ? JSON.parse(n.metadata) : undefined
      })), 
      unreadCount 
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    })
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    })
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    await prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId
      }
    })
  }

  /**
   * Send notification when user enrolls in course
   */
  async notifyEnrollment(userId: string, courseTitle: string, courseSlug: string): Promise<void> {
    await this.createNotification({
      userId,
      type: 'COURSE_ENROLLMENT',
      title: 'Ви записані на курс!',
      message: `Вітаємо! Ви успішно записалися на курс "${courseTitle}". Почніть навчання прямо зараз.`,
      actionUrl: `/learn/${courseSlug}`,
      metadata: { courseSlug }
    })
  }

  /**
   * Send notification when lesson is completed
   */
  async notifyLessonCompleted(
    userId: string, 
    lessonTitle: string, 
    courseTitle: string,
    courseSlug: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      type: 'LESSON_COMPLETED',
      title: 'Урок завершено!',
      message: `Вітаємо! Ви завершили урок "${lessonTitle}" з курсу "${courseTitle}".`,
      actionUrl: `/learn/${courseSlug}`,
      metadata: { lessonTitle, courseTitle, courseSlug }
    })
  }

  /**
   * Send notification when test is passed
   */
  async notifyTestPassed(
    userId: string, 
    testTitle: string, 
    score: number,
    courseSlug?: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      type: 'TEST_PASSED',
      title: 'Тест успішно складено!',
      message: `Вітаємо! Ви успішно склали тест "${testTitle}" з результатом ${score}%.`,
      actionUrl: courseSlug ? `/courses/${courseSlug}` : '/dashboard',
      metadata: { testTitle, score, courseSlug }
    })
  }

  /**
   * Send notification when test is failed
   */
  async notifyTestFailed(
    userId: string, 
    testTitle: string, 
    score: number,
    testId: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      type: 'TEST_FAILED',
      title: 'Тест не складено',
      message: `На жаль, ви не склали тест "${testTitle}" (${score}%). Спробуйте ще раз після повторення матеріалу.`,
      actionUrl: `/tests/${testId}`,
      metadata: { testTitle, score, testId }
    })
  }

  /**
   * Send notification when certificate is earned
   */
  async notifyCertificateEarned(
    userId: string, 
    courseTitle: string, 
    certificateId: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      type: 'CERTIFICATE_EARNED',
      title: 'Сертифікат отримано!',
      message: `Вітаємо! Ви отримали сертифікат за успішне завершення курсу "${courseTitle}".`,
      actionUrl: `/certificates/${certificateId}`,
      metadata: { courseTitle, certificateId }
    })
  }

  /**
   * Send notification when payment is successful
   */
  async notifyPaymentSuccess(
    userId: string, 
    courseTitle: string, 
    amount: number,
    courseSlug: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      type: 'PAYMENT_SUCCESS',
      title: 'Оплата підтверджена!',
      message: `Ваша оплата на суму ${amount} ₴ за курс "${courseTitle}" підтверджена. Тепер ви маєте повний доступ.`,
      actionUrl: `/learn/${courseSlug}`,
      metadata: { courseTitle, amount, courseSlug }
    })
  }

  /**
   * Send notification when achievement is unlocked
   */
  async notifyAchievementUnlocked(
    userId: string, 
    achievementName: string, 
    achievementDescription: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      type: 'ACHIEVEMENT_UNLOCKED',
      title: 'Нове досягнення!',
      message: `Вітаємо! Ви отримали досягнення "${achievementName}": ${achievementDescription}`,
      actionUrl: '/achievements',
      metadata: { achievementName, achievementDescription }
    })
  }

  /**
   * Send system announcement to all users
   */
  async sendSystemAnnouncement(
    title: string, 
    message: string, 
    actionUrl?: string,
    targetRole?: string
  ): Promise<void> {
    // Get all users or users with specific role
    const users = await prisma.user.findMany({
      where: targetRole ? { role: targetRole } : {},
      select: { id: true }
    })

    const userIds = users.map(user => user.id)

    await this.createBulkNotifications(userIds, {
      type: 'SYSTEM_ANNOUNCEMENT',
      title,
      message,
      actionUrl,
      metadata: { targetRole }
    })
  }

  /**
   * Send real-time notification (placeholder for WebSocket implementation)
   */
  private sendRealTimeNotification(notification: Notification): void {
    // TODO: Implement real-time notification via WebSocket/SSE
    // For now, we'll just log it
    console.log('Real-time notification:', notification.title, 'to user:', notification.userId)
  }

  /**
   * Clean up old notifications
   */
  async cleanupOldNotifications(daysOld: number = 30): Promise<number> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    const result = await prisma.notification.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate
        },
        isRead: true
      }
    })

    return result.count
  }
}

export const notificationService = new NotificationService()