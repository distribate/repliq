import { Typography } from "@repo/ui/src/components/typography.tsx";
import { UserEntity } from "@repo/types/entities/entities-type.ts";
import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";
import { ReactNode } from "react";
import { UserFullCard } from "#cards/components/user-main-card/components/user-full-card.tsx";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@repo/ui/src/components/dialog.tsx";

type UserCardModalProperties =
  | {
      withCustomTrigger?: false | undefined;
      trigger?: never;
    }
  | {
      withCustomTrigger: true;
      trigger: ReactNode;
    };

type UserCardModal = Pick<UserEntity, "nickname"> & UserCardModalProperties;

export const UserCardModal = ({
  nickname,
  trigger,
  withCustomTrigger = false,
}: UserCardModal) => {
  return (
    <Dialog>
      <DialogTrigger>
        {withCustomTrigger ? (
          trigger
        ) : (
          <HoverCardItem>
            <Typography>Показать карточку профиля</Typography>
          </HoverCardItem>
        )}
      </DialogTrigger>
      <DialogContent
        withClose={false}
        className="!p-0 !w-[424px] !overflow-visible !border-none !bg-transparent"
      >
        <UserFullCard nickname={nickname} />
      </DialogContent>
    </Dialog>
  );
};
