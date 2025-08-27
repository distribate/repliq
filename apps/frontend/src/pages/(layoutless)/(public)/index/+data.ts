import { getStats } from "#components/layout/components/widgets/forum-stats/models/forum-stats.model";
import { PageContextServer } from "vike/types";

export type Data = Awaited<ReturnType<typeof data>>

export const data = async (pageContext: PageContextServer) => {
  const headers = pageContext.headers ?? undefined

  const data = await getStats({ headers })

  return {
    data
  }
}