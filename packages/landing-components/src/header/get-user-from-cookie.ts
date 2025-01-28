"use server"

import { cookies } from "next/headers"

export async function getUserFromCookie() {
  const userFromCookie = cookies().get("user");
  
  if (!userFromCookie) {
    return null
  }

  return userFromCookie.value as string;
}