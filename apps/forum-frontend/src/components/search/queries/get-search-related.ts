import { getLatestRegUsers } from "@repo/lib/queries/last-reg-users-query";
import { getLastThreads } from "./get-last-threads";

export async function getSearchRelated(l: number = 5) {
  const [lastUsers, lastThreads] = await Promise.all([
    getLatestRegUsers(l),
    getLastThreads(l)
  ]);

  return { lastUsers, lastThreads };
}