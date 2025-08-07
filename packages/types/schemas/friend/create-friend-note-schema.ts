import * as z from "zod";

export const addFriendNoteSchema = z.object({
  friend_id: z.string(),
  recipient: z.string(),
  message: z.string(),
})
