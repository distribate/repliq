import { isDevelopment } from "#shared/env/index.ts";

export function log(
  message: string,
  ...args: unknown[]
) {
  isDevelopment && console.log(message, ...args);
}