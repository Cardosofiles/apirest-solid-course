export {};

declare module 'fastify' {
  interface FastifyInstance {
    db: import('../generated/prisma/client').PrismaClient;
  }

  interface FastifyRequest {
    user: import('../auth').Session['user'] | null;
    session: import('../auth').Session['session'] | null;
  }
}
