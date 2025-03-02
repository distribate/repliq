import { Typography } from "@repo/ui/src/components/typography.tsx";
import BlockGold from "@repo/assets/images/minecraft/block_gold.webp";
import { UserActiveSessionsQuery } from "#components/cards/user-personal-card/components/account-settings/queries/user-sessions-query.ts";
import { TerminateSessionModal } from "#components/modals/user-settings/terminate-session-modal.tsx";
import dayjs from "@repo/lib/constants/dayjs-instance";

export const UserSessionBlock = ({
  is_current, browser, location, session_id, created_at
}: UserActiveSessionsQuery) => {
  const isCurrent = is_current || false;

  return (
    <div className="flex w-full gap-2 group relative py-2 rounded-md hover:bg-shark-700/20 px-4">
      <img
        src={BlockGold}
        alt=""
        width={64}
        className={`w-[64px] h-[64px] ${!isCurrent ? "grayscale" : "grayscale-0"}`}
        height={64}
      />
      <div className="flex w-full justify-between grow items-center">
        <div className="flex flex-col">
          <Typography>{browser}</Typography>
          <div className="flex flex-col gap-x-2 lg:flex-row lg:items-center">
            <Typography textColor="gray">
              {location}
            </Typography>
            <span className="hidden lg:inline text-shark-300 font-[Minecraft] text-[14px]">⏺</span>
            <Typography textColor="gray">
              {dayjs(created_at).format("DD-MMM-YYYY")}
            </Typography>
          </div>
        </div>
        <TerminateSessionModal session_id={session_id} />
      </div>
    </div>
  );
};
