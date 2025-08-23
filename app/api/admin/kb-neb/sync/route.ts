import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { syncContent } from '../../../../../scripts/kb-neb-sync'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { format, language, forceUpdate, dryRun } = body

    // Validate options
    const validFormats = ['ALL', 'M', 'T', 'IG', 'TW', 'FB', 'LI', 'W_ART', 'V_LONG']
    const validLanguages = ['ALL', 'UA', 'EN', 'RU']

    if (format && format !== 'ALL' && !validFormats.includes(format)) {
      return NextResponse.json(
        { error: `Invalid format: ${format}` },
        { status: 400 }
      )
    }

    if (language && language !== 'ALL' && !validLanguages.includes(language)) {
      return NextResponse.json(
        { error: `Invalid language: ${language}` },
        { status: 400 }
      )
    }

    // Run sync
    const options = {
      format: format === 'ALL' ? undefined : format,
      language: language === 'ALL' ? undefined : language,
      forceUpdate: Boolean(forceUpdate),
      dryRun: Boolean(dryRun),
      limit: 50, // Limit for API calls to prevent timeouts
    }

    console.log('Starting KB_NEB sync with options:', options)

    const result = await syncContent(options)

    return NextResponse.json({
      success: true,
      dryRun: options.dryRun,
      result: {
        processedFiles: result.processedFiles,
        importedFiles: result.importedFiles,
        updatedFiles: result.updatedFiles,
        skippedFiles: result.skippedFiles,
        errors: result.errorFiles,
        errorDetails: result.errors,
      }
    })

  } catch (error) {
    console.error('KB_NEB sync error:', error)
    
    return NextResponse.json(
      { 
        error: 'Помилка синхронізації',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Get sync status
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if KB_NEB API is configured
    const apiUrl = process.env.KB_NEB_API_URL
    const apiKey = process.env.KB_NEB_API_KEY

    const isConfigured = Boolean(apiUrl && apiKey)

    return NextResponse.json({
      configured: isConfigured,
      apiUrl: apiUrl ? new URL(apiUrl).origin : null,
      hasApiKey: Boolean(apiKey),
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get sync status' },
      { status: 500 }
    )
  }
}