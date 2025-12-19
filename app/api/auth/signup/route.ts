import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email, password, fullName } = body

    if (!username || !email || !password || !fullName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const existingUsername = await prisma.user.findUnique({ where: { username } })
    if (existingUsername) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 400 })
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } })
    if (existingEmail) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

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

    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword, fullName, role: 'admin', numericId: nextNumericId },
    })

    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json({ user: userWithoutPassword }, { status: 201 })
  } catch (error: any) {
    console.error('Error:', error?.message)
    return NextResponse.json({ error: error?.message || 'Error creating account' }, { status: 500 })
  }
}
