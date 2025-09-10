import { logRouting } from "#shared/utils/log";
import { validatePage } from "#shared/lib/validation";
import { PageContextServer } from "vike/types";

// Default +data hook
// for pages that don't have this hook
export const data = async (pageContext: PageContextServer) => {
  logRouting("(protected)", "data")
  validatePage(pageContext)
}