import { updateUserStatus } from "#lib/queries/user/update-user-status.ts";
import { Kvm } from "@nats-io/kv";
import { getNatsConnection } from "@repo/config-nats/nats-client";

export async function watcher() {
  const nc = getNatsConnection();
  const kvm = new Kvm(nc);
  // const kv = await kvm.create("users", { ttl: 30 * 24 * 60 * 60 * 1000 });
  const kvUsers = await kvm.open("users");
  const kvUsersStatus = await kvm.open("users_status");

  const watch = await kvUsers.watch();
  const watchStatus = await kvUsersStatus.watch();

  (async () => {
    for await (const e of watch) {
      console.log(
        `[Watch] ${e.key} / ${e.operation} / ${e.value ? e.string() : ""}`,
      );
    }
  })().then();

  (async () => {
    for await (const e of watchStatus) {
      if (e.operation === "PUT") {
        await updateUserStatus(e.key);
      }

      console.log(
        `[Watch] ${e.key} / ${e.operation} / ${e.value ? e.string() : ""}`,
      );
    }
  })().then();
}