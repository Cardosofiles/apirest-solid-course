import type { UsersRepository } from '@/repositories/users-repository.js';

import type { User } from '@/generated/prisma/client.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';

interface GetUserProfileUseCaseRequest {
  userId: string;
}

interface GetUserProfileUseCaseResponse {
  user: User;
}

export class GetUserProfileUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({ userId }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new ResourceNotFoundError();
    }

    return { user };
  }
}
