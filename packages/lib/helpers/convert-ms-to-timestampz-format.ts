const padZero = (num: number, length: number = 2): string =>
  num.toString().padStart(length, "0");

export function convertMsToFormattedTimestamp(ms: number): string {
  const date = new Date(ms);

  const year = date.getUTCFullYear();
  const month = padZero(date.getUTCMonth() + 1);
  const day = padZero(date.getUTCDate());
  const hours = padZero(date.getUTCHours());
  const minutes = padZero(date.getUTCMinutes());
  const seconds = padZero(date.getUTCSeconds());
  const milliseconds = padZero(date.getUTCMilliseconds(), 3);
  const microseconds = padZero(0, 3);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}${microseconds}`;
}
