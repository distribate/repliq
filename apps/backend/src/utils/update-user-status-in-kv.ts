import { Kvm } from "@nats-io/kv";
import { getNatsConnection } from "@repo/config-nats/nats-client";

export async function updateUserStatusInKv(nickname: string) {
  const nc = getNatsConnection();
  const kvm = new Kvm(nc);
  const kv = await kvm.open("users_status");

  await kv.put(nickname, JSON.stringify(Date.now()));

  return;
}