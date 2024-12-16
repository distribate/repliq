import { SERVER_API } from '#shared/api';

export async function getRCONHealthCheck() {
  try {
    return await SERVER_API('healthcheck');
  } catch (e) {
    throw e;
  }
}