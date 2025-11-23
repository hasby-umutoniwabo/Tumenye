import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Goal from '@/models/Goal';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get query parameters for date range
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let query: any = { userId: session.user.email };

    if (startDate && endDate) {
      query.date = {
        $gte: startDate,
        $lte: endDate
      };
    } else if (startDate) {
      query.date = { $gte: startDate };
    } else if (endDate) {
      query.date = { $lte: endDate };
    }

    const goals = await Goal.find(query).sort({ date: -1 });

    return NextResponse.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { date, target, completed, achieved } = await request.json();

    if (!date || typeof target !== 'number') {
      return NextResponse.json(
        { error: 'Date and target are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Use findOneAndUpdate with upsert to create or update
    const goal = await Goal.findOneAndUpdate(
      { userId: session.user.email, date },
      {
        userId: session.user.email,
        date,
        target,
        completed: completed || 0,
        achieved: achieved || false,
      },
      { 
        upsert: true, 
        new: true,
        runValidators: true 
      }
    );

    return NextResponse.json(goal);
  } catch (error) {
    console.error('Error creating/updating goal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { date, incrementCompleted, target } = await request.json();

    if (!date) {
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get current goal or create new one
    let goal = await Goal.findOne({ userId: session.user.email, date });
    
    if (!goal) {
      // Create new goal for today
      goal = new Goal({
        userId: session.user.email,
        date,
        target: target || 2, // Default target
        completed: 0,
        achieved: false,
      });
    }

    // Update based on the operation
    if (incrementCompleted) {
      goal.completed += 1;
    }

    if (target !== undefined) {
      goal.target = target;
    }

    // Check if goal is achieved
    goal.achieved = goal.completed >= goal.target;

    await goal.save();

    return NextResponse.json(goal);
  } catch (error) {
    console.error('Error updating goal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Delete all goals for this user (for testing/reset purposes)
    await Goal.deleteMany({ userId: session.user.email });

    return NextResponse.json({ message: 'All goals deleted successfully' });
  } catch (error) {
    console.error('Error deleting goals:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
