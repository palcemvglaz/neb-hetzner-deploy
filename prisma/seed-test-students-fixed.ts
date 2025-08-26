import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Realistic questionnaire data for different profiles
const testStudentsData = [
  {
    id: 1,
    email: 'student1@test.com',
    name: 'Олександр Коваленко',
    age: '22',
    profession: 'ІТ-спеціаліст',
    motorcycle: 'Yamaha MT-09',
    seasons: '2',
    type: 'experienced' as const,
    profileType: 'EXPERIENCED_SAFE',
    riskScore: 3.2,
    confidenceScore: 85,
    safetyScore: 88,
    skillsScore: 82,
    knowledgeScore: 90,
    psychologyScore: 78,
    riskAwareness: 85,
    overallLevel: 'Intermediate',
    riskProfile: 'moderate' as const,
    redFlags: ['Перевищення швидкості на трасі'],
    recommendations: ['Пройти курс екстремального водіння', 'Вивчити техніку контраварійного водіння'],
    completionTime: 420,
    answers: {
      e1_1: 'Так, маю права категорії А',
      e1_2: '2',
      e1_3: 'Так, регулярно',
      e1_4: 'Переважно в місті та на короткі дистанції',
      e1_5: 'Так, досить впевнено',
      e1_6: 'Yamaha MT-09'
    }
  },
  {
    id: 2,
    email: 'student2@test.com',
    name: 'Марина Петрова',
    age: '28',
    profession: 'Дизайнер',
    motorcycle: 'Honda CB650R',
    seasons: '1',
    type: 'beginner' as const,
    profileType: 'BEGINNER_CAREFUL',
    riskScore: 2.1,
    confidenceScore: 65,
    safetyScore: 92,
    skillsScore: 68,
    knowledgeScore: 75,
    psychologyScore: 85,
    riskAwareness: 90,
    overallLevel: 'Novice',
    riskProfile: 'low' as const,
    redFlags: [],
    recommendations: ['Більше практики на майданчику'],
    completionTime: 380,
    answers: {
      b1_1: 'Нещодавно отримав(ла)',
      b1_2: '1',
      b1_6: 'Honda CB650R'
    }
  }
]

// Student 10 will not have questionnaire data
const student10 = {
  email: 'student10@test.com',
  name: 'Роман Новак',
  role: 'STUDENT' as const,
}

async function generateSkillMap(userId: string, profile: any) {
  const baseSkills = {
    balance: Math.floor(profile.skillsScore * 0.8 + Math.random() * 20),
    braking: Math.floor(profile.skillsScore * 0.85 + Math.random() * 20),
    cornering: Math.floor(profile.skillsScore * 0.7 + Math.random() * 30),
  }

  const advancedSkills = {
    emergencyBraking: Math.floor(profile.skillsScore * 0.6 + Math.random() * 40),
    nightRiding: Math.floor(profile.riskAwareness * 0.8 + Math.random() * 20),
  }

  const stuntSkills = {
    wheelie: profile.profileType.includes('AGGRESSIVE') ? Math.floor(Math.random() * 60 + 20) : Math.floor(Math.random() * 30),
    stoppie: Math.floor(Math.random() * 20),
  }

  const safetySkills = {
    hazardPerception: Math.floor(profile.riskAwareness * 0.9 + Math.random() * 10),
    defensiveRiding: Math.floor(profile.safetyScore * 0.8 + Math.random() * 20),
  }

  const levelMapping = {
    'Novice': 1,
    'Beginner': 2,
    'Intermediate': 5,
    'Advanced': 8,
    'Expert': 10
  }
  const numericLevel = levelMapping[profile.overallLevel as keyof typeof levelMapping] || 3

  return await prisma.riderSkillMap.create({
    data: {
      userId,
      overallLevel: numericLevel,
      basicSkills: baseSkills,
      advancedSkills: advancedSkills,
      stuntSkills: stuntSkills,
      safetySkills: safetySkills
    }
  })
}

async function generateTimelineEvents(userId: string, profile: any) {
  const events = []
  const currentDate = new Date()
  const licenseDate = new Date(currentDate)
  licenseDate.setFullYear(licenseDate.getFullYear() - 1)
  
  events.push({
    userId,
    title: 'Отримання водійських прав категорії А',
    description: 'Успішно склав іспит',
    eventType: 'started_riding',
    eventDate: licenseDate
  })

  return await prisma.riderTimelineEvent.createMany({
    data: events
  })
}

async function main() {
  console.log('🌱 Creating test students...')
  const password = await bcrypt.hash('password123', 12)

  // Create 2 test students with questionnaire data
  for (const studentData of testStudentsData) {
    console.log(`👤 Creating ${studentData.name}...`)

    const user = await prisma.user.upsert({
      where: { email: studentData.email },
      update: {},
      create: {
        email: studentData.email,
        name: studentData.name,
        password: password,
        role: 'STUDENT',
        emailVerified: new Date(),
        riderProfile: studentData.profileType,
      }
    })

    // Create questionnaire profile
    await prisma.questionnaireProfile.create({
      data: {
        userId: user.id,
        type: studentData.type,
        answers: studentData.answers,
        profileType: studentData.profileType,
        riskScore: studentData.riskScore,
        confidenceScore: studentData.confidenceScore,
        safetyScore: studentData.safetyScore,
        skillsScore: studentData.skillsScore,
        overallLevel: studentData.overallLevel,
        riskProfile: studentData.riskProfile,
        completionTime: studentData.completionTime
      }
    })

    // Generate skill map and timeline
    await generateSkillMap(user.id, studentData)
    await generateTimelineEvents(user.id, studentData)

    console.log(`✅ Created ${studentData.name}`)
  }

  // Create student 10 without questionnaire
  const user10 = await prisma.user.upsert({
    where: { email: student10.email },
    update: {},
    create: {
      email: student10.email,
      name: student10.name,
      password: password,
      role: student10.role,
      emailVerified: new Date()
    }
  })
  console.log(`✅ Created ${student10.name} (no questionnaire)`)

  console.log('🎉 Test students created!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })