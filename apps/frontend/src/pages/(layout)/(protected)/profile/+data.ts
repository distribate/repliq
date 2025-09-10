import { CURRENT_USER_ATOM_KEY } from "#components/user/models/current-user.model";
import { logRouting } from "#shared/utils/log";
import { createIdLink } from "#shared/helpers/create-link";
import { UserDetailed } from "@repo/types/entities/user-type";
import { redirect } from "vike/abort";
import { PageContextServer } from "vike/types";

export const data = async (pageContext: PageContextServer) => {
  logRouting("(public) profile", "data")

  const user = pageContext.snapshot[CURRENT_USER_ATOM_KEY]?.data as UserDetailed | undefined;

  if (!user) {
    throw redirect("/")
  }

  const url = createIdLink("user", user.nickname)

  throw redirect(url)
}