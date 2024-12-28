import { getRCONHealthCheck } from "../../lib/rcon-server/rcon-server-status.ts"
import { callServerCommand } from "../../lib/rcon-server/call-command.ts"

export async function callBroadcast(value: string): Promise<void> {
  const res = await getRCONHealthCheck();
  
  if (!res.ok) return;
  
  try {
    await callServerCommand({
      parent: "cmi", value: `broadcast ${value}`
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : `Failed calling`
    throw new Error(`[RCON]: ${message}`);
  }
}