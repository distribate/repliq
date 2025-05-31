import { UserSettingsBack } from "#components/modals/user-settings/components/user-settings-back"
import { ContentNotFound } from "#components/templates/components/content-not-found"
import { reatomComponent, useUpdate } from "@reatom/npm-react"
import { LAND_URL } from "@repo/shared/constants/routes"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { Typography } from "@repo/ui/src/components/typography"
import { myLandsResource } from "../models/my-lands.model"
import { CustomLink } from "#components/shared/link"
import { toggleGlobalDialogAction } from "#components/modals/user-settings/models/user-settings.model"

const LandItem = reatomComponent<{ name: string, ulid: string }>(({ ctx, name, ulid }) => {
  return (
    <div className="flex items-center justify-between bg-secondary-color rounded-lg w-full p-4">
      <Typography className="text-lg text-shark-200">
        {name}
      </Typography>
      <CustomLink
        to={LAND_URL + ulid}
        onClick={() => toggleGlobalDialogAction(ctx, { reset: true, value: false })}
        className="w-fit rounded-lg py-1 px-3 flex bg-shark-50 items-center justify-center"
      >
        <Typography className="text-shark-950 font-semibold">
          Перейти к региону
        </Typography>
      </CustomLink>
    </div>
  )
}, "LandItem")

const LandsList = reatomComponent(({ ctx }) => {
  const userLands = ctx.spy(myLandsResource.dataAtom)

  if (!userLands) {
    return <ContentNotFound title="Регионов пока нет :/" />
  }

  return userLands.map((land) =>
    <LandItem key={land.ulid} name={land.name} ulid={land.ulid} />
  )
}, "LandsList")

const FetchLands = () => useUpdate(myLandsResource, [myLandsResource])

export const UserLands = reatomComponent(({ ctx }) => {
  return (
    <div className="flex flex-col gap-y-4 items-center overflow-y-auto w-full">
      <UserSettingsBack to="main" />
      <Typography variant="dialogTitle">Ваши регионы</Typography>
      <div className="flex flex-col w-full gap-2 h-full">
        <FetchLands />
        {ctx.spy(myLandsResource.statusesAtom).isPending ? (
          <>
            <Skeleton className="w-full h-16" />
            <Skeleton className="w-full h-16" />
          </>
        ) : (
          <LandsList />
        )}
      </div>
    </div>
  )
}, "UserLands")