import { logRouting } from "#lib/utils"
import { wrapTitle } from "#lib/utils"
import { useConfig } from 'vike-react/useConfig'
import { PageContextServer } from "vike/types"

function metadata() {
  return {
    title: wrapTitle("Главная")
  } 
}

export const data = async (pageContext: PageContextServer) => {
  logRouting("home", "data")

  const config = useConfig()
  const headers = pageContext.headers ?? undefined;
  
  config(metadata())
}