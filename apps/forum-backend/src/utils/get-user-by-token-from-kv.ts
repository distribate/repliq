import { Kvm } from "@nats-io/kv";
import { getNatsConnection } from "@repo/config-nats/nats-client";

export async function getUserNicknameByTokenFromKv(token?: string) {
  if (!token) {
    return null;
  }
  
  const nc = getNatsConnection();
  const kvm = new Kvm(nc);
  const kv = await kvm.open("users");

  const entry = await kv.get(token);

  if (!entry) {
    return null;
  }

  return entry.string();
}