import { randomUUID } from 'node:crypto';

import { buildApp } from '@/app.js';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('AuthenticateController (e2e)', () => {
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should authenticate an existing user', async () => {
    const email = `${randomUUID()}@example.com`;

    await request(app.server).post('/users').send({
      name: 'John Doe',
      email,
      password: 'password123',
    });

    const response = await request(app.server).post('/sessions').send({
      email,
      password: 'password123',
    });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });
});
