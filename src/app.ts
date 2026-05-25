import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

import { env } from '@/config/env.js';
import { appRoutes } from '@/http/routes.js';
import z, { ZodError } from 'zod';

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
  app.register(appRoutes);

  // ─── Erros Handler ────────────────────────────────────────────────────────
  app.setErrorHandler(async (error, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: 'Validation error',
        issues: z.treeifyError(error),
      });
    }

    if (env.NODE_ENV !== 'production') {
      console.error(error);
    } else {
      // TODO: Logar o erro em um serviço de monitoramento, como Sentry, Datadog, etc.
    }

    return reply.status(500).send({
      message: 'Internal server error',
    });
  });

  return app;
}
