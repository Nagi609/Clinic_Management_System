import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma?: PrismaClient }

let prismaInstance: PrismaClient

try {
  if (!globalForPrisma.prisma) {
    console.log('[Prisma] Initializing new PrismaClient')
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
    console.log('[Prisma] PrismaClient initialized successfully')
  } else {
    console.log('[Prisma] Reusing existing PrismaClient')
  }

  prismaInstance = globalForPrisma.prisma
} catch (error) {
  console.error('[Prisma] Failed to initialize PrismaClient:', error)
  throw error
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prismaInstance
}

export const prisma = prismaInstance
export default prisma
