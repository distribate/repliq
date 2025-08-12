import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import type { UserDetailed } from "@repo/types/entities/user-type.ts";
import { Dialog, DialogContent, DialogTrigger } from "@repo/ui/src/components/dialog.tsx";
import { useState } from "react";
import { reatomComponent } from "@reatom/npm-react";
import { UserSummaryCard } from "../user-main-card/components/user-summary-card";
import { selectedUserCardAtom } from "../user-main-card/models/user-main-card.model";
import { CustomLink } from "#components/shared/link";
import { createIdLink } from "@repo/lib/utils/create-link";
import { Typography } from "@repo/ui/src/components/typography";

export type UserCardProps = Pick<UserDetailed, "nickname" | "avatar">;

export const UserPreviewCard = reatomComponent<UserCardProps>(({ ctx, avatar, nickname }) => {
  const [open, setOpen] = useState(false)

  const handleOpenChange = (value: boolean) => {
    setOpen(value)
    selectedUserCardAtom(ctx, nickname)
  }

  return (
    <div className="flex items-center w-full gap-2">
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger className="min-w-[50px] min-h-[50px]">
          <Avatar url={avatar} nickname={nickname} propHeight={50} propWidth={50} />
        </DialogTrigger>
        <DialogContent
          withClose={false}
          className="!p-0 !w-[424px] !overflow-visible !border-none !bg-transparent"
        >
          <UserSummaryCard />
        </DialogContent>
      </Dialog>
      <div className="flex flex-col">
        <CustomLink to={createIdLink("user", nickname)}>
          <Typography>
            {nickname}
          </Typography>
        </CustomLink>
      </div>
    </div>
  );
}, "UserPreviewCard")