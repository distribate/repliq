import { z } from 'zod';

export const queryRouteSchema = z.object({
  ascending: z.string().transform(Boolean),
  searchQuery: z.string().optional(),
  range: z.string().transform((val) => {
    return val.split(',').map(Number);
  })
})