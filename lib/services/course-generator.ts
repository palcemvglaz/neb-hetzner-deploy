import { prisma } from '@/lib/db/prisma'
import { VaultImporter, VaultTheme, VaultContent } from '@/lib/kb-neb/vault-importer'

export interface CourseStructure {
  title: string
  description: string
  slug: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  category: string
  price: number
  estimatedDuration: number // minutes
  modules: CourseModule[]
  tags: string[]
  prerequisites: string[]
}

export interface CourseModule {
  title: string
  description: string
  order: number
  lessons: CourseLesson[]
}

export interface CourseLesson {
  title: string
  content: string
  type: 'TEXT' | 'VIDEO' | 'QUIZ' | 'EXERCISE'
  order: number
  duration: number // minutes
  keyPoints: string[]
  resources: string[]
}

export class CourseGenerator {
  private vaultImporter: VaultImporter

  constructor() {
    this.vaultImporter = new VaultImporter()
  }

  private estimateReadingTime(text: string): number {
    const wordsPerMinute = 200
    const wordCount = text.split(/\\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\\s]/g, '')
      .replace(/\\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  private extractKeyPoints(content: string): string[] {
    const points: string[] = []
    
    // Extract bullet points
    const bulletMatches = content.match(/^[*-]\\s+(.+)$/gm)
    if (bulletMatches) {
      points.push(...bulletMatches.map(match => match.replace(/^[*-]\\s+/, '')))
    }
    
    // Extract numbered points
    const numberedMatches = content.match(/^\\d+\\.\\s+(.+)$/gm)
    if (numberedMatches) {
      points.push(...numberedMatches.map(match => match.replace(/^\\d+\\.\\s+/, '')))
    }
    
    // Extract bold text as key points
    const boldMatches = content.match(/\\*\\*([^*]+)\\*\\*/g)
    if (boldMatches) {
      points.push(...boldMatches.map(match => match.replace(/\\*\\*/g, '')))
    }
    
    return points.slice(0, 5) // Limit to 5 key points
  }

  private categorizeCourse(themeId: string, title: string): string {
    const titleLower = title.toLowerCase()
    const themeIdLower = themeId.toLowerCase()
    
    if (titleLower.includes('vision') || titleLower.includes('blocker') || themeIdLower.includes('vision')) {
      return 'Основи безпеки'
    }
    if (titleLower.includes('responsibility') || titleLower.includes('відповідальність')) {
      return 'Психологія їзди'
    }
    if (titleLower.includes('braking') || titleLower.includes('гальмування')) {
      return 'Технічні навички'
    }
    if (titleLower.includes('concentration') || titleLower.includes('концентрація')) {
      return 'Ментальна підготовка'
    }
    if (titleLower.includes('timing') || titleLower.includes('час')) {
      return 'Тактика їзди'
    }
    if (titleLower.includes('wave') || titleLower.includes('хвиля')) {
      return 'Аналіз ризиків'
    }
    
    return 'Загальні знання'
  }

  private determineDifficulty(content: VaultContent[]): 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' {
    const avgQuality = content.reduce((sum, item) => {
      return sum + (item.metadata.knowledge_value?.overall_score || 5)
    }, 0) / content.length

    const hasAdvancedConcepts = content.some(item => 
      item.content.includes('серпантин') || 
      item.content.includes('міжряддя') ||
      item.content.includes('траєкторія')
    )

    if (hasAdvancedConcepts || avgQuality > 8) return 'ADVANCED'
    if (avgQuality > 6) return 'INTERMEDIATE'
    return 'BEGINNER'
  }

  private calculatePrice(difficulty: string, duration: number): number {
    const basePrice = {
      'BEGINNER': 299,
      'INTERMEDIATE': 499,
      'ADVANCED': 799
    }
    
    const durationMultiplier = Math.max(1, duration / 60) // 1 hour = 1x multiplier
    return Math.round(basePrice[difficulty as keyof typeof basePrice] * durationMultiplier)
  }

