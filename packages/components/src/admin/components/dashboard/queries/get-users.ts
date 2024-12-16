"use server";

import "server-only";
import { createClient } from '@repo/lib/utils/api/supabase-client.ts';
import { ExtendedUserEntity } from "@repo/types/entities/entities-type.ts";
import { CurrentUser } from '@repo/lib/queries/current-user-query.ts';

export type ExtendedUsers = Pick<
  ExtendedUserEntity,
  | "id"
  | "nickname"
  | "uuid"
  | "created_at"
  | "name_color"
  | "description"
  | "donate"
  | "favorite_item"
>;

type Users = Pick<
  CurrentUser,
  "id" | "nickname" | "name_color" | "uuid" | "created_at" | "description" | "donate" | "favorite_item"
>;

export type GetUsers = {
  range?: number[];
  limit?: number
};

export async function getUsers(filter?: GetUsers): Promise<{ data: ExtendedUsers[] | Users[]; count: number; } | null> {
  const api = createClient();

  let query = api
    .from("users")
    .select("id, nickname, uuid, created_at, name_color, description, favorite_item, donate", {
      count: "exact",
    })
    .returns<Users[]>();

  if (filter?.range) query.range(filter?.range[0], filter?.range[1]);
  if (filter?.limit) query.limit(filter?.limit);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }
  
  return { data, count: count ? count : 0 };
}