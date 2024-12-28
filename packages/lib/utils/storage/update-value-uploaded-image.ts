"use server";

import "server-only";
import { createClient } from "@repo/shared/api/supabase-client.ts";

type UpdateProperties = {
  table: string;
  field: {
    [key: string]: string | null;
  };
  equals: {
    column: string;
    value: unknown;
  };
};

export async function updateValueOfUploadedImage({
  table,
  field,
  equals,
}: UpdateProperties): Promise<boolean> {
  const api = createClient();

  const { error, status } = await api
    .from(table)
    .update(field)
    .eq(equals.column, equals.value);

  return !(error || status === 404);
}
