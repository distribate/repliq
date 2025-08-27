import { logRouting } from "#lib/helpers";
import { validatePage } from "#lib/validation";
import { PageContextServer } from "vike/types";

// Default +data hook
// for pages that don't have this hook
export const data = async (pageContext: PageContextServer) => {
  logRouting("(protected)", "data")
  validatePage(pageContext)
}