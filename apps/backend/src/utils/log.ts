import { isDevelopment } from "#shared/env/index.ts";

export function log(
  ...args: unknown[]
) {
  isDevelopment && console.log(...args);
}