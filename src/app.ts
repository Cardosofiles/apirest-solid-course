import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

import { appRoutes } from '@/http/routes.js';

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

  return app;
}
