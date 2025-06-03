import { jetstream } from "@nats-io/jetstream";
import { getNatsConnection } from "@repo/config-nats/nats-client";
import { natsLogger } from "@repo/lib/utils/logger";
import { Objm } from '@nats-io/obj';

export const USERS_SKINS_BUCKET = "users_skins"

export async function initSkinsBucket() {
  const nc = getNatsConnection();
  const js = jetstream(nc, { timeout: 10_000 });

  // @ts-ignore
  const objm = new Objm(js);

  let bucket = null;

  const list = objm.list()
  const next = await list.next()
  const buckets = next.map(key => key.bucket)

  if (buckets.includes(USERS_SKINS_BUCKET)) {
    natsLogger.success("Opened 'users_skins' bucket");

    bucket = await objm.open(USERS_SKINS_BUCKET)
  } else {
    natsLogger.info("Created 'users_skins' bucket");

    bucket = await objm.create(USERS_SKINS_BUCKET, { ttl: 2592000000000000, storage: "file" });
  }

  if (!bucket) {
    throw new Error("Failed to open bucket");
  }

  const watch = await bucket.watch();

  (async () => {
    for await (const e of watch) {
      natsLogger.debug(`[Watch] ${e.name} / ${e.size} / ${e.revision}`);
    }
  })().then();
}