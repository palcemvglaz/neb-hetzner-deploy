import { readFile, readdir } from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { Course, Section, Lesson, Prisma } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { slugify } from '@/lib/utils';

// KB_NEB vault path
const KB_NEB_VAULT_PATH = '/Users/chyngys/scripts/kb_neb/vault_output';

// Content type mappings
const CONTENT_TYPE_MAP = {
  'M-UA': 'MASTER_UA',
  'M-EN': 'MASTER_EN',
  'T-UA': 'THESIS_UA',
  'T-EN': 'THESIS_EN',
  'V-UA': 'VIDEO_UA',
  'V-EN': 'VIDEO_EN',
  'W-UA': 'WEB_UA',
  'W-EN': 'WEB_EN',
} as const;

interface KBNebContent {
  title: string;
  content: string;
  metadata: {
    knowledge_value?: number;
    is_cornerstone?: boolean;
    quality_evaluation?: number;
    theme_id?: string;
    format?: string;
    language?: string;
    readiness?: string;
    priority?: number;
  };
  filePath: string;
}

interface CourseStructure {
  title: string;
  description: string;
  modules: {
    title: string;
    description: string;
    items: {
      title: string;
      contentPath: string;
      order: number;
    }[];
  }[];
}

export class CourseService {
  /**
   * Read and parse KB_NEB content file
   */
  private async readKBNebFile(filePath: string): Promise<KBNebContent | null> {
    try {
      const fullPath = path.join(KB_NEB_VAULT_PATH, filePath);
      const fileContent = await readFile(fullPath, 'utf-8');
      
      // Try to parse frontmatter
      const { data: metadata, content } = matter(fileContent);
      
      // Extract title from first # heading or filename
      let title = metadata.title || '';
      if (!title) {
        const titleMatch = content.match(/^#\s+(.+)$/m);
        title = titleMatch ? titleMatch[1] : path.basename(filePath, '.md');
      }
      
      return {
        title,
        content,
        metadata,
        filePath
      };
    } catch (error) {
      console.error(`Error reading KB_NEB file ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Get all content files from a directory
   */
  private async getContentFiles(dirPath: string): Promise<string[]> {
    const files: string[] = [];
    
    try {
      const fullDirPath = path.join(KB_NEB_VAULT_PATH, dirPath);
      const entries = await readdir(fullDirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const entryPath = path.join(dirPath, entry.name);
        
        if (entry.isDirectory()) {
          // Recursively get files from subdirectories
          const subFiles = await this.getContentFiles(entryPath);
          files.push(...subFiles);
        } else if (entry.name.endsWith('.md')) {
          files.push(entryPath);
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${dirPath}:`, error);
    }
    
    return files;
  }

  /**
   * Get course structure based on course slug
   */
  private getCourseStructure(courseSlug: string): CourseStructure {
    switch(courseSlug) {
      case 'motorcycle-safety-concepts':
        return this.getSafetyConceptsCourse();
      case 'critical-riding-skills':
        return this.getCriticalSkillsCourse();
      case 'beginner-rider-guide':
        return this.getBeginnerGuideCourse();
      default:
        return this.getSafetyConceptsCourse(); // fallback
    }
  }

  /**
   * Course 1: "8 концептів безпеки мотоцикліста"
   */
  private getSafetyConceptsCourse(): CourseStructure {
    return {
      title: "8 концептів безпеки мотоцикліста",
      description: "Повний курс з 8 життєво важливих концептів безпеки, заснованих на аналізі тисяч реальних аварій.",
      modules: [
        {
          title: "🎯 Module 1: 8 концептів безпеки",
          description: "💀 КРИТИЧНО ВАЖЛИВО! Ці концепти - різниця між життям і смертю. 87% аварій можна уникнути, знаючи ці принципи. Кожен концепт заснований на аналізі реальних ДТП.",
          items: [
            {
              title: "Vision/Blocker - Максимізація видимості",
              contentPath: "Nebachiv/1 All Nebachiv Texts/02  6 Concepts/01 Vision/Vision concept  Blocker  ( M-UA ).md",
              order: 1
            },
            {
              title: "Responsibility - Персональна відповідальність",
              contentPath: "Nebachiv/1 All Nebachiv Texts/02  6 Concepts/8 концептів мотоцикліста ( M-EN ).md",
              order: 2
            },
            {
              title: "Concentration - Концентрація під час руху",
              contentPath: "Nebachiv/1 All Nebachiv Texts/02  6 Concepts/05 wavelike danger/Wave nature of danger ( M-UA ).md",
              order: 3
            },
            {
              title: "Space - Управління простором навколо мотоцикла",
              contentPath: "Nebachiv/1 All Nebachiv Texts/02  6 Concepts/04 Space/Space concept ( M-UA ).md",
              order: 4
            },
            {
              title: "Speed - Розумне використання швидкості",
              contentPath: "Nebachiv/1 All Nebachiv Texts/02  6 Concepts/03 Speed/Speed concept ( M-UA ).md",
              order: 5
            },
            {
              title: "Stability - Стабільність та баланс",
              contentPath: "Nebachiv/1 All Nebachiv Texts/02  6 Concepts/02 Stability/Stability concept ( M-UA ).md",
              order: 6
            },
            {
              title: "Strategy - Стратегічне мислення на дорозі",
              contentPath: "Nebachiv/1 All Nebachiv Texts/02  6 Concepts/06 Strategy/Strategy concept ( M-UA ).md",
              order: 7
            },
            {
              title: "Survival - Інстинкт виживання",
              contentPath: "Nebachiv/1 All Nebachiv Texts/02  6 Concepts/07 Survival/Survival concept ( M-UA ).md",
              order: 8
            }
          ]
        }
      ]
    };
  }

  /**
   * Course 2: "Критичні навички мотоцикліста"
   */
  private getCriticalSkillsCourse(): CourseStructure {
    return {
      title: "Критичні навички мотоцикліста",
      description: "Технічні навички виживання, які повинен знати кожен мотоцикліст. Ці навички врятували тисячі життів.",
      modules: [
        {
          title: "⚡ Module 1: Екстрене гальмування",
          description: "🛑 НАВИЧКА #1 для виживання! 90% аварій можна уникнути правильним гальмуванням. Вивчіть техніки, які використовують професійні гонщики.",
          items: [
            {
              title: "Основи екстреного гальмування",
              contentPath: "Nebachiv/1 All Nebachiv Texts/09 Skillz/Критичні Технічні скілли  ( M-UA ).md",
              order: 1
            },
            {
              title: "Гальмування на мокрій дорозі",
              contentPath: "Nebachiv/1 All Nebachiv Texts/05 City Scenarios/Rain & wet ( M-UA ).md",
              order: 2
            },
            {
              title: "ABS vs звичайні гальма",
              contentPath: "Nebachiv/1 All Nebachiv Texts/09 Skillz/ABS vs Non-ABS techniques ( T-UA ).md",
              order: 3
            }
          ]
        },
        {
          title: "🎯 Module 2: Контроль та баланс",
          description: "🤸‍♂️ СЕКРЕТИ рівноваги та контролю мотоцикла в критичних ситуаціях. Ці техніки відокремлюють професіоналів від аматорів.",
          items: [
            {
              title: "Робота рук та ніг",
              contentPath: "Nebachiv/1 All Nebachiv Texts/09 Skillz/Hands & legz ( T-UA ) [ todo ].md",
              order: 1
            },
            {
              title: "Контроль на низьких швидкостях",
              contentPath: "Nebachiv/1 All Nebachiv Texts/09 Skillz/Low speed maneuvers ( T-UA ).md",
              order: 2
            },
            {
              title: "Стабілізація в заносі",
              contentPath: "Nebachiv/1 All Nebachiv Texts/09 Skillz/Slide control ( T-UA ).md",
              order: 3
            }
          ]
        },
        {
          title: "🏃‍♂️ Module 3: Уникнення зіткнень",
          description: "💨 ОСТАННІЙ шанс врятуватися! Коли гальмування не допомагає - потрібно уникати. Техніки швидкого маневрування.",
          items: [
            {
              title: "Швидка зміна напрямку",
              contentPath: "Nebachiv/1 All Nebachiv Texts/09 Skillz/Quick direction change ( T-UA ).md",
              order: 1
            },
            {
              title: "Контр-рульове керування",
              contentPath: "Nebachiv/1 All Nebachiv Texts/09 Skillz/Counter-steering mastery ( T-UA ).md",
              order: 2
            },
            {
              title: "Комбіновані маневри",
              contentPath: "Nebachiv/1 All Nebachiv Texts/09 Skillz/Combined maneuvers ( T-UA ).md",
              order: 3
            }
          ]
        }
      ]
    };
  }

  /**
   * Course 3: "Гід для початківця мотоцикліста"
   */
  private getBeginnerGuideCourse(): CourseStructure {
    return {
      title: "Повний гід для початківця мотоцикліста",
      description: "Все, що потрібно знати новачку: від вибору мотоцикла до перших безпечних поїздок. Уникніть типових помилок!",
      modules: [
        {
          title: "🏍️ Module 1: Вибір першого мотоцикла",
          description: "💰 НЕ витрачайте гроші даремно! Дізнайтеся, який мотоцикл НАСПРАВДІ потрібен початківцю. Помилки тут коштують тисячі доларів.",
          items: [
            {
              title: "Типи мотоциклів для новачків",
              contentPath: "Nebachiv/1 All Nebachiv Texts/04 Novice.  First Mot  First Equip/02 First Mot/Вибір першого мотоцикла ( M-UA ).md",
              order: 1
            },
            {
              title: "Потужність vs досвід",
              contentPath: "Nebachiv/1 All Nebachiv Texts/04 Novice.  First Mot  First Equip/02 First Mot/Power vs Experience ( T-UA ).md",
              order: 2
            },
            {
              title: "Б/у vs новий мотоцикл",
              contentPath: "Nebachiv/1 All Nebachiv Texts/04 Novice.  First Mot  First Equip/02 First Mot/Used vs New bike ( T-UA ).md",
              order: 3
            }
          ]
        },
        {
          title: "🛡️ Module 2: Екіпірування та захист",
          description: "⚰️ Ваше життя ЗАЛЕЖИТЬ від екіпірування! Дізнайтеся, що насправді захищає, а що - маркетинговий обман.",
          items: [
            {
              title: "Філософія вибору екіпірування",
              contentPath: "Nebachiv/1 All Nebachiv Texts/04 Novice.  First Mot  First Equip/01 Equip/Equip v2  ( M-UA ) [ doing ].md",
              order: 1
            },
            {
              title: "Шолом: вибір та розміри",
              contentPath: "Nebachiv/1 All Nebachiv Texts/04 Novice.  First Mot  First Equip/01 Equip/Helmet selection ( T-UA ).md",
              order: 2
            },
            {
              title: "Захисне взуття та рукавички",
              contentPath: "Nebachiv/1 All Nebachiv Texts/04 Novice.  First Mot  First Equip/01 Equip/Protective gear ( T-UA ).md",
              order: 3
            },
            {
              title: "Куртка та штани",
              contentPath: "Nebachiv/1 All Nebachiv Texts/04 Novice.  First Mot  First Equip/01 Equip/Jacket and pants ( T-UA ).md",
              order: 4
            }
          ]
        },
        {
          title: "🚀 Module 3: Перші кроки на дорозі",
          description: "🎯 Від мотошколи до реального трафіку. Як НЕ стати статистикою в перші місяці їзди. Критично важливо!",
          items: [
            {
              title: "Перші навички мотоцикліста",
              contentPath: "Nebachiv/1 All Nebachiv Texts/04 Novice.  First Mot  First Equip/Перші скілли ( M-UA ) [ doing ].md",
              order: 1
            },
            {
              title: "Типові помилки новачків",
              contentPath: "Nebachiv/1 All Nebachiv Texts/04 Novice.  First Mot  First Equip/Common beginner mistakes ( T-UA ).md",
              order: 2
            },
            {
              title: "Планування перших поїздок",
              contentPath: "Nebachiv/1 All Nebachiv Texts/04 Novice.  First Mot  First Equip/First rides planning ( T-UA ).md",
              order: 3
            },
            {
              title: "Психологія новачка",
              contentPath: "Nebachiv/1 All Nebachiv Texts/04 Novice.  First Mot  First Equip/Beginner psychology ( T-UA ).md",
              order: 4
            }
          ]
        }
      ]
    };
  }

  /**
   * Generate or update a course from KB_NEB content
   */
  async generateCourse(courseSlug: string = 'motorcycle-safety-concepts'): Promise<Course> {
    const courseStructure = this.getCourseStructure(courseSlug);
    
    // Check if course exists
    let course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      include: {
        sections: {
          include: {
            items: true
          }
        }
      }
    });

