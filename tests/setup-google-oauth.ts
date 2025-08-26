import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function setupGoogleOAuthUser() {
  console.log('🌱 Setting up Google OAuth test user...')

  // Create or update puladesign@gmail.com as admin
  await prisma.user.upsert({
    where: { email: 'puladesign@gmail.com' },
    update: {
      role: 'ADMIN',
      name: 'Google Admin User',
      emailVerified: new Date()
    },
    create: {
      email: 'puladesign@gmail.com',
      name: 'Google Admin User',
      role: 'ADMIN',
      emailVerified: new Date()
    }
  })

  console.log('✅ Google OAuth admin user ready: puladesign@gmail.com')
}

setupGoogleOAuthUser()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })