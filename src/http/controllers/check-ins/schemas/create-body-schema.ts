import { z } from 'zod';

export const createCheckInParamsSchema = z.object({
  gymId: z.uuid(),
});

export const createCheckInBodySchema = z.object({
  latitude: z.number().refine((value) => {
    return Math.abs(value) <= 90;
  }),
  longitude: z.number().refine((value) => {
    return Math.abs(value) <= 180;
  }),
});
