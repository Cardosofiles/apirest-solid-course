import { randomUUID } from 'node:crypto';

import { buildApp } from '@/app.js';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('RegisterController (e2e)', () => {
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register a new user', async () => {
    const email = `${randomUUID()}@example.com`;

    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      email,
      password: 'password123',
    });
    expect(response.status).toEqual(201);
  });
});
