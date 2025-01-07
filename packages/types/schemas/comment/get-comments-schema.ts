import { z } from "zod";

export const getCommentsSchema = z.object({
  limit: z.string().transform(Number).optional(),
  cursor: z.string().optional(),
})