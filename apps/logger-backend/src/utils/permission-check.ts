import { luckpermsAPI } from "../shared/api/luckperms-api";

export type LuckpermsCheckPermission = {
  result: string | "true",
  node: {
    key: string,
    type: string,
    value: boolean,
    context: Array<{
      key: string,
      value: string
    }>,
    expiry: number
  }
}

export async function permissionCheck(uuid: string, permission: string) {
  return await luckpermsAPI
    .get(`user/${uuid}/permission-check`, {
      searchParams: {
        permission
      }
    }).json<LuckpermsCheckPermission>()
}