import { AuthAppType, LpAppType } from "auth-backend/src";
import { hc } from "hono/client";

const headers = { Authorization: `Bearer ${process.env.SECRET_TOKEN}` };

const origin = `https://cc.fasberry.su/api/auth`;

export const authClient = hc<AuthAppType>(
  origin, 
  { headers }
)

export const lpClient = hc<LpAppType>(`${origin}/lp`, { headers })