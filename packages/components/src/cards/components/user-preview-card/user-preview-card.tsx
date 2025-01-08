"use client";

import { Avatar } from "#user/components/avatar/components/avatar.tsx";
import dynamic from "next/dynamic";
import Spyglass from "@repo/assets/images/minecraft/spyglass.webp";
import type { UserDetailed } from "@repo/types/entities/user-type.ts";
import { Dialog, DialogContent, DialogTrigger } from "@repo/ui/src/components/dialog.tsx";

export type UserCardProps = Pick<
  UserDetailed,
  "nickname"
>;

const UserSummaryCard = dynamic(
  () => import("../user-main-card/components/user-summary-card.tsx").then((mod) => mod.UserSummaryCard)
);

export const UserPreviewCard = ({
  nickname
}: UserCardProps) => {
  return (
    <Dialog>
      <DialogTrigger title={nickname}>
        <div className="flex cursor-pointer rounded-sm h-[50px] relative group w-[50px] hover:bg-shark-900 overflow-hidden">
          <div className="group-hover:flex z-[2] hidden items-center justify-center absolute h-full w-full bg-black/60">
            <img src={Spyglass.src} width={26} height={26} alt="" />
          </div>
          <Avatar nickname={nickname} propHeight={50} propWidth={50} />
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