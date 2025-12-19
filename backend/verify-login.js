// Simple script to verify login against the Prisma user created earlier
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const usernameOrEmail = process.argv[2]
  const password = process.argv[3]

  if (!usernameOrEmail || !password) {
    console.error('Usage: node verify-login.js <username|email> <password>')
    process.exit(1)
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    }
  })

  if (!user) {
    console.error('User not found')
    process.exit(2)
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    console.error('Password does not match')
    process.exit(3)
  }

  const { password: _, ...userSafe } = user
  console.log('Login verified. User:', userSafe)
}

main()
  .catch((e) => {
    console.error('Error during verification:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
