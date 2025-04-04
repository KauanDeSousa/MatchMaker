import { PrismaClient } from "@prisma/client";

// Verifica se já existe uma instância do Prisma Client no globalThis
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Cria ou reutiliza a instância existente
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// Em desenvolvimento, salva a instância no globalThis para reutilização
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Garante que o cliente está conectado
prisma.$connect().catch((err) => {
  console.error("Failed to connect to database:", err);
  process.exit(1);
});

