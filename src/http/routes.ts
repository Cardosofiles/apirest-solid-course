import type { FastifyInstance } from 'fastify';

import { authenticateController } from '@/http/controllers/authenticate.js';
import { registerController } from '@/http/controllers/register.js';

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', registerController);
  app.post('/sessions', authenticateController);
}
