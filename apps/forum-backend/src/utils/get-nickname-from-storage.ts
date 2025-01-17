import type { Env } from "#types/env-type.ts";
import { getContext } from "hono/context-storage";

export const getNickname = () => getContext<Env>().var.nickname