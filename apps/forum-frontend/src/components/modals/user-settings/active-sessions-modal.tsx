import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { UserActiveSessions } from "#components/cards/user-personal-card/components/account-settings/components/user-active-sessions.tsx";
import { userActiveSessionsQuery } from "#components/cards/user-personal-card/components/account-settings/queries/user-sessions-query.ts";
import YellowCandle from "@repo/assets/images/minecraft/yellow_candle.webp";
import { UserSettingOption } from "#components/cards/user-personal-card/components/profile-settings/user-profile-settings.tsx";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@repo/ui/src/components/dialog.tsx";

export const ActiveSessionsModal = () => {
  const { data: activeSessions, isLoading } = userActiveSessionsQuery();

  return (
    <Dialog>
      <DialogTrigger>
        <UserSettingOption title="Активные сессии" imageSrc={YellowCandle}>
          {isLoading ? (
            <Skeleton className="rounded-md h-4 w-4" />
          ) : (
            <Typography className="text-base">
              {activeSessions?.length}
            </Typography>
          )}
        </UserSettingOption>
      </DialogTrigger>
      <DialogContent>
        <UserActiveSessions />
      </DialogContent>
    </Dialog>
  );
};