    // Create or update course
    if (!course) {
      course = await prisma.course.create({
        data: {
          slug: courseSlug,
          difficulty: 'BEGINNER',
          isPremium: false,
          isPublished: true,
          price: 0, // Free for test course
        },
        include: {
          sections: {
            include: {
              items: true
            }
          }
        }
      });
    }

    // Process each module
    for (let moduleIndex = 0; moduleIndex < courseStructure.modules.length; moduleIndex++) {
      const module = courseStructure.modules[moduleIndex];
      
      // Create or update section
      let section = course.sections.find(s => s.order === moduleIndex + 1);
      
      if (!section) {
        section = await prisma.courseSection.create({
          data: {
            courseId: course.id,
            title: module.title,
            description: module.description,
            order: moduleIndex + 1
          },
          include: {
            items: true
          }
        });
      }

      // Process each lesson
      for (const lessonData of module.items) {
        // Read content from KB_NEB
        const content = await this.readKBNebFile(lessonData.contentPath);
        
        if (!content) {
          console.warn(`Could not read content for lesson: ${lessonData.title}`);
          continue;
        }

        // Check if lesson exists
        let lesson = section.items.find(l => l.order === lessonData.order);
        
        if (!lesson) {
          // First create Content
          const contentRecord = await prisma.content.create({
            data: {
              slug: slugify(`${lessonData.title}-${Date.now()}-${lessonData.order}`),
              type: 'LESSON',
              format: content.metadata.format || 'markdown',
              status: 'PUBLISHED',
              isPublished: true,
              isPremium: false,
              difficulty: 'BEGINNER',
              estimatedTime: 15,
              kbNebMetadata: JSON.stringify({
                sourceFile: lessonData.contentPath,
                title: lessonData.title,
                content: content.content,
                originalMetadata: content.metadata
              })
            }
          });
          
          // Then create CourseSectionItem linking to Content
          await prisma.courseSectionItem.create({
            data: {
              sectionId: section.id,
              contentId: contentRecord.id,
              order: lessonData.order,
              isRequired: true
            }
          });
        } else {
          // Update existing content
          await prisma.content.update({
            where: { id: lesson.contentId },
            data: {
              format: content.metadata.format || 'markdown',
              kbNebMetadata: JSON.stringify({
                sourceFile: lessonData.contentPath,
                title: lessonData.title,
                content: content.content,
                originalMetadata: content.metadata,
                lastUpdated: new Date().toISOString()
              })
            }
          });
        }
      }
    }

