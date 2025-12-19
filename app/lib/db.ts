import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma?: PrismaClient }

let prismaInstance: PrismaClient | null = null

try {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
  }
  prismaInstance = globalForPrisma.prisma

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance
  }
} catch (error) {
  console.error('Failed to initialize Prisma Client:', error)
  throw error
}

export const prisma = prismaInstance!
export { prismaInstance as default }
export { prismaInstance }
