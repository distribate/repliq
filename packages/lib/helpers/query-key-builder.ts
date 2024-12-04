import { QueryKey } from "@tanstack/react-query";

type CreateQueryKeyType = "user" | "ui";

function createQueryKey<
  T extends CreateQueryKeyType,
  P extends [string, ...string[]],
  D extends string | number | boolean,
>(type: T, path: P, dynamicValue?: D): QueryKey {
  return dynamicValue !== undefined
    ? [type, ...path, dynamicValue]
    : [type, ...path];
}

export { createQueryKey };
