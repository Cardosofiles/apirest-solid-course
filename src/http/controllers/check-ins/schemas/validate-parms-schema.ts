import { z } from 'zod';

export const validateCheckInParamsSchema = z.object({
  checkInId: z.string().uuid(),
});
