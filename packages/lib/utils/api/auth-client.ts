import { auth, headers } from "auth-backend/src";
import { hc } from 'hono/client';

export const authClient = hc<typeof auth>(`http://localhost:3400/auth`, { headers });