export const es = (url: string) => new EventSource(url, { withCredentials: true });
