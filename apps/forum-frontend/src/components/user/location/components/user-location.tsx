import { Dialog, DialogContent } from "@repo/ui/src/components/dialog";
import { Typography } from "@repo/ui/src/components/typography";
import { coverAtom } from "#components/profile/header/models/cover.model";
import { userLocationAction, userLocationContentAtom } from "../models/user-location.model";
import { reatomComponent } from "@reatom/npm-react";
import { onConnect } from "@reatom/framework";
import { requestedUserParamAtom } from "#components/profile/main/models/requested-user.model";

const LocationContent = reatomComponent(({ ctx }) => {
  const locationContent = ctx.spy(userLocationContentAtom)

  if (!locationContent) return null;

  return (
    <div className="flex flex-col items-center justify-center w-full gap-4 h-full">
      <Typography variant="dialogTitle">
        Сервер Bisquite
      </Typography>
      <div className="flex flex-col gap-2 w-full p-2">
        <Typography>Мир: {locationContent.world}</Typography>
        <Typography>Локация: {locationContent.customLocation}</Typography>
        <Typography>Координаты: {locationContent.x} / {locationContent.y} / {locationContent.z}</Typography>
        <Typography>Предварительно {locationContent.direction}</Typography>
      </div>
    </div>
  )
}, "LocationContent")

onConnect(userLocationAction, (ctx) => userLocationAction(ctx, ctx.get(requestedUserParamAtom)!))

export const UserLocation = reatomComponent(({ ctx }) => {
  const { opened } = ctx.spy(coverAtom).location
  const location = ctx.spy(userLocationAction.dataAtom)

  if (!location) return null;

  if (location === 'restricted') return null;

  return (
    <Dialog
      open={opened}
      onOpenChange={(opened) => coverAtom(ctx, (state) => ({ ...state, location: { opened } }))}
    >
      <DialogContent>
        <LocationContent />
      </DialogContent>
    </Dialog>
  )
}, "UserLocation")