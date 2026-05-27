import type { CheckIn } from '@/generated/prisma/client.js';
import type { CheckInsRepository } from '@/repositories/check-ins-repository.js';
import type { GymsRepository } from '@/repositories/gyms-repository.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates.js';

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId);
    if (!gym) {
      throw new ResourceNotFoundError();
    }

    const MAX_DISTANCE_IN_KILOMETERS = 0.5; // 500 meters
    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() },
    );
    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new Error();
    }

    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(userId, new Date());
    if (checkInOnSameDate) {
      throw new Error();
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    });

    return {
      checkIn,
    };
  }
}
