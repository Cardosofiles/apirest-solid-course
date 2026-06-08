import type { FastifyReply, FastifyRequest } from 'fastify';

import { createGymBodySchema } from '@/http/controllers/gyms/schemas/create-body-schema.js';
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case.js';

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const { title, description, phone, latitude, longitude } = createGymBodySchema.parse(
    request.body,
  );

  const createGymUseCase = makeCreateGymUseCase();

  await createGymUseCase.execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  });

  return reply.status(201).send();
}
