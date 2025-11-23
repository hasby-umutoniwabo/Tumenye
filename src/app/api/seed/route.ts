import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Progress from '@/models/Progress';
import Streak from '@/models/Streak';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Check if demo user already exists
    const existingUser = await User.findOne({ email: 'demo@tumenye.rw' });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Demo user already exists' },
        { status: 200 }
      );
    }

    // Create demo user
    const hashedPassword = await bcrypt.hash('demo123', 12);
    
    const demoUser = await User.create({
      name: 'Demo Student',
      email: 'demo@tumenye.rw',
      password: hashedPassword,
      role: 'student',
    });

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@tumenye.rw' });
    if (!adminExists) {
      const adminPassword = await bcrypt.hash('admin123', 12);
      await User.create({
        name: 'Admin User',
        email: 'admin@tumenye.rw',
        password: adminPassword,
        role: 'admin',
      });
    }

    // Create some sample progress data for the demo user
    const sampleProgress = [
      {
        userId: 'demo@tumenye.rw',
        moduleId: 'microsoft-word',
        lessonId: 'introduction',
        completed: true,
        score: 95,
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        userId: 'demo@tumenye.rw',
        moduleId: 'microsoft-word',
        lessonId: 'basic-formatting',
        completed: true,
        score: 88,
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        userId: 'demo@tumenye.rw',
        moduleId: 'powerpoint',
        lessonId: 'introduction',
        completed: true,
        score: 92,
        completedAt: new Date(), // Today
      },
    ];

    // Insert sample progress (remove existing first)
    await Progress.deleteMany({ userId: 'demo@tumenye.rw' });
    await Progress.insertMany(sampleProgress);

    // Create sample streak data
    await Streak.findOneAndUpdate(
      { userId: 'demo@tumenye.rw' },
      {
        userId: 'demo@tumenye.rw',
        currentStreak: 3,
        longestStreak: 5,
        lastActivityDate: new Date(),
        totalActiveDays: 8,
        streakHistory: [
          { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), lessonsCompleted: 1 },
          { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), lessonsCompleted: 1 },
          { date: new Date(), lessonsCompleted: 1 },
        ]
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(
      { 
        message: 'Database seeded successfully with sample data',
        demoUser: {
          email: 'demo@tumenye.rw',
          password: 'demo123'
        },
        progress: `${sampleProgress.length} lessons completed`,
        streak: '3 day streak'
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    // Force re-seed progress data for demo user
    const sampleProgress = [
      {
        userId: 'demo@tumenye.rw',
        moduleId: 'microsoft-word',
        lessonId: 'introduction',
        completed: true,
        score: 95,
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        userId: 'demo@tumenye.rw',
        moduleId: 'microsoft-word',
        lessonId: 'basic-formatting',
        completed: true,
        score: 88,
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        userId: 'demo@tumenye.rw',
        moduleId: 'powerpoint',
        lessonId: 'introduction',
        completed: true,
        score: 92,
        completedAt: new Date(), // Today
      },
    ];

    // Remove existing progress and insert new
    await Progress.deleteMany({ userId: 'demo@tumenye.rw' });
    
    // Use upsert operations to avoid duplicate key errors
    const insertedProgress = [];
    for (const progressData of sampleProgress) {
      const progress = await Progress.findOneAndUpdate(
        { userId: progressData.userId, lessonId: progressData.lessonId },
        progressData,
        { upsert: true, new: true, runValidators: true }
      );
      insertedProgress.push(progress);
    }

    // Create sample streak data
    const streak = await Streak.findOneAndUpdate(
      { userId: 'demo@tumenye.rw' },
      {
        userId: 'demo@tumenye.rw',
        currentStreak: 3,
        longestStreak: 5,
        lastActivityDate: new Date(),
        totalActiveDays: 8,
        streakHistory: [
          { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), lessonsCompleted: 1 },
          { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), lessonsCompleted: 1 },
          { date: new Date(), lessonsCompleted: 1 },
        ]
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      message: 'Sample progress data created',
      progress: insertedProgress,
      streak: streak
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { error: 'Failed to seed data' },
      { status: 500 }
    );
  }
}
