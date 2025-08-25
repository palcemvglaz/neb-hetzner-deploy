#!/usr/bin/env node

const Database = require('better-sqlite3');
const { PrismaClient } = require('@prisma/client');

// PostgreSQL client
const postgresDb = new PrismaClient();

// SQLite database  
const sqliteDb = new Database('./prisma/dev.db', { readonly: true });

async function migrateEssentialData() {
  console.log('🚀 Starting ESSENTIAL migration from SQLite to PostgreSQL...\n');
  
  const stats = {
    users: 0,
    tests: 0,
    questions: 0,
    achievements: 0
  };

  try {
    // 1. Migrate Users first (most important)
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
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
          lastSeenAt: user.lastSeenAt ? new Date(user.lastSeenAt) : null,
          isActive: Boolean(user.isActive ?? true),
          isEmailVerified: Boolean(user.isEmailVerified ?? false),
          onboardingCompleted: Boolean(user.onboardingCompleted ?? false)
        };

        await postgresDb.user.create({ data: userData });
        stats.users++;
        console.log(`   ✅ Migrated user: ${user.email}`);
      } catch (err) {
        console.log(`   ⚠️ Skipped user ${user.email}: ${err.message.split('\n')[0]}`);
      }
    }
    console.log(`✅ Migrated ${stats.users} users\n`);

    // 2. Migrate Tests (important for functionality)  
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
              category: test.category || 'general',
              difficulty: test.difficulty || 'BEGINNER',
              timeLimit: test.timeLimit || 30,
              passingScore: test.passingScore || 70,
              totalQuestions: test.totalQuestions || 10,
              isPublished: Boolean(test.isPublished ?? false),
              isAdaptive: Boolean(test.isAdaptive ?? false),
              instructions: test.instructions,
              allowReview: Boolean(test.allowReview ?? true),
              shuffleQuestions: Boolean(test.shuffleQuestions ?? false),
              maxAttempts: test.maxAttempts || 3,
              createdAt: new Date(test.createdAt),
              updatedAt: new Date(test.updatedAt)
            }
          });
          stats.tests++;
          console.log(`   ✅ Migrated test: ${test.title}`);
        } catch (err) {
          console.log(`   ⚠️ Skipped test: ${err.message.split('\n')[0]}`);
        }
      }
    } catch (err) {
      console.log(`   ⚠️ Tests table not found: ${err.message}`);
    }
    console.log(`✅ Migrated ${stats.tests} tests\n`);

    // 3. Migrate Questions  
    console.log('📦 Migrating Questions...');
    try {
      const questions = sqliteDb.prepare('SELECT * FROM Question').all();
      for (const question of questions) {
        try {
          await postgresDb.question.create({
            data: {
              id: question.id,
              text: question.text,
              type: question.type || 'MULTIPLE_CHOICE',
              category: question.category || 'general',
              difficulty: question.difficulty || 'BEGINNER',
              correctAnswer: question.correctAnswer,
              options: question.options ? JSON.parse(question.options) : null,
              explanation: question.explanation,
              imageUrl: question.imageUrl,
              points: question.points || 1,
              source: question.source,
              isActive: Boolean(question.isActive ?? true),
              createdAt: new Date(question.createdAt),
              updatedAt: new Date(question.updatedAt)
            }
          });
          stats.questions++;
        } catch (err) {
          console.log(`   ⚠️ Skipped question: ${err.message.split('\n')[0]}`);
        }
      }
    } catch (err) {
      console.log(`   ⚠️ Questions table not found: ${err.message}`);
    }
    console.log(`✅ Migrated ${stats.questions} questions\n`);

    // 4. Migrate Achievements
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
              icon: achievement.icon || '🏆',
              category: achievement.category || 'general',
              requiredProgress: achievement.requiredProgress || 1,
              points: achievement.points || 10,
              createdAt: new Date(achievement.createdAt)
            }
          });
          stats.achievements++;
        } catch (err) {
          console.log(`   ⚠️ Skipped achievement: ${err.message.split('\n')[0]}`);
        }
      }
    } catch (err) {
      console.log(`   ⚠️ Achievements table not found: ${err.message}`);
    }
    console.log(`✅ Migrated ${stats.achievements} achievements\n`);

    // Print final summary
    console.log('='.repeat(60));
    console.log('✨ ESSENTIAL MIGRATION COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('\n📊 Migration Summary:');
    Object.entries(stats).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });
    
    console.log('\n🎯 Next steps:');
    console.log('   1. Test user login functionality');
    console.log('   2. Check dashboard works');
    console.log('   3. Verify all pages load properly');

    return stats;

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
migrateEssentialData().catch(console.error);