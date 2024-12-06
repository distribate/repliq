import { SERVER_API } from '#shared/api.ts';

export async function getRCONHealthCheck() {
  const isHealth = await SERVER_API('healthcheck');
  
  if (!isHealth.ok) {
    throw new Error('Server is not alive');
  }
}