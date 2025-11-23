import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import Streak from '@/models/Streak';

// GET /api/streak - Get user's streak data
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      // For demo purposes, return sample data if no auth (in development)
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({
          _id: "demo-streak",
          userId: "demo@tumenye.rw",
          currentStreak: 3,
          longestStreak: 5,
          lastActivityDate: new Date(),
          totalActiveDays: 8,
          streakHistory: [
            { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), lessonsCompleted: 1 },
            { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), lessonsCompleted: 1 },
            { date: new Date(), lessonsCompleted: 1 },
          ]
        });
      }
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    let streak = await Streak.findOne({ userId: session.user.email });
    
    if (!streak) {
      // Create initial streak record
      streak = await Streak.create({
        userId: session.user.email,
        currentStreak: 0,
        longestStreak: 0,
        totalActiveDays: 0,
        streakHistory: []
      });
    }

    return NextResponse.json(streak);
  } catch (error) {
    console.error('Error fetching streak:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/streak - Update streak when lesson is completed
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    let streak = await Streak.findOne({ userId: session.user.email });
    
    if (!streak) {
      // Create new streak record
      streak = await Streak.create({
        userId: session.user.email,
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: today,
        totalActiveDays: 1,
        streakHistory: [{
          date: today,
          lessonsCompleted: 1
        }]
      });
    } else {
      const lastActivity = streak.lastActivityDate ? new Date(streak.lastActivityDate) : null;
      
      if (lastActivity) {
        lastActivity.setHours(0, 0, 0, 0); // Reset time to start of day
        const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 0) {
          // Same day - just update lesson count in history
          const todayEntry = streak.streakHistory.find((entry: any) => {
            const entryDate = new Date(entry.date);
            entryDate.setHours(0, 0, 0, 0);
            return entryDate.getTime() === today.getTime();
          });
          
          if (todayEntry) {
            todayEntry.lessonsCompleted += 1;
          }
        } else if (daysDiff === 1) {
          // Consecutive day - increment streak
          streak.currentStreak += 1;
          streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
          streak.lastActivityDate = today;
          streak.totalActiveDays += 1;
          
          // Add new day to history
          streak.streakHistory.push({
            date: today,
            lessonsCompleted: 1
          });
        } else if (daysDiff > 1) {
          // Gap in days - reset streak
          streak.currentStreak = 1;
          streak.lastActivityDate = today;
          streak.totalActiveDays += 1;
          
          // Add new day to history
          streak.streakHistory.push({
            date: today,
            lessonsCompleted: 1
          });
        }
      } else {
        // First activity
        streak.currentStreak = 1;
        streak.longestStreak = 1;
        streak.lastActivityDate = today;
        streak.totalActiveDays = 1;
        streak.streakHistory = [{
          date: today,
          lessonsCompleted: 1
        }];
      }
      
      // Keep only last 30 days of history to avoid excessive data
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      streak.streakHistory = streak.streakHistory.filter((entry: any) => 
        new Date(entry.date) >= thirtyDaysAgo
      );
      
      await streak.save();
    }

    return NextResponse.json(streak);
  } catch (error) {
    console.error('Error updating streak:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}