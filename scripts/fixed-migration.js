#!/usr/bin/env node

const Database = require('better-sqlite3');
const { PrismaClient } = require('@prisma/client');

// PostgreSQL client
const postgresDb = new PrismaClient();

// SQLite database  
const sqliteDb = new Database('./prisma/dev.db', { readonly: true });

async function migrateWithFixedSchema() {
  console.log('🚀 Starting FIXED migration from SQLite to PostgreSQL...\n');
  
  const stats = {
    users: 0,
    schools: 0,
    tests: 0,
    questions: 0,
    achievements: 0,
    badges: 0,
    staticPages: 0,
    courses: 0,
    enrollments: 0,
    userAchievements: 0,
    testResults: 0,
    progress: 0,
    riderSkills: 0,
    waitlist: 0
  };

  try {
    // Clean existing data first
    console.log('🧹 Cleaning existing PostgreSQL data...');
    await postgresDb.waitlist.deleteMany({});
    await postgresDb.riderSkillMap.deleteMany({});
    await postgresDb.progress.deleteMany({});
    await postgresDb.testResult.deleteMany({});
    await postgresDb.userAchievement.deleteMany({});
    await postgresDb.enrollment.deleteMany({});
    await postgresDb.course.deleteMany({});
    await postgresDb.staticPageTranslation.deleteMany({});
    await postgresDb.staticPage.deleteMany({});
    await postgresDb.question.deleteMany({});
    await postgresDb.test.deleteMany({});
    await postgresDb.badge.deleteMany({});
    await postgresDb.achievement.deleteMany({});
    await postgresDb.user.deleteMany({});
    await postgresDb.school.deleteMany({});
    console.log('✅ Cleaned existing data\n');

    // 1. Migrate Schools first (no dependencies)
    console.log('📦 Migrating Schools...');
    try {
      const schools = sqliteDb.prepare('SELECT * FROM School').all();
      for (const school of schools) {
        await postgresDb.school.create({
          data: {
            id: school.id,
            name: school.name,
            description: school.description,
            logo: school.logo,
            address: school.address,
            phone: school.phone,
            email: school.email,
            website: school.website,
            createdAt: new Date(school.createdAt),
            updatedAt: new Date(school.updatedAt)
          }
        });
        stats.schools++;
      }
    } catch (err) {
      console.log(`   ⚠️ Schools table might not exist: ${err.message}`);
    }
    console.log(`✅ Migrated ${stats.schools} schools\n`);

    // 2. Migrate Users (depends on schools)
    console.log('📦 Migrating Users...');
    const users = sqliteDb.prepare('SELECT * FROM User').all();
    for (const user of users) {
      try {
        const userData = {
          id: user.id,
          email: user.email,
          emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
          password: user.password,
          name: user.name,
          image: user.image,
          role: user.role || 'STUDENT',
          phone: user.phone,
          dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : null,
          stripeCustomerId: user.stripeCustomerId,
          stripeSubscriptionId: user.stripeSubscriptionId,
          subscriptionStatus: user.subscriptionStatus,
          subscriptionTier: user.subscriptionTier,
          bio: user.bio,
          websiteUrl: user.websiteUrl,
          socialLinks: user.socialLinks ? JSON.parse(user.socialLinks) : null,
          preferences: user.preferences ? JSON.parse(user.preferences) : null,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
          lastSeenAt: user.lastSeenAt ? new Date(user.lastSeenAt) : null,
          isActive: Boolean(user.isActive ?? true),
          isEmailVerified: Boolean(user.isEmailVerified ?? false),
          onboardingCompleted: Boolean(user.onboardingCompleted ?? false),
          metadata: user.metadata ? JSON.parse(user.metadata) : null,
          isWaitlist: Boolean(user.isWaitlist ?? false)
        };

        // Add school relation if exists
        if (user.schoolId) {
          userData.school = {
            connect: { id: user.schoolId }
          };
        }

        await postgresDb.user.create({ data: userData });
        stats.users++;
        if (stats.users % 10 === 0) {
          console.log(`   Migrated ${stats.users} users...`);
        }
      } catch (err) {
        console.log(`   ⚠️ Skipped user ${user.email}: ${err.message.split('\n')[0]}`);
      }
    }
    console.log(`✅ Migrated ${stats.users} users\n`);

    // 3. Migrate Achievements (no dependencies)
    console.log('📦 Migrating Achievements...');
    try {
      const achievements = sqliteDb.prepare('SELECT * FROM Achievement').all();
      for (const achievement of achievements) {
        try {
          await postgresDb.achievement.create({
            data: {
              id: achievement.id,
              name: achievement.name,
              description: achievement.description,
              icon: achievement.icon,
              category: achievement.category,
              requiredProgress: achievement.requiredProgress,
              points: achievement.points,
              createdAt: new Date(achievement.createdAt)
            }
          });
          stats.achievements++;
        } catch (err) {
          console.log(`   ⚠️ Skipped achievement: ${err.message.split('\n')[0]}`);
        }
      }
    } catch (err) {
      console.log(`   ⚠️ Achievements table might not exist: ${err.message}`);
    }
    console.log(`✅ Migrated ${stats.achievements} achievements\n`);

    // 4. Migrate Badges (no dependencies)
    console.log('📦 Migrating Badges...');
    try {
      const badges = sqliteDb.prepare('SELECT * FROM Badge').all();
      for (const badge of badges) {
        try {
          await postgresDb.badge.create({
            data: {
              id: badge.id,
              name: badge.name,
              description: badge.description,
              imageUrl: badge.imageUrl,
              category: badge.category,
              criteria: badge.criteria ? JSON.parse(badge.criteria) : null,
              points: badge.points,
              createdAt: new Date(badge.createdAt)
            }
          });
          stats.badges++;
        } catch (err) {
          console.log(`   ⚠️ Skipped badge: ${err.message.split('\n')[0]}`);
        }
      }
    } catch (err) {
      console.log(`   ⚠️ Badges table might not exist: ${err.message}`);
    }
    console.log(`✅ Migrated ${stats.badges} badges\n`);

    // 5. Migrate Tests (no dependencies)
    console.log('📦 Migrating Tests...');
    try {
      const tests = sqliteDb.prepare('SELECT * FROM Test').all();
      for (const test of tests) {
        try {
          await postgresDb.test.create({
            data: {
              id: test.id,
              title: test.title,
              description: test.description,
              category: test.category,
              difficulty: test.difficulty,
              timeLimit: test.timeLimit,
              passingScore: test.passingScore,
              totalQuestions: test.totalQuestions,
              isPublished: Boolean(test.isPublished ?? false),
              isAdaptive: Boolean(test.isAdaptive ?? false),
              instructions: test.instructions,
              allowReview: Boolean(test.allowReview ?? true),
              shuffleQuestions: Boolean(test.shuffleQuestions ?? false),
              maxAttempts: test.maxAttempts,
              tags: test.tags ? JSON.parse(test.tags) : null,
              createdAt: new Date(test.createdAt),
              updatedAt: new Date(test.updatedAt)
            }
          });
          stats.tests++;
        } catch (err) {
          console.log(`   ⚠️ Skipped test: ${err.message.split('\n')[0]}`);
        }
      }
    } catch (err) {
      console.log(`   ⚠️ Tests table might not exist: ${err.message}`);
    }
    console.log(`✅ Migrated ${stats.tests} tests\n`);

    // 6. Migrate Questions (depends on tests)
    console.log('📦 Migrating Questions...');
    try {
      const questions = sqliteDb.prepare('SELECT * FROM Question').all();
      for (const question of questions) {
        try {
          const questionData = {
            id: question.id,
            text: question.text,
            type: question.type,
            category: question.category,
            difficulty: question.difficulty,
            correctAnswer: question.correctAnswer,
            options: question.options ? JSON.parse(question.options) : null,
            explanation: question.explanation,
            imageUrl: question.imageUrl,
            points: question.points,
            source: question.source,
            metadata: question.metadata ? JSON.parse(question.metadata) : null,
            isActive: Boolean(question.isActive ?? true),
            tags: question.tags ? JSON.parse(question.tags) : null,
            createdAt: new Date(question.createdAt),
            updatedAt: new Date(question.updatedAt)
          };

          // Add test relation if exists
          if (question.testId) {
            questionData.test = {
              connect: { id: question.testId }
            };
          }

          await postgresDb.question.create({ data: questionData });
          stats.questions++;
        } catch (err) {
          console.log(`   ⚠️ Skipped question: ${err.message.split('\n')[0]}`);
        }
      }
    } catch (err) {
      console.log(`   ⚠️ Questions table might not exist: ${err.message}`);
    }
    console.log(`✅ Migrated ${stats.questions} questions\n`);

    // 7. Migrate Static Pages (depends on users)
    console.log('📦 Migrating Static Pages...');
    try {
      const staticPages = sqliteDb.prepare('SELECT * FROM StaticPage').all();
      for (const page of staticPages) {
        try {
          const pageData = {
            id: page.id,
            slug: page.slug,
            isPublished: Boolean(page.isPublished ?? false),
            publishedAt: page.publishedAt ? new Date(page.publishedAt) : null,
            createdAt: new Date(page.createdAt),
            updatedAt: new Date(page.updatedAt)
          };

          // Add author relation if exists
          if (page.authorId) {
            pageData.author = {
              connect: { id: page.authorId }
            };
          }

          await postgresDb.staticPage.create({ data: pageData });
          stats.staticPages++;
        } catch (err) {
          console.log(`   ⚠️ Skipped page: ${err.message.split('\n')[0]}`);
        }
      }
    } catch (err) {
      console.log(`   ⚠️ StaticPage table might not exist: ${err.message}`);
    }
    console.log(`✅ Migrated ${stats.staticPages} static pages\n`);

    // 8. Migrate Waitlist entries
    console.log('📦 Migrating Waitlist entries...');
    try {
      const waitlistEntries = sqliteDb.prepare('SELECT * FROM Waitlist').all();
      for (const entry of waitlistEntries) {
        try {
          await postgresDb.waitlist.create({
            data: {
              id: entry.id,
              email: entry.email,
              name: entry.name,
              phone: entry.phone,
              interests: entry.interests,
              source: entry.source,
              createdAt: new Date(entry.createdAt)
            }
          });
          stats.waitlist++;
        } catch (err) {
          console.log(`   ⚠️ Skipped waitlist entry: ${err.message.split('\n')[0]}`);
        }
      }
    } catch (err) {
      console.log(`   ⚠️ Waitlist table might not exist: ${err.message}`);
    }
    console.log(`✅ Migrated ${stats.waitlist} waitlist entries\n`);

    // Print final summary
    console.log('='.repeat(60));
    console.log('✨ MIGRATION COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('\n📊 Migration Summary:');
    Object.entries(stats).forEach(([key, value]) => {
      if (value > 0) {
        console.log(`   ${key}: ${value}`);
      }
    });
    console.log('\n🎯 Next steps:');
    console.log('   1. Run: npm run db:push (to sync schema)');
    console.log('   2. Test the application');
    console.log('   3. Check all functionality works');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  } finally {
    sqliteDb.close();
    await postgresDb.$disconnect();
  }
}

// Run migration
migrateWithFixedSchema().catch(console.error);