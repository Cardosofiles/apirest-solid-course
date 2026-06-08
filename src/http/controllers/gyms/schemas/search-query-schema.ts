import { z } from 'zod';

export const searchGymsQuerySchema = z.object({
  q: z.string(),
  page: z.coerce.number().min(1).default(1),
});
