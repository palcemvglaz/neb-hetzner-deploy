#!/usr/bin/env ts-node

import { CourseGenerator } from '../lib/services/course-generator'
import { VaultImporter } from '../lib/kb-neb/vault-importer'
import { prisma } from '../lib/db/prisma'

async function importCourses() {
  console.log('🚀 Starting KB_NEB course import...')
  
  const vaultImporter = new VaultImporter()
  const courseGenerator = new CourseGenerator()
  
  try {
    // Get all themes
    console.log('📚 Fetching KB_NEB themes...')
    const allThemes = await vaultImporter.getThemes()
    
    // Filter cornerstone and high-quality themes
    const priorityThemes = allThemes.filter(theme => 
      theme.is_cornerstone || theme.best_quality_score >= 7.0
    ).slice(0, 20) // Start with first 20 courses
    
    console.log(`Found ${allThemes.length} themes, importing ${priorityThemes.length} priority courses`)
    
    let successCount = 0
    let failedCount = 0
    
    for (let index = 0; index < priorityThemes.length; index++) {
      const theme = priorityThemes[index]
      console.log(`\n[${index + 1}/${priorityThemes.length}] Processing: ${theme.title}`)
      console.log(`  - Cornerstone: ${theme.is_cornerstone ? '✅' : '❌'}`)
      console.log(`  - Quality score: ${theme.best_quality_score}`)
      console.log(`  - Formats: ${theme.formats.join(', ')}`)
      console.log(`  - Word count: ${theme.total_word_count}`)
      
      try {
        // Check if course already exists
        const slug = theme.title
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
        
        const existingCourse = await prisma.course.findFirst({
          where: {
            slug: slug
          }
        })
        
        if (existingCourse) {
          console.log(`  ⏭️  Course already exists, skipping...`)
          continue
        }
        
        // Generate course structure
        const courseStructure = await courseGenerator.generateCourseFromTheme(theme)
        
        if (!courseStructure) {
          console.log(`  ❌ Failed to generate course structure`)
          failedCount++
          continue
        }
        
        console.log(`  - Generated course: ${courseStructure.difficulty} | ${courseStructure.price} UAH`)
        console.log(`  - Modules: ${courseStructure.modules.length}`)
        console.log(`  - Total lessons: ${courseStructure.modules.reduce((sum, m) => sum + m.lessons.length, 0)}`)
        
        // Save to database
        const courseId = await courseGenerator.saveCourseToDatabase(courseStructure)
        
        if (courseId) {
          console.log(`  ✅ Course saved with ID: ${courseId}`)
          successCount++
        } else {
          console.log(`  ❌ Failed to save course`)
          failedCount++
        }
        
      } catch (error) {
        console.error(`  ❌ Error processing theme:`, error instanceof Error ? error.message : error)
        failedCount++
      }
    }
    
    console.log('\n📊 Import Summary:')
    console.log(`✅ Successfully imported: ${successCount} courses`)
    console.log(`❌ Failed: ${failedCount} courses`)
    console.log(`📚 Total themes available: ${allThemes.length}`)
    
    // Show course statistics
    const beginnerCount = await prisma.course.count({ where: { difficulty: 'BEGINNER' } })
    const intermediateCount = await prisma.course.count({ where: { difficulty: 'INTERMEDIATE' } })
    const advancedCount = await prisma.course.count({ where: { difficulty: 'ADVANCED' } })
    
    console.log('\n📈 Course Distribution:')
    console.log(`  - BEGINNER: ${beginnerCount} courses`)
    console.log(`  - INTERMEDIATE: ${intermediateCount} courses`)
    console.log(`  - ADVANCED: ${advancedCount} courses`)
    
    const totalCourses = await prisma.course.count()
    console.log(`\n🎯 Total courses in database: ${totalCourses}`)
    
  } catch (error) {
    console.error('❌ Import failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run import
importCourses()
  .then(() => {
    console.log('\n✨ Import completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })