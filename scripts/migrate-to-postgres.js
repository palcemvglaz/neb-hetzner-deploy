#!/usr/bin/env node

const Database = require('better-sqlite3');
const { PrismaClient } = require('@prisma/client');

// PostgreSQL client
const postgresDb = new PrismaClient();

// SQLite database
const sqliteDb = new Database('./prisma/dev.db', { readonly: true });

async function migrateData() {
  console.log('🚀 Starting migration from SQLite to PostgreSQL...\n');
  
  const stats = {
    users: 0,
    tests: 0,  
    questions: 0,
    achievements: 0,
    badges: 0,
    courses: 0,
    schools: 0,
    staticPages: 0,
    errors: []
  };

  try {
    // 1. Migrate Users
    console.log('📦 Migrating Users...');
    const users = sqliteDb.prepare('SELECT * FROM User').all();
    for (const user of users) {
      try {
        await postgresDb.user.create({
          data: {
            id: user.id,
            email: user.email,
            emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
            password: user.password,
            name: user.name,
            image: user.image,
            role: user.role,
            phone: user.phone,
            dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : null,
            schoolId: user.schoolId,
            schoolGroupId: user.schoolGroupId,
            stripeCustomerId: user.stripeCustomerId,
            stripeSubscriptionId: user.stripeSubscriptionId,
            subscriptionStatus: user.subscriptionStatus,
            subscriptionTier: user.subscriptionTier,
            bio: user.bio,
            websiteUrl: user.websiteUrl,
            socialLinks: user.socialLinks ? JSON.parse(user.socialLinks) : null,
            preferences: user.preferences ? JSON.parse(user.preferences) : null,
            profile: user.profile,
            createdAt: new Date(user.createdAt),
            updatedAt: new Date(user.updatedAt),
            lastSeenAt: user.lastSeenAt ? new Date(user.lastSeenAt) : null,
            isActive: Boolean(user.isActive),
            isEmailVerified: Boolean(user.isEmailVerified),
            onboardingCompleted: Boolean(user.onboardingCompleted),
            metadata: user.metadata ? JSON.parse(user.metadata) : null,
            isWaitlist: Boolean(user.isWaitlist)
          }
        });
        stats.users++;
      } catch (err) {
        console.log(`   ⚠️ Skipped user ${user.email}: ${err.message}`);
        stats.errors.push(`User ${user.email}: ${err.message}`);
      }
    }
    console.log(`✅ Migrated ${stats.users} users\n`);

    // 2. Migrate Schools
    console.log('📦 Migrating Schools...');
    const schools = sqliteDb.prepare('SELECT * FROM School').all();
    for (const school of schools) {
      try {
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
      } catch (err) {
        console.log(`   ⚠️ Skipped school: ${err.message}`);
      }
    }
    console.log(`✅ Migrated ${stats.schools} schools\n`);

    // 3. Migrate Courses
    console.log('📦 Migrating Courses...');
    const courses = sqliteDb.prepare('SELECT * FROM Course').all();
    for (const course of courses) {
      try {
        await postgresDb.course.create({
          data: {
            id: course.id,
            title: course.title,
            slug: course.slug,
            description: course.description,
            thumbnail: course.thumbnail,
            price: course.price,
            level: course.level,
            duration: course.duration,
            language: course.language,
            isPublished: Boolean(course.isPublished),
            isFree: Boolean(course.isFree),
            createdAt: new Date(course.createdAt),
            updatedAt: new Date(course.updatedAt),
            schoolId: course.schoolId
          }
        });
        stats.courses++;
      } catch (err) {
        console.log(`   ⚠️ Skipped course: ${err.message}`);
      }
    }
    console.log(`✅ Migrated ${stats.courses} courses\n`);

    // 4. Migrate Tests
    console.log('📦 Migrating Tests...');
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
            isPublished: Boolean(test.isPublished),
            isAdaptive: Boolean(test.isAdaptive),
            instructions: test.instructions,
            allowReview: Boolean(test.allowReview),
            shuffleQuestions: Boolean(test.shuffleQuestions),
            maxAttempts: test.maxAttempts,
            tags: test.tags ? JSON.parse(test.tags) : null,
            createdAt: new Date(test.createdAt),
            updatedAt: new Date(test.updatedAt)
          }
        });
        stats.tests++;
      } catch (err) {
        console.log(`   ⚠️ Skipped test: ${err.message}`);
      }
    }
    console.log(`✅ Migrated ${stats.tests} tests\n`);

    // 5. Migrate Questions
    console.log('📦 Migrating Questions...');
    const questions = sqliteDb.prepare('SELECT * FROM Question').all();
    for (const question of questions) {
      try {
        await postgresDb.question.create({
          data: {
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
            isActive: Boolean(question.isActive),
            tags: question.tags ? JSON.parse(question.tags) : null,
            createdAt: new Date(question.createdAt),
            updatedAt: new Date(question.updatedAt)
          }
        });
        stats.questions++;
      } catch (err) {
        console.log(`   ⚠️ Skipped question: ${err.message}`);
      }
    }
    console.log(`✅ Migrated ${stats.questions} questions\n`);

    // 6. Migrate Achievements
    console.log('📦 Migrating Achievements...');
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
        console.log(`   ⚠️ Skipped achievement: ${err.message}`);
      }
    }
    console.log(`✅ Migrated ${stats.achievements} achievements\n`);

    // 7. Migrate Badges
    console.log('📦 Migrating Badges...');
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
        console.log(`   ⚠️ Skipped badge: ${err.message}`);
      }
    }
    console.log(`✅ Migrated ${stats.badges} badges\n`);

    // 8. Migrate Static Pages
    console.log('📦 Migrating Static Pages...');
    const staticPages = sqliteDb.prepare('SELECT * FROM StaticPage').all();
    for (const page of staticPages) {
      try {
        await postgresDb.staticPage.create({
          data: {
            id: page.id,
            slug: page.slug,
            isPublished: Boolean(page.isPublished),
            publishedAt: page.publishedAt ? new Date(page.publishedAt) : null,
            createdAt: new Date(page.createdAt),
            updatedAt: new Date(page.updatedAt),
            authorId: page.authorId
          }
        });
        stats.staticPages++;
      } catch (err) {
        console.log(`   ⚠️ Skipped static page: ${err.message}`);
      }
    }
    console.log(`✅ Migrated ${stats.staticPages} static pages\n`);

    // Print summary
    console.log('=' .repeat(50));
    console.log('✨ MIGRATION COMPLETED SUCCESSFULLY!');
    console.log('=' .repeat(50));
    console.log('\n📊 Migration Summary:');
    Object.entries(stats).forEach(([key, value]) => {
      if (key !== 'errors') {
        console.log(`   ${key}: ${value}`);
      }
    });
    
    if (stats.errors.length > 0) {
      console.log('\n⚠️ Errors encountered:');
      stats.errors.forEach(err => console.log(`   - ${err}`));
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    sqliteDb.close();
    await postgresDb.$disconnect();
  }
}

// Run migration
migrateData().catch(console.error);