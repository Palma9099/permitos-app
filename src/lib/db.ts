// Prisma client with graceful fallback
// When prisma generate hasn't been run or DATABASE_URL isn't set,
// db will be null and the data layer falls back to mock data.

let PrismaClientConstructor: any = null;
try {
  // Dynamic import so the build doesn't fail when @prisma/client isn't generated
  PrismaClientConstructor = require("@prisma/client").PrismaClient;
} catch {
  // @prisma/client not generated yet — that's fine, we'll use mock data
}

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined;
};

function createPrismaClient(): any {
  if (!process.env.DATABASE_URL || !PrismaClientConstructor) return null;
  try {
    return new PrismaClientConstructor({
      log:
        process.env.NODE_ENV === "development"
          ? ["warn", "error"]
          : ["error"],
    });
  } catch {
    console.warn(
      "Failed to create Prisma client — DATABASE_URL may be invalid"
    );
    return null;
  }
}

export const db: any = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production" && db) {
  globalForPrisma.prisma = db;
}
