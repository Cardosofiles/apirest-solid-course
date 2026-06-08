import type { FastifyReply, FastifyRequest } from 'fastify';

export function verifyUserRole(roleToVerify: 'ADMIN' | 'MEMBER') {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { role } = request.user;

    if (role !== roleToVerify) {
      await reply.status(401).send({ error: 'Sem autorização.' });
    }
  };
}
