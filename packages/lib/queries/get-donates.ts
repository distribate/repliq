import { forumLandingClient } from '@repo/shared/api/forum-client';
import { InferResponseType } from 'hono/client';

const client = forumLandingClient["get-donates"].$get

export type DonateType = InferResponseType<typeof client, 200>

export async function getDonates() {
  const res = await forumLandingClient["get-donates"].$get();

  const data = await res.json();

  if ("error" in data) {
    return null;
  }

  return data.data.length > 0 ? data.data : null
}