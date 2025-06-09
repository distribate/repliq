import { z } from "zod/v4";

export const getFriendsRequestSchema = z.object({
  type: z.enum(["incoming", "outgoing"]),
  cursor: z.string().optional()
});