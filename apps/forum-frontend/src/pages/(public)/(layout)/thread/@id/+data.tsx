import { getThreadModel } from "#components/thread/thread-main/models/thread.model"
import { logRouting } from "#lib/helpers"
import { serializeNodes } from "@repo/lib/helpers/nodes-serializer"
import { createIdLink } from "@repo/lib/utils/create-link"
import { logger } from "@repo/lib/utils/logger"
import { wrapTitle } from "@repo/lib/utils/wrap-title"
import { KEYWORDS } from "@repo/shared/constants/meta"
import { ThreadDetailed } from "@repo/types/entities/thread-type"
import { useConfig } from "vike-react/useConfig"
import { render } from "vike/abort"
import { PageContextServer } from "vike/types"

export type Data = Awaited<ReturnType<typeof data>>

function metadata(thread: ThreadDetailed) {
  const image = "/preview.jpg"

  const title = thread.title.length >= 128 ? thread.title.slice(0, 128) + '...' : thread.title
  const threadContent = thread.content;
  const description = thread?.description ?? threadContent ? `${serializeNodes(threadContent).slice(0, 160)}...` : "..."
  // const images = []
  // const imagesIsExists = images && images.length >= 1

  const keywords = `Repliq thread, ${title} thread, ${title}, ${thread.owner.nickname}`
  const url = `https://fasberry.su${createIdLink("thread", thread.id)}`

  return {
    title: wrapTitle(title),
    description,
    Head: (
      <>
        <meta name="keywords" content={keywords.concat(', ' + KEYWORDS)} />
        <meta property="og:title" content={wrapTitle(title)} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="600" />
        <meta property="og:image:alt" content="image" />
        <meta property="og:image:type" content="image/png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={wrapTitle(title)} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
      </>
    )
  }
}

export const data = async (pageContext: PageContextServer) => {
  logRouting("(public) thread", "data");

  const headers = pageContext.headers;
  const param = pageContext.routeParams.id

  if (!headers) {
    throw render("/")
  }

  const config = useConfig();

  let data: ThreadDetailed | null = null;

  try {
    const res = await getThreadModel(param, { headers })

    if (!res) {
      throw new Error("Result is null")
    }

    data = res
  } catch (e) {
    logger.error(e)
  }

  if (!data) {
    throw render("/not-exist")
  }

  config(metadata(data))

  return {
    data,
    id: data.id
  }
}