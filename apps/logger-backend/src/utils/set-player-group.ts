import { callServerCommand } from "./call-command";

export async function setPlayerGroup(nickname: string, group: string) {
  return await callServerCommand({
    parent: "lp",
    value: `user ${nickname} permission set ${group}`
  })
}