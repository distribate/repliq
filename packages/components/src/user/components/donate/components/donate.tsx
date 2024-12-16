"use client";

import { donateQuery } from "../queries/donate-query.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { ParticleEffect } from "@repo/ui/src/components/particle-effect.tsx";
import { UserDonateBadge } from "./donate-badge.tsx";
import { DonateVariantsEnum } from '@repo/types/entities/entities-type.ts';
import { CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { DONATE_GROUPS } from '@repo/shared/constants/donate-aliases.ts';

const getDonateTitle = (donate: DonateVariantsEnum) => DONATE_GROUPS[donate];

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

type UserDonateProps = {
  donate: DonateVariantsEnum,
  favoriteItemId: Pick<CurrentUser, "favorite_item">["favorite_item"]
}

export const UserDonate = ({
  donate, favoriteItemId
}: UserDonateProps) => {
  const { data: favoriteItem } = donateQuery(favoriteItemId)
  const title = getDonateTitle(donate);
  const favoriteItemImage = favoriteItem?.image;
  
  return favoriteItemImage ? (
    <ParticleEffect options={{ particle: favoriteItemImage }}>
      <UserDonateBadge variant={donate}>
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
    <UserDonateBadge variant={donate}>
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
