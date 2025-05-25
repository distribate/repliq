import { requestedUserAtom } from "#components/profile/requested-user.model";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { currentUserAtom, currentUserNicknameAtom } from "@repo/lib/helpers/get-user";
import { forumUserClient } from "@repo/shared/api/forum-client";
import { editUserSettingsBodySchema } from "@repo/types/schemas/user/edit-user-settings-schema";
import { toast } from "sonner";
import { z } from "zod";
import { userDetailsSchema } from '@repo/types/schemas/user/edit-user-details-schema';

export type UpdateUserSettings = Omit<z.infer<typeof editUserSettingsBodySchema>, "userId">

async function updateUserSettings(values: UpdateUserSettings) {
  const res = await forumUserClient.user['edit-user-settings'].$post({
    json: values
  });
  const data = await res.json();
  if (!data || "error" in data) return null;
  return data.data
}

type UpdateUserFields = z.infer<typeof userDetailsSchema>

async function updateUserFields({
  criteria, value, signal
}: UpdateUserFields & { signal: AbortSignal }) {
  const res = await forumUserClient.user["edit-user-details"].$post({
    json: { criteria, value }
  }, {
    init: { signal }
  })

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

    currentUserAtom(ctx, (state) => {
      if (!state) return null;
      return { ...state, ...res }
    })

    const requestedUser = ctx.get(requestedUserAtom)
    if (!requestedUser) return;

    if (currentUserNickname === requestedUser.nickname) {
      requestedUserAtom(ctx, (state) => state ? ({ ...state, ...res, }) : null)
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
    const requestedUser = ctx.get(requestedUserAtom)
    if (!currentUserNickname || !requestedUser) return;

    currentUserAtom(ctx, (state) => state
      ? ({ ...state, preferences: { ...state.preferences, ...res }, })
      : null
    )

    if (currentUserNickname === requestedUser.nickname) {
      requestedUserAtom(ctx, (state) => state
        ? ({ ...state, preferences: { ...state.preferences, ...res }, })
        : null
      )
    }
  },
  onReject: (_, error) => {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}).pipe(withStatusesAtom())