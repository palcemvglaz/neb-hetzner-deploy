/**
 * Transaction Safety System for Nebachiv Content App
 * Inspired by my-finance-app data integrity patterns
 * 
 * Ensures data integrity for critical educational operations:
 * - Course enrollments
 * - Student progress updates
 * - Payment processing
 * - Certificate generation
 * - KB_NEB content synchronization
 */

import { PrismaClient, Prisma } from '@prisma/client';
import { enhancedLogger, logError, logUserAction, logPerformanceMetric } from './enhancedLogger';

// Create Prisma client instance
const prisma = new PrismaClient();

// Transaction result interface
interface TransactionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  rollbackReason?: string;
  duration?: number;
}

// Audit log interface
interface AuditLogEntry {
  operation: string;
  userId?: string;
  entityType: string;
  entityId?: string;
  changes?: Record<string, any>;
  metadata?: Record<string, any>;
  timestamp: Date;
}

/**
 * Safe transaction wrapper with audit logging
 * Ensures all critical operations are atomic and logged
 */
export async function safeTransaction<T>(
  operation: string,
  transactionFn: (tx: Prisma.TransactionClient) => Promise<T>,
  context?: {
    userId?: string;
    entityType?: string;
    entityId?: string;
    metadata?: Record<string, any>;
  }
): Promise<TransactionResult<T>> {
  const startTime = Date.now();
  
  try {
    enhancedLogger.info(`Starting transaction: ${operation}`, {
      component: 'TransactionSafety',
      action: 'start',
      operation,
      ...context
    });

    const result = await prisma.$transaction(async (tx) => {
      // Execute the main operation
      const operationResult = await transactionFn(tx);
      
      // Create audit log entry
      const auditEntry: AuditLogEntry = {
        operation,
        userId: context?.userId,
        entityType: context?.entityType || 'unknown',
        entityId: context?.entityId,
        metadata: context?.metadata,
        timestamp: new Date()
      };

      // Log the audit entry in the database
      await tx.auditLog.create({
        data: {
          operation: auditEntry.operation,
          userId: auditEntry.userId,
          entityType: auditEntry.entityType,
          entityId: auditEntry.entityId,
          changes: auditEntry.metadata as Prisma.JsonObject || {},
          timestamp: auditEntry.timestamp
        }
      });

      return operationResult;
    }, {
      timeout: 30000, // 30 seconds timeout
      isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted
    });

    const duration = Date.now() - startTime;
    
    enhancedLogger.info(`Transaction completed: ${operation}`, {
      component: 'TransactionSafety',
      action: 'complete',
      operation,
      duration,
      success: true,
      ...context
    });

    logPerformanceMetric(`transaction_${operation}`, startTime);

    return {
      success: true,
      data: result,
      duration
    };

  } catch (error: any) {
    const duration = Date.now() - startTime;
    
    logError(error, {
      component: 'TransactionSafety',
      action: 'error',
      operation,
      severity: 'high',
      ...context
    });

    enhancedLogger.error(`Transaction failed: ${operation}`, {
      component: 'TransactionSafety',
      action: 'failed',
      operation,
      duration,
      error: error.message,
      ...context
    });

    return {
      success: false,
      error: error.message,
      rollbackReason: 'Exception during transaction execution',
      duration
    };
  }
}

/**
 * Course Enrollment with full transaction safety
 */
export async function safeCourseEnrollment(
  userId: string,
  courseId: string,
  paymentIntentId?: string
): Promise<TransactionResult<{ enrollment: any; progress: any }>> {
  return safeTransaction(
    'course_enrollment',
    async (tx) => {
      // Check if already enrolled
      const existingEnrollment = await tx.enrollment.findUnique({
        where: {
          userId_courseId: { userId, courseId }
        }
      });

      if (existingEnrollment) {
        throw new Error('User already enrolled in this course');
      }

      // Get course details
      const course = await tx.course.findUnique({
        where: { id: courseId },
        include: { lessons: true }
      });

      if (!course) {
        throw new Error('Course not found');
      }

      // Create enrollment
      const enrollment = await tx.enrollment.create({
        data: {
          userId,
          courseId,
          enrolledAt: new Date(),
          paymentIntentId,
          status: 'ACTIVE'
        }
      });

      // Initialize progress tracking
      const progress = await tx.progress.create({
        data: {
          userId,
          courseId,
          completedLessons: 0,
          totalLessons: course.lessons.length,
          progressPercentage: 0,
          startedAt: new Date()
        }
      });

      // Update course enrollment count
      await tx.course.update({
        where: { id: courseId },
        data: {
          enrollmentCount: { increment: 1 }
        }
      });

      return { enrollment, progress };
    },
    {
      userId,
      entityType: 'enrollment',
      entityId: courseId,
      metadata: { courseId, paymentIntentId }
    }
  );
}

