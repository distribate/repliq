import { logRouting } from "#shared/utils/log";
import { validateAdmin } from "#shared/lib/validation";
import { render } from "vike/abort";
import { PageContextServer } from "vike/types";

export const guard = async (pageContext: PageContextServer) => {
  logRouting("(protected) (admin)", "guard");

  const headers = pageContext.headers;

  if (!headers) {
    return;
  }

  const isAuth = await validateAdmin({ headers })

  if (!isAuth) {
    throw render("/")
  }
}