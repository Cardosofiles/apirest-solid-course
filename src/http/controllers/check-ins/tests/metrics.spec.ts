import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { buildApp } from '@/app.js';
import { prisma } from '@/db/prisma.js';
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user.js';

describe('Check-in Metrics (e2e)', () => {
  let app: Awaited<ReturnType<typeof buildApp>>;
  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to get the total count of check-ins', async () => {
    const { token, userId } = await createAndAuthenticateUser(app);

    const gym = await prisma.gym.create({
      data: {
        title: `JavaScript Gym ${userId}`,
        latitude: -27.2092052,
        longitude: -49.6401091,
      },
    });

    await prisma.checkIn.createMany({
      data: [
        {
          gym_id: gym.id,
          user_id: userId,
        },
        {
          gym_id: gym.id,
          user_id: userId,
        },
      ],
    });

    const response = await request(app.server)
      .get('/check-ins/metrics')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.checkInsCount).toEqual(2);
  });
});
