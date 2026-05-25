import { type FastifyReply, type FastifyRequest } from 'fastify';

import z from 'zod';

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository.js';
import { RegisterUseCase } from '@/use-cases/register.js';

export async function registerController(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const userRepository = new PrismaUsersRepository();
    const registerUseCase = new RegisterUseCase(userRepository);

    await registerUseCase.execute({ name, email, password });
  } catch (e) {
    return reply.status(409).send({ message: 'Email already in use' });
  }

  return reply.status(201).send({ message: 'User created successfully' });
}
