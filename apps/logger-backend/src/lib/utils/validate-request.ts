import { getAdmins } from "../../queries/get-admins.ts"

export async function validateRequest(telegramId: number): Promise<boolean> {
  const query = await getAdmins(telegramId)

  if (query.length === 0) {
    return false
  }

  return true
}