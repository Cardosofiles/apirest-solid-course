import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js';
import { CreateGymUseCase } from '@/use-cases/create-gym.js';

let inMemoryGymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

const gymLatitude = -18.9141957;
const gymLongitude = -48.2620054;

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(inMemoryGymsRepository);
  });

  it('should to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'JavaScript Gym',
      description: null,
      phone: null,
      latitude: gymLatitude,
      longitude: gymLongitude,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
