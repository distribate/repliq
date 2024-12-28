import { z } from "zod";
import { queryRouteSchema } from "../global/query-route-schema";

export const getUserFriendsSchema = z.object({
  with_details: z.string().transform((val) => val === "true"),
  sort_type: z.enum(["donate_weight", "created_at"]).optional()
}).merge(queryRouteSchema)