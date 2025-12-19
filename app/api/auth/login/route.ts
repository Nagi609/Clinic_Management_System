import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    // Parse request body safely
    let body: { usernameOrEmail?: string; password?: string };
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    const { usernameOrEmail, password } = body;

    // Validate input
    if (!usernameOrEmail || !password) {
      return NextResponse.json(
        { error: 'Username/email and password are required' },
        { status: 400 }
      );
    }

    // Find user by username or email
    let user;
    try {
      user = await prisma.user.findFirst({
        where: {
          OR: [
            { username: usernameOrEmail },
            { email: usernameOrEmail },
          ],
        },
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid username/email or password' }, { status: 401 });
    }

    // Verify password
    let passwordMatch;
    try {
      passwordMatch = await bcrypt.compare(password, user.password);
    } catch (bcryptError) {
      console.error('Bcrypt error:', bcryptError);
      return NextResponse.json({ error: 'Password verification error' }, { status: 500 });
    }

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid username/email or password' }, { status: 401 });
    }

    // Remove password before sending response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword }, { status: 200 });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
