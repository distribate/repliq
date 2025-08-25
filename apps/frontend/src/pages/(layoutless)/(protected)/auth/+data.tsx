import { logRouting } from "#lib/helpers"
import { wrapTitle } from "#lib/wrap-title"
import { useConfig } from "vike-react/useConfig"

function metadata() {
  return {
    title: wrapTitle("Авторизация"),
    Head: (
      <>
        <link rel="canonical" href={`https://fasberry.su/auth`} />
        <meta property="og:url" content={`https://fasberry.su/auth`} />
      </>
    )
  }
}

export const data = async () => {
  logRouting("auth", "data")

  const config = useConfig()

  config(metadata())
}