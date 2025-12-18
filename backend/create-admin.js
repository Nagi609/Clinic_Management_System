// Create or upsert an admin user
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const email = 'sorsuclinic@gmail.com'
  const username = 'sorsuclinic'
  const password = 'Sorsuclinic@2025'
  const hashed = await bcrypt.hash(password, 10)

  // Check if admin exists
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    // If existing user has no numericId, assign one
    if (!existing.numericId || existing.numericId === 0) {
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
      await prisma.user.update({ where: { email }, data: { numericId: nextNumericId } })
      console.log(`Assigned numericId=${nextNumericId} to existing admin`)
    }

    const user = await prisma.user.update({
      where: { email },
      data: {
        username,
        password: hashed,
        fullName: 'SorSU Clinic',
        role: 'admin',
      },
    })
    console.log('Admin updated:', user.username, user.email)
  } else {
    // Determine smallest available positive numericId (ignore 0)
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
      data: {
        username,
        email,
        password: hashed,
        fullName: 'SorSU Clinic',
        role: 'admin',
        numericId: nextNumericId,
      },
    })
    console.log('Admin created:', user.username, user.email)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
