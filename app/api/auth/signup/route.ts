import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, fullName } = await request.json()

    // Validation
    if (!username || !email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    })

    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    })

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Determine smallest available positive numericId (ignore 0)
    const existingIds = await prisma.user.findMany({
      where: { numericId: { gt: 0 } },
      select: { numericId: true },
      orderBy: { numericId: 'asc' },
    })
    let nextNumericId = 1
    for (const row of existingIds) {
      if (row.numericId === nextNumericId) nextNumericId++
      else if (row.numericId > nextNumericId) break
    }

    // Create user with assigned numericId
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        fullName,
        role: 'admin',
        numericId: nextNumericId,
      },
    })

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json(
      { user: userWithoutPassword, message: 'Account created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
