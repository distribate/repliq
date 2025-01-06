import type { Env } from "#types/env-type.ts";
import { getContext } from "hono/context-storage";

export function getNickname() {
  return getContext<Env>().var.nickname
}