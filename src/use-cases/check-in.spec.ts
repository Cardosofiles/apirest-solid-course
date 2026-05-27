import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js';
import { CheckInUseCase } from '@/use-cases/check-in.js';
import { Decimal } from '@prisma/client/runtime/client';

let inMemoryCheckInsRepository: InMemoryCheckInsRepository;
let inMemoryGymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

const userLatitude = new Decimal(-18.9575168);
const userLongitude = new Decimal(-48.2756885);

const gymLatitude = new Decimal(-18.9573718);
const gymLongitude = new Decimal(-48.28035);

const gymLatitude2 = new Decimal(-18.9304625);
const gymLongitude2 = new Decimal(-48.2783065);

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
      userLatitude: userLatitude.toNumber(),
      userLongitude: userLongitude.toNumber(),
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2026, 4, 26, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: userLatitude.toNumber(),
      userLongitude: userLongitude.toNumber(),
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: userLatitude.toNumber(),
        userLongitude: userLongitude.toNumber(),
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2026, 4, 26, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: userLatitude.toNumber(),
      userLongitude: userLongitude.toNumber(),
    });

    vi.setSystemTime(new Date(2026, 4, 27, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: userLatitude.toNumber(),
      userLongitude: userLongitude.toNumber(),
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in on distance gym', async () => {
    inMemoryGymsRepository.items.push({
      id: 'gym-02',
      title: 'JavaScript Gym 2',
      latitude: gymLatitude2,
      longitude: gymLongitude2,
      description: '',
      phone: '',
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: userLatitude.toNumber(),
        userLongitude: userLongitude.toNumber(),
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
