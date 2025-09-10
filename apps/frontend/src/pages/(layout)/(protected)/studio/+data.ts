import { logRouting } from "#shared/utils/log";
import { validatePage } from "#shared/lib/validation";
import { useConfig } from "vike-react/useConfig";
import { PageContextServer } from "vike/types";

function metadata() {
  return {
    title: "Студия"
  }
}

export const data = async (pageContext: PageContextServer) => {
  logRouting("(protected) studio", "data");

  const config = useConfig();

  config(metadata())

  validatePage(pageContext)
}