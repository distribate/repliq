import { requestedUserAtom } from "#components/profile/main/models/requested-user.model";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { userClient } from "#shared/api/forum-client";
import { editUserSettingsBodySchema } from "@repo/types/schemas/user/edit-user-settings-schema";
import { toast } from "sonner";
import * as z from "zod";
import { userDetailsSchema } from '@repo/types/schemas/user/edit-user-details-schema';
import { currentUserAtom, currentUserNicknameAtom } from "#components/user/models/current-user.model";
import { batch } from "@reatom/core";
import { validateResponse } from "#shared/api/validation";

type UpdateUserSettings = Omit<z.infer<typeof editUserSettingsBodySchema>, "userId">

type UpdateUserDetails = z.infer<typeof userDetailsSchema>

export const updateCurrentUserAction = reatomAsync(async (ctx, { criteria, value }: UpdateUserDetails) => {
  return await ctx.schedule(async () => {
    const res = await userClient.user["edit-user-details"].$post(
      { json: { criteria, value } }
    )

    return validateResponse<typeof res>(res);
  })
}, {
  name: "updateCurrentUserAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    const currentUserNickname = ctx.get(currentUserNicknameAtom)
    if (!currentUserNickname) return;

    const requestedUser = ctx.get(requestedUserAtom)

    batch(ctx, () => {
      currentUserAtom(ctx,
        (state) => state ? ({ ...state, ...res }) : null
      )
  
      if (!requestedUser) return;
  
      if (currentUserNickname === requestedUser.nickname) {
        requestedUserAtom(ctx,
          (state) => state ? ({ ...state, ...res, }) : null
        )
      }
    })
  },
  onReject: (_, e) => {
    if (e instanceof Error) {
      toast.error('Произошла ошибка при обновлении.', { description: 'Повторите попытку позже' })
      console.error(e.message)
    }
  }
}).pipe(withStatusesAtom())

export const updateCurrentUserSettingsAction = reatomAsync(async (ctx, json: UpdateUserSettings) => {
  return await ctx.schedule(async () => {
    const res = await userClient.user['edit-user-settings'].$post({ json });
    return validateResponse<typeof res>(res);
  })
}, {
  name: "updateCurrentUserSettingsAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      toast.error("Произошла ошибка", { description: "Повторите попытку позже" })
      console.error(e.message)
    }
  },
  onFulfill: (ctx, res) => {
    if (!res) return;

    const currentUserNickname = ctx.get(currentUserNicknameAtom)
    if (!currentUserNickname) return;

    const requestedUser = ctx.get(requestedUserAtom)

    batch(ctx, () => {
      currentUserAtom(ctx,
        (state) => state ? ({ ...state, preferences: { ...state.preferences, ...res } }) : null
      )

      if (!requestedUser) return;

      if (currentUserNickname === requestedUser.nickname) {
        requestedUserAtom(ctx,
          // @ts-expect-error
          (state) => state ? ({ ...state, preferences: { ...state.preferences, ...res } }) : null
        )
      }
    })
  }
}).pipe(withStatusesAtom())