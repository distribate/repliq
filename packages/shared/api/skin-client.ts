import { hc } from 'hono/client';
import { SkinAppType } from 'skin-backend/src';

export const skinClient = hc<SkinAppType>(`http://localhost:4102/`,
  {
    fetch: (input: RequestInfo | URL, requestInit?: RequestInit) => {
      const retries = 1; 
      const retryDelay = 1000;

      const attemptFetch = (attempt: number): Promise<Response> => {
        return fetch(input, {
          method: requestInit?.method ?? 'GET',
          headers: {
            'content-type': 'application/json',
            ...requestInit?.headers,
          },
          body: requestInit?.body ?? null,
          credentials: "include",
          ...requestInit,
        }).then((res) => {
          if (!res.ok && attempt < retries) {
            return new Promise<Response>((resolve) => {
              setTimeout(() => resolve(attemptFetch(attempt + 1)), retryDelay);
            });
          }
          
          return res;  
        });
      };

      return attemptFetch(0);
    }
  }
)