import type { FastifyReply, FastifyRequest } from 'fastify';

import { validateCheckInParamsSchema } from '@/http/controllers/check-ins/schemas/validate-parms-schema.js';
import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case.js';

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const { checkInId } = validateCheckInParamsSchema.parse(request.params);

  const validateCheckInUseCase = makeValidateCheckInUseCase();

  await validateCheckInUseCase.execute({
    checkInId,
  });

  return reply.status(204).send();
}
