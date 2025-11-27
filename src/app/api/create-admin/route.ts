import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Force create admin user (delete existing if any)
    await User.deleteOne({ email: 'admin@tumenye.rw' });
    
    // Create new admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    
    const adminUser = await User.create({
      name: 'Platform Administrator',
      email: 'admin@tumenye.rw',
      password: adminPassword,
      role: 'admin',
    });

    return NextResponse.json({
      message: 'Admin user created successfully',
      admin: {
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role
      }
    });

  } catch (error) {
    console.error('Admin creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user', details: error },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to create admin user',
    credentials: {
      email: 'admin@tumenye.rw',
      password: 'admin123'
    }
  });
}
