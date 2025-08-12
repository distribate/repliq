import { logRouting } from "#lib/helpers"
import { wrapTitle } from "@repo/lib/utils/wrap-title"
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

  config(metadata())
}