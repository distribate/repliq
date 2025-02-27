export function getParamFromUrl(url: string, param: string): string | null {
  const parsedUrl = new URL(url);
  
  return parsedUrl.searchParams.get(param);
}