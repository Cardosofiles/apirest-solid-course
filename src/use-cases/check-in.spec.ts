import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Prisma } from '@/generated/prisma/client.js';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js';
import { CheckInUseCase } from '@/use-cases/check-in.js';

let inMemoryCheckInsRepository: InMemoryCheckInsRepository;
let inMemoryGymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

const userLatitude = new Prisma.Decimal(-18.9539707);
const userLongitude = new Prisma.Decimal(-48.2740856);

const gymLatitude = new Prisma.Decimal(-18.9640372);
const gymLongitude = new Prisma.Decimal(-48.2641501);

describe('Check-in Use Case', () => {
  beforeEach(() => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository();
    inMemoryGymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(inMemoryCheckInsRepository, inMemoryGymsRepository);

    inMemoryGymsRepository.items.push({
      id: 'gym-01',
      title: 'JavaScript Gym',
      latitude: gymLatitude,
      longitude: gymLongitude,
      description: '',
      phone: '',
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -18.9539707,
      userLongitude: -48.2740856,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2026, 4, 26, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -18.9539707,
      userLongitude: -48.2740856,
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -18.9539707,
        userLongitude: -48.2740856,
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2026, 4, 26, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -18.9539707,
      userLongitude: -48.2740856,
    });

    vi.setSystemTime(new Date(2026, 4, 27, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -18.9539707,
      userLongitude: -48.2740856,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
