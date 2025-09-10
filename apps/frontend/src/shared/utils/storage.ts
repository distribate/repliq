import { STORAGE_PREFIX } from "#shared/env";

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