import { z } from "zod/v4";

export const replyCommentBodySchema = z.object({
  recipient_comment_id: z.string(),
  content: z.string(),
  parent_type: z.enum(["thread", "post"]),
  parent_id: z.string(),
})