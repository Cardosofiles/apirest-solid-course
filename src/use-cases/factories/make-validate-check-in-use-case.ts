import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repositor.js';
import { ValidateCheckInUseCase } from '@/use-cases/validate-check-in.js';

export function makeValidateCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const useCase = new ValidateCheckInUseCase(checkInsRepository);

  return useCase;
}
