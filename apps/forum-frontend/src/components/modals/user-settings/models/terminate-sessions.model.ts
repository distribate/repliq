import { authClient } from "@repo/shared/api/auth-client.ts";
import { toast } from "sonner";
import { userActiveSessionsAction } from "#components/modals/user-settings/models/user-sessions.model.ts";
import { AUTH_REDIRECT } from "@repo/shared/constants/routes.ts";
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