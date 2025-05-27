import type { Env } from "#types/env-type.ts";
import { logger } from "@repo/lib/utils/logger";
import { getContext } from "hono/context-storage";

/**
 * Если validateRequest миддлвара имеет тип 'prevent', то для этой функции рекомендуется установить флаг true
 * 
 * @param isOptional - Если true, возвращаемый тип -> string | undefined.
 *
 */
export function getNickname(isOptional: true): string | undefined;
export function getNickname(isOptional?: false): string;
export function getNickname(): string;
export function getNickname(isOptional?: boolean): string | undefined {
  const nickname = getContext<Env>().var.nickname;

  logger.debug(`Nickname: ${nickname}`);

  if (isOptional) {
    return nickname
  } else {
    if (typeof nickname !== 'string' || nickname.length === 0) {
      console.error("Critical: Nickname was expected (non-optional) but not found or not a string.");
      throw new Error("Internal Server Error: User context not properly initialized for non-optional access.");
    }

    return nickname
  }
};