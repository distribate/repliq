import { logRouting } from "#lib/helpers";
import { validatePage } from "#lib/validation";
import { wrapTitle } from "@repo/lib/utils/wrap-title";
import { useConfig } from "vike-react/useConfig";
import { PageContextServer } from "vike/types";

function metadata() {
  return {
    title: wrapTitle("Уведомления")
  }
}

export const data = async (pageContext: PageContextServer) => {
  logRouting("(protected) notifications", "data");

  const config = useConfig();

  config(metadata())

  validatePage(pageContext)
}