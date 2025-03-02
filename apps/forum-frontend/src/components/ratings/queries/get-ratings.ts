import { ratingClient } from "@repo/shared/api/minecraft-client";
import type { InferResponseType, InferRequestType } from "hono/client"

const client = ratingClient.rating["get-rating-by"].$get

export type GetRatingsResponse = InferResponseType<typeof client, 200>

export type GetRatings = InferRequestType<typeof client>["query"]

export const RATINGS_LIMIT = 50;

export async function getRatings({
  type, cursor, ascending
}: Omit<GetRatings, "limit">) {
  const res = await ratingClient.rating["get-rating-by"].$get({
    query: { type, limit: RATINGS_LIMIT.toString(), cursor, ascending }
  })

  const data = await res.json()

  if ("error" in data) {
    return null
  }

  return data
}