const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function simulateQuestionnaire() {
  console.log('🎯 Starting questionnaire simulation...\n');

  // Get test students
  const students = await prisma.user.findMany({
    where: {
      email: {
        in: ['student@test.com', 'student2@test.com']
      }
    }
  });

  for (const student of students) {
    console.log(`📝 Processing ${student.email}...`);

    // Generate skill map based on student type
    const isExperienced = student.email === 'student2@test.com';
    
    const skillMap = {
      basicSkills: {
        balance: isExperienced ? 85 : 45,
        throttleControl: isExperienced ? 90 : 40,
        braking: isExperienced ? 88 : 50,
        shifting: isExperienced ? 92 : 55,
        turning: isExperienced ? 87 : 42,
        parking: isExperienced ? 95 : 60
      },
      advancedSkills: {
        lanePositioning: isExperienced ? 82 : 30,
        emergencyBraking: isExperienced ? 78 : 25,
        countersteering: isExperienced ? 75 : 20,
        trailBraking: isExperienced ? 70 : 15,
        bodyPosition: isExperienced ? 85 : 35,
        corneringSpeed: isExperienced ? 73 : 28,
        // Weather skills
        rainRiding: isExperienced ? 65 : 20,
        mistRiding: isExperienced ? 60 : 15,
        nightRiding: isExperienced ? 70 : 25,
        coldWeatherRiding: isExperienced ? 68 : 22
      },
      stuntSkills: {
        wheelie: isExperienced ? 45 : 5,
        stoppie: isExperienced ? 35 : 0,
        burnout: isExperienced ? 50 : 10,
        drifting: isExperienced ? 30 : 0
      },
      safetySkills: {
        hazardPerception: isExperienced ? 88 : 55,
        defensiveRiding: isExperienced ? 90 : 60,
        groupRiding: isExperienced ? 85 : 40,
        trafficAwareness: isExperienced ? 92 : 65,
        weatherAdaptation: isExperienced ? 80 : 45,
        nightVisibility: isExperienced ? 75 : 50
      },
      overallLevel: isExperienced ? 75 : 35
    };

    // Create or update skill map
    await prisma.riderSkillMap.upsert({
      where: { userId: student.id },
      update: skillMap,
      create: {
        userId: student.id,
        ...skillMap
      }
    });

    console.log(`✅ Created skill map for ${student.email}`);

    // Create timeline events
    const events = isExperienced ? [
      {
        userId: student.id,
        eventType: 'LICENSE_OBTAINED',
        title: 'Отримав категорію А',
        description: 'Успішно склав іспит в мотошколі',
        metadata: { school: 'Kyiv Moto School', score: 95 },
        eventDate: new Date('2023-05-15')
      },
      {
        userId: student.id,
        eventType: 'FIRST_BIKE',
        title: 'Купив перший мотоцикл',
        description: 'Honda CB650R - мрія збулась!',
        metadata: { bike: 'Honda CB650R', year: 2023 },
        eventDate: new Date('2023-06-01')
      },
      {
        userId: student.id,
        eventType: 'ACHIEVEMENT',
        title: 'Перша далека поїздка',
        description: '500км по Карпатах за один день',
        metadata: { distance: 500, location: 'Carpathians' },
        eventDate: new Date('2023-08-20')
      },
      {
        userId: student.id,
        eventType: 'COURSE_COMPLETED',
        title: 'Пройшов курс безпечного водіння',
        description: 'Nebachiv Advanced Safety Course',
        metadata: { courseId: 'safety-advanced', score: 88 },
        eventDate: new Date('2024-03-10')
      },
      {
        userId: student.id,
        eventType: 'MILESTONE',
        title: '10,000 км пробігу',
        description: 'Досягнув позначки 10000 км без аварій',
        metadata: { totalKm: 10000, accidents: 0 },
        eventDate: new Date('2024-09-15')
      }
    ] : [
      {
        userId: student.id,
        eventType: 'LICENSE_OBTAINED',
        title: 'Отримав категорію А',
        description: 'Щойно склав іспит!',
        metadata: { school: 'Local Moto School', score: 82 },
        eventDate: new Date('2024-10-01')
      },
      {
        userId: student.id,
        eventType: 'FIRST_BIKE',
        title: 'Купив першій мотоцикл',
        description: 'Yamaha MT-03 для початківця',
        metadata: { bike: 'Yamaha MT-03', year: 2024 },
        eventDate: new Date('2024-10-15')
      },
      {
        userId: student.id,
        eventType: 'TRAINING',
        title: 'Перша тренувальна сесія',
        description: 'Практика на парковці',
        metadata: { duration: '2 hours', location: 'Parking lot' },
        eventDate: new Date('2024-10-20')
      }
    ];

    // Delete existing events to avoid duplicates
    await prisma.riderTimelineEvent.deleteMany({
      where: { userId: student.id }
    });

    // Create new timeline events
    await prisma.riderTimelineEvent.createMany({
      data: events
    });

    console.log(`✅ Created ${events.length} timeline events for ${student.email}`);

    // Update user rider profile with questionnaire data
    await prisma.user.update({
      where: { id: student.id },
      data: {
        riderProfile: isExperienced ? 'EXPERIENCED_RIDER' : 'BEGINNER_CAUTIOUS',
        riderProfileData: {
          profileType: isExperienced ? 'EXPERIENCED_RIDER' : 'BEGINNER_CAUTIOUS',
          completedAt: new Date().toISOString(),
          answers: {
            experience: isExperienced ? '2-5 years' : 'less than 6 months',
            ridingStyle: isExperienced ? 'sport' : 'commute',
            mainGoal: isExperienced ? 'track days' : 'safety',
            bikePower: isExperienced ? '650cc' : '300cc'
          }
        }
      }
    });

    console.log(`✅ Updated questionnaire profile for ${student.email}\n`);
  }

  // Check results
  console.log('📊 Verifying data...\n');

  for (const student of students) {
    const userData = await prisma.user.findUnique({
      where: { id: student.id },
      include: {
        riderSkillMap: true,
        riderTimeline: {
          orderBy: { eventDate: 'desc' }
        }
      }
    });

    console.log(`👤 ${student.email}:`);
    console.log(`   - Skill Level: ${userData.riderSkillMap?.overallLevel || 0}`);
    console.log(`   - Timeline Events: ${userData.riderTimeline?.length || 0}`);
    console.log(`   - Profile Type: ${userData.riderProfile || 'None'}`);
    
    // Show URLs
    console.log(`\n   🔗 URLs:`);
    console.log(`   - Skill Tree: http://localhost:3205/profile/${student.id}/skills`);
    console.log(`   - Timeline: http://localhost:3205/profile/${student.id}/timeline`);
    console.log(`   - Profile: http://localhost:3205/profile/${student.id}`);
    console.log('');
  }

  console.log('\n✅ Simulation complete!');
  console.log('\n📊 Admin URLs:');
  console.log('   - Questionnaires: http://localhost:3205/admin/questionnaires');
  console.log('   - Analytics: http://localhost:3205/admin/questionnaires/analytics');
  
  await prisma.$disconnect();
}

simulateQuestionnaire().catch(console.error);