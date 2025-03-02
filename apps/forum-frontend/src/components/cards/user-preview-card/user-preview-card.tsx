import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import Spyglass from "@repo/assets/images/minecraft/spyglass.webp";
import type { UserDetailed } from "@repo/types/entities/user-type.ts";
import { Dialog, DialogContent, DialogTrigger } from "@repo/ui/src/components/dialog.tsx";
import { UserSummaryCard } from "../user-main-card/components/user-summary-card";
import { Suspense } from "react";
import { Skeleton } from "@repo/ui/src/components/skeleton";

export type UserCardProps = Pick<
  UserDetailed, "nickname"
>;

export const UserPreviewCard = ({
  nickname
}: UserCardProps) => {
  return (
    <Dialog>
      <DialogTrigger title={nickname}>
        <div className="flex cursor-pointer rounded-sm relative group overflow-hidden">
          <div className="flex duration-300 ease-in-out group-hover:opacity-100 
            transition z-[2] opacity-0 items-center justify-center absolute h-full w-full bg-black/60">
            <img src={Spyglass} width={26} height={26} alt="" />
          </div>
          <Suspense fallback={<Skeleton className="w-[50px] h-[50px]" />}>
            <Avatar nickname={nickname} propHeight={50} propWidth={50} />
          </Suspense>
        </div>
      </DialogTrigger>
      <DialogContent
        withClose={false}
        className="!p-0 !w-[424px] !overflow-visible !border-none !bg-transparent"
      >
        <UserSummaryCard nickname={nickname} />
      </DialogContent>
    </Dialog>
  );
};