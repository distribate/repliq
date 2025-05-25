import { Typography } from "@repo/ui/src/components/typography.tsx";
import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";
import Barrier from "@repo/assets/images/minecraft/barrier.webp";
import { ConfirmationActionModalTemplate } from "#components/modals/confirmation-modal/components/confirmation-action-modal.tsx";
import { ConfirmationButton } from "#components/modals/confirmation-modal/components/confirmation-action-button.tsx";
import { DynamicModal } from "../../dynamic-modal/components/dynamic-modal.tsx";
import { DialogClose } from "@repo/ui/src/components/dialog.tsx";
import { authClient } from "@repo/shared/api/auth-client.ts";
import { toast } from "sonner";
import { userActiveSessionsAction } from "#components/modals/user-settings/queries/user-sessions-query.ts";
import { AUTH_REDIRECT } from "@repo/shared/constants/routes.ts";
import { reatomComponent } from "@reatom/npm-react";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { router } from "#main.tsx";

type TerminateSession =
  | { type: "single", selectedSessionId: string }
  | { type: "all", selectedSessionId?: never }

const terminateSession = async ({
  selectedSessionId, type
}: TerminateSession) => {
  const res = await authClient["terminate-session"].$post({ json: { selectedSessionId, type } })
  const data = await res.json()

  if (!data) return null;

  return data
}

export const terminateSessionAction = reatomAsync(async (ctx, values: TerminateSession) => {
  return await ctx.schedule(() => terminateSession(values))
}, {
  name: "terminateSessionAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    if ("error" in res) {
      if (res.error === 'Session must be at least 3 days old') {
        return toast.error('Для этого действия требуется быть больше в сети');
      }

      return toast.error(res.error);
    }

    if (res.status) {
      if (res.meta.is_current) {
        ctx.schedule(() => router.navigate({ to: AUTH_REDIRECT }))
      }

      userActiveSessionsAction(ctx)
    }
  }
}).pipe(withStatusesAtom())

export const TerminateAllSessionsModal = reatomComponent(({ ctx }) => {
  return (
    <DynamicModal
      autoClose
      withLoader
      isPending={ctx.spy(terminateSessionAction.statusesAtom).isPending}
      trigger={
        <HoverCardItem className="gap-2 px-2">
          <img
            src={Barrier}
            alt=""
            width={32}
            className="max-w-[40px] max-h-[40px]"
            height={32}
          />
          <Typography className="text-base">
            Выйти с остальных сессий
          </Typography>
        </HoverCardItem>
      }
      content={
        <ConfirmationActionModalTemplate title="Уверены, что хотите уничтожить все остальные сессии?">
          <ConfirmationButton
            actionType="continue"
            title="Да, уничтожить"
            onClick={() => terminateSessionAction(ctx, { type: 'all' })}
            disabled={ctx.spy(terminateSessionAction.statusesAtom).isPending}
          />
          <DialogClose>
            <ConfirmationButton
              actionType="cancel"
              title="Отмена"
              disabled={ctx.spy(terminateSessionAction.statusesAtom).isPending}
            />
          </DialogClose>
        </ConfirmationActionModalTemplate>
      }
    />
  );
}, "TerminateAllSessionsModal")