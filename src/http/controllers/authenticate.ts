import type { FastifyReply, FastifyRequest } from 'fastify';

import { authenticateBodySchema } from '@/http/schemas/authenticate-body-schema.js';
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credential-erro.js';
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case.js';

export async function authenticateController(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase();

    await authenticateUseCase.execute({
      email,
      password,
    });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message });
    }

    throw err;
  }

  return reply.status(200).send();
}
