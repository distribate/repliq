"use server";

import { createClient } from "../../../../../../../../lib/utils/api/supabase-client.ts";
import { SearchTypes } from "../types/search-types.ts";
import { RequestDetails } from "@repo/types/entities/entities-type.ts";

type GetSearchUsers = Pick<SearchTypes, "searchedValue"> & RequestDetails;

export async function getSearchUsers({
  searchedValue,
  range,
  limit,
}: GetSearchUsers) {
  const api = createClient();

  let query = api.from("users").select("nickname, name_color");

  query.like("nickname", `%${searchedValue}%`);

  if (range) query.range(range[0], range[1]);
  if (limit) query.limit(limit);

  const { data: searchedUsers, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return searchedUsers;
}
