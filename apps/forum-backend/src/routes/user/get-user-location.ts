import { forumDB } from "#shared/database/forum-db.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { getNatsConnection } from "@repo/config-nats/nats-client";
import { throwError } from "@repo/lib/helpers/throw-error";
import { SERVER_EVENT_GET_USER_LOCATION, SERVER_USER_EVENT_SUBJECT } from "@repo/shared/constants/nats-subjects";
import { Hono } from "hono";

type UserLocation = {
  world: string,
  x: number,
  y: number,
  z: number,
  pitch: number,
  yaw: number,
  customLocation: string | null
}

async function getLocation(nickname: string) {
  const nc = getNatsConnection()

  const payload = {
    event: SERVER_EVENT_GET_USER_LOCATION,
    nickname
  }

  const res = await nc.request(SERVER_USER_EVENT_SUBJECT, JSON.stringify(payload), { timeout: 7000 })

  return res.json<Omit<UserLocation, "customLocation">>()
}

function parseWorldName(input: string): string | null {
  const regex = /CraftWorld\{name=(.+?)\}/;
  const match = input.match(regex);

  return match ? match[1] : null;
}

interface Cuboid {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  title: string;
  world: "Offenburg" | "BisquiteWorld" | string
}

type LocationNames =
  | "spawnpoint" 
  | "bar-brat"

const terrainMap: Map<LocationNames, Cuboid> = new Map([
  ["spawnpoint", {
    minX: 478,
    maxX: 493,
    minZ: -2689,
    maxZ: -2672,
    title: "Точка появления",
    world: "Offenburg"
  }],
  ["bar-brat", {
    minX: 503,
    maxX: 519,
    minZ: -2646,
    maxZ: -2628,
    title: "Бар <Брат>",
    world: "Offenburg",
  }]
]);

type GetCustomLocation = {
  world: string,
  coords: Pick<UserLocation, "x" | "z">
}

function getCustomLocation({
  coords, world
}: GetCustomLocation): string | null {
  const { x, z } = coords;

  let title: string | null = null;

  for (const [_, cuboid] of terrainMap) {
    if (world === cuboid.world) {
      if (x >= cuboid.minX && x <= cuboid.maxX && z >= cuboid.minZ && z <= cuboid.maxZ) {
        return title = cuboid.title;
      }
    }
  }

  if (!title && world === 'Offenburg') {
    return title = "где-то на спавне"
  }

  return null;
}

async function getUserLocationPreference(nickname: string) {
  const { show_game_location } = await forumDB
    .selectFrom("users_settings")
    .select("show_game_location")
    .where("nickname", "=", nickname)
    .executeTakeFirstOrThrow()

  return show_game_location
}

export const getUserLocationRoute = new Hono()
  .get("/get-user-location/:nickname", async (ctx) => {
    const initiator = getNickname()
    const { nickname: recipient } = ctx.req.param()

    const isValid = await getUserLocationPreference(recipient)

    if (!isValid && initiator !== recipient) {
      return ctx.json({ error: "restricted" }, 401)
    }

    try {
      const rawLocation = await getLocation(recipient)

      if (!rawLocation) {
        return ctx.json({ data: null }, 200)
      }

      let location: UserLocation | null = null;
      let world: string = parseWorldName(rawLocation.world) ?? rawLocation.world

      location = {
        ...rawLocation,
        world,
        customLocation: getCustomLocation({
          world,
          coords: { x: rawLocation.x, z: rawLocation.z }
        })
      }

      return ctx.json({ data: location }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })