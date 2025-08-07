import * as z from "zod";

export const createFriendRequestSchema = z.object({
  recipient: z.string(),
  friend_id: z.string().optional(),
});
