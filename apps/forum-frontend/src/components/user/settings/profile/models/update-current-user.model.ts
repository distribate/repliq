import { requestedUserAtom } from "#components/profile/main/models/requested-user.model";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { forumUserClient } from "#shared/forum-client";
import { editUserSettingsBodySchema } from "@repo/types/schemas/user/edit-user-settings-schema";
import { toast } from "sonner";
import * as z from "zod";
import { userDetailsSchema } from '@repo/types/schemas/user/edit-user-details-schema';
import { currentUserAtom, currentUserNicknameAtom } from "#components/user/models/current-user.model";

type UpdateUserSettings = Omit<z.infer<typeof editUserSettingsBodySchema>, "userId">

async function updateUserSettings(json: UpdateUserSettings) {
  const res = await forumUserClient.user['edit-user-settings'].$post({ json });
  const data = await res.json();
  if (!data || "error" in data) return null;
  return data.data
}

async function updateUserFields({
  criteria, value, signal
}: z.infer<typeof userDetailsSchema> & { signal: AbortSignal }) {
  const res = await forumUserClient.user["edit-user-details"].$post({ json: { criteria, value } }, { init: { signal } })
  const data = await res.json()
  if (!data || "error" in data) return null;
  return data.data;
}

export const updateCurrentUserAction = reatomAsync(async (ctx, values: any) => {
  return await ctx.schedule(() => updateUserFields({ ...values, signal: ctx.controller.signal }))
}, {
  name: "updateCurrentUserAction",
  onFulfill: (ctx, res) => {
    if (!res || 'error' in res) return toast.error('Произошла ошибка при обновлении.', {
      description: 'Повторите попытку позже',
    });

    const currentUserNickname = ctx.get(currentUserNicknameAtom)
    if (!currentUserNickname) return;

    currentUserAtom(ctx,
      (state) => state ? ({ ...state, ...res }) : null
    )

    const requestedUser = ctx.get(requestedUserAtom)
    if (!requestedUser) return;

    if (currentUserNickname === requestedUser.nickname) {
      requestedUserAtom(ctx,
        (state) => state ? ({ ...state, ...res, }) : null
      )
    }
  },
  onReject: (_, error) => {
    if (error instanceof Error) {
      toast.error(error.message)
      throw new Error(error.message);
    }
  }
}).pipe(withStatusesAtom())

export const updateCurrentUserSettingsAction = reatomAsync(async (_, values: UpdateUserSettings) => {
  return await updateUserSettings(values)
}, {
  name: "updateCurrentUserSettingsAction",
  onFulfill: (ctx, res) => {
    if (!res || "error" in res) return toast.error("Произошла ошибка", {
      description: "Повторите попытку позже"
    });

    const currentUserNickname = ctx.get(currentUserNicknameAtom)
    if (!currentUserNickname) return;

    currentUserAtom(ctx,
      (state) => state ? ({ ...state, preferences: { ...state.preferences, ...res } }) : null
    )

    const requestedUser = ctx.get(requestedUserAtom)
    if (!requestedUser) return;

    if (currentUserNickname === requestedUser.nickname) {
      requestedUserAtom(ctx,
        // @ts-expect-error
        (state) => state ? ({ ...state, preferences: { ...state.preferences, ...res } }) : null
      )
    }
  },
  onReject: (_, e) => {
    if (e instanceof Error) {
      toast.error(e.message)
      throw new Error(e.message);
    }
  }
}).pipe(withStatusesAtom())