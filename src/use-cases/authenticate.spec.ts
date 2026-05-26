import { hash } from 'bcryptjs';
import { describe, expect, it } from 'vitest';

import { InMemoryUsersRepository } from '@/repositories/prisma/in-memory/in-memory-users-repository.js';
import { AuthenticateUseCase } from '@/use-cases/authenticate.js';
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credential-erro.js';

describe('Authenticate Use Case', () => {
  it('should be able to authenticate', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(inMemoryUsersRepository);

    await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    });

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('johndoe@example.com');
  });

  it('should not be able to authenticate with wrong email', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(inMemoryUsersRepository);

    expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate with wrong email', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(inMemoryUsersRepository);

    await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    });

    expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
