import type { FastifyInstance } from 'fastify';

import { authenticateController } from '@/http/controllers/users/authenticate.js';
import { profile } from '@/http/controllers/users/profile.js';
import { registerController } from '@/http/controllers/users/register.js';
import { verifyJwt } from '@/http/middlewares/verify-jwt.js';

export async function usersRoutes(app: FastifyInstance) {
  /** Public routes */
  app.post('/users', registerController);
  app.post('/sessions', authenticateController);

  /** Authenticated routes */
  app.get('/me', { onRequest: [verifyJwt] }, profile);
}
