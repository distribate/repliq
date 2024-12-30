import { deleteSession } from "../lib/queries/delete-session";

export async function invalidateSession(sessionId: string) {
  return await deleteSession(sessionId)
}