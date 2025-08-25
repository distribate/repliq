import { logRouting } from "#lib/helpers";
import { validatePage } from "#lib/validation";
import { wrapTitle } from "#lib/wrap-title";
import { useConfig } from "vike-react/useConfig";
import { PageContextServer } from "vike/types";

function metadata() {
  return {
    title: wrapTitle("1")
  }
}

export const data = async (pageContext: PageContextServer) => {
  logRouting("(protected) (category)", "data");

  const config = useConfig()

  config(metadata());

  validatePage(pageContext)
}