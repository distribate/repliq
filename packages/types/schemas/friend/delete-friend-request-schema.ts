import { z } from "zod";

export const deleteFriendRequestSchema = z.object({
  request_id: z.string()
})
