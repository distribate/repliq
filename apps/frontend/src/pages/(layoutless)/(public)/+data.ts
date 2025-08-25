import { logRouting } from "#lib/helpers";
import { PageContextServer } from "vike/types";

// Default +data hook
// for pages that don't have this hook
export const data = async (pageContext: PageContextServer) => {
  logRouting("(public)", "data")
}