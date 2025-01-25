export const getCookieByKey = (key: string): string | null => {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [cookieKey, cookieValue] = cookie.split('=');
    if (cookieKey === key) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null; // Куки не найдены
};