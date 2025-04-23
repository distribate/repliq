import { Typography } from "@repo/ui/src/components/typography.tsx";
import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";
import Barrier from "@repo/assets/images/minecraft/barrier.webp";
import { ConfirmationActionModalTemplate } from "#components/modals/confirmation-modal/components/confirmation-action-modal.tsx";
import { ConfirmationButton } from "#components/modals/confirmation-modal/components/confirmation-action-button.tsx";
import { DynamicModal } from "../../dynamic-modal/components/dynamic-modal.tsx";
import { DialogClose } from "@repo/ui/src/components/dialog.tsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@repo/shared/api/auth-client.ts";
import { toast } from "sonner";
import { USER_ACTIVE_SESSIONS_QUERY_KEY } from "#components/modals/user-settings/queries/user-sessions-query.ts";
import { CURRENT_USER_QUERY_KEY } from "@repo/lib/queries/current-user-query.ts";
import { AUTH_REDIRECT } from "@repo/shared/constants/routes.ts";
import { useNavigate } from "@tanstack/react-router"

type TerminateSession =
  | { type: "single", selectedSessionId: string }
  | { type: "all", selectedSessionId?: never }

const terminateSession = async ({
  selectedSessionId, type
}: TerminateSession) => {
  const res = await authClient["terminate-session"].$post({
    json: { selectedSessionId, type }
  })

  const data = await res.json()

  if (!data) {
    return null;
  }

  return data
}

export const TERMINATE_SESSIONS_MUTATION_KEY = ["terminate-sessions"];

export const useTerminateSession = () => {
  const qc = useQueryClient()
  const navigate = useNavigate()

  const terminateSessionMutation = useMutation({
    mutationKey: TERMINATE_SESSIONS_MUTATION_KEY,
    mutationFn: async (values: TerminateSession) => terminateSession(values),
    onSuccess: async (data) => {
      if (!data) return;

      if ("error" in data) {
        if (data.error === 'Session must be at least 3 days old') {
          return toast.error('Для этого действия требуется быть больше в сети');
        }

        return toast.error(data.error);
      }

      if (data.status) {
        if (data.meta.is_current) {
          navigate({ to: AUTH_REDIRECT })

          return setTimeout(() => {
            qc.clear()
          }, 3000)
        }

        await Promise.all([
          qc.invalidateQueries({ queryKey: USER_ACTIVE_SESSIONS_QUERY_KEY }),
          qc.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY })
        ])
      }
    }
  })

  return { terminateSessionMutation }
}

export const TerminateAllSessionsModal = () => {
  const { terminateSessionMutation } = useTerminateSession();

  return (
    <DynamicModal
      mutationKey={TERMINATE_SESSIONS_MUTATION_KEY}
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
            onClick={() => terminateSessionMutation.mutate({ type: 'all' })}
            disabled={terminateSessionMutation.isPending}
          />
          <DialogClose>
            <ConfirmationButton
              actionType="cancel"
              title="Отмена"
              disabled={terminateSessionMutation.isPending}
            />
          </DialogClose>
        </ConfirmationActionModalTemplate>
      }
    />
  );
};
