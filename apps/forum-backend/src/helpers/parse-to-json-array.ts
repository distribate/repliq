export function parseToJsonbArray(value: any): any[] {
  if (Array.isArray(value)) {
    return value.map((item) => JSON.stringify(item));
  }

  return [JSON.stringify(value)];
}