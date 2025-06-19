import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import type { UserDetailed } from "@repo/types/entities/user-type.ts";
import { Dialog, DialogContent, DialogTrigger } from "@repo/ui/src/components/dialog.tsx";
import { useState } from "react";
import { reatomComponent } from "@reatom/npm-react";
import { UserSummaryCard } from "../user-main-card/components/user-summary-card";
import { selectedUserCardAtom } from "../user-main-card/models/user-main-card.model";

export type UserCardProps = Pick<UserDetailed, "nickname" | "avatar">;

export const UserPreviewCard = reatomComponent<UserCardProps>(({ ctx, avatar, nickname }) => {
  const [open, setOpen] = useState(false)

  const handleOpenChange = (value: boolean) => {
    setOpen(value)
    selectedUserCardAtom(ctx, nickname)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger title={nickname}>
        <div className="flex cursor-pointer rounded-sm relative group overflow-hidden">
          <Avatar url={avatar} nickname={nickname} propHeight={50} propWidth={50} />
        </div>
      </DialogTrigger>
      <DialogContent
        withClose={false}
        className="!p-0 !w-[424px] !overflow-visible !border-none !bg-transparent"
      >
        <UserSummaryCard />
      </DialogContent>
    </Dialog>
  );
}, "UserPreviewCard")