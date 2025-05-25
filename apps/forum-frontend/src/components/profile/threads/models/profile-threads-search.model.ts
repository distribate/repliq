import { profileThreadsSettingsAtom } from "#components/profile/threads/models/profile-threads-settings.model";
import { getThreadsUser, threadsAtom } from "#components/profile/threads/models/profile-threads.model";
import { reatomAsync } from "@reatom/async";
import { ThreadEntity } from "@repo/types/entities/entities-type.ts";

export type UserThreads = Pick<ThreadEntity, "id" | "title" | "created_at"> & {
  comments_count: number;
};

export const profileThreadsSearchAction = reatomAsync(async (ctx, nickname: string) => {
  const { querySearch } = ctx.get(profileThreadsSettingsAtom);

  if (!querySearch) return;

  return await ctx.schedule(() => getThreadsUser({ nickname, querySearch }));
}, {
  name: "profileThreadsSearchAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    return threadsAtom(ctx, res)
  },
  onReject: (_, error) => {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
})