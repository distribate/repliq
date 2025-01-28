import { z } from "zod";

export const getUserFriendsSchema = z.object({
  with_details: z.enum(["true", "false"]).transform((value) => value === "true"),
  ascending: z.enum(["true", "false"]).transform((value) => value === "true"),
  cursor: z.string().optional(),
  limit: z.string().transform(Number).optional(),
  sort_type: z.enum(["donate_weight", "created_at"]),
});