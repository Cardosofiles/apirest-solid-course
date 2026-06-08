import type { FastifyReply, FastifyRequest } from 'fastify';

import { nearbyGymsQuerySchema } from '@/http/controllers/gyms/schemas/nearby-query-schema.js';
import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case.js';

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.body);

  const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase();

  const { gyms } = await fetchNearbyGymsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(200).send({
    gyms,
  });
}
