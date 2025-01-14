export function getCurrentTimestamp(): string {
  const pad = (num: number) => String(num).padStart(2, '0');
  const date = new Date();
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1); 
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0'); 
  const timezoneOffset = '+00';

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}${timezoneOffset}`;
}