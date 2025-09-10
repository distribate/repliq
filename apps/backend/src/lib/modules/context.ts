import type { Env } from "#types/env-type.ts";
import { getContext } from "hono/context-storage";

/**
 * If requireAuth === 'prevent', isOptional can have only true
 * 
 * @param isOptional - If true, return type -> string | undefined.
 *
 */
export function getNickname(isOptional: true): string | undefined;
export function getNickname(isOptional?: false): string;
export function getNickname(): string;
export function getNickname(isOptional?: boolean): string | undefined {
  const nickname = getContext<Env>().var.nickname;

  if (isOptional) {
    return nickname
  } else {
    if (typeof nickname !== 'string' || nickname.length === 0) {
      console.error("[Critical]: Nickname was expected (non-optional) but not found or not a string.");
      throw new Error("User context not properly initialized for non-optional access.");
    }

    return nickname
  }
};