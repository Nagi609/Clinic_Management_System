import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET user profile
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { role, ...userWithoutRole } = user
    return NextResponse.json({ user: userWithoutRole })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { fullName, email, phone, address, avatar } = await request.json()

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: fullName ?? user.fullName,
        email: email ?? user.email,
        phone: phone ?? user.phone,
        address: address ?? user.address,
        avatar: avatar ?? user.avatar
      }
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
