import { randomUUID } from 'node:crypto';

import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user.js';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { buildApp } from '@/app.js';

describe('Nearby Gyms (e2e)', () => {
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const uniqueKey = randomUUID();
    const javascriptGymTitle = `JavaScript Gym ${uniqueKey}`;
    const typescriptGymTitle = `TypeScript Gym ${uniqueKey}`;
    const coordinateSeed = Number.parseInt(uniqueKey.slice(0, 8), 16);
    const baseLatitude = -80 + (coordinateSeed % 4000) / 100;
    const baseLongitude = -170 + (coordinateSeed % 8000) / 100;

    await request(app.server).post('/gyms').set('Authorization', `Bearer ${token}`).send({
      title: javascriptGymTitle,
      description: 'Some description.',
      phone: '1199999999',
      latitude: baseLatitude,
      longitude: baseLongitude,
    });

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: typescriptGymTitle,
        description: 'Some description.',
        phone: '1199999999',
        latitude: baseLatitude + 0.2,
        longitude: baseLongitude + 0.2,
      });

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: baseLatitude,
        longitude: baseLongitude,
      })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: javascriptGymTitle,
      }),
    ]);
  });
});
