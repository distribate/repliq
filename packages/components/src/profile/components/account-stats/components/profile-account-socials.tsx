"use client"

import { Skeleton } from "@repo/ui/src/components/skeleton"
import { userSocialsQuery } from "../queries/user-socials-query"
import { Typography } from "@repo/ui/src/components/typography"
import { SocialsCard } from "./socials-card"

export const ProfileAccountSocials = () => {
  const { data: userSocials, isLoading } = userSocialsQuery()

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-1 w-fit">
          <Typography
            textColor="shark_white"
            className="text-[22px] font-semibold"
          >
            Привязанные соцсети
          </Typography>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 auto-rows-auto gap-2 w-full h-full">
        {isLoading && (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        )}
        {!isLoading && (
          <>
            <SocialsCard
              title="Discord"
              value={userSocials?.DISCORD_ID ?? null}
            />
            <SocialsCard
              title="Telegram"
              value={userSocials?.TELEGRAM_ID ?? null}
            />
          </>
        )}
      </div>
    </div>
  )
}