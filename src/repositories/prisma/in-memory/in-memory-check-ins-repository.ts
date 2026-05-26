import { randomUUID } from 'node:crypto';

import type { CheckIn, Prisma } from '@/generated/prisma/client.js';
import type { CheckInsRepository } from '@/repositories/check-ins-repository.js';

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = [];

  async findByUserIdOnDate(userId: string, date: Date) {
    const checkInOnSameDate = this.items.find((checkIn) => {
      const isSameUser = checkIn.user_id === userId;
      const isSameDate =
        checkIn.created_at.getUTCFullYear() === date.getUTCFullYear() &&
        checkIn.created_at.getUTCMonth() === date.getUTCMonth() &&
        checkIn.created_at.getUTCDate() === date.getUTCDate();

      return isSameUser && isSameDate;
    });

    return checkInOnSameDate || null;
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    };

    this.items.push(checkIn);

    return checkIn;
  }
}
