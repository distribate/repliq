"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  CURRENT_USER_QUERY_KEY,
} from "#queries/current-user-query.ts";
import { getUserInformation } from "#queries/get-user-information.ts";
import { useNavigate } from "@tanstack/react-router";
import { AUTH_REDIRECT } from "@repo/shared/constants/routes";
import { UserDetailed } from "@repo/types/entities/user-type";

export function getUser() {
  const qc = useQueryClient();
  const cacheUser = qc.getQueryData<UserDetailed>(CURRENT_USER_QUERY_KEY);
  const navigate = useNavigate();

  if (!cacheUser) {
    qc.fetchQuery<UserDetailed | { error: string }>({
      queryKey: CURRENT_USER_QUERY_KEY,
      queryFn: () => getUserInformation(),
      retry: 2,
    }).then((res) => {
      if ("error" in res) {
        return navigate({ to: AUTH_REDIRECT })
      }
    });
  }
  
  return cacheUser!;
}