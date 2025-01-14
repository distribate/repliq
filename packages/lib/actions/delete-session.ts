import { authClient } from "@repo/shared/api/auth-client.ts";

export async function deleteSession() {
  const res = await authClient["invalidate-session"].$post();

  const data = await res.json();

  if ("error" in data) {
    throw new Error(data.error);
  }

  return data;
}