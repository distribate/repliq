import { Kvm } from "@nats-io/kv";
import { getNatsConnection } from "@repo/config-nats/nats-client";

export async function putSessionToken(nickname: string, token: string) {
  const nc = getNatsConnection();
  const kvm = new Kvm(nc);
  const kv = await kvm.open("users");

  await kv.put(token, nickname);
}