import { z } from "zod/v4";

export const createCommentSchema = z.object({
  parent_type: z.enum(["thread", "post"]),
  parent_id: z.string(),
  content: z.string()
})