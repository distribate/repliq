import { Skeleton } from "@repo/ui/src/components/skeleton"
import { userSocialsResource } from "../../models/user-socials.model"
import { Typography } from "@repo/ui/src/components/typography"
import { SocialsCard } from "./socials-card"
import { reatomComponent } from "@reatom/npm-react"

export const ProfileAccountSocials = reatomComponent(({ ctx }) => {
  const userSocials = ctx.spy(userSocialsResource.dataAtom)
  const isLoading = ctx.spy(userSocialsResource.statusesAtom).isPending

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-1 w-fit">
          <Typography
            textColor="shark_white"
            textSize="big"
            className="font-semibold"
          >
            Привязанные соцсети
          </Typography>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 auto-rows-auto gap-4 w-full h-full">
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
}, "ProfileAccountSocials")