  async generateCourseFromTheme(theme: VaultTheme): Promise<CourseStructure | null> {
    try {
      // Get all content for this theme
      const themeContent = theme.content_items
      
      if (themeContent.length === 0) {
        console.warn(`No content found for theme: ${theme.theme_id}`)
        return null
      }

      // Prioritize Master and Thesis content
      const masterContent = themeContent.filter(item => item.format === 'M')
      const thesisContent = themeContent.filter(item => item.format === 'T')
      const videoContent = themeContent.filter(item => item.format === 'V')
      
      const mainContent = masterContent.length > 0 ? masterContent[0] : themeContent[0]
      
      if (!mainContent) {
        return null
      }

      // Create course structure
      const modules: CourseModule[] = []
      const totalDuration = themeContent.reduce((sum, item) => 
        sum + this.estimateReadingTime(item.content), 0
      )

      // Module 1: Theory (from Master content)
      if (masterContent.length > 0) {
        const theoryLessons: CourseLesson[] = masterContent.map((content, index) => ({
          title: `${content.title} - Теорія`,
          content: content.content,
          type: 'TEXT' as const,
          order: index + 1,
          duration: this.estimateReadingTime(content.content),
          keyPoints: this.extractKeyPoints(content.content),
          resources: []
        }))

        modules.push({
          title: 'Теоретична основа',
          description: 'Основні принципи та концепції',
          order: 1,
          lessons: theoryLessons
        })
      }

      // Module 2: Key Points (from Thesis content)
      if (thesisContent.length > 0) {
        const thesisLessons: CourseLesson[] = thesisContent.map((content, index) => ({
          title: `${content.title} - Ключові моменти`,
          content: content.content,
          type: 'TEXT' as const,
          order: index + 1,
          duration: this.estimateReadingTime(content.content),
          keyPoints: this.extractKeyPoints(content.content),
          resources: []
        }))

        modules.push({
          title: 'Ключові принципи',
          description: 'Структуровані тези та чек-листи',
          order: 2,
          lessons: thesisLessons
        })
      }

      // Module 3: Video Content (if available)
      if (videoContent.length > 0) {
        const videoLessons: CourseLesson[] = videoContent.map((content, index) => ({
          title: `${content.title} - Відео`,
          content: content.content,
          type: 'VIDEO' as const,
          order: index + 1,
          duration: this.estimateReadingTime(content.content) * 2, // Video takes longer
          keyPoints: this.extractKeyPoints(content.content),
          resources: []
        }))

        modules.push({
          title: 'Практичні приклади',
          description: 'Відео-демонстрації та сценарії',
          order: 3,
          lessons: videoLessons
        })
      }

      // Generate course metadata
      const difficulty = this.determineDifficulty(themeContent)
      const category = this.categorizeCourse(theme.theme_id, theme.title)
      const price = this.calculatePrice(difficulty, totalDuration)
      
      const courseStructure: CourseStructure = {
        title: theme.title,
        description: this.generateCourseDescription(mainContent, theme),
        slug: this.generateSlug(theme.title),
        difficulty,
        category,
        price,
        estimatedDuration: totalDuration,
        modules,
        tags: this.generateTags(themeContent),
        prerequisites: this.generatePrerequisites(theme, difficulty)
      }

      return courseStructure
    } catch (error) {
      console.error(`Error generating course for theme ${theme.theme_id}:`, error)
      return null
    }
  }

  private generateCourseDescription(mainContent: VaultContent, theme: VaultTheme): string {
    const firstParagraph = mainContent.content.split('\\n\\n')[0] || mainContent.content.substring(0, 200)
    
    return `${firstParagraph}...\\n\\nЦей курс базується на перевірених принципах безпечної їзди з KB_NEB системи знань. Ви вивчите практичні навички та психологічні аспекти, які допоможуть уникнути аварійних ситуацій на дорозі.`
  }

