import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json()

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      )
    }

    // Check if username exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    })

    return NextResponse.json(
      { available: !existingUser },
      { status: 200 }
    )
  } catch (error) {
    console.error('Check username error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
