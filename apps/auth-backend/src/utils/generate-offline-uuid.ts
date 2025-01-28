export function generateOfflineUUID(nickname: string): string {
  const offlineIdentifier = `OfflinePlayer:${nickname}`;

  const hashBuffer = new Bun.CryptoHasher('md5')
    .update(offlineIdentifier)
    .digest();

  const hashArray = new Uint8Array(hashBuffer);

  hashArray[6] = (hashArray[6] & 0x0f) | 0x30;
  hashArray[8] = (hashArray[8] & 0x3f) | 0x80;

  const uuid = Array.from(hashArray)
    .map((byte) => ("00" + byte.toString(16)).slice(-2))
    .join("");

  return [
    uuid.slice(0, 8),
    uuid.slice(8, 12),
    uuid.slice(12, 16),
    uuid.slice(16, 20),
    uuid.slice(20),
  ].join("-");
}