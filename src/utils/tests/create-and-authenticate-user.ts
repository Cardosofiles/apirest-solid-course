import type { FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';
import request from 'supertest';

import { prisma } from '@/db/prisma.js';

export async function createAndAuthenticateUser(app: FastifyInstance) {
  const email = `${randomUUID()}@example.com`;

  await request(app.server).post('/users').send({
    name: 'John Doe',
    email,
    password: '123456',
  });

  const authResponse = await request(app.server).post('/sessions').send({
    email,
    password: '123456',
  });

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  });

  const { token } = authResponse.body;

  return {
    token,
    userId: user.id,
  };
}
