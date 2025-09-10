import { logRouting } from "#shared/utils/log"
import { useConfig } from "vike-react/useConfig"

function metadata() {
  return {
    title: "Авторизация",
    Head: (
      <>
        <link rel="canonical" href={`https://repliq.fasberry.su/auth`} />
        <meta property="og:url" content={`https://repliq.fasberry.su/auth`} />
      </>
    )
  }
}

export const data = async () => {
  logRouting("auth", "data")

  const config = useConfig()

  config(metadata())
}