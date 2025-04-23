import { Dialog, DialogContent } from "@repo/ui/src/components/dialog";
import { Typography } from "@repo/ui/src/components/typography";
import { COVER_QUERY_KEY, CoverQuery, coverQuery } from "#components/profile/header/queries/cover-query.ts";
import { useQueryClient } from "@tanstack/react-query";
import { userLocationQuery } from "../queries/user-location-query";

function getPlayerDirection(pitch: number, yaw: number): string {
  if (yaw < 0) {
    yaw += 360;
  }

  let horizontalDirection: string;

  if (yaw >= 315 || yaw < 45) {
    horizontalDirection = "взгляд на север";
  } else if (yaw >= 45 && yaw < 135) {
    horizontalDirection = "взгляд на восток";
  } else if (yaw >= 135 && yaw < 225) {
    horizontalDirection = "взгляд на юг";
  } else {
    horizontalDirection = "взгляд на запад";
  }

  let verticalDirection: string;

  if (pitch > 45) {
    verticalDirection = "смотрит вверх";
  } else if (pitch < -45) {
    verticalDirection = "смотрит вниз";
  } else {
    verticalDirection = "смотрит прямо";
  }

  return `${horizontalDirection} и ${verticalDirection}`;
}

type LocationContentProps = {
  nickname: string
}

const LocationContent = ({
  nickname
}: LocationContentProps) => {
  const { data: location } = userLocationQuery(nickname)

  if (location === 'restricted') return null;

  let pitch: number | null = null
  let yaw: number | null = null;
  let x: number | null = null;
  let y: number | null = null;
  let z: number | null = null;
  let world: string | null = null
  let customLocation: string | null = null;

  if (location) {
    pitch = Number(location.pitch.toFixed(2))
    yaw = Number(location.yaw.toFixed(2))
    x = Number(location.x.toFixed(2))
    y = Number(location.y.toFixed(2))
    z = Number(location.z.toFixed(2))

    customLocation = location.customLocation ?? "Дикий мир"
    world = location.world
  }

  return (
    <div className="flex flex-col items-center justify-center w-full gap-4 h-full">
      <Typography variant="dialogTitle">
        Сервер Bisquite
      </Typography>
      <div className="flex flex-col gap-2 w-full p-2">
        <Typography>Мир: {world}</Typography>
        <Typography>Локация: {customLocation}</Typography>
        <Typography>Координаты: {x} / {y} / {z}</Typography>
        <Typography>Предварительно {getPlayerDirection(pitch!, yaw!)}</Typography>
      </div>
    </div>
  )
}

export const UserLocation = ({ nickname }: { nickname: string }) => {
  const qc = useQueryClient()
  const { data: { location: { opened } } } = coverQuery();
  const { data: location } = userLocationQuery(nickname)

  const handleClose = (v: boolean) => {
    qc.setQueryData(COVER_QUERY_KEY,
      (prev: CoverQuery) => ({ ...prev, location: { opened: v } })
    )
  }

  if (!location) return null;

  return (
    location === 'restricted' ? null : (
      <Dialog
        open={opened}
        onOpenChange={handleClose}
      >
        <DialogContent className="font-[Minecraft]">
          <LocationContent nickname={nickname} />
        </DialogContent>
      </Dialog>
    )
  )
}