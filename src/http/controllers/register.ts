import { type FastifyReply, type FastifyRequest } from 'fastify';

import { registerBodySchema } from '@/http/schemas/register-body-schema.js';
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error.js';
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case.js';

export async function registerController(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const registerUseCase = makeRegisterUseCase();

    await registerUseCase.execute({ name, email, password });
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }

  return reply.status(201).send({ message: 'Usuário criado com sucesso!' });
}