    // Return updated course
    return await prisma.course.findUnique({
      where: { id: course.id },
      include: {
        sections: {
          include: {
            items: {
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    }) as Course;
  }

  /**
   * Get course with full content
   */
  async getCourseWithContent(courseSlug: string) {
    return await prisma.course.findUnique({
      where: { slug: courseSlug },
      include: {
        sections: {
          include: {
            items: {
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });
  }

  /**
   * Scan KB_NEB for available content
   */
  async scanAvailableContent() {
    const contentMap = new Map<string, KBNebContent[]>();
    
    // Key directories to scan
    const directories = [
      'Nebachiv/1 All Nebachiv Texts/02 6 Concepts',
      'Nebachiv/1 All Nebachiv Texts/04 Novice',
      'Nebachiv/1 All Nebachiv Texts/05 City Scenarios',
      'Nebachiv/1 All Nebachiv Texts/09 Skillz'
    ];

    for (const dir of directories) {
      const files = await this.getContentFiles(dir);
      const contents: KBNebContent[] = [];
      
      for (const file of files) {
        const content = await this.readKBNebFile(file);
        if (content) {
          contents.push(content);
        }
      }
      
      contentMap.set(dir, contents);
    }

    return contentMap;
  }

  /**
   * Generate quiz questions from lesson content
   */
  async generateQuizQuestions(lessonId: string) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId }
    });

    if (!lesson) {
      throw new Error('Lesson not found');
    }

    // This is a placeholder for quiz generation logic
    // In a real implementation, this could use AI or predefined question templates
    const questions = [
      {
        question: `Що є основним принципом концепції "${lesson.title}"?`,
        type: 'SINGLE_CHOICE',
        options: [
          'Варіант А',
          'Варіант Б', 
          'Варіант В',
          'Варіант Г'
        ],
        correctAnswer: 0,
        explanation: 'Пояснення правильної відповіді...'
      }
    ];

    return questions;
  }
}

// Export singleton instance
export const courseService = new CourseService();