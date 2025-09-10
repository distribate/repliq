import { getStats } from "#components/widgets/forum-stats/models/forum-stats.model";
import { useConfig } from "vike-react/useConfig";
import { PageContextServer } from "vike/types";

export type Data = Awaited<ReturnType<typeof data>>

function metadata() {
  return {
    title: "Repliq - социальная платформа"
  }
}

export const data = async (pageContext: PageContextServer) => {
  const headers = pageContext.headers ?? undefined

  const config = useConfig()
  config(metadata())
  
  const data = await getStats({ headers })

  return {
    data
  }
}