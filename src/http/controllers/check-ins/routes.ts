import type { FastifyInstance } from 'fastify';

import { create } from '@/http/controllers/check-ins/create.js';
import { history } from '@/http/controllers/check-ins/history.js';
import { metrics } from '@/http/controllers/check-ins/metrics.js';
import { validate } from '@/http/controllers/check-ins/validate.js';
import { verifyJwt } from '@/http/middlewares/verify-jwt.js';
import { verifyUserRole } from '@/http/middlewares/verify-user-role.js';

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt);

  app.get('/check-ins/history', history);
  app.get('/check-ins/metrics', metrics);

  app.post('/gyms/:gymId/check-ins', create);
  app.patch('/check-ins/:checkInId/validate', { onRequest: [verifyUserRole('ADMIN')] }, validate);
}
