import { z } from "zod"

export const getAlertsSchema = z.object({
  limit: z.string().transform(Number).optional(),
  cursor: z.string().optional()
})