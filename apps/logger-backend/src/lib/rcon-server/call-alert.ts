import { getRCONHealthCheck } from '#lib/rcon-server/rcon-server-status';
import { callServerCommand } from '#lib/rcon-server/call-command';

export async function callAlert(value: string): Promise<void> {
  const res = await getRCONHealthCheck();
  console.log(res)
  
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