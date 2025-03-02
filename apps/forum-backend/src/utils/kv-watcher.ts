import { updateUserStatus } from "#lib/queries/user/update-user-status.ts";
import { USERS_SESSION_BUCKET, USERS_STATUS_BUCKET } from "#shared/constants/nats-buckets.ts";
import { Kvm } from "@nats-io/kv";
import { getNatsConnection } from "@repo/config-nats/nats-client";

export async function watcher() {
  const nc = getNatsConnection();
  const kvm = new Kvm(nc);
  // const kv = await kvm.create(USERS_SESSION_BUCKET, { ttl: 30 * 24 * 60 * 60 * 1000 });
  const kvUsers = await kvm.open(USERS_SESSION_BUCKET);
  const kvUsersStatus = await kvm.open(USERS_STATUS_BUCKET);

  const watch = await kvUsers.watch();
  const watchStatus = await kvUsersStatus.watch();

  // (async () => {
  //   for await (const e of watch) {
  //     console.log(`[Watch] ${e.key} / ${e.operation} / ${e.value ? e.string() : ""}`);
  //   }
  // })().then();

  (async () => {
    for await (const e of watchStatus) {
      if (e.operation === "PUT") {
        await updateUserStatus(e.key);
      }
    }
  })().then();
}