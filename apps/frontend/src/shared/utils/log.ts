import { isDevelopment } from "#shared/env";

export function log(
  message: string, 
  ...args: unknown[]
) {
  isDevelopment && console.log(message, ...args)
}

export function logRouting(
  target: string, 
  message: string
) {
  isDevelopment && console.log(`[Routing]: ${target} called +${message}`)
}