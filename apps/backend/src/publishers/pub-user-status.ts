import { getNatsConnection } from "@repo/config-nats/nats-client";
import { USER_ACTIVITY_STATUS_SUBJECT } from "@repo/shared/constants/nats-subjects";

export function publishUserActivityStatus(nickname: string) {
  const nc = getNatsConnection();

  return nc.publish(USER_ACTIVITY_STATUS_SUBJECT, nickname);
}