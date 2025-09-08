import { logRouting } from "#lib/utils";
import { defineGlobalState } from "#lib/validation";
import { PageContextServer } from "vike/types";

export const onCreatePageContext = async (pageContext: PageContextServer) => {
  logRouting("(global)", "onCreatePageContext")
  await defineGlobalState(pageContext)
}