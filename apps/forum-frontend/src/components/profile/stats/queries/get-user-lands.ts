"use server";

import ky from "ky";
import { ResponseType } from "#components/profile/stats/types/stats-types.ts";

type LandsRole = {
  name: string;
  type: number;
  priority: number;
  id: number;
  ulid: string;
  action: string[] | null;
  manage: string[] | null;
  icon: string;
  taxes: boolean;
  parent: boolean;
};

type LandsHolder = {
  roles: LandsRole[];
  trusted: string[];
};

type LandsTax = {
  current: number;
  time: number;
  before: number;
};

type LandsArea = {
  ulid: string;
  holder: LandsHolder;
  settings: string[];
  invites: any[];
  tax: LandsTax;
  banned: any[];
};

type LandsMember = {
  uuid: string;
  nickname: string;
  chunks: number;
};

type LandsEnity = {
  ulid: string;
  server: string;
  world: string;
  category: string | null;
  members: LandsMember[];
  area: LandsArea;
  balance: number;
  type: string;
  name: string;
  created_At: string;
  title: string;
};

async function getLands(uuid?: string) {
  if (!uuid) return;

  const searchParams = new URLSearchParams();
  searchParams.set("uuid", uuid);

  const res = await ky.get(`${process.env.ASP_NET_API_URL}/get-lands`, {
    searchParams,
    headers: {
      Authorization: `Bearer ${process.env.ASP_NET_API_SECRET}`,
      "Content-Type": "application/json",
    },
    retry: 1
  });

  if (!res.ok) {
    return null;
  }

  return await res.json<ResponseType<Array<LandsEnity>> | null>();
}

export async function getUserLands(
  uuid?: string,
): Promise<Array<LandsEnity> | null> {
  const data = await getLands(uuid);

  if (!data) return null;

  return data.data;
}
