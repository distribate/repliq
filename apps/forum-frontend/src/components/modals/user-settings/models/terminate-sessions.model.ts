import { authClient } from "#shared/auth-client";
import { toast } from "sonner";
import { userActiveSessionsAction } from "#components/modals/user-settings/models/user-sessions.model.ts";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { navigate } from "vike/client/router";

type TerminateSession =
  | { type: "single", selectedSessionId: string }
  | { type: "all", selectedSessionId?: never }

export const terminateSessionAction = reatomAsync(async (ctx, values: TerminateSession) => {
  return await ctx.schedule(async () => {
    const { type, selectedSessionId } = values;

    const res = await authClient["terminate-session"].$post({ json: { selectedSessionId, type } })
    const data = await res.json()

    if ("error" in data) throw new Error(data.error);

    return data
  })
}, {
  name: "terminateSessionAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      if (e.message === 'Session must be at least 3 days old') {
        return toast.error('Для этого действия требуется быть больше в сети');
      }

      return toast.error(e.message);
    }
  },
  onFulfill: (ctx, { status, meta }) => {
    if (meta.is_current) {
      ctx.schedule(() => navigate("/auth"))
    }

    userActiveSessionsAction(ctx)
  }
}).pipe(withStatusesAtom())