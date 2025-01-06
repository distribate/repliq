"use client";

import { donateQuery } from "../queries/donate-query.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { ParticleEffect } from "@repo/ui/src/components/particle-effect.tsx";
import { UserDonateBadge } from "./donate-badge.tsx";
import { DonateVariantsEnum } from '@repo/types/entities/entities-type.ts';
import type { UserDetailed } from '@repo/types/entities/user-type.ts';
import { DONATE_GROUPS } from '@repo/shared/constants/donate-aliases.ts';
import { useState } from "react";

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
  favoriteItemId: number | null
}

export const UserDonate = ({
  donate, favoriteItemId
}: UserDonateProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { data: favoriteItem } = donateQuery(favoriteItemId, isHovered)
  const title = getDonateTitle(donate);
  const favoriteItemImage = favoriteItem?.image;
  
  return (
    <div onMouseEnter={() => setIsHovered(true)}>
      {favoriteItemImage ? (
        <ParticleEffect options={{ particle: favoriteItemImage }}>
          <UserDonateBadge variant={donate} className="w-fit">
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
        <UserDonateBadge variant={donate} className="w-fit">
          <Typography
            textColor="shark_white"
            font="minecraft"
            className="text-[12px]"
         >
            {title}
          </Typography>
        </UserDonateBadge>
      )}
    </div>
  )
};
