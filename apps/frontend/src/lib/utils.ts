import { logger } from "@repo/shared/utils/logger";

export const isDevelopment = import.meta.env.DEV
export const isProduction = import.meta.env.PROD

export function log(
  message: string, 
  ...args: unknown[]
) {
  isDevelopment && logger.info(message, args)
}

export function logRouting(
  target: string, 
  message: string
) {
  isDevelopment && console.log(`[Routing]: ${target} called +${message}`)
}

export const wrapTitle = (title?: string) => title ? `${title}` : "Загрузка..."

export const STORAGE_PREFIX = "https://kong.fasberry.su/storage/v1/object"
export const STORAGE_PUBLIC_PREFIX = `${STORAGE_PREFIX}/public`
export const STORAGE_PRIVATE_PREFIX = `${STORAGE_PREFIX}/private`

const PREFIX_TYPE = {
  "public": STORAGE_PUBLIC_PREFIX,
  "private": STORAGE_PRIVATE_PREFIX
} as const;

export function getObject(
  type: keyof typeof PREFIX_TYPE,
  bucket: string,
  fileName: string
) {
  return `${PREFIX_TYPE[type]}/${bucket}/${fileName}`
}

// static always public
export function getStaticObject(fileName: string) {
  return getObject("public", "static", fileName);
}