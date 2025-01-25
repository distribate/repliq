import { callServerCommand } from "./call-command";

export async function giveCharism(nickname: string, value: number) {
  return await callServerCommand({ parent: "cmi", value: `money give ${nickname} ${value}` })
}