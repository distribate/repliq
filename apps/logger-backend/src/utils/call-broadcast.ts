import { callServerCommand } from "./call-command";

export async function callBroadcast(v: string): Promise<void> {
  await callServerCommand({ parent: "cmi", value: `broadcast ${v}` })
}