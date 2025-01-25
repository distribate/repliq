export function convertIPv6ToIPv4(ipv6: string): string | null {
  const match = ipv6.match(/^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/);
  return match ? match[1] : null;
}