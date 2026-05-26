import type { Prisma, User } from '@/generated/prisma/client.js';
import type { UsersRepository } from '@/repositories/users-repository.js';

import { prisma } from '@/db/prisma.js';

export class PrismaUsersRepository implements UsersRepository {
  findById(id: string): Promise<User | null> {
    throw new Error('Método não implementado.');
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    });

    return user;
  }
}
