import type { Subscription } from "@nats-io/transport-node";
import { subscribeUserStatus } from '#subscribers/sub-user-status.ts';
import { subscribeCollectStats } from '#subscribers/sub-collect-stats.ts';
import { subscribeReceiveNotify } from '#subscribers/sub-receive-notify.ts';
import { subscribeAdminLog } from '#subscribers/sub-admin-log.ts';
import { subscribeDisconnectService } from '#subscribers/sub-disconnect-service.ts';

export const SUBSCRIPTIONS: Record<string, () => Subscription> = {
  "users-status": subscribeUserStatus,
  "collect-stats": subscribeCollectStats,
  "receive-notify": subscribeReceiveNotify,
  "admin-log": subscribeAdminLog,
  "disconnect-service": subscribeDisconnectService
}