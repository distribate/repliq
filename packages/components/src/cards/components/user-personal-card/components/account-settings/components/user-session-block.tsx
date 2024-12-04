import Image from "next/image";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import BlockGold from "@repo/assets/images/minecraft/block_gold.webp";
import { TerminateSessionModal } from "#modals/user-settings/terminate-session-modal.tsx";
import { UserActiveSessionsQuery } from "#cards/components/user-personal-card/components/account-settings/queries/user-sessions-query.ts";

export const UserSessionBlock = ({
  current,
  browser,
  uuid,
  geo,
}: UserActiveSessionsQuery) => {
  const isCurrent = current || false;

  return (
    <div className="flex w-full gap-2 group relative py-2 rounded-md hover:bg-shark-700/20 px-4">
      <Image
        src={BlockGold.src}
        alt="Page private"
        width={64}
        className={`w-[64px] h-[64px] ${!isCurrent ? "grayscale" : "grayscale-0"}`}
        height={64}
      />
      <div className="flex w-full justify-between grow items-center">
        <div className="flex flex-col">
          <Typography>{browser}</Typography>
          <Typography textColor="gray">
            {geo?.country || "Unknown"}, {geo?.city || "Unknown"}
          </Typography>
        </div>
        <TerminateSessionModal session_uuid={uuid} />
      </div>
    </div>
  );
};
