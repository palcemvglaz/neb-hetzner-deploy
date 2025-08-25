import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function fixPasswords() {
  console.log('🔧 Fixing passwords...\n')

  const users = [
    { email: 'admin@nebachiv.com', password: 'admin123' },
    { email: 'student@nebachiv.com', password: 'student123' },
    { email: 'school@nebachiv.com', password: 'school123' },
  ]

  for (const userData of users) {
    const user = await prisma.user.findUnique({
      where: { email: userData.email }
    })

    if (user) {
      const hashedPassword = await bcrypt.hash(userData.password, 10)
      
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      })
      
      console.log(`✅ Fixed password for: ${userData.email}`)
    } else {
      console.log(`❌ User not found: ${userData.email}`)
    }
  }

  console.log('\n✨ All passwords fixed!')
}

fixPasswords()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })