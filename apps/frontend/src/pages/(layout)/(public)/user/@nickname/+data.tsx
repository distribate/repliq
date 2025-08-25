import { getUserProfile, RequestedUserFull } from "#components/profile/main/models/requested-user.model"
import { logRouting } from "#lib/helpers"
import { createIdLink } from "#lib/create-link"
import { logger } from "@repo/shared/utils/logger.ts"
import { wrapTitle } from "#lib/wrap-title"
import { KEYWORDS } from "@repo/shared/constants/meta"
import { useConfig } from "vike-react/useConfig"
import { render } from "vike/abort"
import { PageContextServer } from "vike/types"

export type Data = Awaited<ReturnType<typeof data>>

function metadata({ nickname, ...user }: RequestedUserFull) {
  const image = user.avatar ?? "/preview.jpg"

  const description = `Профиль ${nickname}. ${user.description ? `О себе: ${user.description}` : null}`
  const keywords = `Repliq profile, ${nickname} profile, ${nickname}, пользователь ${nickname}`
  const url = `https://fasberry.su${createIdLink("user", nickname)}`

  return {
    title: wrapTitle(nickname),
    description,
    Head: (
      <>
        <meta name="keywords" content={keywords.concat(', ' + KEYWORDS)} />
        <meta property="og:title" content={wrapTitle(nickname)} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="600" />
        <meta property="og:image:alt" content="image" />
        <meta property="og:image:type" content="image/png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={wrapTitle(nickname)} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
      </>
    )
  }
}

export const data = async (
  { headers, ...pageContext }: PageContextServer
) => {
  logRouting("(public) user.@nickname", "data")
  const param = pageContext.routeParams.nickname;
  const config = useConfig()

  if (!headers) {
    throw render("/")
  }

  let data: RequestedUserFull | null = null;;

  try {
    const res = await getUserProfile(param, { headers });

    if (!res) {
      throw render(404)
    }

    data = res as RequestedUserFull;;
  } catch (e) {
    logger.error(e)
  }

  if (!data) {
    throw render("/")
  }

  config(metadata(data))
  
  return {
    data,
    nickname: data.nickname
  }
}