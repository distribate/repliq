import { Kvm } from "@nats-io/kv";
import { getNatsConnection } from "@repo/config-nats/nats-client";

export async function putSessionToken(nickname: string, token: string): Promise<void> {
  const nc = getNatsConnection();
  const kvm = new Kvm(nc);
  const kv = await kvm.open("users");

  const put = await kv.put(token, nickname);

  console.log(put)
}