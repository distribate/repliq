import { updateUserStatus } from "#lib/queries/user/update-user-status.ts";
import { USERS_STATUS_BUCKET } from "#shared/constants/nats-buckets.ts";
import { Kvm } from "@nats-io/kv";
import { getNatsConnection } from "@repo/config-nats/nats-client";

export async function watcher() {
  const nc = getNatsConnection();
  const kvm = new Kvm(nc);
  // const kvUsers = await kvm.open(USERS_SESSION_BUCKET);
  const kvUsersStatus = await kvm.open(USERS_STATUS_BUCKET);

  const usersStatusWatch = await kvUsersStatus.watch();

  (async() => {
    for await (const e of usersStatusWatch) {
      if (e.operation === "PUT") {
        await updateUserStatus(e.key);
      }
    }
  })().then()
}