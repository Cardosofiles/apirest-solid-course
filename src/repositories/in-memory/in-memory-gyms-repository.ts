import { Decimal } from '@prisma/client/runtime/client';
import { randomUUID } from 'node:crypto';

import type { Gym, Prisma } from '@/generated/prisma/client.js';
import type { GymsRepository } from '@/repositories/gyms-repository.js';

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = [];

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
      created_at: new Date(),
    };

    this.items.push(gym);

    return gym;
  }

  async findById(id: string): Promise<Gym | null> {
    const gym = this.items.find((item) => item.id === id);
    return gym || null;
  }
}
