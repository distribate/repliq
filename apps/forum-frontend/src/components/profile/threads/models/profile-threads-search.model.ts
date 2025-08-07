import { profileThreadsSettingsAtom } from "#components/profile/threads/models/profile-threads-settings.model";
import { getThreadsUser, threadsAtom } from "#components/profile/threads/models/profile-threads.model";
import { reatomAsync } from "@reatom/async";

export type UserThreads = {
  id: string,
  title: string,
  created_at: string | Date,
  comments_count: number;
};

export const profileThreadsSearchAction = reatomAsync(async (ctx, nickname: string) => {
  const { query } = ctx.get(profileThreadsSettingsAtom);

  if (!query) return;

  return await ctx.schedule(() => getThreadsUser({ nickname, query }));
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