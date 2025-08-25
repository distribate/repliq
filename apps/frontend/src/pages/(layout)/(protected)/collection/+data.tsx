import { logRouting } from "#lib/helpers"
import { validatePage } from "#lib/validation"
import { wrapTitle } from "#lib/wrap-title"
import { useConfig } from "vike-react/useConfig"
import { PageContextServer } from "vike/types"

function metadata() {
  return {
    title: wrapTitle("Коллекции"),
    Head: (
      <>
        <link rel="canonical" href={`https://repliq.fasberry.su/collection`} />
        <meta property="og:url" content={`https://repliq.fasberry.su/collection`} />
      </>
    )
  }
}

export const data = async (pageContext: PageContextServer) => {
  logRouting("(protected) (collection)", "data")

  const config = useConfig()

  config(metadata())

  validatePage(pageContext)
}