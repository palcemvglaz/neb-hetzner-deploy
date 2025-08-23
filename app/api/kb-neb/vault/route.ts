import { NextRequest, NextResponse } from 'next/server'
import { VaultImporter } from '@/lib/kb-neb/vault-importer'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'stats'
    
    const importer = new VaultImporter()

    switch (action) {
      case 'stats':
        const stats = await importer.getVaultStats()
        return NextResponse.json({
          success: true,
          data: stats
        })

      case 'themes':
        const themes = await importer.getThemes()
        return NextResponse.json({
          success: true,
          data: {
            themes: themes.slice(0, 20), // Limit for demo
            total: themes.length
          }
        })

      case 'cornerstone':
        const cornerstoneContent = await importer.getCornerstoneContent()
        return NextResponse.json({
          success: true,
          data: {
            content: cornerstoneContent.slice(0, 10),
            total: cornerstoneContent.length
          }
        })

      case 'high-quality':
        const minScore = parseFloat(searchParams.get('min_score') || '7.0')
        const highQualityContent = await importer.getHighQualityContent(minScore)
        return NextResponse.json({
          success: true,
          data: {
            content: highQualityContent.slice(0, 10),
            total: highQualityContent.length,
            min_score: minScore
          }
        })

      case 'content':
        const themeId = searchParams.get('theme_id')
        const format = searchParams.get('format')
        const language = searchParams.get('language')
        
        if (!themeId) {
          return NextResponse.json({
            success: false,
            error: 'theme_id is required'
          }, { status: 400 })
        }

        const content = await importer.getContentByTheme(themeId, format || undefined, language || undefined)
        return NextResponse.json({
          success: true,
          data: {
            theme_id: themeId,
            content,
            total: content.length
          }
        })

      case 'scan':
        const allContent = await importer.scanVaultDirectory()
        return NextResponse.json({
          success: true,
          data: {
            content: allContent.slice(0, 5), // Show first 5 for demo
            total: allContent.length,
            message: 'Showing first 5 items. Use other endpoints for filtered data.'
          }
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Available: stats, themes, cornerstone, high-quality, content, scan'
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Vault API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}