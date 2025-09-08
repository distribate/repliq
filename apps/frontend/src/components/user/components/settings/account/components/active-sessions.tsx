import { Typography } from "@repo/ui/src/components/typography.tsx";
import { currentSessionAtom, userActiveSessionsAction, UserActiveSessionsPayload } from "#components/modals/user-settings/models/user-sessions.model";
import { TerminateAllSessionsModal } from "#components/modals/user-settings/components/terminate-all-sessions-modal";
import dayjs from "@repo/shared/constants/dayjs-instance";
import { TerminateSessionModal } from "#components/modals/user-settings/components/terminate-session-modal";
import { reatomComponent } from "@reatom/npm-react";
import { IconDevices } from "@tabler/icons-react";

export const UserSessionBlock = ({
  is_current, browser, location, session_id, created_at
}: UserActiveSessionsPayload[number]) => {
  const formattedCreated = dayjs(created_at).format("DD-MMM-YYYY")

  return (
    <div className="flex w-full gap-2 group relative py-2 rounded-md hover:bg-shark-700/20 px-4">
      <IconDevices size={64} className={`w-[64px] h-[64px] ${!is_current ? "text-shark-400" : "text-shark-50"}`} />
      <div className="flex w-full justify-between grow items-center">
        <div className="flex flex-col">
          <Typography>{browser}</Typography>
          <div className="flex flex-col gap-x-2 lg:flex-row lg:items-center">
            <Typography textColor="gray">
              {location}
            </Typography>
            <span className="hidden lg:inline text-shark-300 text-[14px]">
              ⏺
            </span>
            <Typography textColor="gray">
              {formattedCreated}
            </Typography>
          </div>
        </div>
        <TerminateSessionModal session_id={session_id} />
      </div>
    </div>
  );
};

export const ActiveSessions = reatomComponent(({ ctx }) => {
  const activeSessions = ctx.get(userActiveSessionsAction.dataAtom)
  const currentSession = ctx.get(currentSessionAtom)

  if (!currentSession || !activeSessions) return;

  return (
    <div className="flex flex-col items-center gap-y-4 w-full">
      <Typography variant="dialogTitle">Управление сессиями</Typography>
      <div className="flex flex-col gap-y-2 w-full">
        <div className="flex flex-col gap-y-2 w-full">
          <Typography className="text-base text-shark-50 px-4">
            Текущая сессия
          </Typography>
          <UserSessionBlock {...currentSession} />
        </div>
        {activeSessions.length > 1 && <TerminateAllSessionsModal />}
      </div>
      {activeSessions.length > 1 && (
        <>
          <div className="bg-shark-800 w-full py-2 px-4">
            <Typography className="text-shark-200 text-sm">
              Будут уничтожены все сессии, кроме текущей.
            </Typography>
          </div>
          <div className="flex flex-col w-full gap-y-2">
            <Typography className="text-base text-shark-50 px-4">
              Активные сессии
            </Typography>
            <div className="flex flex-col gap-y-1 w-full">
              {activeSessions.map((item, i) => (
                <UserSessionBlock key={i} {...item} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}, "ActiveSessions")