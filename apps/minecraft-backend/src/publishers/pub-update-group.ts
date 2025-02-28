import { getNatsConnection } from "@repo/config-nats/nats-client";
import { nanoid } from "nanoid";
import type { LuckpermsLogContent } from "../subscribers/sub-player-group";
import { LUCKPERMS_UPDATE_SUBJECT } from '@repo/shared/constants/nats-subjects';

type PublishUpdateGroup = {
  nickname: string,
  permission: string;
}

export function publishUpdateGroup({
  nickname, permission
}: PublishUpdateGroup) {
  const nc = getNatsConnection()
  const id = nanoid(6)

  const payload: {
    content: LuckpermsLogContent,
    id: string,
    type: "log"
  } = {
    id,
    type: "log",
    content: {
      timestamp: Date.now(),
      source: {
        uniqueId: "00000000-0000-0000-0000-000000000000",
        name: "CONSOLE"
      },
      target: {
        type: "USER",
        uniqueId: "00000000-0000-0000-0000-000000000000",
        name: nickname
      },
      description: `permission set ${permission} true`
    }
  }

  return nc.publish(LUCKPERMS_UPDATE_SUBJECT, JSON.stringify(payload))
}