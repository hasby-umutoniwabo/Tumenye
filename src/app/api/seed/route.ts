import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

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

    return NextResponse.json(
      { 
        message: 'Database seeded successfully',
        demoUser: {
          email: 'demo@tumenye.rw',
          password: 'demo123'
        }
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
