import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Fragment } from "react";
import { userBlockedQuery } from "#cards/components/user-personal-card/components/account-settings/queries/user-blocked-query.ts";
import { UserBlockedCard } from "#cards/components/user-blocked-card/components/user-blocked-card.tsx";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@repo/ui/src/components/dialog.tsx";
import { getUser } from "@repo/lib/helpers/get-user.ts";

export const BlockedListModal = () => {
  const currentUser = getUser();
  if (!currentUser) return null;

  const { data: userBlocked } = userBlockedQuery(currentUser.nickname);

  return (
    <Dialog>
      <DialogTrigger>
        <Typography className="text-base">
          {userBlocked?.length || 0}
        </Typography>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col gap-y-4 w-full items-center">
          <Typography variant="dialogTitle" className="px-4">
            Черный список
          </Typography>
          {!userBlocked && (
            <div className="self-start w-full px-2">
              <Typography className="text-shark-300" textSize="small">
                список пуст
              </Typography>
            </div>
          )}
          {userBlocked && (
            <div className="flex flex-col gap-y-1 w-full overflow-y-scroll max-h-[600px]">
              {userBlocked.map((user) => (
                <Fragment key={user.id}>
                  <UserBlockedCard
                    name_color={user.name_color}
                    nickname={user.nickname}
                    time={user.added_at}
                  />
                </Fragment>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
