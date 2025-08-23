import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { courseService } from '@/lib/kb-neb/course-service';

export async function POST(request: NextRequest) {
  try {
    // Check authentication - only admins can generate courses
    const session = await getServerSession(authOptions);
    const isTestMode = request.headers.get('x-test-mode') === 'true';
    
    if (!session?.user?.role === 'ADMIN' && !isTestMode) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get course slug from request body
    const body = await request.json();
    const { courseSlug = 'motorcycle-safety-basics' } = body;

    console.log(`Generating course: ${courseSlug}`);

    // Generate course from KB_NEB content
    const course = await courseService.generateCourse(courseSlug);

    // Get updated course with sections and items count
    const updatedCourse = await courseService.getCourseWithContent(course.slug);
    
    const sectionsCount = updatedCourse?.sections?.length || 0;
    const lessonsCount = updatedCourse?.sections?.reduce((total, section) => 
      total + (section.items?.length || 0), 0) || 0;

    return NextResponse.json({
      success: true,
      course: {
        id: course.id,
        title: course.slug,
        slug: course.slug,
        sectionsCount,
        lessonsCount
      }
    });
  } catch (error) {
    console.error('🔴 COURSE GENERATION ERROR:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error instanceof Error ? error.message : error);
    console.error('Full error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate course',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Scan available content for preview
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const availableContent = await courseService.scanAvailableContent();
    
    // Convert Map to object for JSON serialization
    const contentSummary: any = {};
    for (const [dir, contents] of Array.from(availableContent)) {
      contentSummary[dir] = contents.map(c => ({
        title: c.title,
        path: c.filePath,
        metadata: c.metadata
      }));
    }

    return NextResponse.json({
      success: true,
      availableContent: contentSummary,
      totalFiles: Object.values(contentSummary).reduce((acc: number, arr: any) => acc + arr.length, 0)
    });
  } catch (error) {
    console.error('Error scanning content:', error);
    return NextResponse.json(
      { error: 'Failed to scan content' },
      { status: 500 }
    );
  }
}