import { callServerCommand } from "./call-command";
import { getRCONHealthCheck } from "./rcon-server-status";

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