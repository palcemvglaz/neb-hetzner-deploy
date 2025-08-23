import { NextRequest, NextResponse } from 'next/server'
import { TestGenerator } from '@/lib/services/test-generator'

export async function POST(request: NextRequest) {
  try {
    const testGenerator = new TestGenerator()
    
    // Create Vision Blocker test
    const testStructure = await testGenerator.createVisionBlockerTest()
    const testId = await testGenerator.saveTestToDatabase(testStructure)
    
    return NextResponse.json({
      success: true,
      data: {
        test_id: testId,
        test: testStructure,
        saved: testId !== null
      }
    })

  } catch (error) {
    console.error('Test generation error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}