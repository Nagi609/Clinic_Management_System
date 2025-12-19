import prisma from '../../backend/lib/db'

/**
 * Gets the next available ID for a model per user by finding the smallest missing ID starting from 1
 * The DB stores `id` as strings (cuid), but this helper returns a numeric sequence per-user.
 */
export async function getNextIdForUser(model: 'Patient' | 'VisitRecord', userId: string): Promise<number> {
  type IdRecord = { id: string }
  let existingIds: IdRecord[]

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

  // Parse numeric ids from the string `id` values. Ignore non-numeric ids.
  const usedIds = new Set<number>()
  for (const rec of existingIds) {
    const n = parseInt(rec.id, 10)
    if (!Number.isNaN(n) && n > 0) usedIds.add(n)
  }

  // Find the smallest missing ID starting from 1
  let nextId = 1
  while (usedIds.has(nextId)) {
    nextId++
  }

  return nextId
}
