import type { FastifyInstance } from 'fastify';

import { authenticateController } from '@/http/controllers/authenticate.js';
import { profile } from '@/http/controllers/profile.js';
import { registerController } from '@/http/controllers/register.js';

export async function appRoutes(app: FastifyInstance) {
  /** Public routes */
  app.post('/users', registerController);
  app.post('/sessions', authenticateController);

  /** Authenticated routes */
  app.get('/me', profile);
}
