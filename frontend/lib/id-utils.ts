import prisma from '../../backend/lib/db'

/**
 * Gets the next available ID for a model per user by finding the smallest missing ID starting from 1
 */
export async function getNextIdForUser(model: 'Patient' | 'VisitRecord', userId: string): Promise<number> {
  let existingIds: { id: number }[]

  if (model === 'Patient') {
    existingIds = await prisma.patient.findMany({
      where: { userId },
      select: { id: true },
      orderBy: { id: 'asc' }
    })
  } else {
    existingIds = await prisma.visitRecord.findMany({
      where: { userId },
      select: { id: true },
      orderBy: { id: 'asc' }
    })
  }

  const usedIds = new Set(existingIds.map((record) => record.id))

  // Find the smallest missing ID starting from 1
  let nextId = 1
  while (usedIds.has(nextId)) {
    nextId++
  }

  return nextId
}
