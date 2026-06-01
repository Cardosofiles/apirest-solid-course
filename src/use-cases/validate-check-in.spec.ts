import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { ValidateCheckInUseCase } from '@/use-cases/validate-check-in.js';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

let inMemoryCheckInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

describe('Validate Check-in Use Case', () => {
  beforeEach(async () => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(inMemoryCheckInsRepository);

    // vi.useFakeTimers()
  });

  afterEach(() => {
    // vi.useRealTimers()
  });

  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await inMemoryCheckInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(inMemoryCheckInsRepository.items[0]!.validated_at).toEqual(expect.any(Date));
  });

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'inexistent-check-in-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
