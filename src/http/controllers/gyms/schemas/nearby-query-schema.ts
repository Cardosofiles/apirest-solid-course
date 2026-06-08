import { z } from 'zod';

export const nearbyGymsQuerySchema = z.object({
  latitude: z.number().refine((value) => {
    return Math.abs(value) <= 90;
  }),
  longitude: z.number().refine((value) => {
    return Math.abs(value) <= 180;
  }),
});
