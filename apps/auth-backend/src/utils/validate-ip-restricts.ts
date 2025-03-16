import { authDB } from "../shared/database/auth-db";

export async function validateIpRestricts(ip: string): Promise<boolean> {
  const query = await authDB
    .selectFrom("AUTH")
    .select(authDB.fn.countAll().as("count"))
    .where("IP", "=", ip)
    .$castTo<{ count: number }>()
    .executeTakeFirst();

  // more than 2 users with the same IP
  return query ? query.count > 2 : false
}