import { getNatsConnection } from "@repo/config-nats/nats-client";
import { Kvm } from "@nats-io/kv";

export async function deleteSessionToken(token: string | string[]) {
  const nc = getNatsConnection();
  const kvm = new Kvm(nc);
  const kv = await kvm.open("users");

  if (Array.isArray(token)) {
    for (const t of token) {
      await kv.delete(t);
    }
    
    return;
  }

  await kv.delete(token);
}