"use server";

import "server-only";
import { createClient } from "@repo/shared/api/supabase-client.ts";

export async function getAvailableCategories() {
  const api = createClient();

  const { data, error } = await api
    .from("category")
    .select("id, title, description")
    .eq("available", true)
    .returns<{ id: number, title: string, description: string}[]>();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
