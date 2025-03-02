import { useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";

export type ProfileThreadsViewType = "grid" | "list";

export type ProfileThreadsSettingsQuery = {
  viewType: ProfileThreadsViewType;
  querySearch: string | null;
};

const initial: ProfileThreadsSettingsQuery = {
  viewType: "list",
  querySearch: null,
};

export const PROFILE_THREADS_SORT_QUERY_KEY = createQueryKey("ui", [
  "profile-threads",
  "sort",
]);

export const profileThreadsSettingsQuery = () =>
  useQuery<ProfileThreadsSettingsQuery>({
    queryKey: PROFILE_THREADS_SORT_QUERY_KEY,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    initialData: initial,
  });
