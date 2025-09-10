import { logRouting } from "#shared/utils/log";
import { validatePage } from "#shared/lib/validation";
import { useConfig } from "vike-react/useConfig";
import { PageContextServer } from "vike/types";

function metadata() {
  return {
    title: "Друзья"
  }
}

export const data = async (pageContext: PageContextServer) => {
  logRouting("(protected) friends", "data");

  const config = useConfig();

  config(metadata())

  validatePage(pageContext)
}