import { logRouting } from "#shared/utils/log"
import { validatePage } from "#shared/lib/validation"
import { useConfig } from "vike-react/useConfig"
import { PageContextServer } from "vike/types"

function metadata() {
  return {
    title: `Поиск`,
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