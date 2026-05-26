import type { FastifyReply, FastifyRequest } from 'fastify';

import { authenticateBodySchema } from '@/http/schemas/authenticate-body-schema.js';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository.js';
import { AuthenticateUseCase } from '@/use-cases/authenticate.js';
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credential-erro.js';

export async function authenticateController(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const usersRepository = new PrismaUsersRepository();
    const authenticateUseCase = new AuthenticateUseCase(usersRepository);

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
