import type { FastifyReply, FastifyRequest } from 'fastify';

import { searchGymsQuerySchema } from '@/http/controllers/gyms/schemas/search-query-schema.js';
import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case.js';

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const { q, page } = searchGymsQuerySchema.parse(request.query);

  const searchGymsUseCase = makeSearchGymsUseCase();

  const { gyms } = await searchGymsUseCase.execute({
    query: q,
    page,
  });

  return reply.status(200).send({ gyms });
}
