import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// ======= Validation Helpers =======
const validateNameField = (name: string): boolean =>
  !!name?.trim() && /^[a-zA-Z\s]*$/.test(name.trim())

const validatePhone = (phone: string): boolean =>
  typeof phone === 'string' && /^09\d{9}$/.test(phone)

const validateIdNumber = (idNumber: string): boolean =>
  typeof idNumber === 'string' && /^[a-zA-Z0-9-]+$/.test(idNumber)

const parseAttachments = (attachments: any) => {
  if (!attachments) return null
  try {
    return JSON.stringify(attachments)
  } catch {
    return null
  }
}

// ======= GET - All patients =======
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const patients = await prisma.patient.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ patients })
  } catch (error) {
    console.error('Get patients error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    )
  }
}

// ======= POST - Create patient =======
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const errors: string[] = []

    // ===== Basic validations =====
    if (!validateNameField(data.firstName)) errors.push('First name is required and must be letters only')
    if (data.middleName && !validateNameField(data.middleName)) errors.push('Middle name must contain letters only')
    if (!validateNameField(data.lastName)) errors.push('Last name is required and must be letters only')
    if (data.suffix && !validateNameField(data.suffix)) errors.push('Suffix must contain letters only')

    if (!data.dateOfBirth) errors.push('Date of birth is required')
    if (isNaN(Date.parse(data.dateOfBirth))) errors.push('Invalid date of birth')

    if (!data.gender) errors.push('Gender is required')
    if (!validatePhone(data.phone)) errors.push('Phone must start with 09 and be exactly 11 digits')

    if (!data.role || !['student', 'teaching_staff', 'non_teaching_staff'].includes(data.role)) {
      errors.push('Valid role is required')
    }

    if (!validateIdNumber(data.idNumber)) errors.push('Valid ID number is required')

    // ===== Role-specific =====
    if (data.role === 'student') {
      if (!['CICT', 'CBME'].includes(data.program)) errors.push('Valid program is required for students')
      if (!data.course) errors.push('Course is required for students')
      if (!data.yearLevel || data.yearLevel < 1 || data.yearLevel > 4) errors.push('Year level must be 1–4')
      if (data.block && (data.block < 1 || data.block > 5)) errors.push('Block must be 1–5')
    }

    if (data.role === 'teaching_staff') {
      if (!['CICT', 'CBME'].includes(data.department)) errors.push('Valid department is required')
    }

    if (data.role === 'non_teaching_staff') {
      if (!data.staffCategory) errors.push('Staff category is required')
    }

    // ===== Emergency contact =====
    if (!data.primaryContactName?.trim()) errors.push('Primary contact name is required')
    if (!data.primaryContactRelationship?.trim()) errors.push('Primary contact relationship is required')
    if (!validatePhone(data.primaryContactPhone)) errors.push('Primary contact phone is invalid')

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    // ===== CREATE =====
    const patient = await prisma.patient.create({
      data: {
        ...data,
        dateOfBirth: new Date(data.dateOfBirth), // 🔥 FIX
        middleName: data.middleName || null,
        suffix: data.suffix || null,
        email: data.email || null,
        address: data.address || null,
        program: data.role === 'student' ? data.program : null,
        course: data.role === 'student' ? data.course : null,
        yearLevel: data.role === 'student' ? data.yearLevel : null,
        block: data.role === 'student' ? data.block : null,
        department: data.role === 'teaching_staff' ? data.department : null,
        staffCategory: data.role === 'non_teaching_staff' ? data.staffCategory : null,
        pastIllnesses: data.pastIllnesses || null,
        surgeries: data.surgeries || null,
        currentMedication: data.currentMedication || null,
        allergies: data.allergies || null,
        medicalNotes: data.medicalNotes || null,
        primaryContactAddress: data.primaryContactAddress || null,
        secondaryContactName: data.secondaryContactName || null,
        secondaryContactRelationship: data.secondaryContactRelationship || null,
        secondaryContactPhone: data.secondaryContactPhone || null,
        secondaryContactAddress: data.secondaryContactAddress || null,
        attachments: parseAttachments(data.attachments),
        userId,
      },
    })

    return NextResponse.json({ patient }, { status: 201 })
  } catch (error: any) {
    console.error('Create patient error:', error)
    return NextResponse.json(
      { error: 'Failed to save patient', details: error.message },
      { status: 500 }
    )
  }
}
