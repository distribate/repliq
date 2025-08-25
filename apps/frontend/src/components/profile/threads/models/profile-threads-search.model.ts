import { profileThreadsSettingsAtom } from "#components/profile/threads/models/profile-threads-settings.model";
import { getThreadsUser, threadsAction } from "#components/profile/threads/models/profile-threads.model";
import { reatomAsync } from "@reatom/async";

export const profileThreadsSearchAction = reatomAsync(async (ctx, nickname: string) => {
  const { query } = ctx.get(profileThreadsSettingsAtom);
  if (!query) return;

  // @ts-ignore
  return await ctx.schedule(() => getThreadsUser(nickname, { query }));
}, {
  name: "profileThreadsSearchAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message);
    }
  },
  onFulfill: (ctx, res) => {
    if (!res) return;
    threadsAction.dataAtom(ctx, res)
  },
})