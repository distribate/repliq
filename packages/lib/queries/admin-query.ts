import { createQueryKey } from "#helpers/query-key-builder.ts";
import { useQuery } from "@tanstack/react-query";
import { checkAdminPermission } from "#actions/check-admin-permission.ts";

export const ADMIN_QUERY_KEY = createQueryKey("ui", ["admin-state"]);

export const adminQuery = () => useQuery<boolean, Error>({
  queryKey: ADMIN_QUERY_KEY,
  queryFn: () => checkAdminPermission(),
  refetchOnWindowFocus: false,
  refetchOnMount: false,
});