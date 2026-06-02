import '@fastify/jwt';
import 'fastify-jwt';

declare module 'fastify' {
  interface FastifyInstance {
    db: import('../generated/prisma/client').PrismaClient;
  }

  interface FastifyRequest {
    user: import('../auth').Session['user'] | null;
    session: import('../auth').Session['session'] | null;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      sub: string;
    };
  }
}
