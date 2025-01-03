export async function delay<T>(ms: number, value?: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value as T), ms);
  });
}