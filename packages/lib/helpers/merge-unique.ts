export function mergeUnique<T, K extends keyof T>(
  array1: T[],
  array2: T[],
  uniqueKey: K
): T[] {
  const map = new Map<T[K], T>();

  array1.forEach(item => map.set(item[uniqueKey], item));

  array2.forEach(item => map.set(item[uniqueKey], item));

  return Array.from(map.values());
}