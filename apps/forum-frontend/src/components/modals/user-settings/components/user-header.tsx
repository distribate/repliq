import { Avatar } from "#components/user/avatar/components/avatar";
import { UserNickname } from "#components/user/name/nickname";
import { getUser } from "@repo/lib/helpers/get-user";
import { userStatusQuery } from "@repo/lib/queries/user-status-query";
import { Button } from "@repo/ui/src/components/button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@repo/ui/src/components/dialog";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { Typography } from "@repo/ui/src/components/typography";
import { Suspense } from "react";

export const UserPersonalCardHeader = () => {
  const { nickname, name_color } = getUser();
  const { data: userStatus } = userStatusQuery(nickname);

  const isOnline = userStatus?.status === 'online';

  return (
    <div className="flex items-center gap-4 justify-start w-full px-2">
      <Suspense fallback={<Skeleton className="w-[82px] h-[82px]" />}>
        <Dialog>
          <DialogTrigger>
            <Avatar rounded="medium" propHeight={82} propWidth={82} nickname={nickname} />
          </DialogTrigger>
          <DialogContent withClose={false} className="!p-0 bg-transparent flex items-center justify-center">
            <div className="flex flex-col gap-4">
              <Avatar rounded="medium" propHeight={256} propWidth={256} nickname={nickname} />
              <DialogClose>
                <Button className="px-6 bg-shark-50">
                  <Typography className="text-lg font-semibold text-shark-950">
                    Закрыть
                  </Typography>
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </Suspense>
      <div className="flex flex-col items-start">
        <UserNickname nickname={nickname} nicknameColor={name_color} className="text-base font-semibold" />
        <Typography>
          {isOnline ? "онлайн" : "оффлайн"}
        </Typography>
      </div>
    </div>
  );
};