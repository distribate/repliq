import { HTTPException } from 'hono/http-exception';

export function exceptionHandler(err: Error | HTTPException, c: any) {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status);
  }
  
  return c.json({ error: 'Internal Server Error' }, 500);
}