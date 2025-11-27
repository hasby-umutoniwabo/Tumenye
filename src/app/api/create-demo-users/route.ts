import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Create some demo users for testing
    const demoUsers = [
      {
        name: 'Jean Baptiste',
        email: 'jean@tumenye.rw',
        role: 'student',
        password: await bcrypt.hash('demo123', 12)
      },
      {
        name: 'Marie Claire',
        email: 'marie@tumenye.rw',
        role: 'student',
        password: await bcrypt.hash('demo123', 12)
      },
      {
        name: 'David Mugisha',
        email: 'david@tumenye.rw',
        role: 'student',
        password: await bcrypt.hash('demo123', 12)
      },
      {
        name: 'Grace Uwimana',
        email: 'grace@tumenye.rw',
        role: 'student',
        password: await bcrypt.hash('demo123', 12)
      },
      {
        name: 'Samuel Niyonkuru',
        email: 'samuel@tumenye.rw',
        role: 'admin',
        password: await bcrypt.hash('demo123', 12)
      }
    ];

    // Remove existing demo users first
    await User.deleteMany({ 
      email: { $in: demoUsers.map(u => u.email) }
    });

    // Insert new demo users
    const createdUsers = await User.insertMany(demoUsers);

    return NextResponse.json({
      message: 'Demo users created successfully',
      users: createdUsers.map(user => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }))
    });

  } catch (error) {
    console.error('Error creating demo users:', error);
    return NextResponse.json(
      { error: 'Failed to create demo users', details: error },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to create demo users',
    info: 'This will create 5 demo users with different roles for testing the admin interface'
  });
}
