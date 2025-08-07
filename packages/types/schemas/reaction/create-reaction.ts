import * as z from "zod";

export const createReactionSchema = z.object({
  emoji: z.string(),
  type: z.enum(["thread", "post"]),
  id: z.string(),
})