import { logRouting } from "#shared/utils/log";
import { defineGlobalState } from "#shared/lib/validation";
import { PageContextServer } from "vike/types";

export const onCreatePageContext = async (pageContext: PageContextServer) => {
  logRouting("(global)", "onCreatePageContext")
  await defineGlobalState(pageContext)
}