import { z } from "zod/v4";

export const deleteFriendRequestSchema = z.object({
  request_id: z.string(),
})
