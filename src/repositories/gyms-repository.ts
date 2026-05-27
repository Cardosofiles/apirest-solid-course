import type { Gym } from '@/generated/prisma/client.js';

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>;
  // findByEmail(email: string): Promise<Gym | null>;
  // create(data: Prisma.GymCreateInput): Promise<Gym>;
}
