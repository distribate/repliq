import { Typography } from "@repo/ui/src/components/typography.tsx";
import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/src/components/dialog.tsx";
import { UserSummaryCard } from "#components/user/components/cards/preview-card/components/user-summary-card";
import { reatomComponent } from "@reatom/npm-react";
import { selectedUserCardAtom, userCardAction, userCardDialogIsOpenAtom } from "#components/user/components/cards/preview-card/models/user-main-card.model";

type UserCardModalProperties =
  | { withCustomTrigger?: false | undefined; trigger?: never }
  | { withCustomTrigger: true; trigger: ReactNode;  };

type UserCardModal = { nickname: string } & UserCardModalProperties;

export const UserCardModal = reatomComponent<UserCardModal>(({
  ctx, nickname, trigger, withCustomTrigger = false
}) => {
  const handle = (value: boolean) => {
    userCardDialogIsOpenAtom(ctx, value);

    if (value) {
      selectedUserCardAtom(ctx, nickname);
      userCardAction(ctx, nickname);
    }
  }

  return (
    <Dialog
      open={ctx.spy(userCardDialogIsOpenAtom)}
      onOpenChange={handle}
    >
      <DialogTrigger
        asChild={withCustomTrigger}
        className={withCustomTrigger ? "cursor-default" : ""}
      >
        {withCustomTrigger ? (
          trigger
        ) : (
          <Typography>Показать карточку профиля</Typography>
        )}
      </DialogTrigger>
      <DialogContent
        withClose={false}
        className="!p-0 w-full sm:!w-[424px] !overflow-visible !bg-transparent"
      >
        <DialogTitle className="hidden"></DialogTitle>
        <UserSummaryCard />
      </DialogContent>
    </Dialog>
  );
}, "UserCardModal")