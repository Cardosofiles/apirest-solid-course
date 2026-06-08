import { randomUUID } from 'node:crypto';

import { buildApp } from '@/app.js';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('ProfileController (e2e)', () => {
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to get profile information for an authenticated user', async () => {
    const email = `${randomUUID()}@example.com`;

    await request(app.server).post('/users').send({
      name: 'John Doe',
      email,
      password: 'password123',
    });

    const authResponse = await request(app.server).post('/sessions').send({
      email,
      password: 'password123',
    });

    const { token } = authResponse.body;

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(profileResponse.status).toEqual(200);
    expect(profileResponse.body).toEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          email,
        }),
      }),
    );
  });
});
