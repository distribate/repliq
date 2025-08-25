import { logRouting } from "#lib/helpers";
import { validatePage } from "#lib/validation";
import { wrapTitle } from "#lib/wrap-title";
import { useConfig } from "vike-react/useConfig";
import { PageContextServer } from "vike/types";

function metadata() {
  return {
    title: wrapTitle("Друзья")
  }
}

export const data = async (pageContext: PageContextServer) => {
  logRouting("(protected) friends", "data");

  const config = useConfig();

  config(metadata())

  validatePage(pageContext)
}