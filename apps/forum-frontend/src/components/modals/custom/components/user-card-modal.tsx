import { Typography } from "@repo/ui/src/components/typography.tsx";
import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@repo/ui/src/components/dialog.tsx";
import { UserSummaryCard } from "#components/cards/user-main-card/components/user-summary-card";
import { reatomComponent } from "@reatom/npm-react";
import { selectedUserCardAtom } from "#components/cards/user-main-card/models/user-main-card.model";
import { atom } from "@reatom/core";

type UserCardModalProperties =
  | {
    withCustomTrigger?: false | undefined;
    trigger?: never;
  }
  | {
    withCustomTrigger: true;
    trigger: ReactNode;
  };

type UserCardModal = { nickname: string } & UserCardModalProperties;

export const userCardDialogIsOpenAtom = atom(false, "userCardDialogIsOpen")

export const UserCardModal = reatomComponent<UserCardModal>(({ 
  ctx, nickname, trigger, withCustomTrigger = false 
}) => {
  const handle = (value: boolean) => {
    userCardDialogIsOpenAtom(ctx, value)
    selectedUserCardAtom(ctx, nickname)
  }

  return (
    <Dialog open={ctx.spy(userCardDialogIsOpenAtom)} onOpenChange={handle}>
      <DialogTrigger asChild={withCustomTrigger} className={withCustomTrigger ? "cursor-default" : ""}>
        {withCustomTrigger ? (
          trigger
        ) : (
          <Typography>Показать карточку профиля</Typography>
        )}
      </DialogTrigger>
      <DialogContent
        withClose={false}
        className="!p-0 !w-[424px] !overflow-visible !border-none !bg-transparent"
      >
        <UserSummaryCard />
      </DialogContent>
    </Dialog>
  );
}, "UserCardModal")