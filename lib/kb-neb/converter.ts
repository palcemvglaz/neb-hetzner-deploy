import { Prisma } from '@prisma/client'

interface KBNebContent {
  theme_id: string
  format: string
  format_code: string
  lang: string
  title: string
  content: string
  metadata: {
    status: string
    word_count: number
    readiness: number
    author?: string
    tags?: string[]
    requires_update?: boolean
    last_review?: string
    submitter?: string
    source?: string
    quality_scores?: {
      practical_utility?: number
      depth_of_insight?: number
      structured_clarity?: number
      analytical_rigor?: number
      knowledge_density?: number
    }
  }
}

interface KBNebTheme {
  theme_id: string
  title: {
    ua: string
    en?: string
    ru?: string
  }
  priority: string
  is_cornerstone: boolean
  knowledge_type: string
  related_themes: string[]
  metadata?: {
    tags?: string[]
  }
}

// Map KB_NEB format codes to Nebachiv content types
const FORMAT_TO_CONTENT_TYPE: Record<string, string> = {
  'M': 'ARTICLE',      // Master text → Article
  'T': 'GUIDE',        // Theses → Guide
  'IG': 'ARTICLE',     // Instagram → Article (short)
  'TW': 'ARTICLE',     // Twitter → Article (micro)
  'W_ART': 'ARTICLE',  // Web Article → Article
  'V_LONG': 'VIDEO',   // Long Video → Video
  'FB': 'ARTICLE',     // Facebook → Article
  'LI': 'ARTICLE',     // LinkedIn → Article
}

// Map KB_NEB languages to Nebachiv languages
const LANGUAGE_MAP: Record<string, string> = {
  'ua': 'UA',
  'en': 'EN',
  'ru': 'RU',
}

// Determine difficulty based on knowledge type and format
function getDifficulty(knowledgeType: string, format: string): string {
  if (knowledgeType === 'cornerstone' || format === 'M') {
    return 'ADVANCED'
  } else if (knowledgeType === 'high_value') {
    return 'INTERMEDIATE'
  }
  return 'BEGINNER'
}

// Calculate average quality score
function getAverageQualityScore(scores?: Record<string, number>): number {
  if (!scores) return 0
  
  const values = Object.values(scores).filter(v => typeof v === 'number')
  if (values.length === 0) return 0
  
  return values.reduce((sum, val) => sum + val, 0) / values.length
}

// Determine if content should be premium based on quality scores
function shouldBePremium(
  content: KBNebContent,
  theme: KBNebTheme
): boolean {
  // Cornerstone content is always premium
  if (theme.is_cornerstone) return true
  
  // Master texts are premium
  if (content.format_code === 'M') return true
  
  // High quality content (average score > 8) is premium
  const avgScore = getAverageQualityScore(content.metadata.quality_scores)
  if (avgScore > 8) return true
  
  // High priority content is premium
  if (theme.priority === 'High') return true
  
  return false
}

// Generate unique KB_NEB ID
export function generateKbNebId(themeId: string, format: string, lang: string): string {
  return `${themeId}_${format}_${lang}`.toLowerCase()
}

// Convert KB_NEB content to Nebachiv content format
export function convertToContent(
  kbContent: KBNebContent,
  theme: KBNebTheme,
  existingTags: Array<{ id: string; slug: string; nameUa: string }>
): {
  content: Prisma.ContentCreateInput
  translations: Array<{
    language: string
    title: string
    description: string
    body: string
  }>
  tagIds: string[]
} {
  const contentType = FORMAT_TO_CONTENT_TYPE[kbContent.format_code] || 'ARTICLE'
  const language = LANGUAGE_MAP[kbContent.lang] || 'UA'
  const difficulty = getDifficulty(theme.knowledge_type, kbContent.format_code)
  const isPremium = shouldBePremium(kbContent, theme)
  
  // Extract description from content (first paragraph)
  const firstParagraph = kbContent.content.split('\n\n')[0]
  const description = firstParagraph.replace(/^#.*\n/, '').trim().substring(0, 200)
  
  // Map tags
  const tagSlugs = [
    ...(kbContent.metadata.tags || []),
    ...(theme.metadata?.tags || [])
  ].map(tag => tag.toLowerCase().replace(/\s+/g, '-'))
  
  const tagIds = existingTags
    .filter(tag => tagSlugs.includes(tag.slug))
    .map(tag => tag.id)
  
  // Prepare metadata
  const kbNebMetadata = {
    theme_id: theme.theme_id,
    format: kbContent.format,
    format_code: kbContent.format_code,
    language: kbContent.lang,
    quality_scores: kbContent.metadata.quality_scores,
    word_count: kbContent.metadata.word_count,
    readiness: kbContent.metadata.readiness,
    status: kbContent.metadata.status,
    priority: theme.priority,
    is_cornerstone: theme.is_cornerstone,
    knowledge_type: theme.knowledge_type,
    related_themes: theme.related_themes,
  }
  
  // Create slug from theme_id and format
  const slug = `${theme.theme_id}-${kbContent.format_code}`.toLowerCase()
  
  return {
    content: {
      kbNebId: generateKbNebId(theme.theme_id, kbContent.format_code, kbContent.lang),
      slug,
      type: contentType,
      format: kbContent.format_code,
      status: kbContent.metadata.status === 'done' ? 'PUBLISHED' : 'DRAFT',
      isPublished: kbContent.metadata.status === 'done',
      isPremium,
      difficulty,
      estimatedTime: Math.ceil(kbContent.metadata.word_count / 200), // ~200 words per minute
      order: theme.priority === 'High' ? 1 : theme.priority === 'Medium' ? 2 : 3,
      kbNebMetadata: JSON.stringify(kbNebMetadata),
      qualityScores: JSON.stringify(kbContent.metadata.quality_scores || {}),
      publishedAt: kbContent.metadata.status === 'done' ? new Date() : null,
    },
    translations: [{
      language,
      title: kbContent.title,
      description,
      body: kbContent.content,
    }],
    tagIds,
  }
}

// Map format name to code (for flexibility)
export function normalizeFormat(format: string): string {
  const formatMap: Record<string, string> = {
    'master': 'M',
    'thesises': 'T',
    'instagram': 'IG',
    'twitter': 'TW',
    'web_article': 'W_ART',
    'video_long': 'V_LONG',
    'facebook': 'FB',
    'linkedin': 'LI',
  }
  
  return formatMap[format.toLowerCase()] || format.toUpperCase()
}

// Get content type from format
export function getContentType(formatCode: string): string {
  return FORMAT_TO_CONTENT_TYPE[formatCode] || 'ARTICLE'
}

// Check if format is supported
export function isSupportedFormat(formatCode: string): boolean {
  return formatCode in FORMAT_TO_CONTENT_TYPE
}