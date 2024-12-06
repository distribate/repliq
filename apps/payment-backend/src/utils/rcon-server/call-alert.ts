import { callServerCommand } from '#utils/rcon-server/call-command.ts';
import { getRCONHealthCheck } from '#utils/rcon-server/rcon-server-status.ts';

export async function callAlert(value: string): Promise<void> {
  await getRCONHealthCheck();
  
  try {
    await callServerCommand({
      parent: "cmi", value: `broadcast ${value}`
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : `Failed calling`
    throw new Error(message);
  }
}