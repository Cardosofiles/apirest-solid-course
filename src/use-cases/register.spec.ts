import { compare } from 'bcryptjs';
import { describe, expect, it } from 'vitest';

import { RegisterUseCase } from '@/use-cases/register.js';

describe('Register Use Case', () => {
  it('should hash user password upon registration', async () => {
    // const prismaUsersRepository = new PrismaUsersRepository();
    const registerUseCase = new RegisterUseCase({
      async findByEmail() {
        return null;
      },

      async create(data) {
        return {
          id: 'user-id',
          name: data.name,
          email: data.email,
          password_hash: data.password_hash,
          created_at: new Date(),
        };
      },
    });

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'securepassword',
    });

    const isPasswordCorrectlyHashed = await compare('securepassword', user.password_hash);
    expect(isPasswordCorrectlyHashed).toBe(true);
  });
});
