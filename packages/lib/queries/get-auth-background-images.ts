"use server"

import { createClient } from "@repo/lib/utils/api/server.ts";

export async function getAuthBackgroundImages() {
  const api = createClient();
  
  const { data, error } = await api
  .storage
  .from('static')
  .list('auth_background', {
    limit: 100, offset: 0
  })
  
  if (error || !data) {
    return null;
  }
  
  return data;
}