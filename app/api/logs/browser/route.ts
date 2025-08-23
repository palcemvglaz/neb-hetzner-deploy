import { NextRequest, NextResponse } from 'next/server';
import { enhancedLogger } from '@/lib/utils/enhancedLogger';

export async function POST(request: NextRequest) {
  try {
    const { errors } = await request.json();
    
    // Log each browser error
    for (const error of errors) {
      enhancedLogger.error(`Browser Error: ${error.message}`, {
        component: 'BROWSER',
        action: 'client_error',
        severity: error.type === 'unhandledRejection' ? 'high' : 'medium',
        url: error.url,
        userAgent: error.userAgent,
        stack: error.stack,
        timestamp: error.timestamp,
        errorBoundary: error.errorBoundary,
        componentStack: error.componentStack
      });
    }
    
    return NextResponse.json({ success: true, received: errors.length });
  } catch (error) {
    enhancedLogger.error('Failed to log browser errors', {
      component: 'API',
      action: 'browser_log_error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    return NextResponse.json(
      { success: false, error: 'Failed to log errors' },
      { status: 500 }
    );
  }
}