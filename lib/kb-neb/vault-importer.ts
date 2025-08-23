import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

export interface VaultContent {
  title: string
  theme_id: string
  format: string
  language: string
  status: string
  content: string
  metadata: {
    created?: string
    modified?: string
    status: string
    type_of_text: string
    lang: string
    knowledge_type?: string
    priority?: string
    is_cornerstone?: boolean
    knowledge_value?: {
      overall_score?: number
      applicability_score?: number
      uniqueness_score?: number
      impact_score?: number
      value_category?: string
    }
    word_count?: number
    tags?: string[]
  }
  file_path: string
  file_stats: {
    size: number
    created: Date
    modified: Date
  }
}

export interface VaultTheme {
  theme_id: string
  title: string
  content_items: VaultContent[]
  is_cornerstone: boolean
  knowledge_type: string
  formats: string[]
  languages: string[]
  total_word_count: number
  best_quality_score: number
  priority: string
}

export class VaultImporter {
  private vaultPath: string

  constructor(vaultPath?: string) {
    this.vaultPath = vaultPath || '/Users/chyngys/scripts/kb_neb/vault_output'
  }

  private parseFileName(fileName: string): {
    title: string
    format: string
    language: string
    status: string
  } | null {
    // Parse filename: "Title ( FORMAT-LANG ) [ status ].md"
    const match = fileName.match(/^(.+?)\s*\(\s*([A-Z]+)-([A-Z]+)\s*\)(?:\s*\[\s*([^[\]]+)\s*\])?\.(md|txt)$/i)
    
    if (!match) {
      return null
    }

    const [, title, format, language, status] = match
    
    return {
      title: title.trim(),
      format: format.toUpperCase(),
      language: language.toUpperCase(),
      status: status ? status.trim() : 'done'
    }
  }