/**
 * Student Progress Update with cascade handling
 */
export async function safeProgressUpdate(
  userId: string,
  courseId: string,
  lessonId: string,
  completed: boolean = true
): Promise<TransactionResult<{ progress: any; certificate?: any }>> {
  return safeTransaction(
    'progress_update',
    async (tx) => {
      // Get current progress
      const currentProgress = await tx.progress.findUnique({
        where: {
          userId_courseId: { userId, courseId }
        }
      });

      if (!currentProgress) {
        throw new Error('Progress record not found');
      }

      // Update lesson completion
      if (completed) {
        await tx.lessonProgress.upsert({
          where: {
            userId_lessonId: { userId, lessonId }
          },
          create: {
            userId,
            lessonId,
            completed: true,
            completedAt: new Date()
          },
          update: {
            completed: true,
            completedAt: new Date()
          }
        });
      }

      // Recalculate total progress
      const completedCount = await tx.lessonProgress.count({
        where: {
          userId,
          lesson: { courseId },
          completed: true
        }
      });

      const course = await tx.course.findUnique({
        where: { id: courseId },
        include: { lessons: true }
      });

      if (!course) {
        throw new Error('Course not found');
      }

      const totalLessons = course.lessons.length;
      const progressPercentage = Math.round((completedCount / totalLessons) * 100);

      // Update progress record
      const updatedProgress = await tx.progress.update({
        where: {
          userId_courseId: { userId, courseId }
        },
        data: {
          completedLessons: completedCount,
          progressPercentage,
          lastActivityAt: new Date(),
          ...(progressPercentage === 100 && { completedAt: new Date() })
        }
      });

      let certificate = null;

      // Generate certificate if course completed
      if (progressPercentage === 100) {
        certificate = await tx.certificate.create({
          data: {
            userId,
            courseId,
            issuedAt: new Date(),
            certificateNumber: `NEB-${Date.now()}-${userId.slice(-4)}`
          }
        });

        // Update user achievements
        await tx.achievement.create({
          data: {
            userId,
            type: 'COURSE_COMPLETION',
            title: `Completed: ${course.title}`,
            description: `Successfully completed the course "${course.title}"`,
            earnedAt: new Date(),
            metadata: { courseId, certificateId: certificate.id }
          }
        });
      }

      return { progress: updatedProgress, certificate };
    },
    {
      userId,
      entityType: 'progress',
      entityId: lessonId,
      metadata: { courseId, lessonId, completed }
    }
  );
}

/**
 * Payment Processing with Stripe integration safety
 */
export async function safePaymentProcessing(
  userId: string,
  courseId: string,
  stripePaymentIntentId: string,
  amount: number
): Promise<TransactionResult<{ payment: any; enrollment?: any }>> {
  return safeTransaction(
    'payment_processing',
    async (tx) => {
      // Check for duplicate payment
      const existingPayment = await tx.payment.findUnique({
        where: { stripePaymentIntentId }
      });

      if (existingPayment) {
        throw new Error('Payment already processed');
      }

      // Create payment record
      const payment = await tx.payment.create({
        data: {
          userId,
          courseId,
          stripePaymentIntentId,
          amount,
          currency: 'USD',
          status: 'COMPLETED',
          processedAt: new Date()
        }
      });

      // Auto-enroll user in course after successful payment
      const enrollmentResult = await safeCourseEnrollment(
        userId,
        courseId,
        stripePaymentIntentId
      );

      if (!enrollmentResult.success) {
        throw new Error(`Auto-enrollment failed: ${enrollmentResult.error}`);
      }

      return { 
        payment, 
        enrollment: enrollmentResult.data?.enrollment 
      };
    },
    {
      userId,
      entityType: 'payment',
      entityId: stripePaymentIntentId,
      metadata: { courseId, amount, stripePaymentIntentId }
    }
  );
}

