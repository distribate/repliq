import { z } from "zod/v4";

export const createFriendRequestSchema = z.object({
  recipient: z.string(),
  friend_id: z.string().optional(),
});
