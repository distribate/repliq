import { logRouting } from "#shared/utils/log"
import { validatePage } from "#shared/lib/validation"
import { useConfig } from "vike-react/useConfig"
import { PageContextServer } from "vike/types"

function metadata() {
  return {
    title: "Коллекции",
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