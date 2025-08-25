#!/usr/bin/env tsx

import { prisma } from '../lib/db/prisma'
import { KBNebClient } from '../lib/kb-neb/client'
import { 
  convertToContent, 
  normalizeFormat, 
  isSupportedFormat,
  generateKbNebId 
} from '../lib/kb-neb/converter'

interface SyncOptions {
  format?: string
  language?: string
  forceUpdate?: boolean
  dryRun?: boolean
  limit?: number
}

interface SyncResult {
  totalFiles: number
  processedFiles: number
  importedFiles: number
  updatedFiles: number
  skippedFiles: number
  errorFiles: number
  errors: Array<{ file: string; error: string }>
}

async function syncContent(options: SyncOptions = {}): Promise<SyncResult> {
  const client = new KBNebClient()
  const result: SyncResult = {
    totalFiles: 0,
    processedFiles: 0,
    importedFiles: 0,
    updatedFiles: 0,
    skippedFiles: 0,
    errorFiles: 0,
    errors: [],
  }

  try {
    console.log('🚀 Starting KB_NEB sync...')
    console.log('Options:', options)

    // Create sync record
    const sync = await prisma.kBNebSync.create({
      data: {
        status: 'IN_PROGRESS',
        startedAt: new Date(),
      }
    })

    // Get all tags for mapping
    const existingTags = await prisma.tag.findMany()

    // Fetch themes from KB_NEB
    const themesResponse = await client.getThemes({
      limit: options.limit || 100,
      filter: {
        has_mastertext: true, // Only themes with content
      }
    })

    const themes = themesResponse.data.themes
    console.log(`📚 Found ${themes.length} themes to process`)

    // Process each theme
    for (const theme of themes) {
      try {
        console.log(`\n📖 Processing theme: ${theme.theme_id}`)
        
        // Get detailed theme info
        const themeDetail = await client.getTheme(theme.theme_id)
        const formats = themeDetail.data.formats

        // Filter formats if specified
        let formatsToProcess = formats
        if (options.format) {
          const normalizedFormat = normalizeFormat(options.format)
          formatsToProcess = formats.filter(f => f.format_code === normalizedFormat)
        }

        // Filter by language if specified
        if (options.language) {
          formatsToProcess = formatsToProcess.filter(f => 
            f.lang.toUpperCase() === options.language!.toUpperCase()
          )
        }

        // Only process supported formats
        formatsToProcess = formatsToProcess.filter(f => isSupportedFormat(f.format_code))

        console.log(`  Found ${formatsToProcess.length} formats to process`)

        for (const format of formatsToProcess) {
          result.totalFiles++
          
          const fileId = `${theme.theme_id}/${format.format_code}-${format.lang}`
          console.log(`  Processing: ${fileId}`)

          try {
            // Skip if not ready
            if (format.status !== 'done' && format.status !== 'published') {
              console.log(`    ⏭️  Skipped (status: ${format.status})`)
              result.skippedFiles++
              continue
            }

            // Fetch content from KB_NEB
            const contentResponse = await client.getContent(
              theme.theme_id,
              format.format_code,
              format.lang
            )
            const kbContent = contentResponse.data

            // Generate KB_NEB ID
            const kbNebId = generateKbNebId(theme.theme_id, format.format_code, format.lang)

            // Check if content already exists
            const existingContent = await prisma.content.findUnique({
              where: { kbNebId }
            })

            if (existingContent && !options.forceUpdate) {
              console.log(`    ⏭️  Skipped (already exists)`)
              result.skippedFiles++
              continue
            }

            // Convert content
            const converted = convertToContent(kbContent, themeDetail.data, existingTags)

            if (options.dryRun) {
              console.log(`    🔍 Dry run - would ${existingContent ? 'update' : 'import'}: ${converted.content.slug}`)
              result.processedFiles++
              continue
            }

            // Create sync item record
            const syncItem = await prisma.kBNebSyncItem.create({
              data: {
                syncId: sync.id,
                fileName: fileId,
                filePath: fileId,
                status: 'PROCESSING',
              }
            })

            try {
              if (existingContent) {
                // Update existing content
                await prisma.content.update({
                  where: { id: existingContent.id },
                  data: {
                    ...converted.content,
                    updatedAt: new Date(),
                  }
                })

                // Update translations
                for (const translation of converted.translations) {
                  await prisma.contentTranslation.upsert({
                    where: {
                      contentId_language: {
                        contentId: existingContent.id,
                        language: translation.language,
                      }
                    },
                    update: {
                      title: translation.title,
                      description: translation.description,
                      body: translation.body,
                    },
                    create: {
                      contentId: existingContent.id,
                      ...translation,
                    }
                  })
                }

                // Update tags
                await prisma.contentTag.deleteMany({
                  where: { contentId: existingContent.id }
                })
                if (converted.tagIds.length > 0) {
                  await prisma.contentTag.createMany({
                    data: converted.tagIds.map(tagId => ({
                      contentId: existingContent.id,
                      tagId,
                    }))
                  })
                }

                console.log(`    ✅ Updated: ${converted.content.slug}`)
                result.updatedFiles++
              } else {
                // Create new content
                const newContent = await prisma.content.create({
                  data: {
                    ...converted.content,
                    translations: {
                      create: converted.translations,
                    },
                    tags: converted.tagIds.length > 0 ? {
                      create: converted.tagIds.map(tagId => ({
                        tag: { connect: { id: tagId } }
                      }))
                    } : undefined,
                  }
                })

                console.log(`    ✅ Imported: ${converted.content.slug}`)
                result.importedFiles++
              }

              // Update sync item
              await prisma.kBNebSyncItem.update({
                where: { id: syncItem.id },
                data: {
                  status: 'IMPORTED',
                  contentId: existingContent?.id || undefined,
                }
              })

              result.processedFiles++
            } catch (error) {
              // Update sync item with error
              await prisma.kBNebSyncItem.update({
                where: { id: syncItem.id },
                data: {
                  status: 'ERROR',
                  error: error instanceof Error ? error.message : 'Unknown error',
                }
              })
              throw error
            }
          } catch (error) {
            console.error(`    ❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
            result.errorFiles++
            result.errors.push({
              file: fileId,
              error: error instanceof Error ? error.message : 'Unknown error',
            })
          }
        }
      } catch (error) {
        console.error(`❌ Error processing theme ${theme.theme_id}:`, error)
      }
    }

    // Update sync record
    await prisma.kBNebSync.update({
      where: { id: sync.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        totalFiles: result.totalFiles,
        processedFiles: result.processedFiles,
        importedFiles: result.importedFiles + result.updatedFiles,
        errorFiles: result.errorFiles,
        errorLog: result.errors.length > 0 ? JSON.stringify(result.errors) : null,
      }
    })

    // Print summary
    console.log('\n📊 Sync Summary:')
    console.log(`  Total files: ${result.totalFiles}`)
    console.log(`  Processed: ${result.processedFiles}`)
    console.log(`  Imported: ${result.importedFiles}`)
    console.log(`  Updated: ${result.updatedFiles}`)
    console.log(`  Skipped: ${result.skippedFiles}`)
    console.log(`  Errors: ${result.errorFiles}`)

    if (options.dryRun) {
      console.log('\n⚠️  This was a dry run. No data was actually imported.')
    }

    return result
  } catch (error) {
    console.error('Fatal error during sync:', error)
    throw error
  }
}

// Parse command line arguments
function parseArgs(): SyncOptions {
  const args = process.argv.slice(2)
  const options: SyncOptions = {}

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    
    if (arg === '--format' && args[i + 1]) {
      options.format = args[i + 1]
      i++
    } else if (arg === '--language' && args[i + 1]) {
      options.language = args[i + 1]
      i++
    } else if (arg === '--force-update') {
      options.forceUpdate = true
    } else if (arg === '--dry-run') {
      options.dryRun = true
    } else if (arg === '--limit' && args[i + 1]) {
      options.limit = parseInt(args[i + 1])
      i++
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
KB_NEB Content Sync Script

Usage: npm run kb-neb:sync -- [options]

Options:
  --format <format>      Sync only specific format (e.g., M, T, IG)
  --language <lang>      Sync only specific language (e.g., UA, EN, RU)
  --force-update         Update existing content
  --dry-run              Preview changes without importing
  --limit <number>       Limit number of themes to process
  --help, -h             Show this help message

Examples:
  npm run kb-neb:sync
  npm run kb-neb:sync -- --format=M --language=UA
  npm run kb-neb:sync -- --force-update
  npm run kb-neb:sync -- --dry-run --limit=5
      `)
      process.exit(0)
    }
  }

  return options
}

// Main execution
if (require.main === module) {
  const options = parseArgs()
  
  syncContent(options)
    .then(() => {
      console.log('✅ Sync completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Sync failed:', error)
      process.exit(1)
    })
}

export { syncContent }