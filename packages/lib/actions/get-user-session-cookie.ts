"use server"

import "server-only"

import { cookies } from "next/headers";

export async function getUserSessionCookie() {
  const session = cookies().get("session");
  return session?.value ?? null;
}