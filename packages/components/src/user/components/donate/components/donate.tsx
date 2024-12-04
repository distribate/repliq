"use client";

import { donateQuery, DonateQueryType } from "../queries/donate-query.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { DonateType } from "../queries/get-user-donate.ts";
import { DONATE_GROUPS } from "../constants/donate-aliases.ts";
import { ParticleEffect } from "@repo/ui/src/components/particle-effect.tsx";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { UserDonateBadge } from "./donate-badge.tsx";

const getDonateTitle = (donate: DonateType["primary_group"]) =>
  DONATE_GROUPS[donate];

// <div className="flex flex-col gap-y-2 w-full p-2">
//   <Typography textSize="small" textColor="shark_white">
//     Привилегии дают доступ к большим возможностям на форуме и в самой игре.
//   </Typography>
//   <Typography textSize="small" textColor="shark_white">
//     подробнее см.&nbsp;
//     <Link href={`/misc/donate`} className="text-caribbean-green-500 text-sm">
//       привилегии
//     </Link>
//   </Typography>
// </div>

export const UserDonate = ({ nickname, existingDonate }: DonateQueryType) => {
  const { data: donate, isLoading } = donateQuery({ nickname, existingDonate });

  if (isLoading) return <Skeleton className="h-5 rounded-md w-24" />;

  if (!donate) return null;

  const title = getDonateTitle(donate.donate);
  const favoriteItemImage = donate.favoriteItemImage?.image;

  return favoriteItemImage ? (
    <ParticleEffect options={{ particle: favoriteItemImage }}>
      <UserDonateBadge variant={donate.donate}>
        <Typography
          textColor="shark_white"
          font="minecraft"
          className="text-[12px]"
        >
          {title}
        </Typography>
      </UserDonateBadge>
    </ParticleEffect>
  ) : (
    <UserDonateBadge variant={donate.donate}>
      <Typography
        textColor="shark_white"
        font="minecraft"
        className="text-[12px]"
      >
        {title}
      </Typography>
    </UserDonateBadge>
  );
};
