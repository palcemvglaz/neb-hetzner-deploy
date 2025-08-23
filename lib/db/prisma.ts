import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: any
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  }).$extends({
    query: {
      payment: {
        async create({ args, query }) {
          // Create the payment first
          const result = await query(args)
          
          // Check for duplicates after creation
          if (result) {
            const { DuplicateDetectionService } = await import('@/lib/services/duplicate-detection')
            const duplicate = await DuplicateDetectionService.checkNewPayment(result as any)
            
            if (duplicate) {
              console.warn(`⚠️ Duplicate payment detected: ${result.id}`)
              // Optionally mark as duplicate automatically
              // await DuplicateDetectionService.markAsDuplicate(result.id, duplicate.original.id)
            }
          }
          
          return result
        }
      }
    }
  })
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma