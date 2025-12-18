const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } })
  for (let i = 0; i < users.length; i++) {
    const num = i + 1
    await prisma.user.update({ where: { id: users[i].id }, data: { numericId: num } })
    console.log(`Set numericId=${num} for user ${users[i].username}`)
  }
  console.log('Backfill complete')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
