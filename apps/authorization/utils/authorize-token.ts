import { HTTPException } from 'hono/http-exception';

const API_KEY = process.env.SECRET_TOKEN

export function authorizeToken(authHeader: string | undefined) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new HTTPException(401, { message: "Missing or invalid Authorization header" });
  }
  
  const token = authHeader.split(' ')[1];
  
  if (token !== API_KEY) {
    throw new HTTPException(403, { message: "Forbidden: Invalid API key" });
  }
}