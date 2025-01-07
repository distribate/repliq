import { z } from "zod";

export const updateThreadSchema = z.object({
  threadId: z.string(),
  new_title: z.string().optional(),
  new_description: z.string().optional().nullable(),
  new_tags: z.string().optional(),
  is_comments: z.string().transform((val) => val === "true").optional(),
})