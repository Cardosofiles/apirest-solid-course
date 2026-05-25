import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import { prisma } from '@/db/prisma.js';
import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import z from 'zod';

export async function buildApp() {
  // ─── Fastify Instance ─────────────────────────────────────────────────────
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
      ...(process.env.NODE_ENV === 'development' && {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname',
          },
        },
      }),
    },
  }).withTypeProvider<ZodTypeProvider>();

  // ─── Zod Compilers ────────────────────────────────────────────────────────
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // ─── Plugins ──────────────────────────────────────────────────────────────

  // ─── Rotas ────────────────────────────────────────────────────────────────

  app.post('/users', async (request, reply) => {
    const registerBodySchema = z.object({
      name: z.string(),
      email: z.email(),
      password: z.string().min(6),
    });

    const { name, email, password } = registerBodySchema.parse(request.body);

    await prisma.user.create({
      data: {
        name,
        email,
        password_hash: password,
      },
    });

    return reply.status(201).send({ message: 'User created successfully' });
  });

  return app;
}
