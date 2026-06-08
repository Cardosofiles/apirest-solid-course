import { buildApp } from '@/app.js';
import { prisma } from '@/db/prisma.js';
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user.js';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Validate Check-in (e2e)', () => {
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to validate a check-in', async () => {
    const { token, userId } = await createAndAuthenticateUser(app, true);

    const gym = await prisma.gym.create({
      data: {
        title: `JavaScript Gym ${userId}`,
        latitude: -27.2092052,
        longitude: -49.6401091,
      },
    });

    let checkIn = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: userId,
      },
    });

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(204);

    checkIn = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id,
      },
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
  });
});
