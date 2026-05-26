import { compare } from 'bcryptjs';
import { describe, expect, it } from 'vitest';

import { InMemoryUsersRepository } from '@/repositories/prisma/in-memory/in-memory-users-repository.js';
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error.js';
import { RegisterUseCase } from '@/use-cases/register.js';

describe('Register Use Case', () => {
  it('should be able to register a user', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(inMemoryUsersRepository);

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'securepassword',
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john.doe@example.com');
  });

  it('should hash user password upon registration', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(inMemoryUsersRepository);

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'securepassword',
    });

    const isPasswordCorrectlyHashed = await compare('securepassword', user.password_hash);
    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to register with same email twice', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(inMemoryUsersRepository);

    await registerUseCase.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'securepassword',
    });

    await expect(
      registerUseCase.execute({
        name: 'Jane Doe',
        email: 'john.doe@example.com',
        password: 'securepassword',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
