export function parseBoolean(v: string | boolean): boolean {
  return typeof v === "boolean" ? v : v.toLowerCase() === "true";
}