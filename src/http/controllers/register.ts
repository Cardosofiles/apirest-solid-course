import { type FastifyReply, type FastifyRequest } from 'fastify';

import { registerBodySchema } from '@/http/schemas/register-body-schema.js';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository.js';
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error.js';
import { RegisterUseCase } from '@/use-cases/register.js';

export async function registerController(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const userRepository = new PrismaUsersRepository();
    const registerUseCase = new RegisterUseCase(userRepository);

    await registerUseCase.execute({ name, email, password });
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }

  return reply.status(201).send({ message: 'Usuário criado com sucesso!' });
}
