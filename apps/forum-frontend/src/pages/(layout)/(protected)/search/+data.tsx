import { logRouting } from "#lib/helpers"
import { validatePage } from "#lib/validation"
import { wrapTitle } from "@repo/lib/utils/wrap-title"
import { useConfig } from "vike-react/useConfig"
import { PageContextServer } from "vike/types"

function metadata() {
  return {
    title: wrapTitle(`Поиск`),
    Head: (
      <>
        <link rel="canonical" href="https://fasberry.su/search" />
        <meta property="og:url" content="https://fasberry.su/search" />
      </>
    )
  }
}

export const data = async (pageContext: PageContextServer) => {
  logRouting("(protected) (search)", "data")

  const config = useConfig()

  config(metadata())

  validatePage(pageContext)
}