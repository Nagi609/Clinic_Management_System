import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET all clinic contacts for the current user
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const clinicContacts = await prisma.clinicContact.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ clinicContacts })
  } catch (error) {
    console.error('Get clinic contacts error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create a new clinic contact
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { name, icon, link, notes } = await request.json()

    if (!name || !icon || !link) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const clinicContact = await prisma.clinicContact.create({
      data: {
        name,
        icon,
        link,
        notes,
        userId
      }
    })

    return NextResponse.json({ clinicContact }, { status: 201 })
  } catch (error) {
    console.error('Create clinic contact error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update a clinic contact
export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, name, icon, link, notes } = await request.json()
    if (!id) return NextResponse.json({ error: 'Clinic contact ID required' }, { status: 400 })

    const clinicContact = await prisma.clinicContact.findUnique({ where: { id } })
    if (!clinicContact || clinicContact.userId !== userId) {
      return NextResponse.json({ error: 'Clinic contact not found or unauthorized' }, { status: 404 })
    }

    const updatedClinicContact = await prisma.clinicContact.update({
      where: { id },
      data: {
        name: name ?? clinicContact.name,
        icon: icon ?? clinicContact.icon,
        link: link ?? clinicContact.link,
        notes: notes ?? clinicContact.notes
      }
    })

    return NextResponse.json({ clinicContact: updatedClinicContact })
  } catch (error) {
    console.error('Update clinic contact error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete a clinic contact
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'Clinic contact ID required' }, { status: 400 })

    const clinicContact = await prisma.clinicContact.findUnique({ where: { id } })
    if (!clinicContact || clinicContact.userId !== userId) {
      return NextResponse.json({ error: 'Clinic contact not found or unauthorized' }, { status: 404 })
    }

    await prisma.clinicContact.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete clinic contact error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