/**
 * KB_NEB Content Sync with batch safety
 */
export async function safeKbNebSync(
  contentItems: any[],
  syncOptions: {
    forceUpdate?: boolean;
    dryRun?: boolean;
    userId?: string;
  } = {}
): Promise<TransactionResult<{ imported: number; updated: number; skipped: number }>> {
  return safeTransaction(
    'kb_neb_sync',
    async (tx) => {
      let imported = 0;
      let updated = 0;
      let skipped = 0;

      if (syncOptions.dryRun) {
        // Dry run - just count what would be processed
        for (const item of contentItems) {
          const existing = await tx.content.findUnique({
            where: { kbNebId: item.id }
          });
          
          if (existing) {
            if (syncOptions.forceUpdate) {
              updated++;
            } else {
              skipped++;
            }
          } else {
            imported++;
          }
        }
      } else {
        // Process items in batches of 50
        const batchSize = 50;
        for (let i = 0; i < contentItems.length; i += batchSize) {
          const batch = contentItems.slice(i, i + batchSize);
          
          for (const item of batch) {
            const existing = await tx.content.findUnique({
              where: { kbNebId: item.id }
            });

            if (existing) {
              if (syncOptions.forceUpdate) {
                await tx.content.update({
                  where: { id: existing.id },
                  data: {
                    title: item.title,
                    content: item.content,
                    metadata: item.metadata,
                    updatedAt: new Date()
                  }
                });
                updated++;
              } else {
                skipped++;
              }
            } else {
              await tx.content.create({
                data: {
                  kbNebId: item.id,
                  title: item.title,
                  content: item.content,
                  type: item.type,
                  metadata: item.metadata,
                  importedAt: new Date()
                }
              });
              imported++;
            }
          }
        }

        // Update sync status
        await tx.syncStatus.upsert({
          where: { source: 'KB_NEB' },
          create: {
            source: 'KB_NEB',
            lastSyncAt: new Date(),
            itemsProcessed: contentItems.length,
            status: 'COMPLETED'
          },
          update: {
            lastSyncAt: new Date(),
            itemsProcessed: contentItems.length,
            status: 'COMPLETED'
          }
        });
      }

      return { imported, updated, skipped };
    },
    {
      userId: syncOptions.userId,
      entityType: 'kb_neb_sync',
      metadata: { 
        itemCount: contentItems.length,
        forceUpdate: syncOptions.forceUpdate,
        dryRun: syncOptions.dryRun
      }
    }
  );
}

/**
 * Safe bulk operation with progress tracking
 */
export async function safeBulkOperation<T>(
  operation: string,
  items: T[],
  processor: (tx: Prisma.TransactionClient, item: T) => Promise<any>,
  batchSize: number = 100
): Promise<TransactionResult<{ processed: number; errors: any[] }>> {
  const startTime = Date.now();
  let processed = 0;
  const errors: any[] = [];

  try {
    // Process in smaller transactions to avoid timeout
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      
      const batchResult = await safeTransaction(
        `${operation}_batch_${i}`,
        async (tx) => {
          const batchResults = [];
          for (const item of batch) {
            try {
              const result = await processor(tx, item);
              batchResults.push(result);
              processed++;
            } catch (error: any) {
              errors.push({ item, error: error.message });
            }
          }
          return batchResults;
        }
      );

      if (!batchResult.success) {
        errors.push({ batch: i, error: batchResult.error });
      }
    }

    const duration = Date.now() - startTime;
    logPerformanceMetric(`bulk_${operation}`, startTime);

    return {
      success: true,
      data: { processed, errors },
      duration
    };

  } catch (error: any) {
    const duration = Date.now() - startTime;
    
    logError(error, {
      component: 'TransactionSafety',
      action: 'bulk_operation_error',
      operation,
      severity: 'high'
    });

    return {
      success: false,
      error: error.message,
      data: { processed, errors },
      duration
    };
  }
}

// Export all safe operation functions
export {
  safeCourseEnrollment,
  safeProgressUpdate,
  safePaymentProcessing,
  safeKbNebSync,
  safeBulkOperation
};