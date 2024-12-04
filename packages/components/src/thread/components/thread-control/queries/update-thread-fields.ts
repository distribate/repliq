"use server";

import "server-only";
import { createClient } from "@repo/lib/utils/api/supabase-client.ts";
import { validateThreadOwner } from "#thread/components/thread-control/queries/validate-thread-owner.ts";
import { ThreadControlQueryValues } from "#thread/components/thread-control/queries/thread-control-query.ts";
import { getCurrentSession } from "@repo/lib/actions/get-current-session.ts";

type UpdateThread = {
  threadId: string;
  values: ThreadControlQueryValues;
};

export async function updateThread({ threadId, values }: UpdateThread) {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser) return;

  const isValid = await validateThreadOwner({
    threadId,
    currentUserNickname: currentUser.nickname,
  });

  if (!isValid) return;

  const api = createClient();

  const { error } = await api.from("threads").update(values).eq("id", threadId);

  return !error;
}
