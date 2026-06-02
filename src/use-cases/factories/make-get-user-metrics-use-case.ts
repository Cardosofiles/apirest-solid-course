import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repositor.js';
import { GetUserMetricsUseCase } from '@/use-cases/get-user-metrics.js';

export function makeGetUserMetricsUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const useCase = new GetUserMetricsUseCase(checkInsRepository);

  return useCase;
}
