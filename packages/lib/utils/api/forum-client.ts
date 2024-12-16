import { hc } from 'hono/client';
import { user, headers } from 'forum-backend/src';

export const forumUserClient = hc<typeof user>("http://localhost:3500/api/", { headers })