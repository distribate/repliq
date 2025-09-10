import { logRouting } from "#shared/utils/log"
import { useConfig } from 'vike-react/useConfig'
import { PageContextServer } from "vike/types"

function metadata() {
  return {
    title: "Главная"
  } 
}

export const data = async (pageContext: PageContextServer) => {
  logRouting("home", "data")

  const config = useConfig()
  const headers = pageContext.headers ?? undefined;
  
  config(metadata())
}