import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js';
import { CheckInUseCase } from '@/use-cases/check-in.js';

let inMemoryCheckInsRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;

describe('Check-in Use Case', () => {
  beforeEach(() => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInUseCase(inMemoryCheckInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2026, 4, 26, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2026, 4, 26, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    });

    vi.setSystemTime(new Date(2026, 4, 27, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
