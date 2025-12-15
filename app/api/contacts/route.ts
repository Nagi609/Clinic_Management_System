import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET all contacts for the current user
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const contacts = await prisma.contact.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ contacts })
  } catch (error) {
    console.error('Get contacts error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create a new contact
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { name, phone, email, relationship } = await request.json()

    if (!name || !phone || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        phone,
        email,
        relationship,
        userId
      }
    })

    return NextResponse.json({ contact }, { status: 201 })
  } catch (error) {
    console.error('Create contact error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update a contact
export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, name, phone, email, relationship } = await request.json()
    if (!id) return NextResponse.json({ error: 'Contact ID required' }, { status: 400 })

    const contact = await prisma.contact.findUnique({ where: { id } })
    if (!contact || contact.userId !== userId) {
      return NextResponse.json({ error: 'Contact not found or unauthorized' }, { status: 404 })
    }

    const updatedContact = await prisma.contact.update({
      where: { id },
      data: {
        name: name ?? contact.name,
        phone: phone ?? contact.phone,
        email: email ?? contact.email,
        relationship: relationship ?? contact.relationship
      }
    })

    return NextResponse.json({ contact: updatedContact })
  } catch (error) {
    console.error('Update contact error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete a contact
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'Contact ID required' }, { status: 400 })

    const contact = await prisma.contact.findUnique({ where: { id } })
    if (!contact || contact.userId !== userId) {
      return NextResponse.json({ error: 'Contact not found or unauthorized' }, { status: 404 })
    }

    await prisma.contact.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete contact error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
