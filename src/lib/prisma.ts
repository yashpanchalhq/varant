import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  // Prisma 7 uses DATABASE_URL from environment automatically if not using Accelerate/Adapter
  // We'll leave it empty to use default behavior or pass it via datasources if needed
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;