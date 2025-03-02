import { Input } from "@repo/ui/src/components/input.tsx";
import { ChangeEvent, forwardRef, useState } from "react";
import { useDebounce } from "@repo/lib/hooks/use-debounce.ts";
import { useQueryClient } from "@tanstack/react-query";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder";
import { z } from "zod";
import { getUserFriendsSchema } from "@repo/types/schemas/user/get-user-friends-schema";

export const FRIENDS_SORT_QUERY_KEY = createQueryKey("ui", [
  "friends-filter-settings",
]);

export type FriendsSortQuery = Omit<z.infer<typeof getUserFriendsSchema>, "with_details"> & {
  searchQuery: string;
  type: "first" | "other",
  cursor?: string
}

export const FriendsFilteringSearch = forwardRef<HTMLInputElement>(
  (props, ref) => {
    const qc = useQueryClient();
    const [value, setValue] = useState<string>("");

    const updateQuery = (val: string) => {
      return qc.setQueryData(
        FRIENDS_SORT_QUERY_KEY,
        (prev: FriendsSortQuery) => ({ ...prev, querySearch: val }),
      );
    };

    const debouncedUpdateQuery = useDebounce(updateQuery, 300);

    const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      setValue(value);
      debouncedUpdateQuery(value);
    };

    return (
      <Input
        ref={ref}
        className="rounded-lg"
        value={value}
        maxLength={24}
        placeholder="Поиск по нику"
        onChange={handleSearchInput}
        {...props}
      />
    );
  },
);
