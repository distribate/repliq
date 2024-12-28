import { z } from 'zod';

export const queryRouteSchema = z.object({
  ascending: z.string()
  .refine(val => val === "true" || val === "false", {
    message: "Invalid value, must be 'true' or 'false'"
  })
  .transform(val => val === "true"),  // Преобразование строки в boolean,
  searchQuery: z.string().optional(),
  range: z.string().transform((val) => {
    return val.split(',').map(Number);
  })
})