interface Theme {
  theme_id: string
  title: {
    ua: string
    en?: string
    ru?: string
  }
  priority: string
  is_cornerstone: boolean
  knowledge_type: string
  has_mastertext: boolean
  has_thesises: boolean
  formats_count: number
  languages: string[]
  related_themes: string[]
  created_at: string
  updated_at: string
}

interface Format {
  format_code: string
  format_name: string
  lang: string
  status: string
  word_count: number
  readiness: number
  file_path?: string
  updated_at: string
}

interface ThemeDetail extends Theme {
  formats: Format[]
  metadata: {
    priority: string
    is_cornerstone: boolean
    knowledge_type: string
    theme_status: string
    related_themes: string[]
    tags?: string[]
  }
  stats: {
    total_formats: number
    completed_formats: number
    total_words: number
    languages: string[]
  }
}

interface Content {
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
  }
  file_info: {
    path: string
    size_bytes: number
    created_at: string
    updated_at: string
  }
}

interface BatchContentRequest {
  theme_id: string
  formats: string[]
  languages: string[]
}

interface SyncChange {
  change_id: string
  theme_id: string
  format?: string
  lang?: string
  change_type: 'created' | 'updated' | 'deleted'
  timestamp: string
  details?: {
    fields_changed?: string[]
    old_status?: string
    new_status?: string
  }
}

export class KBNebClient {
  private apiUrl: string
  private apiKey: string

  constructor(apiUrl?: string, apiKey?: string) {
    this.apiUrl = apiUrl || process.env.KB_NEB_API_URL || 'http://localhost:8000/api/v1'
    this.apiKey = apiKey || process.env.KB_NEB_API_KEY || ''
    
    if (!this.apiKey) {
      throw new Error('KB_NEB API key is required')
    }
  }

  private async fetch<T>(path: string, options?: RequestInit): Promise<T> {
    const url = `${this.apiUrl}${path}`
    const response = await fetch(url, {
      ...options,
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(`KB_NEB API error: ${error.error?.message || response.statusText}`)
    }

    return response.json()
  }

  async getThemes(params?: {
    page?: number
    limit?: number
    sort_by?: string
    sort_order?: 'asc' | 'desc'
    filter?: {
      priority?: string
      is_cornerstone?: boolean
      has_mastertext?: boolean
      languages?: string
      status?: string
    }
    search?: string
  }): Promise<{ data: { themes: Theme[] }, meta: any }> {
    const queryParams = new URLSearchParams()
    
    if (params?.page) queryParams.set('page', params.page.toString())
    if (params?.limit) queryParams.set('limit', params.limit.toString())
    if (params?.sort_by) queryParams.set('sort_by', params.sort_by)
    if (params?.sort_order) queryParams.set('sort_order', params.sort_order)
    if (params?.search) queryParams.set('search', params.search)
    
    if (params?.filter) {
      Object.entries(params.filter).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.set(`filter[${key}]`, value.toString())
        }
      })
    }
    
    return this.fetch(`/themes?${queryParams}`)
  }

  async getTheme(themeId: string): Promise<{ data: ThemeDetail }> {
    return this.fetch(`/themes/${themeId}`)
  }

  async getContent(
    themeId: string, 
    format: string, 
    lang: string = 'ua'
  ): Promise<{ data: Content }> {
    const queryParams = new URLSearchParams({ lang })
    return this.fetch(`/content/${themeId}/${format}?${queryParams}`)
  }

  async batchContent(requests: BatchContentRequest[], includeMetadata: boolean = true): Promise<{ 
    data: { 
      content: Record<string, Record<string, Record<string, any>>> 
    },
    meta: any 
  }> {
    return this.fetch('/content/batch', {
      method: 'POST',
      body: JSON.stringify({
        requests,
        include_metadata: includeMetadata
      })
    })
  }

  async search(params: {
    q: string
    lang?: string
    formats?: string
    themes?: string
    limit?: number
  }): Promise<{ data: { results: any[] }, meta: any }> {
    const queryParams = new URLSearchParams()
    queryParams.set('q', params.q)
    
    if (params.lang) queryParams.set('lang', params.lang)
    if (params.formats) queryParams.set('formats', params.formats)
    if (params.themes) queryParams.set('themes', params.themes)
    if (params.limit) queryParams.set('limit', params.limit.toString())
    
    return this.fetch(`/search?${queryParams}`)
  }

  async getSyncChanges(params: {
    since: string
    types?: string
    limit?: number
  }): Promise<{ data: { changes: SyncChange[] }, meta: any }> {
    const queryParams = new URLSearchParams()
    queryParams.set('since', params.since)
    
    if (params.types) queryParams.set('types', params.types)
    if (params.limit) queryParams.set('limit', params.limit.toString())
    
    return this.fetch(`/sync/changes?${queryParams}`)
  }

  async getSyncStatus(): Promise<{ data: any }> {
    return this.fetch('/sync/status')
  }

  async getStats(): Promise<{ data: any }> {
    return this.fetch('/stats')
  }

  async getFormats(): Promise<{ data: { formats: any[] } }> {
    return this.fetch('/formats')
  }
}