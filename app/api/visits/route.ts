import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// Utility: return JSON with status
function json(data: any, status = 200) {
  return NextResponse.json(data, { status })
}

// ─────────────────────────────────────────────
// GET - All visit records for current user
// ─────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) return json({ error: 'Unauthorized' }, 401)

    const visits = await prisma.visitRecord.findMany({
      where: { userId },
      include: {
        Patient: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            suffix: true,
            gender: true,
            idNumber: true,
            program: true,
            course: true,
            yearLevel: true
          }
        },
        User: {
          select: { fullName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return json({ visits })
  } catch (error) {
    console.error('GET visits error:', error)
    return json({ error: 'Internal server error' }, 500)
  }
}

// ─────────────────────────────────────────────
// POST - Create a new visit record
// ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) return json({ error: 'Unauthorized' }, 401)

    const { patientId, visitDate, reason, symptoms, treatment, notes } =
      await request.json()

    if (!patientId || !visitDate || !reason)
      return json({ error: 'Missing required fields' }, 400)

    // Ensure patient belongs to user
    const patient = await prisma.patient.findUnique({ where: { id: patientId } })
    if (!patient || patient.userId !== userId)
      return json({ error: 'Patient not found or unauthorized' }, 404)

    const visit = await prisma.visitRecord.create({
      data: {
        patientId,
        visitDate,
        reason,
        symptoms,
        treatment,
        notes,
        userId
      }
    })

    return json({ visit }, 201)
  } catch (error) {
    console.error('POST visit error:', error)
    return json({ error: 'Internal server error' }, 500)
  }
}

// ─────────────────────────────────────────────
// PUT - Update a visit record
// ─────────────────────────────────────────────
export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) return json({ error: 'Unauthorized' }, 401)

    const { id, patientId, visitDate, reason, symptoms, treatment, notes } =
      await request.json()

    if (!id) return json({ error: 'Visit ID required' }, 400)

    const existing = await prisma.visitRecord.findUnique({ where: { id } })
    if (!existing || existing.userId !== userId)
      return json({ error: 'Visit not found or unauthorized' }, 404)

    // Validate patient if changed
    if (patientId && patientId !== existing.patientId) {
      const patient = await prisma.patient.findUnique({ where: { id: patientId } })
      if (!patient || patient.userId !== userId)
        return json({ error: 'Patient not found or unauthorized' }, 404)
    }

    const updatedVisit = await prisma.visitRecord.update({
      where: { id },
      data: {
        ...(patientId && { patientId }),
        visitDate,
        reason,
        symptoms,
        treatment,
        notes
      }
    })

    return json({ visit: updatedVisit })
  } catch (error) {
    console.error('PUT visit error:', error)
    return json({ error: 'Internal server error' }, 500)
  }
}

// ─────────────────────────────────────────────
// DELETE - Remove a visit record
// ─────────────────────────────────────────────
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) return json({ error: 'Unauthorized' }, 401)

    const { id } = await request.json()
    if (!id) return json({ error: 'Visit ID required' }, 400)

    const visit = await prisma.visitRecord.findUnique({ where: { id } })
    if (!visit || visit.userId !== userId)
      return json({ error: 'Visit not found or unauthorized' }, 404)

    await prisma.visitRecord.delete({ where: { id } })
    return json({ message: 'Visit deleted' })
  } catch (error) {
    console.error('DELETE visit error:', error)
    return json({ error: 'Internal server error' }, 500)
  }
}
