import { authClient } from '@repo/shared/api/auth-client';

export async function validateSession() {
  const res = await authClient["get-session"].$get();
  const data = await res.json();

  if (!data || "error" in data) {
    return false;
  }

  if (data.data) {
    return true
  }

  return false
}