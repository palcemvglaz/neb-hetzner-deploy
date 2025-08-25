#!/usr/bin/env node

const { PrismaClient: SqliteClient } = require('@prisma/client');
const { PrismaClient: PostgresClient } = require('@prisma/client');
const path = require('path');

// Create SQLite client with old connection
const sqliteDb = new SqliteClient({
  datasources: {
    db: {
      url: 'file:./prisma/dev.db'
    }
  }
});

// Create PostgreSQL client with new connection
const postgresDb = new PostgresClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function migrateData() {
  console.log('🚀 Starting migration from SQLite to PostgreSQL...\n');
  
  const stats = {
    users: 0,
    tests: 0,
    questions: 0,
    achievements: 0,
    badges: 0,
    courses: 0,
    enrollments: 0,
    schools: 0,
    staticPages: 0
  };

  try {
    // 1. Migrate Users
    console.log('📦 Migrating Users...');
    const users = await sqliteDb.user.findMany();
    for (const user of users) {
      await postgresDb.user.create({ data: user });
      stats.users++;
    }
    console.log(`✅ Migrated ${stats.users} users\n`);

    // 2. Migrate Schools
    console.log('📦 Migrating Schools...');
    const schools = await sqliteDb.school.findMany();
    for (const school of schools) {
      await postgresDb.school.create({ data: school });
      stats.schools++;
    }
    console.log(`✅ Migrated ${stats.schools} schools\n`);

    // 3. Migrate Courses
    console.log('📦 Migrating Courses...');
    const courses = await sqliteDb.course.findMany();
    for (const course of courses) {
      await postgresDb.course.create({ data: course });
      stats.courses++;
    }
    console.log(`✅ Migrated ${stats.courses} courses\n`);

    // 4. Migrate Tests
    console.log('📦 Migrating Tests...');
    const tests = await sqliteDb.test.findMany();
    for (const test of tests) {
      await postgresDb.test.create({ data: test });
      stats.tests++;
    }
    console.log(`✅ Migrated ${stats.tests} tests\n`);

    // 5. Migrate Questions
    console.log('📦 Migrating Questions...');
    const questions = await sqliteDb.question.findMany();
    for (const question of questions) {
      await postgresDb.question.create({ data: question });
      stats.questions++;
    }
    console.log(`✅ Migrated ${stats.questions} questions\n`);

    // 6. Migrate Achievements
    console.log('📦 Migrating Achievements...');
    const achievements = await sqliteDb.achievement.findMany();
    for (const achievement of achievements) {
      await postgresDb.achievement.create({ data: achievement });
      stats.achievements++;
    }
    console.log(`✅ Migrated ${stats.achievements} achievements\n`);

    // 7. Migrate Badges
    console.log('📦 Migrating Badges...');
    const badges = await sqliteDb.badge.findMany();
    for (const badge of badges) {
      await postgresDb.badge.create({ data: badge });
      stats.badges++;
    }
    console.log(`✅ Migrated ${stats.badges} badges\n`);

    // 8. Migrate Enrollments
    console.log('📦 Migrating Enrollments...');
    const enrollments = await sqliteDb.enrollment.findMany();
    for (const enrollment of enrollments) {
      await postgresDb.enrollment.create({ data: enrollment });
      stats.enrollments++;
    }
    console.log(`✅ Migrated ${stats.enrollments} enrollments\n`);

    // 9. Migrate Static Pages
    console.log('📦 Migrating Static Pages...');
    const staticPages = await sqliteDb.staticPage.findMany();
    for (const page of staticPages) {
      await postgresDb.staticPage.create({ data: page });
      stats.staticPages++;
    }
    console.log(`✅ Migrated ${stats.staticPages} static pages\n`);

    // Print summary
    console.log('=' .repeat(50));
    console.log('✨ MIGRATION COMPLETED SUCCESSFULLY!');
    console.log('=' .repeat(50));
    console.log('\n📊 Migration Summary:');
    Object.entries(stats).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sqliteDb.$disconnect();
    await postgresDb.$disconnect();
  }
}

// Run migration
migrateData().catch(console.error);