import { AuthAppType, LpAppType } from "auth-backend/src";
import { hc } from "hono/client";

const headers = { Authorization: `Bearer ${process.env.SECRET_TOKEN}` };

export const authClient = hc<AuthAppType>(`http://localhost:4100/api/auth`, { headers })
export const lpClient = hc<LpAppType>(`http://localhost:4100/api/lp`, { headers })