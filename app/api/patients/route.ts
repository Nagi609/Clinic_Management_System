import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// Validation helpers
const validateNameField = (name: string): boolean => {
  if (!name || !name.trim()) return false
  return /^[a-zA-Z\s]*$/.test(name.trim())
}

const validatePhone = (phone: string): boolean => {
  // Must start with 09 and be exactly 11 digits
  return /^09\d{9}$/.test(phone)
}

const validateIdNumber = (idNumber: string): boolean => {
  // Can contain letters, numbers, and dash only
  return /^[a-zA-Z0-9-]+$/.test(idNumber)
}

const validateEmail = (email: string): boolean => {
  // Basic email regex pattern
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Helper to parse attachments safely
const parseAttachments = (attachments: any) => {
  if (!attachments) return null
  try {
    return JSON.stringify(attachments)
  } catch {
    return null
  }
}

// GET all patients for the current user
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    const patients = await prisma.patient.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    let filteredPatients = patients

    if (search && search.trim()) {
      const searchTerm = search.trim().toLowerCase()
      filteredPatients = patients.filter(patient => {
        const fullName = `${patient.firstName} ${patient.middleName ?? ""} ${patient.lastName}${patient.suffix ? " " + patient.suffix : ""}`.toLowerCase().trim()
        return fullName.includes(searchTerm) ||
               patient.firstName.toLowerCase().includes(searchTerm) ||
               (patient.middleName && patient.middleName.toLowerCase().includes(searchTerm)) ||
               patient.lastName.toLowerCase().includes(searchTerm) ||
               (patient.suffix && patient.suffix.toLowerCase().includes(searchTerm))
      })
    }

    return NextResponse.json({ patients: filteredPatients })
  } catch (error) {
    console.error('Get patients error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create a new patient
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const {
      firstName,
      middleName,
      lastName,
      suffix,
      dateOfBirth,
      gender,
      phone,
      email,
      address,
      role,
      idNumber,
      program,
      course,
      yearLevel,
      block,
      department,
      staffCategory,
      // Medical History
      pastIllnesses,
      surgeries,
      currentMedication,
      allergies,
      medicalNotes,
      // Emergency Contacts
      primaryContactName,
      primaryContactRelationship,
      primaryContactPhone,
      primaryContactAddress,
      secondaryContactName,
      secondaryContactRelationship,
      secondaryContactPhone,
      secondaryContactAddress,
      attachments
    } = await request.json()

    // Validate required fields
    const errors: string[] = []

    if (!firstName || !validateNameField(firstName)) {
      errors.push('First name is required and must contain only letters')
    }
    if (middleName && !validateNameField(middleName)) {
      errors.push('Middle name must contain only letters')
    }
    if (!lastName || !validateNameField(lastName)) {
      errors.push('Last name is required and must contain only letters')
    }
    if (suffix && !validateNameField(suffix)) {
      errors.push('Suffix must contain only letters')
    }
    if (!dateOfBirth) {
      errors.push('Date of birth is required')
    }
    if (!gender) {
      errors.push('Gender is required')
    }
    if (!phone || !validatePhone(phone)) {
      errors.push('Phone must start with 09 and be exactly 11 digits')
    }
    if (!role || !['student', 'teaching_staff', 'non_teaching_staff'].includes(role)) {
      errors.push('Valid role is required')
    }
    if (!idNumber || !validateIdNumber(idNumber)) {
      errors.push('ID number is required and can only contain letters, numbers, and dashes')
    }

    // Validate role-specific fields
    if (role === 'student') {
      if (!program || !['CICT', 'CBME'].includes(program)) {
        errors.push('Valid program (CICT or CBME) is required for students')
      }
      if (!course) {
        errors.push('Course is required for students')
      }
      if (!yearLevel || yearLevel < 1 || yearLevel > 4) {
        errors.push('Valid year level (1-4) is required for students')
      }
      if (!block || block < 1 || block > 5) {
        errors.push('Valid block (1-5) is required for students')
      }
    }

    if (role === 'teaching_staff') {
      if (!department || !['CICT', 'CBME'].includes(department)) {
        errors.push('Valid program (CICT or CBME) is required for teaching staff')
      }
    }

    if (role === 'non_teaching_staff') {
      if (!staffCategory || !['Administrative', 'Security', 'Maintenance', 'Support', 'Clinic'].includes(staffCategory)) {
        errors.push('Valid category is required for non-teaching staff')
      }
    }

    // Validate primary emergency contact (required)
    if (!primaryContactName || !primaryContactName.trim()) {
      errors.push('Primary contact name is required')
    }
    if (!primaryContactRelationship || !primaryContactRelationship.trim()) {
      errors.push('Primary contact relationship is required')
    }
    if (!primaryContactPhone || !validatePhone(primaryContactPhone)) {
      errors.push('Primary contact phone must start with 09 and be exactly 11 digits')
    }

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    const patient = await prisma.patient.create({
      data: {
        firstName,
        middleName: middleName || null,
        lastName,
        suffix: suffix || null,
        dateOfBirth,
        gender,
        phone,
        email: email || null,
        address: address || null,
        role,
        idNumber,
        program: role === 'student' ? program : null,
        course: role === 'student' ? course : null,
        yearLevel: role === 'student' ? yearLevel : null,
        block: role === 'student' ? block : null,
        department: role === 'teaching_staff' ? department : null,
        staffCategory: role === 'non_teaching_staff' ? staffCategory : null,
        // Medical History
        pastIllnesses: pastIllnesses || null,
        surgeries: surgeries || null,
        currentMedication: currentMedication || null,
        allergies: allergies || null,
        medicalNotes: medicalNotes || null,
        // Emergency Contacts
        primaryContactName,
        primaryContactRelationship,
        primaryContactPhone,
        primaryContactAddress: primaryContactAddress || null,
        secondaryContactName: secondaryContactName || null,
        secondaryContactRelationship: secondaryContactRelationship || null,
        secondaryContactPhone: secondaryContactPhone || null,
        secondaryContactAddress: secondaryContactAddress || null,
        attachments: parseAttachments(attachments),
        userId
      }
    })

    return NextResponse.json({ patient }, { status: 201 })
  } catch (error) {
    console.error('Create patient error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update a patient
export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const {
      id,
      firstName,
      middleName,
      lastName,
      suffix,
      dateOfBirth,
      gender,
      phone,
      email,
      address,
      role,
      idNumber,
      program,
      course,
      yearLevel,
      block,
      department,
      staffCategory,
      // Medical History
      pastIllnesses,
      surgeries,
      currentMedication,
      allergies,
      medicalNotes,
      // Emergency Contacts
      primaryContactName,
      primaryContactRelationship,
      primaryContactPhone,
      primaryContactAddress,
      secondaryContactName,
      secondaryContactRelationship,
      secondaryContactPhone,
      secondaryContactAddress,
      attachments
    } = await request.json()

    if (!id) return NextResponse.json({ error: 'Patient ID required' }, { status: 400 })

    const patient = await prisma.patient.findUnique({ where: { id } })
    if (!patient || patient.userId !== userId) {
      return NextResponse.json({ error: 'Patient not found or unauthorized' }, { status: 404 })
    }

    // Validate fields if provided
    const errors: string[] = []

    if (firstName && !validateNameField(firstName)) {
      errors.push('First name must contain only letters')
    }
    if (middleName && !validateNameField(middleName)) {
      errors.push('Middle name must contain only letters')
    }
    if (lastName && !validateNameField(lastName)) {
      errors.push('Last name must contain only letters')
    }
    if (suffix && !validateNameField(suffix)) {
      errors.push('Suffix must contain only letters')
    }
    if (phone && !validatePhone(phone)) {
      errors.push('Phone must start with 09 and be exactly 11 digits')
    }
    if (email && !validateEmail(email)) {
      errors.push('Email must be a valid email address')
    }
    if (idNumber && !validateIdNumber(idNumber)) {
      errors.push('ID number can only contain letters, numbers, and dashes')
    }

    // Validate primary emergency contact if provided
    if (primaryContactName && !primaryContactName.trim()) {
      errors.push('Primary contact name must be provided if updating')
    }
    if (primaryContactRelationship && !primaryContactRelationship.trim()) {
      errors.push('Primary contact relationship must be provided if updating')
    }
    if (primaryContactPhone && !validatePhone(primaryContactPhone)) {
      errors.push('Primary contact phone must start with 09 and be exactly 11 digits')
    }

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    const updatedPatient = await prisma.patient.update({
      where: { id },
      data: {
        firstName: firstName || undefined,
        middleName: middleName || null,
        lastName: lastName || undefined,
        suffix: suffix || null,
        dateOfBirth: dateOfBirth || undefined,
        gender: gender || undefined,
        phone: phone || undefined,
        email: email || null,
        address: address || null,
        role: role || undefined,
        idNumber: idNumber || undefined,
        program: role === 'student' ? program : null,
        course: role === 'student' ? course : null,
        yearLevel: role === 'student' ? yearLevel : null,
        block: role === 'student' ? block : null,
        department: role === 'teaching_staff' ? department : null,
        staffCategory: role === 'non_teaching_staff' ? staffCategory : null,
        // Medical History
        pastIllnesses: pastIllnesses || null,
        surgeries: surgeries || null,
        currentMedication: currentMedication || null,
        allergies: allergies || null,
        medicalNotes: medicalNotes || null,
        // Emergency Contacts
        primaryContactName: primaryContactName || undefined,
        primaryContactRelationship: primaryContactRelationship || undefined,
        primaryContactPhone: primaryContactPhone || undefined,
        primaryContactAddress: primaryContactAddress || null,
        secondaryContactName: secondaryContactName || null,
        secondaryContactRelationship: secondaryContactRelationship || null,
        secondaryContactPhone: secondaryContactPhone || null,
        secondaryContactAddress: secondaryContactAddress || null,
        attachments: parseAttachments(attachments)
      }
    })

    return NextResponse.json({ patient: updatedPatient })
  } catch (error) {
    console.error('Update patient error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
