import { compare } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js';
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error.js';
import { RegisterUseCase } from '@/use-cases/register.js';

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe('Register Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(inMemoryUsersRepository);
  });

  it('should be able to register a user', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'securepassword',
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john.doe@example.com');
  });

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'securepassword',
    });

    const isPasswordCorrectlyHashed = await compare('securepassword', user.password_hash);
    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to register with same email twice', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'securepassword',
    });

    await expect(
      sut.execute({
        name: 'Jane Doe',
        email: 'john.doe@example.com',
        password: 'securepassword',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