  private generateThemeId(title: string, language: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '') + '_' + language.toLowerCase()
  }

  private async readContentFile(filePath: string): Promise<VaultContent | null> {
    try {
      const fileName = path.basename(filePath)
      const parsedName = this.parseFileName(fileName)
      
      if (!parsedName) {
        console.warn(`Skipping file with invalid name format: ${fileName}`)
        return null
      }

      const fileContent = await fs.readFile(filePath, 'utf-8')
      const stats = await fs.stat(filePath)
      
      // Parse frontmatter and content
      const { data: frontmatter, content } = matter(fileContent)
      
      // Calculate word count
      const wordCount = content.split(/\s+/).filter(word => word.length > 0).length

      const theme_id = frontmatter.theme_id || this.generateThemeId(parsedName.title, parsedName.language)

      return {
        title: parsedName.title,
        theme_id,
        format: parsedName.format,
        language: parsedName.language,
        status: frontmatter.status || parsedName.status,
        content: content.trim(),
        metadata: {
          created: frontmatter.created,
          modified: frontmatter.modified,
          status: frontmatter.status || parsedName.status,
          type_of_text: frontmatter.type_of_text || parsedName.format.toLowerCase(),
          lang: frontmatter.lang || parsedName.language.toLowerCase(),
          knowledge_type: frontmatter.knowledge_type,
          priority: frontmatter.priority,
          is_cornerstone: frontmatter.is_cornerstone || false,
          knowledge_value: frontmatter.knowledge_value,
          word_count: wordCount,
          tags: frontmatter.tags
        },
        file_path: filePath,
        file_stats: {
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        }
      }
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error)
      return null
    }
  }

  async scanVaultDirectory(): Promise<VaultContent[]> {
    const contentItems: VaultContent[] = []
    
    const scanDirectory = async (dirPath: string) => {
      try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true })
        
        for (const entry of entries) {
          const fullPath = path.join(dirPath, entry.name)
          
          if (entry.isDirectory()) {
            await scanDirectory(fullPath)
          } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.txt'))) {
            const content = await this.readContentFile(fullPath)
            if (content) {
              contentItems.push(content)
            }
          }
        }
      } catch (error) {
        console.error(`Error scanning directory ${dirPath}:`, error)
      }
    }

    await scanDirectory(this.vaultPath)
    return contentItems
  }

  async getThemes(): Promise<VaultTheme[]> {
    const contentItems = await this.scanVaultDirectory()
    const themeMap = new Map<string, VaultContent[]>()

    // Group content by theme_id
    contentItems.forEach(item => {
      if (!themeMap.has(item.theme_id)) {
        themeMap.set(item.theme_id, [])
      }
      themeMap.get(item.theme_id)!.push(item)
    })

    // Convert to VaultTheme objects
    const themes: VaultTheme[] = []
    
    themeMap.forEach((items, themeId) => {
      const representativeItem = items[0]
      const formats = [...new Set(items.map(item => item.format))]
      const languages = [...new Set(items.map(item => item.language))]
      const totalWordCount = items.reduce((sum, item) => sum + (item.metadata.word_count || 0), 0)
      const bestQualityScore = Math.max(
        ...items.map(item => item.metadata.knowledge_value?.overall_score || 0)
      )

      themes.push({
        theme_id: themeId,
        title: representativeItem.title,
        content_items: items,
        is_cornerstone: representativeItem.metadata.is_cornerstone || false,
        knowledge_type: representativeItem.metadata.knowledge_type || 'general',
        formats,
        languages,
        total_word_count: totalWordCount,
        best_quality_score: bestQualityScore,
        priority: representativeItem.metadata.priority || 'medium'
      })
    })

    // Sort by quality and cornerstone status
    themes.sort((a, b) => {
      if (a.is_cornerstone && !b.is_cornerstone) return -1
      if (!a.is_cornerstone && b.is_cornerstone) return 1
      return b.best_quality_score - a.best_quality_score
    })

    return themes
  }

  async getContentByTheme(themeId: string, format?: string, language?: string): Promise<VaultContent[]> {
    const allContent = await this.scanVaultDirectory()
    
    return allContent.filter(item => {
      if (item.theme_id !== themeId) return false
      if (format && item.format !== format.toUpperCase()) return false
      if (language && item.language !== language.toUpperCase()) return false
      return true
    })
  }

  async getHighQualityContent(minScore: number = 7.0): Promise<VaultContent[]> {
    const allContent = await this.scanVaultDirectory()
    
    return allContent.filter(item => {
      const score = item.metadata.knowledge_value?.overall_score || 0
      return score >= minScore
    })
  }

  async getCornerstoneContent(): Promise<VaultContent[]> {
    const allContent = await this.scanVaultDirectory()
    
    return allContent.filter(item => item.metadata.is_cornerstone)
  }

  async getContentByFormat(format: string, language: string = 'UA'): Promise<VaultContent[]> {
    const allContent = await this.scanVaultDirectory()
    
    return allContent.filter(item => 
      item.format === format.toUpperCase() && 
      item.language === language.toUpperCase()
    )
  }

  async getVaultStats(): Promise<{
    total_files: number
    total_themes: number
    total_words: number
    formats: Record<string, number>
    languages: Record<string, number>
    quality_distribution: Record<string, number>
    cornerstone_count: number
  }> {
    const allContent = await this.scanVaultDirectory()
    const themes = await this.getThemes()
    
    const formats: Record<string, number> = {}
    const languages: Record<string, number> = {}
    const qualityDistribution: Record<string, number> = {
      excellent: 0,
      high: 0,
      medium: 0,
      low: 0,
      unknown: 0
    }
    
    let totalWords = 0
    let cornerstoneCount = 0

    allContent.forEach(item => {
      // Count formats
      formats[item.format] = (formats[item.format] || 0) + 1
      
      // Count languages
      languages[item.language] = (languages[item.language] || 0) + 1
      
      // Sum word count
      totalWords += item.metadata.word_count || 0
      
      // Count cornerstone content
      if (item.metadata.is_cornerstone) {
        cornerstoneCount++
      }
      
      // Quality distribution
      const category = item.metadata.knowledge_value?.value_category || 'unknown'
      qualityDistribution[category] = (qualityDistribution[category] || 0) + 1
    })

    return {
      total_files: allContent.length,
      total_themes: themes.length,
      total_words: totalWords,
      formats,
      languages,
      quality_distribution: qualityDistribution,
      cornerstone_count: cornerstoneCount
    }
  }
}