import { authDB } from "../shared/database/auth-db";

export async function validateIpRestricts(ip: string): Promise<boolean> {
  const q = await authDB
    .selectFrom("AUTH")
    .select(authDB.fn.countAll().as("count"))
    .where("IP", "=", ip)
    .$castTo<{ count: number }>()
    .executeTakeFirst();

  return q ? q.count > 2 : false // more than 2 users with the same IP
}