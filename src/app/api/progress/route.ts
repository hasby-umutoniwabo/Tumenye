import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import Progress from '@/models/Progress';

// DELETE /api/progress - Reset progress (for testing)
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    // Delete all progress for the current user
    await Progress.deleteMany({ userId: session.user.email });

    return NextResponse.json({ message: 'Progress reset successfully' });
  } catch (error) {
    console.error('Error resetting progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/progress - Get user's progress
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      // For demo purposes, return sample data if no auth (in development)
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json([
          {
            _id: "demo1",
            userId: "demo@tumenye.rw",
            moduleId: "microsoft-word",
            lessonId: "introduction",
            completed: true,
            score: 95,
            completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
          {
            _id: "demo2", 
            userId: "demo@tumenye.rw",
            moduleId: "microsoft-word",
            lessonId: "basic-formatting",
            completed: true,
            score: 88,
            completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          }
        ]);
      }
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const url = new URL(request.url);
    const moduleId = url.searchParams.get('moduleId');
    const lessonId = url.searchParams.get('lessonId');

    let query: any = { userId: session.user.email };
    
    if (moduleId) {
      query.moduleId = moduleId;
    }
    
    if (lessonId) {
      query.lessonId = lessonId;
    }

    const progress = await Progress.find(query).sort({ updatedAt: -1 });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/progress - Update lesson progress
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { moduleId, lessonId, completed, score } = body;

    if (!moduleId || !lessonId) {
      return NextResponse.json(
        { error: 'moduleId and lessonId are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const progressData = {
      userId: session.user.email,
      moduleId,
      lessonId,
      completed: completed || false,
      score,
      completedAt: completed ? new Date() : undefined,
    };

    // Use findOneAndUpdate with upsert to create or update
    const progress = await Progress.findOneAndUpdate(
      { userId: session.user.email, lessonId },
      progressData,
      { 
        upsert: true, 
        new: true,
        runValidators: true 
      }
    );

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/progress - Test endpoint for lesson completion (development only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { moduleId, lessonId, score } = body;

    if (!moduleId || !lessonId) {
      return NextResponse.json(
        { error: 'moduleId and lessonId are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const progressData = {
      userId: session.user.email,
      moduleId,
      lessonId,
      completed: true,
      score: score || 100,
      completedAt: new Date(),
    };



    // Use findOneAndUpdate with upsert to create or update
    const progress = await Progress.findOneAndUpdate(
      { userId: session.user.email, lessonId },
      progressData,
      { 
        upsert: true, 
        new: true,
        runValidators: true 
      }
    );


    return NextResponse.json({ message: 'Test lesson completed', progress });
  } catch (error) {
    console.error('Error in test lesson completion:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}