import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getNextIdForUser } from "@/lib/id-utils"

// GET all visits for the current user
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const visits = await prisma.visitRecord.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        Patient: true
      }
    })

    return NextResponse.json({ visits })
  } catch (error) {
    console.error('Get visits error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create a new visit
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const {
      patientId,
      reason,
      symptoms,
      treatment,
      notes
    } = await request.json()

    // Validate required fields
    const errors: string[] = []

    if (!patientId) {
      errors.push('Patient ID is required')
    }
    if (!reason || !reason.trim()) {
      errors.push('Reason for visit is required')
    }

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    // Verify patient exists and belongs to user
    const patient = await prisma.patient.findUnique({
      where: { id: patientId }
    })
    if (!patient || patient.userId !== userId) {
      return NextResponse.json({ error: 'Patient not found or unauthorized' }, { status: 404 })
    }

    // Get next ID for this user
    const nextId = await getNextIdForUser('VisitRecord', userId)

    const visit = await prisma.visitRecord.create({
      data: {
        id: String(nextId),
        patientId,
        visitDate: new Date().toISOString(),
        reason,
        symptoms: symptoms || '',
        treatment: treatment || '',
        notes: notes || null,
        userId
      },
      include: {
        Patient: true
      }
    })

    return NextResponse.json({ visit }, { status: 201 })
  } catch (error) {
    console.error('Create visit error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update a visit
export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const {
      id,
      patientId,
      visitDate,
      reason,
      symptoms,
      treatment,
      notes
    } = await request.json()

    if (!id) return NextResponse.json({ error: 'Visit ID required' }, { status: 400 })

    const visit = await prisma.visitRecord.findUnique({
      where: { id },
      include: { Patient: true }
    })
    if (!visit || visit.userId !== userId) {
      return NextResponse.json({ error: 'Visit not found or unauthorized' }, { status: 404 })
    }

    // Validate fields if provided
    const errors: string[] = []

    if (patientId) {
      const patient = await prisma.patient.findUnique({
        where: { id: patientId }
      })
      if (!patient || patient.userId !== userId) {
        errors.push('Patient not found or unauthorized')
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    const updatedVisit = await prisma.visitRecord.update({
      where: { id },
      data: {
        patientId: patientId || undefined,
        visitDate: visitDate ? new Date(visitDate).toISOString() : undefined,
        reason: reason || undefined,
        symptoms: symptoms || undefined,
        treatment: treatment || undefined,
        notes: notes || null
      },
      include: {
        Patient: true
      }
    })

    return NextResponse.json({ visit: updatedVisit })
  } catch (error) {
    console.error('Update visit error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete a visit
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await request.json()

    if (!id) return NextResponse.json({ error: 'Visit ID required' }, { status: 400 })

    const visit = await prisma.visitRecord.findUnique({
      where: { id }
    })
    if (!visit || visit.userId !== userId) {
      return NextResponse.json({ error: 'Visit not found or unauthorized' }, { status: 404 })
    }

    await prisma.visitRecord.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Visit deleted successfully' })
  } catch (error) {
    console.error('Delete visit error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
