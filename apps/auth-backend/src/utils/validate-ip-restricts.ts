import { authDB } from "../shared/database/auth-db";

const MAX_USERS_PER_IP = 2;

export async function validateIpRestricts(ip: string): Promise<boolean> {
  const query = await authDB
    .selectFrom("AUTH")
    .select(authDB.fn.countAll().as("count"))
    .where("IP", "=", ip)
    .executeTakeFirst();

  if (!query) return false;

  return Number(query.count) > MAX_USERS_PER_IP;
}