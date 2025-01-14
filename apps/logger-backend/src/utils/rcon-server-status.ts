import { SERVER_API } from '../shared/api/minecraft-api';

export async function getRCONHealthCheck() {
  try {
    return await SERVER_API('healthcheck');
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`[RCON]: ${e.message}`);
    }

    throw new Error(`[RCON]: Unknown error`);
  }
}