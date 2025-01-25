// replace to the nats call

import { callServerCommand } from "./call-command";

export async function giveBelkoin(nickname: string, value: number) {
  return await callServerCommand({ parent: "p", value: `give ${nickname} ${value}` })
}