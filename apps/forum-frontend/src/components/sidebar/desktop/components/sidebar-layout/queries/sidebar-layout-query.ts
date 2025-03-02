import { useSuspenseQuery } from "@tanstack/react-query";
import {
  SIDEBAR_DEFAULT_SIZE,
  SIDEBAR_FORMAT_KEY,
} from "../hooks/use-sidebar-control.ts";
import { useLocalStorage } from "@repo/lib/hooks/use-local-storage.ts";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";

export const SIDEBAR_LAYOUT_QUERY_KEY = createQueryKey("ui", [
  "sidebar-layout-state",
]);

export type SidebarFormat = "full" | "compact" | "dynamic";

export type SidebarQuery = {
  format: SidebarFormat;
  width: number;
};

export const sidebarLayoutQuery = () => {
  const [value] = useLocalStorage<{ format: SidebarFormat }>(
    SIDEBAR_FORMAT_KEY,
    { format: "dynamic" },
  );

  const format = value.format;

  return useSuspenseQuery<SidebarQuery, Error>({
    queryKey: SIDEBAR_LAYOUT_QUERY_KEY,
    refetchOnWindowFocus: false,
    initialData: { width: SIDEBAR_DEFAULT_SIZE, format: format },
  });
};