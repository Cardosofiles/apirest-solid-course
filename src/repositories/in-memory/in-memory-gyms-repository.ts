import type { Gym } from '@/generated/prisma/client.js';
import type { GymsRepository } from '@/repositories/gyms-repository.js';

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = [];

  async findById(id: string): Promise<Gym | null> {
    const gym = this.items.find((item) => item.id === id);
    return gym || null;
  }
}
