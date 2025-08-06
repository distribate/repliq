import { getUserProfile, RequestedUserFull } from "#components/profile/main/models/requested-user.model"
import { CURRENT_USER_ATOM_KEY } from "#components/user/models/current-user.model"
import { logRouting } from "#lib/helpers"
import { PersistRecord } from "@reatom/persist"
import { createIdLink } from "@repo/lib/utils/create-link"
import { logger } from "@repo/lib/utils/logger"
import { wrapTitle } from "@repo/lib/utils/wrap-title"
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

  console.log(url);

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
      throw new Error("Result is null")
    }

    data = res;
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === 'not-exist') {
        const currentUser = (
          pageContext.snapshot[CURRENT_USER_ATOM_KEY] as PersistRecord<{ nickname: string }> | undefined
        )?.data ?? null;

        if (currentUser) {
          throw render(`/not-exist?redirect_nickname=${currentUser.nickname}`)
        }

        throw render(`/`)
      }
    }
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