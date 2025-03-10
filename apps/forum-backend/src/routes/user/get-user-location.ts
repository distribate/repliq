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
  yaw: number
}

async function getLocation(nickname: string) {
  const nc = getNatsConnection()

  const payload = {
    event: SERVER_EVENT_GET_USER_LOCATION,
    nickname
  }

  const res = await nc.request(SERVER_USER_EVENT_SUBJECT, JSON.stringify(payload), { timeout: 7000 })

  return res.json<UserLocation>()
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

const terrainMap: Map<string, Cuboid> = new Map([
  ["spawnpoint", {
    minX: 478,
    minZ: -2689, // значение меньше, чем maxZ
    maxX: 493,
    maxZ: -2672, // значение должно быть больше, чем minZ
    title: "Точка появления",
    world: "Offenburg"
  }]
]);

function getCustomLocation(world: string, coords: Pick<UserLocation, "x" | "z">): string | null {
  const { x, z } = coords;

  for (const [name, cuboid] of terrainMap) {
    if (world === cuboid.world) {
      if (
        x >= cuboid.minX && x <= cuboid.maxX &&
        z >= cuboid.minZ && z <= cuboid.maxZ
      ) {
        // const area = (cuboid.maxX - cuboid.minX) * (cuboid.maxZ - cuboid.minZ);

        return cuboid.title;
      } else if (cuboid.world === 'Offenburg') {
        return "где-то на спавне"
      }
    }
  }

  return null;
}

export const getUserLocationRoute = new Hono()
  .get("/get-user-location/:nickname", async (ctx) => {
    const { nickname } = ctx.req.param()

    try {
      const rawLocation = await getLocation(nickname)

      if (!rawLocation) {
        return ctx.json({ data: null }, 200)
      }

      let location: UserLocation & { customLocation: string | null } | null = null;

      let world: string = parseWorldName(rawLocation.world) ?? rawLocation.world

      location = {
        ...rawLocation,
        world: rawLocation.world,
        customLocation: getCustomLocation(world, { x: rawLocation.x, z: rawLocation.z })
      }

      return ctx.json({ data: location }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  }) 