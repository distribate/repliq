"use client";

import { Input } from "@repo/ui/src/components/input.tsx";
import { ChangeEvent, forwardRef, useState } from "react";
import { useDebounce } from "@repo/lib/hooks/use-debounce.ts";
import {
  FRIENDS_SORT_QUERY_KEY,
  FriendsSortQuery,
} from "#profile/components/friends/queries/friends-settings-query.ts";
import { useQueryClient } from "@tanstack/react-query";

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
