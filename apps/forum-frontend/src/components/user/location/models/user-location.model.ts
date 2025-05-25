import { reatomAsync, withCache, withDataAtom, withStatusesAtom } from "@reatom/async";
import { action, atom } from "@reatom/core";
import { forumUserClient } from "@repo/shared/api/forum-client";

async function getUserLocation(nickname: string) {
  const res = await forumUserClient.user["get-user-location"][":nickname"].$get({ param: { nickname } })
  const data = await res.json()

  if ("error" in data) {
    const error = data.error

    if (error === 'restricted') {
      return "restricted"
    }

    return null;
  }

  return data.data
}

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

type Location = { world: string; x: number; y: number; z: number; pitch: number; yaw: number; customLocation: string | null }
type LocationContent = Location & { direction: string | null }

export const createLocationContentAction = action((ctx, location: Location) => {
  let pitch: number = location.pitch
  let yaw: number = location.yaw
  let x: number = location.x
  let y: number = location.y
  let z: number = location.z
  let world: string = location.world
  let customLocation: string | null = location.customLocation
  let direction: string | null = null;

  if (location) {
    pitch = Number(location.pitch.toFixed(2))
    yaw = Number(location.yaw.toFixed(2))
    x = Number(location.x.toFixed(2))
    y = Number(location.y.toFixed(2))
    z = Number(location.z.toFixed(2))
    customLocation = location.customLocation ?? "Дикий мир"
    world = location.world
    direction = getPlayerDirection(pitch, yaw)
  }

  userLocationContentAtom(ctx, { pitch, yaw, x, y, z, world, customLocation, direction })
})

export const userLocationAction = reatomAsync(async (ctx, target: string) => {
  return await ctx.schedule(() => getUserLocation(target))
}, {
  name: "userLocationAction",
  onFulfill: (ctx, res) => {
    if (res && typeof res !== 'string') {
      createLocationContentAction(ctx, res)
    }
  }
}).pipe(withDataAtom(), withCache(), withStatusesAtom())

export const userLocationContentAtom = atom<LocationContent | null>(null, "userLocationContentAtom")