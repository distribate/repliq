import { z } from "zod/v4";

export const createReactionSchema = z.object({
  emoji: z.string(),
  type: z.enum(["thread", "post"]),
  id: z.string(),
})