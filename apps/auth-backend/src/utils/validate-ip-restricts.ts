import { MAX_USERS_PER_IP } from "../shared/constants/limits";
import { authDB } from "../shared/database/auth-db";

export async function validateIpRestricts(ip: string): Promise<boolean> {
  const result = await authDB
    .selectFrom("AUTH")
    .select(authDB.fn.countAll().as("count"))
    .where("IP", "=", ip)
    .$castTo<{ count: number }>()
    .executeTakeFirst();

  if (!result) return false;

  return result.count > MAX_USERS_PER_IP;
}