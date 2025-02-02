import { getNatsConnection } from "@repo/config-nats/nats-client";
import { USER_STATUS_SUBJECT } from "@repo/shared/constants/nats-subjects";

export function publishUserStatus(nickname: string) {
  const nc = getNatsConnection();

  return nc.publish(USER_STATUS_SUBJECT, JSON.stringify(nickname));
}