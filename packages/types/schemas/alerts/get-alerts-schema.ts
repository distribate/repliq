import { z } from "zod/v4"

export const getAlertsSchema = z.object({
  limit: z.string().transform(Number).optional(),
  cursor: z.string().optional()
})