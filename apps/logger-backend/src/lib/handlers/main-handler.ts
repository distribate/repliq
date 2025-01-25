import { adminsListMessage } from "../../messages/admins-list.ts";
import { getAdmins } from "../queries/get-admins.ts";
import type { Context } from "./message-handler.ts"

export const sendAdminsList = async (ctx: Context) => {
  const admins = await getAdmins()

  return ctx.send(adminsListMessage(admins));
};