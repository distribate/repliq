import { UserSettingsBack } from "#components/modals/user-settings/components/user-settings-back"
import { toggleGlobalDialogAction } from "#components/modals/user-settings/hooks/use-user-settings-modal"
import { ContentNotFound } from "#components/templates/components/content-not-found"
import { reatomComponent } from "@reatom/npm-react"
import { LAND_URL } from "@repo/shared/constants/routes"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { Typography } from "@repo/ui/src/components/typography"
import { Link } from "@tanstack/react-router"
import { myLandsResource } from "../models/my-lands.model"

export const UserLands = reatomComponent(({ ctx }) => {  
  const userLands = ctx.spy(myLandsResource.dataAtom)
  const isLoading = ctx.spy(myLandsResource.statusesAtom).isPending

  return (
    <div className="flex flex-col gap-y-4 items-center w-full">
      <UserSettingsBack to="main" />
      <Typography variant="dialogTitle">Ваши регионы</Typography>
      <div className="flex flex-col w-full gap-y-4">
        {isLoading && (
          <>
            <Skeleton className="w-full h-16" />
            <Skeleton className="w-full h-16" />
          </>
        )}
        {(!userLands && !isLoading) && (
          <ContentNotFound title="Регионов пока нет :/" />
        )}
        {userLands && userLands?.map((land) => (
          <div key={land.ulid} className="flex items-center justify-between bg-secondary-color rounded-lg w-full p-4">
            <Typography className="text-lg text-shark-200">
              {land.name}
            </Typography>
            <Link
              to={LAND_URL + land.ulid}
              onClick={() => toggleGlobalDialogAction(ctx, { reset: true, value: false })}
              className="w-fit rounded-lg py-1 px-3 flex bg-shark-50 items-center justify-center"
            >
              <Typography className="text-shark-950 font-semibold">
                Перейти к региону
              </Typography>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}, "UserLands")