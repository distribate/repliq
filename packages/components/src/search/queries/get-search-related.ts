import { getLastUsers } from "#widgets/last-registered-users/components/last-registered-users.tsx";
import { getLastThreads } from "./get-last-threads";

export async function getSearchRelated(l: number = 5) {
  const [lastUsers, lastThreads] = await Promise.all([
    getLastUsers(l),
    getLastThreads(l)
  ]);

  return { lastUsers, lastThreads };
}