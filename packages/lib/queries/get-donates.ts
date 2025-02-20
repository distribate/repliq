import { forumLandingClient } from '@repo/shared/api/forum-client';
import { InferResponseType, InferRequestType } from 'hono/client';

const client = forumLandingClient["get-donates"].$get

export type GetDonatesResponse = InferResponseType<typeof client, 200>

type GetDonatesRequest = InferRequestType<typeof client>["query"]

export type Donates = {
  imageUrl: string;
  id: string;
  created_at: string;
  description: string;
  title: string;
  origin: string;
  price: string;
  rating: string;
  commands: string[],
  forum: string[] | null
}

export async function getDonates(args: GetDonatesRequest) {
  const res = await forumLandingClient["get-donates"].$get({
    query: args
  });

  const data = await res.json();

  if ("error" in data) {
    return null;
  }

  return data.data.length > 0 ? data.data : null
}