  private generateTags(content: VaultContent[]): string[] {
    const tags = new Set<string>()
    
    content.forEach(item => {
      const contentLower = item.content.toLowerCase()
      
      if (contentLower.includes('новачок') || contentLower.includes('початківець')) tags.add('новачки')
      if (contentLower.includes('досвід') || contentLower.includes('експерт')) tags.add('досвідчені')
      if (contentLower.includes('безпека')) tags.add('безпека')
      if (contentLower.includes('аварія') || contentLower.includes('ДТП')) tags.add('профілактика ДТП')
      if (contentLower.includes('місто')) tags.add('міська їзда')
      if (contentLower.includes('траса') || contentLower.includes('швидкість')) tags.add('швидкісна їзда')
      if (item.metadata.is_cornerstone) tags.add('cornerstone')
      if (item.metadata.knowledge_value?.value_category === 'excellent') tags.add('висока якість')
      
      // Add format-based tags
      if (item.format === 'M') tags.add('детальне вивчення')
      if (item.format === 'T') tags.add('швидке навчання')
      if (item.format === 'V') tags.add('відео-курс')
    })
    
    return Array.from(tags).slice(0, 8)
  }

  private generatePrerequisites(theme: VaultTheme, difficulty: string): string[] {
    const prerequisites: string[] = []
    
    if (difficulty === 'INTERMEDIATE') {
      prerequisites.push('Базові навички керування мотоциклом')
      prerequisites.push('Досвід їзди від 6 місяців')
    }
    
    if (difficulty === 'ADVANCED') {
      prerequisites.push('Впевнене володіння мотоциклом')
      prerequisites.push('Досвід міської та заміської їзди')
      prerequisites.push('Знання основ безпечної їзди')
    }
    
    if (theme.title.toLowerCase().includes('серпантин') || theme.title.toLowerCase().includes('поворот')) {
      prerequisites.push('Курс "Основи гальмування"')
      prerequisites.push('Курс "Принципи позиціонування"')
    }
    
    return prerequisites
  }

  async generateAllCourses(): Promise<CourseStructure[]> {
    const themes = await this.vaultImporter.getThemes()
    const courses: CourseStructure[] = []
    
    // Focus on cornerstone content first
    const cornerstoneThemes = themes.filter(theme => theme.is_cornerstone)
    const highQualityThemes = themes.filter(theme => theme.best_quality_score >= 7.0)
    
    const priorityThemes = [
      ...cornerstoneThemes,
      ...highQualityThemes.filter(theme => !theme.is_cornerstone)
    ].slice(0, 20) // Limit to 20 courses for initial launch
    
    for (const theme of priorityThemes) {
      const course = await this.generateCourseFromTheme(theme)
      if (course) {
        courses.push(course)
      }
    }
    
    return courses
  }

  async saveCourseToDatabase(courseStructure: CourseStructure): Promise<string | null> {
    try {
      const course = await prisma.course.create({
        data: {
          title: courseStructure.title,
          description: courseStructure.description,
          slug: courseStructure.slug,
          difficulty: courseStructure.difficulty,
          category: courseStructure.category,
          price: courseStructure.price,
          estimatedDuration: courseStructure.estimatedDuration,
          tags: courseStructure.tags,
          prerequisites: courseStructure.prerequisites,
          status: 'PUBLISHED',
          modules: {
            create: courseStructure.modules.map(module => ({
              title: module.title,
              description: module.description,
              order: module.order,
              lessons: {
                create: module.lessons.map(lesson => ({
                  title: lesson.title,
                  content: lesson.content,
                  type: lesson.type,
                  order: lesson.order,
                  duration: lesson.duration,
                  keyPoints: lesson.keyPoints,
                  resources: lesson.resources
                }))
              }
            }))
          }
        },
        include: {
          modules: {
            include: {
              lessons: true
            }
          }
        }
      })
      
      return course.id
    } catch (error) {
      console.error('Error saving course to database:', error)
      return null
    }
  }
}