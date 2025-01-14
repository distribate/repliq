import { Typography } from "@repo/ui/src/components/typography.tsx";
import { userActiveSessionsQuery } from "../queries/user-sessions-query.ts";
import { UserSessionBlock } from "./user-session-block.tsx";
import { TerminateAllSessionsModal } from "#modals/user-settings/terminate-all-sessions-modal.tsx";

export const UserActiveSessions = () => {
  const { data: activeSessions, isError } = userActiveSessionsQuery();

  const currentSession = activeSessions
    ? activeSessions.find((item) => (item ? item.is_current : null))
    : null;

  if (isError || !currentSession || !activeSessions) return;

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
};
